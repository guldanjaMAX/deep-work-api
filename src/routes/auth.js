// src/routes/auth.js
// Auth, magic link, and payment success route handlers

import { json } from '../utils/helpers.js';
import {
  getJWTSecret, authRateLimit, stripMetadata, logEvent,
  generateSessionAccessToken, stripeGet, getMagicLinkEmail
} from '../utils/internal.js';
import {
  getUserByEmail, getUserById, verifyPassword, hashPassword,
  updateLastLogin, createSessionToken, generateMagicToken,
  storeMagicToken, consumeMagicToken, createUser, updateUserPassword,
  requireAuth
} from '../auth.js';
import { logError, trackFunnelEvent } from '../monitor.js';

export async function handleAuthLogin(request, env) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return json({ error: "Please enter both your email and password." }, 400);
    const ip4 = request.headers.get("CF-Connecting-IP") || "unknown";
    if (await authRateLimit(env, (email || "unknown") + ":" + ip4))
      return json({ error: "Too many attempts. Please wait 15 minutes before trying again." }, 429);
    const user = await getUserByEmail(env, email);
    if (!user)
      return json({ error: "No account found with that email. Double check your address or try the Magic Link option." }, 401);
    if (!user.password_hash)
      return json({ error: `This account uses passwordless login. Click "Magic Link" above and we'll email you a sign-in link.` }, 401);
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      await trackFunnelEvent(env, "login_failed", { email, reason: "wrong_password" });
      return json({ error: 'Incorrect password. Try again or click "Forgot password?" to reset it.' }, 401);
    }
    await updateLastLogin(env, user.id);
    const secret = getJWTSecret(env);
    const token = await createSessionToken(user.id, user.role, secret);
    await trackFunnelEvent(env, "login_success", { userId: user.id, method: "password" });
    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    await logError(env, { endpoint: "/api/auth/login", method: "POST", statusCode: 500, errorType: "auth_error", errorMessage: e.message, stack: e.stack });
    return json({ error: "Something went wrong signing you in. Please try again in a moment." }, 500);
  }
}

export async function handleAuthRegister(request, env) {
  try {
    const { email, name, password } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const ip2 = request.headers.get("CF-Connecting-IP") || "unknown";
    if (await authRateLimit(env, email + ":" + ip2))
      return json({ error: "Too many attempts. Please wait 15 minutes before trying again." }, 429);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return json({ error: "Please enter a valid email address" }, 400);
    const existing = await getUserByEmail(env, email);
    if (existing)
      return json({ error: "Email already registered" }, 409);
    const passwordHash = password ? await hashPassword(password) : null;
    const user = await createUser(env, { email, name, role: "user" });
    if (passwordHash) {
      await updateUserPassword(env, user.id, passwordHash);
    }
    const secret = getJWTSecret(env);
    const token = await createSessionToken(user.id, user.role, secret);
    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, 201);
  } catch (e) {
    return json({ error: "Registration failed" }, 500);
  }
}

export async function handleAuthMagic(request, env) {
  try {
    const { token } = await request.json();
    if (!token)
      return json({ error: "Token required" }, 400);
    const persistentRow = await env.DB.prepare(
      `SELECT * FROM auth_tokens WHERE token = ? AND type = 'persistent_magic' AND expires_at > datetime('now')`
    ).bind(token).first().catch(() => null);
    let row;
    if (persistentRow) {
      row = persistentRow;
    } else {
      row = await consumeMagicToken(env, token);
    }
    if (!row)
      return json({ error: "Invalid or expired token" }, 401);
    const user = await getUserById(env, row.user_id);
    if (!user)
      return json({ error: "User not found" }, 404);
    await updateLastLogin(env, user.id);
    const secret = getJWTSecret(env);
    const sessionToken = await createSessionToken(user.id, user.role, secret);
    return json({
      token: sessionToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    return json({ error: "Magic auth failed" }, 500);
  }
}

export async function handleRequestMagic(request, env) {
  try {
    const { email } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const ip3 = request.headers.get("CF-Connecting-IP") || "unknown";
    if (await authRateLimit(env, email + ":" + ip3))
      return json({ error: "Too many sign-in requests. Please wait 15 minutes before trying again." }, 429);
    const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex2.test(email.trim()))
      return json({ error: "Please enter a valid email address" }, 400);
    let user = await getUserByEmail(env, email);
    if (!user) {
      user = await createUser(env, { email, name: "", role: "user" });
    }
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, "magic_login", 24);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicUrl = `${origin}/magic?token=${token}`;
    if (env.RESEND_API_KEY) {
      let emailSent = false;
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
            to: [email],
            subject: "Your Deep Work session is ready",
            html: getMagicLinkEmail(magicUrl, email)
          })
        });
        emailSent = emailRes.ok;
      } catch (_) {
      }
      if (!emailSent) {
        await logError(env, { endpoint: "/api/auth/request-magic", method: "POST", statusCode: 503, errorType: "resend_failure", errorMessage: "Failed to deliver magic link email to " + email }).catch(() => {
        });
        return json({ error: "We could not send the login email right now. Please try again in a moment, or contact james@jamesguldan.com for help." }, 503);
      }
    }
    return json({ ok: true, message: "Magic link sent", debug_url: env.DEBUG_MAGIC ? magicUrl : void 0 });
  } catch (e) {
    return json({ error: "Failed to send magic link" }, 500);
  }
}

export async function handleAuthMe(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Unauthorized" }, 401);
  return json({ id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier });
}

export async function handleFastResume(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const userInfo = { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier };
    const completedRow = await env.DB.prepare(
      "SELECT id, tier, phase, message_count, blueprint_generated, created_at, updated_at, status FROM sessions WHERE user_id = ? AND blueprint_generated = 1 AND (status != 'expired' OR status IS NULL) ORDER BY created_at DESC LIMIT 1"
    ).bind(user.id).first();
    if (completedRow) {
      const age = Date.now() - new Date(completedRow.created_at).getTime();
      if (age < 30 * 24 * 3600 * 1e3) {
        const kvData = await env.SESSIONS.get(completedRow.id);
        if (kvData) {
          const session = JSON.parse(kvData);
          const displayMessages = (session.messages || []).filter((m, i) => !(i === 0 && m.role === "user" && m.content === "Start the interview."));
          await logEvent(env, completedRow.id, "session_resumed", { phase: session.phase, messageCount: displayMessages.length, fast: true });
          return json({
            ok: true,
            user: userInfo,
            hasActiveSession: true,
            blueprintComplete: true,
            sessionId: completedRow.id,
            tier: session.tier || completedRow.tier,
            phase: session.phase || completedRow.phase || 8,
            messages: displayMessages.map((m) => ({ role: m.role, content: m.role === "assistant" ? stripMetadata(m.content) : m.content })),
            blueprintGenerated: true,
            blueprint: session.blueprint || null,
            strategistDebrief: session.strategistDebrief || null
          });
        }
      } else {
        await env.DB.prepare("UPDATE sessions SET status = 'expired' WHERE id = ?").bind(completedRow.id).run().catch(() => null);
      }
    }
    const activeRow = await env.DB.prepare(
      "SELECT id, tier, phase, message_count, created_at, updated_at FROM sessions WHERE user_id = ? AND (status = 'active' OR status IS NULL) AND blueprint_generated = 0 ORDER BY created_at DESC LIMIT 1"
    ).bind(user.id).first();
    if (activeRow) {
      const kvData = await env.SESSIONS.get(activeRow.id);
      if (kvData) {
        const session = JSON.parse(kvData);
        if (session.messages && session.messages.length > 0) {
          const displayMessages = session.messages.filter((m, i) => !(i === 0 && m.role === "user" && m.content === "Start the interview."));
          await logEvent(env, activeRow.id, "session_resumed", { phase: session.phase, messageCount: displayMessages.length, fast: true });
          return json({
            ok: true,
            user: userInfo,
            hasActiveSession: true,
            blueprintComplete: false,
            sessionId: activeRow.id,
            tier: session.tier || activeRow.tier,
            phase: session.phase || activeRow.phase || 1,
            messages: displayMessages.map((m) => ({ role: m.role, content: m.role === "assistant" ? stripMetadata(m.content) : m.content })),
            blueprintGenerated: false,
            blueprint: null,
            strategistDebrief: null
          });
        }
      } else {
        await env.DB.prepare("UPDATE sessions SET status = 'expired' WHERE id = ?").bind(activeRow.id).run().catch(() => null);
      }
    }
    return json({ ok: true, user: userInfo, hasActiveSession: false });
  } catch (e) {
    return json({ error: "Fast resume failed", detail: e.message }, 500);
  }
}

export async function handleSetPassword(request, env) {
  try {
    const user = await requireAuth(request, env);
    if (!user)
      return json({ error: "Unauthorized" }, 401);
    const { password } = await request.json();
    if (!password || password.length < 8)
      return json({ error: "Password must be at least 8 characters" }, 400);
    const hash = await hashPassword(password);
    await updateUserPassword(env, user.id, hash);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to set password" }, 500);
  }
}

export async function handleMagicLink(request, env, url) {
  const token = url.searchParams.get("token");
  if (!token) {
    return new Response("Missing token", { status: 400 });
  }
  const row = await env.DB.prepare(
    `SELECT * FROM auth_tokens WHERE token = ? AND expires_at > datetime('now') AND (used = 0 OR type = 'persistent_magic')`
  ).bind(token).first().catch(() => null);
  if (!row) {
    return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Link Expired</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#ffffff;color:#1d1d1f;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:40px 20px;}
.card{max-width:400px;background:#ffffff;border:1px solid #f0f0f0;border-radius:20px;padding:48px 40px;}
.wordmark{font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1d1d1f;margin-bottom:24px;}
.rule{width:40px;height:2px;background:#c4703f;margin:0 auto 32px;}
h2{font-family:'Outfit',sans-serif;font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:12px;}
p{font-size:15px;color:#666;line-height:1.6;margin-bottom:28px;}
a{display:inline-block;background:#1d1d1f;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;}
</style>
</head><body>
<div class="card">
  <div class="wordmark">James Guldan</div>
  <div class="rule"></div>
  <h2>This link has expired</h2>
  <p>Magic links can only be used once and expire after 24 hours. Request a new one to sign in.</p>
  <a href="/">Request a new link</a>
</div>
</body></html>`, { status: 410, headers: { "Content-Type": "text/html;charset=UTF-8" } });
  }
  const origin = new URL(request.url).origin;
  const redirect = url.searchParams.get("redirect") || "";
  try {
    const user = await getUserById(env, row.user_id);
    if (user) {
      if (row.type !== "persistent_magic") {
        await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`).bind(token).run().catch(() => null);
      }
      await updateLastLogin(env, user.id).catch(() => null);
      const secret = getJWTSecret(env);
      const sessionToken = await createSessionToken(user.id, user.role, secret);
      const maxAge = 30 * 24 * 3600;
      const isAdmin = row.type === "admin_magic";
      const baseDest = isAdmin ? `${origin}/admin` : redirect ? `${origin}${redirect}` : `${origin}/app`;
      const dest2 = `${baseDest}?_s=${encodeURIComponent(sessionToken)}`;
      return new Response(null, {
        status: 302,
        headers: {
          "Location": dest2,
          "Set-Cookie": `dw_session=${sessionToken}; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax; HttpOnly`,
          "Cache-Control": "no-store"
        }
      });
    }
  } catch (e) {
  }
  const defaultRedirect = redirect ? `${origin}${redirect}` : `${origin}/app`;
  const dest = row.type === "admin_magic" ? `${origin}/admin?magic=${encodeURIComponent(token)}` : `${defaultRedirect}?magic=${encodeURIComponent(token)}`;
  return Response.redirect(dest, 302);
}

export async function handlePaymentSuccess(request, env, url) {
  const checkoutSessionId = url.searchParams.get("session_id");
  const tier = url.searchParams.get("tier") || "blueprint";
  if (!checkoutSessionId) {
    const origin2 = new URL(request.url).origin;
    return Response.redirect(`${origin2}/`, 302);
  }
  let verified = false;
  if (!env.STRIPE_SECRET_KEY) {
    const origin2 = new URL(request.url).origin;
    const isLocal = origin2.includes("localhost") || origin2.includes("127.0.0.1") || origin2.includes(".dev");
    if (!isLocal) {
      return new Response("Payment processing is not configured. Please contact support.", { status: 503 });
    }
    verified = true;
  } else {
    try {
      const res = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`);
      const session = await res.json();
      verified = session.payment_status === "paid";
    } catch (e) {
      await logError(env, { endpoint: "/payment-success", method: "GET", statusCode: 500, errorType: "stripe_verify_error", errorMessage: e.message });
    }
  }
  if (!verified) {
    return new Response("Payment not verified. Please contact support.", { status: 402 });
  }
  const origin = new URL(request.url).origin;
  const existingSessionId = url.searchParams.get("existing_session");
  if (existingSessionId) {
    const raw = await env.SESSIONS.get(existingSessionId);
    if (raw) {
      const existingSession = JSON.parse(raw);
      existingSession.tier = "site";        // always grant full access on purchase
      existingSession.blueprintTier = tier;  // preserve original tier for analytics
      existingSession.stripeCheckoutId = checkoutSessionId;
      await env.SESSIONS.put(existingSessionId, JSON.stringify(existingSession), { expirationTtl: 60 * 60 * 24 * 30 });
      await logEvent(env, existingSessionId, "tier_upgraded", { from: existingSession.tier, to: tier });
      const upgradeAccess = await generateSessionAccessToken(env, existingSessionId);
      return Response.redirect(`${origin}/app?session=${existingSessionId}&tier=${tier}&upgraded=true&access=${upgradeAccess}`, 302);
    }
  }
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await env.SESSIONS.put(sessionId, JSON.stringify({
    id: sessionId,
    tier: "site",              // always grant site tier -- blueprint + deploy included in any purchase
    blueprintTier: tier,       // preserve original tier for analytics
    stripeCheckoutId: checkoutSessionId,
    phase: 1,
    messages: [],
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }), { expirationTtl: 60 * 60 * 24 * 30 });
  const accessToken = await generateSessionAccessToken(env, sessionId);
  if (env.RESEND_API_KEY) {
    const checkoutDetails = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`).then((r) => r.json()).catch(() => ({}));
    const customerEmail = checkoutDetails.customer_details?.email || checkoutDetails.customer_email || null;
    const tierLabel = tier === "site" ? "Site In Sixty ($130)" : "Blueprint Session ($67)";
    const startUrl = `${origin}/app?session=${sessionId}&tier=${tier}&access=${accessToken}`;
    if (customerEmail) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
          to: [customerEmail],
          subject: "You're in \u2014 your Deep Work session is ready",
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;"><tr><td style="padding-bottom:28px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1d1d1f;">JAMES GULDAN</p></td></tr><tr><td style="background:#1d1d1f;border-radius:20px 20px 0 0;padding:40px 40px 36px;"><p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c4703f;">Deep Work</p><h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">You're in.</h1><p style="margin:0;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">Payment confirmed. Your Deep Work Interview is ready. Eight conversations. One complete brand blueprint built around who you actually are.</p></td></tr><tr><td style="background:#ffffff;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;border-radius:0 0 20px 20px;padding:36px 40px 40px;"><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #f0f0f0;border-radius:12px;overflow:hidden;"><tr><td style="padding:20px 24px;"><p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#86868b;">What to expect</p><p style="margin:0;font-size:14px;color:#1d1d1f;line-height:1.7;">About 60-90 minutes total. Pause and come back any time - your session saves automatically.</p></td></tr></table><table cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-radius:50px;background:#1d1d1f;"><a href="${startUrl}" style="display:inline-block;background:#1d1d1f;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Begin My Session &rarr;</a></td></tr></table><p style="margin:0 0 24px;font-size:13px;color:#86868b;line-height:1.7;">This link is your direct access. Bookmark it or save this email.</p><hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;"><p style="margin:0;font-size:13px;color:#86868b;line-height:1.6;">Questions? Reply here or write to <a href="mailto:james@jamesguldan.com" style="color:#c4703f;text-decoration:none;">james@jamesguldan.com</a></p></td></tr><tr><td style="padding-top:24px;text-align:center;"><p style="margin:0;font-size:12px;color:#c0c0c0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Align Consulting LLC &middot; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#c0c0c0;text-decoration:none;">Privacy Policy</a> &middot; <a href="mailto:james@jamesguldan.com" style="color:#c0c0c0;text-decoration:none;">Support</a></p></td></tr></table></td></tr></table></body></html>`
        })
      }).catch(() => {
      });
    }
  }
  return Response.redirect(`${origin}/app?session=${sessionId}&tier=${tier}&access=${accessToken}`, 302);
}
