// ============================================================
// DEEP WORK APP — CLOUDFLARE WORKER
// ============================================================
// Infra IDs:
//   KV:  DEEP_WORK_SESSIONS  (ad823265a8944b9da7a561198f7f3782)
//   R2:  deep-work-uploads
//   D1:  deep-work-db        (92121f3b-dcfb-4fa8-8482-b827224b611d)
//
// Stripe Price IDs:
//   Blueprint:  price_1TCXL7FArNSFW9mB5DDauxQg  ($67)
//   Call:       price_1TCXL8FArNSFW9mBBtiWVRCb  ($197)
//   Site:       price_1TCXL9FArNSFW9mBr189gJuC  ($197)
//
// Required secrets (set via wrangler secret put):
//   ANTHROPIC_API_KEY
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   CF_ACCOUNT_ID  (bd13f1dff62d4ccbea47440e45b48ec2)
// ============================================================

import { getHTML } from './html.js';
import { getAdminHTML } from './admin.js';
import { getLoginHTML } from './login.js';
import {
  DEEP_WORK_SYSTEM_PROMPT,
  SITE_GENERATION_PROMPT,
  SITE_CSS_FOUNDATION,
  imagePrompts,
  contextEnrichmentPrompt
} from './prompts.js';
import {
  hashPassword, verifyPassword,
  createSessionToken, verifySessionToken,
  generateMagicToken, storeMagicToken, consumeMagicToken,
  getUserByEmail, getUserById, createUser, updateUserPassword, updateLastLogin,
  requireAuth, requireAdmin,
  getSetting, setSetting, getAllSettings
} from './auth.js';
import {
  logError, trackMetric, trackAPICall, trackFunnelEvent,
  createAlert, runFullHealthCheck, checkFunnelHealth,
  handleMonitoringDashboard, generateDailyDigest,
  getErrorPageHTML, ERROR_PAGES
} from './monitor.js';

// ── CORS HEADERS ─────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsHeaders(extra = {}) {
  return { ...CORS, ...extra };
}

// ── SECURITY HEADERS ──────────────────────────────────────
const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function htmlHeaders(extra = {}) {
  return { 'Content-Type': 'text/html;charset=UTF-8', ...SEC_HEADERS, ...extra };
}

// ── MAIN EXPORT ──────────────────────────────────────────
export default {
  // Cron triggers:
  //   Every 2 hours — abandonment check
  //   Daily at 9am UTC — full system health check
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      try {
        await runAbandonmentCheck(env);
        // Daily health check fires on the 9am cron
        if (event.cron === '0 9 * * *') {
          await runDailyHealthCheck(env);
        }
      } catch (e) {
        console.error('Scheduled task error:', e.message);
      }
    })());
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    try {
      // ── Login page (app.jamesguldan.com entry point) ──
      if (path === '/' || path === '') {
        return new Response(getLoginHTML(), { headers: htmlHeaders() });
      }

      // ── Main app (authenticated users, post-payment) ──
      if (path === '/app') {
        const html = getHTML({
          STRIPE_PRICE_BLUEPRINT: 'price_1TCXL7FArNSFW9mB5DDauxQg',
          STRIPE_PRICE_CALL:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
          STRIPE_PRICE_SITE:      'price_1TCXL9FArNSFW9mBr189gJuC',
        });
        return new Response(html, { headers: htmlHeaders() });
      }

      // ── Admin panel ───────────────────────────────────
      if (path === '/admin') {
        return new Response(getAdminHTML(), { headers: htmlHeaders() });
      }

      // ── Payment success redirect ───────────────────────
      if (path === '/payment-success') {
        return handlePaymentSuccess(request, env, url);
      }

      // ── Auth routes ───────────────────────────────────
      if (path === '/api/auth/login'         && request.method === 'POST')  return handleAuthLogin(request, env);
      if (path === '/api/auth/register'      && request.method === 'POST')  return handleAuthRegister(request, env);
      if (path === '/api/auth/magic'         && request.method === 'POST')  return handleAuthMagic(request, env);
      if (path === '/api/auth/request-magic' && request.method === 'POST')  return handleRequestMagic(request, env);
      if (path === '/api/auth/me'             && request.method === 'GET')   return handleAuthMe(request, env);
      if (path === '/api/auth/set-password'   && request.method === 'POST')  return handleSetPassword(request, env);
      if (path === '/api/auth/forgot-password'&& request.method === 'POST')  return handleForgotPassword(request, env);
      if (path === '/api/auth/reset-password' && request.method === 'POST')  return handleResetPassword(request, env);

      // ── Reset password page ───────────────────────────
      if (path === '/reset-password') return serveResetPasswordPage(request, env, url);

      // ── Magic link bypass ─────────────────────────────
      if (path === '/magic') return handleMagicLink(request, env, url);

      // ── Logout ────────────────────────────────────────
      if (path === '/logout') {
        return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Signing out...</title>
<style>body{font-family:sans-serif;background:#FDFCFA;display:flex;align-items:center;justify-content:center;height:100vh;color:#1a1a1a;}</style>
</head><body><p>Signing out...</p>
<script>
localStorage.removeItem('dw_session');
localStorage.removeItem('dw_admin_token');
document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
window.location.replace('/');
</script></body></html>`, {
          status: 200,
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Set-Cookie': 'dw_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax'
          }
        });
      }

      // ── Admin API routes ──────────────────────────────
      if (path === '/api/admin/stats'                  && request.method === 'GET')  return handleAdminStats(request, env);
      if (path === '/api/admin/users'                  && request.method === 'GET')  return handleAdminListUsers(request, env);
      if (path === '/api/admin/users'                  && request.method === 'POST') return handleAdminCreateUser(request, env);
      if (path === '/api/admin/sessions'               && request.method === 'GET')  return handleAdminListSessions(request, env);
      if (path.startsWith('/api/admin/session/')       && request.method === 'GET')  return handleAdminGetSession(request, env, path);
      if (path === '/api/admin/magic-link'             && request.method === 'POST') return handleAdminMagicLink(request, env);
      if (path === '/api/admin/settings'               && request.method === 'GET')  return handleAdminGetSettings(request, env);
      if (path === '/api/admin/settings'               && request.method === 'POST') return handleAdminSaveSettings(request, env);
      if (path === '/api/admin/prompt'                 && request.method === 'GET')  return handleAdminGetPrompt(request, env);
      if (path === '/api/admin/prompt'                 && request.method === 'POST') return handleAdminSavePrompt(request, env);

      // ── API routes ────────────────────────────────────
      if (path === '/api/checkout' && request.method === 'POST') {
        return handleCheckout(request, env);
      }
      if (path === '/api/webhook' && request.method === 'POST') {
        return handleWebhook(request, env);
      }
      if (path === '/api/session/start' && request.method === 'POST') {
        return handleSessionStart(request, env);
      }
      if (path === '/api/session/resume' && request.method === 'POST') {
        return handleSessionResume(request, env);
      }
      if (path === '/api/user/active-session' && request.method === 'GET') {
        return handleUserActiveSession(request, env);
      }
      if (path === '/api/chat' && request.method === 'POST') {
        return handleChat(request, env);
      }
      if (path === '/api/upload' && request.method === 'POST') {
        return handleUpload(request, env);
      }
      if (path === '/api/generate/images' && request.method === 'POST') {
        return handleGenerateImages(request, env);
      }
      if (path === '/api/generate/site' && request.method === 'POST') {
        return handleGenerateSite(request, env);
      }
      if (path === '/api/deploy' && request.method === 'POST') {
        return handleDeploy(request, env);
      }
      if (path === '/api/export' && request.method === 'POST') {
        return handleExport(request, env);
      }
      if (path === '/api/blueprint/pdf' && request.method === 'POST') {
        return handleBlueprintPDF(request, env);
      }
      if (path === '/api/feedback' && request.method === 'POST') {
        return handleFeedback(request, env);
      }
      if (path === '/api/test/blueprint' && request.method === 'POST') {
        return handleTestBlueprint(request, env);
      }
      if (path.startsWith('/api/session/') && request.method === 'GET') {
        return handleGetSession(request, env, path);
      }

      // ── Legal pages ───────────────────────────────────
      if (path === '/legal/terms') {
        return new Response(getLegalHTML('Terms of Service', `
          <p>Last updated: March 2025</p>
          <h2>1. Service Description</h2>
          <p>Deep Work App is an AI-powered brand strategy tool provided by Align Growth LLC ("we", "us", "our"). By purchasing and using this service, you agree to these terms.</p>
          <h2>2. Payment & Refunds</h2>
          <p>Payments are processed securely via Stripe. Due to the digital and instant-delivery nature of this product, all sales are final. If you experience a technical issue that prevents access, contact us at james@jamesguldan.com within 7 days.</p>
          <h2>3. Intellectual Property</h2>
          <p>All content you generate through the service is owned by you. The platform, prompts, and software are owned by Align Growth LLC.</p>
          <h2>4. Acceptable Use</h2>
          <p>You may not use this service for unlawful purposes, to generate spam, or to reverse-engineer our AI systems. We reserve the right to terminate access for misuse.</p>
          <h2>5. Disclaimer</h2>
          <p>Results are not guaranteed. The AI-generated brand strategy is a starting point, not a substitute for professional business advice.</p>
          <h2>6. Contact</h2>
          <p>Questions? Email <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
        `), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
      }

      if (path === '/legal/privacy') {
        return new Response(getLegalHTML('Privacy Policy', `
          <p>Last updated: March 2025</p>
          <h2>1. Information We Collect</h2>
          <p>We collect your email address (for account creation and login), content you submit during sessions (brand strategy answers, uploaded images), and basic usage data (session progress, completion status).</p>
          <h2>2. How We Use Your Data</h2>
          <p>Your session content is used solely to generate your brand blueprint and website. We do not sell your data. Email is used for login and optional product updates (you can unsubscribe anytime).</p>
          <h2>3. Data Storage</h2>
          <p>Data is stored in Cloudflare's infrastructure (D1, R2, KV). Session content may be retained for up to 12 months to allow re-access to your blueprint. Uploaded images are stored securely in Cloudflare R2.</p>
          <h2>4. Third Parties</h2>
          <p>We use Stripe for payment processing (their privacy policy applies to payment data). We use Anthropic's Claude API to process session content. We do not share your data with other third parties.</p>
          <h2>5. Your Rights</h2>
          <p>You may request deletion of your data at any time by emailing james@jamesguldan.com. We will process deletion requests within 30 days.</p>
          <h2>6. Cookies</h2>
          <p>We use a single session cookie (dw_session) for authentication only. No advertising or tracking cookies are used.</p>
          <h2>7. Contact</h2>
          <p>Privacy questions: <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
        `), { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
      }

      // ── Health check ──────────────────────────────────
      if (path === '/health') {
        return json({ ok: true, ts: Date.now() });
      }

      // ── Monitoring routes (admin only) ──────────────────
      if (path === '/api/admin/health'      && request.method === 'GET')  return handleHealthCheck(request, env);
      if (path === '/api/admin/monitoring'  && request.method === 'GET')  return handleMonitoring(request, env);
      if (path === '/api/admin/digest'      && request.method === 'POST') return handleDigest(request, env);
      if (path === '/api/admin/errors'      && request.method === 'GET')  return handleAdminErrors(request, env);
      if (path === '/api/admin/api-usage'   && request.method === 'GET')  return handleAPIUsage(request, env);
      if (path === '/api/admin/resolve-alert' && request.method === 'POST') return handleResolveAlert(request, env);
      if (path === '/api/admin/test-trigger'  && request.method === 'POST') return handleAdminTestTrigger(request, env);
      if (path === '/api/admin/system-health' && request.method === 'GET')  return handleSystemHealthCheck(request, env);

      // ── 404 with beautiful error page ───────────────────
      return new Response(getErrorPageHTML(404, 'Page Not Found', ERROR_PAGES[404].message), {
        status: 404, headers: htmlHeaders()
      });

    } catch (err) {
      console.error('Worker error:', err);
      const reqId = crypto.randomUUID().slice(0, 8);
      const path = new URL(request.url).pathname;

      // Log the error (best effort, don't let this fail the response)
      try {
        await logError(env, {
          endpoint: path,
          method: request.method,
          statusCode: 500,
          errorType: err.name || 'Error',
          errorMessage: err.message,
          stack: err.stack?.slice(0, 2000),
          requestId: reqId
        });
        await createAlert(env, {
          alertType: 'worker_exception',
          severity: 'critical',
          title: 'Worker Exception',
          message: `Unhandled error on ${request.method} ${path}: ${err.message} (Request ID: ${reqId})`
        });
      } catch (_) { /* don't fail the response if logging fails */ }

      // Return beautiful error page for HTML requests, JSON for API
      if (path.startsWith('/api/')) {
        return json({ error: 'Something went wrong', requestId: reqId }, 500);
      }
      return new Response(
        getErrorPageHTML(500, 'Something Went Wrong', ERROR_PAGES[500].message + `<br><span style="font-size:12px;color:#ccc;margin-top:8px;display:inline-block;">Ref: ${reqId}</span>`),
        { status: 500, headers: htmlHeaders() }
      );
    }
  }
};


// ════════════════════════════════════════════════════════
// LEGAL PAGES
// ════════════════════════════════════════════════════════

function getLegalHTML(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Deep Work App</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #FDFCFA; color: #1a1a1a; padding: 0; -webkit-font-smoothing: antialiased; }
  nav { background: rgba(253,252,250,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #EAE7E2; padding: 0 48px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .nav-logo { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase; color: #1a1a1a; text-decoration: none; }
  .nav-back { font-size: 13px; color: #888; text-decoration: none; }
  .nav-back:hover { color: #1a1a1a; }
  main { max-width: 680px; margin: 0 auto; padding: 60px 24px 80px; }
  h1 { font-family: 'Outfit', sans-serif; font-size: 36px; font-weight: 700; margin-bottom: 8px; }
  .meta { font-size: 14px; color: #888; margin-bottom: 48px; border-bottom: 1px solid #EAE7E2; padding-bottom: 24px; }
  h2 { font-size: 18px; font-weight: 600; margin: 32px 0 12px; }
  p { font-size: 15px; color: #444; line-height: 1.75; margin-bottom: 16px; }
  a { color: #c4703f; text-decoration: none; }
  a:hover { text-decoration: underline; }
  footer { text-align: center; padding: 32px; font-size: 12px; color: #bbb; border-top: 1px solid #EAE7E2; }
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Deep Work</a>
  <a href="/" class="nav-back">← Back</a>
</nav>
<main>
  <h1>${title}</h1>
  <p class="meta">Align Growth LLC &nbsp;·&nbsp; james@jamesguldan.com</p>
  ${content}
</main>
<footer>&copy; 2025 Align Growth LLC &nbsp;·&nbsp; <a href="/legal/terms">Terms</a> &nbsp;·&nbsp; <a href="/legal/privacy">Privacy</a></footer>
</body>
</html>`;
}


// ════════════════════════════════════════════════════════
// PAYMENT
// ════════════════════════════════════════════════════════

async function handleCheckout(request, env) {
  const body = await request.json();
  const { tier, sessionId: existingSessionId } = body;

  const PRICE_MAP = {
    blueprint: 'price_1TCXL7FArNSFW9mB5DDauxQg',
    call:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
    site:      'price_1TCXL9FArNSFW9mBr189gJuC',
  };

  const priceId = PRICE_MAP[tier];
  if (!priceId) return json({ error: 'Invalid tier' }, 400);

  const origin = new URL(request.url).origin;
  // Pass the existing session ID through so handlePaymentSuccess can upgrade it instead of creating a new one
  const existingParam = existingSessionId ? `&existing_session=${existingSessionId}` : '';
  const successUrl = `${origin}/payment-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}${existingParam}`;
  const cancelUrl = `${origin}/`;

  const params = new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': successUrl,
    'cancel_url': cancelUrl,
    'metadata[tier]': tier,
  });
  if (existingSessionId) params.set('metadata[existing_session_id]', existingSessionId);

  const apiStart = Date.now();
  const res = await stripePost(env, '/v1/checkout/sessions', params);

  trackAPICall(env, 'stripe', '/v1/checkout/sessions', res.status, Date.now() - apiStart);
  trackFunnelEvent(env, 'checkout_started', { tier });

  const session = await res.json();
  if (session.url) {
    return json({ url: session.url });
  }
  await logError(env, { endpoint: '/api/checkout', method: 'POST', statusCode: 500, errorType: 'stripe_checkout', errorMessage: JSON.stringify(session.error) });
  await trackFunnelEvent(env, 'payment_failed', { tier, error: session.error?.message });
  return json({ error: 'Failed to create checkout session', detail: session.error }, 500);
}

async function handlePaymentSuccess(request, env, url) {
  const checkoutSessionId = url.searchParams.get('session_id');
  const tier = url.searchParams.get('tier') || 'blueprint';

  if (!checkoutSessionId) {
    return Response.redirect(new URL('/').toString(), 302);
  }

  // Verify payment with Stripe
  let verified = false;
  try {
    const res = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`);
    const session = await res.json();
    verified = session.payment_status === 'paid';
  } catch (e) {
    // If Stripe key not set yet, allow through for testing
    verified = true;
  }

  if (!verified) {
    return new Response('Payment not verified. Please contact support.', { status: 402 });
  }

  const origin = new URL(request.url).origin;

  // Check if this is a tier upgrade for an existing session (e.g. order-bump upsell)
  const existingSessionId = url.searchParams.get('existing_session');
  if (existingSessionId) {
    const raw = await env.SESSIONS.get(existingSessionId);
    if (raw) {
      const existingSession = JSON.parse(raw);
      existingSession.tier = tier;
      existingSession.stripeCheckoutId = checkoutSessionId;
      await env.SESSIONS.put(existingSessionId, JSON.stringify(existingSession), { expirationTtl: 60 * 60 * 24 * 30 });
      await logEvent(env, existingSessionId, 'tier_upgraded', { from: existingSession.tier, to: tier });
      // Send them to the app with their existing session — the blueprint screen will show with the build-site-btn
      return Response.redirect(`${origin}/?session=${existingSessionId}&tier=${tier}`, 302);
    }
  }

  // New session flow (initial purchase)
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

  // Store minimal session in KV
  await env.SESSIONS.put(sessionId, JSON.stringify({
    id: sessionId,
    tier,
    stripeCheckoutId: checkoutSessionId,
    phase: 1,
    messages: [],
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: new Date().toISOString()
  }), { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days

  // Redirect to app with session token
  return Response.redirect(`${origin}/?session=${sessionId}&tier=${tier}`, 302);
}

async function handleWebhook(request, env) {
  // Stripe webhook - log events to D1
  const body = await request.text();
  // Signature verification would use env.STRIPE_WEBHOOK_SECRET
  try {
    const event = JSON.parse(body);
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      await logEvent(env, null, 'stripe_payment_completed', {
        checkoutId: s.id,
        tier: s.metadata?.tier,
        amount: s.amount_total
      });
    }
  } catch (e) {}
  return json({ received: true });
}


// ════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ════════════════════════════════════════════════════════

async function handleSessionStart(request, env) {
  const body = await request.json();
  const { sessionId, tier, existingWebsiteUrl, linkedinUrl, competitorUrls, testimonials, uploadedKeys, phone } = body;

  // Extract user ID from auth token if present
  let userId = null;
  try {
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = await verifySessionToken(token, env.JWT_SECRET || 'dev-secret-change-me');
      if (payload) userId = payload.userId;
    }
  } catch (_) {}

  // Load or create session
  let session;
  const sessionRaw = await env.SESSIONS.get(sessionId);
  if (sessionRaw) {
    session = JSON.parse(sessionRaw);
  } else {
    session = {
      id: sessionId || ('sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)),
      tier: tier || 'blueprint',
      phase: 1,
      messages: [],
      userData: {},
      userId: userId,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: new Date().toISOString()
    };
  }

  // Always update userId if we have one
  if (userId) session.userId = userId;

  // Store phone at top-level session for drip worker use
  if (phone) session.phone = phone;

  // Enrich with intake data
  session.userData = {
    existingWebsiteUrl: existingWebsiteUrl || '',
    linkedinUrl: linkedinUrl || '',
    competitorUrls: competitorUrls || [],
    testimonials: testimonials || '',
    uploadedKeys: uploadedKeys || [],
    phone: phone || '',
    existingWebsiteAnalysis: '',
    linkedinData: '',
    competitorAnalyses: []
  };

  // Fetch external context in parallel
  const fetchPromises = [];

  if (existingWebsiteUrl) {
    fetchPromises.push(
      fetchAndSummarize(env, existingWebsiteUrl, 'Summarize this website in 200 words: what they offer, their positioning, their target audience, and what is missing.')
        .then(text => { session.userData.existingWebsiteAnalysis = text; })
        .catch(() => {})
    );
  }

  if (competitorUrls && competitorUrls.length > 0) {
    competitorUrls.slice(0, 3).forEach((url, i) => {
      fetchPromises.push(
        fetchAndSummarize(env, url, 'Summarize this competitor website: their positioning, target audience, pricing signals, and main differentiators in 150 words.')
          .then(text => { session.userData.competitorAnalyses[i] = text; })
          .catch(() => {})
      );
    });
  }

  await Promise.allSettled(fetchPromises);

  // Build context enrichment
  const contextExtra = contextEnrichmentPrompt(session.userData);
  const systemWithContext = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? '\n\n' + contextExtra : '');
  session.systemPrompt = systemWithContext;

  // Generate opening message from Claude
  const openingMessages = [
    { role: 'user', content: 'Start the interview. Introduce yourself briefly and ask your first question for Phase 1.' }
  ];

  const firstMessage = await callClaude(env, systemWithContext, openingMessages, false);
  const cleanFirst = stripMetadata(firstMessage);

  // Add to session messages (the actual conversation starts after this)
  session.messages = [
    { role: 'user', content: 'Start the interview.' },
    { role: 'assistant', content: firstMessage }
  ];

  await env.SESSIONS.put(session.id, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

  // Log to D1
  await initSessionInD1(env, session);
  await logEvent(env, session.id, 'session_started', { tier, phase: 1 });

  // Fire interview_started event to drip worker (non-blocking)
  if (session.userId) {
    getUserById(env, session.userId).then(user => {
      if (user?.email) {
        fireEventToDripWorker(env, user.email, 'interview_started', {
          name: user.name || '',
          phone: session.phone || ''
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  return json({ ok: true, sessionId: session.id, firstMessage: cleanFirst });
}

async function handleGetSession(request, env, path) {
  const sessionId = path.split('/').pop();
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);
  // Don't return full messages to save bandwidth
  return json({
    id: session.id,
    tier: session.tier,
    phase: session.phase,
    blueprintGenerated: session.blueprintGenerated,
    siteGenerated: session.siteGenerated
  });
}

// Find active session for authenticated user
async function handleUserActiveSession(request, env) {
  const user = await requireAuth(request, env);
  if (!user) return json({ error: 'Not authenticated' }, 401);

  try {
    // Check D1 for active sessions belonging to this user
    const row = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND (status = 'active' OR status IS NULL) AND blueprint_generated = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();

    if (!row) return json({ hasActiveSession: false });

    // Verify it still exists in KV
    const kvData = await env.SESSIONS.get(row.id);
    if (!kvData) {
      // KV expired, mark session as expired in D1
      await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(row.id).run();
      return json({ hasActiveSession: false });
    }

    const session = JSON.parse(kvData);
    return json({
      hasActiveSession: true,
      session: {
        id: row.id,
        tier: row.tier,
        phase: session.phase || row.phase,
        messageCount: session.messages ? session.messages.length : row.message_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (e) {
    return json({ hasActiveSession: false, error: e.message });
  }
}

// Resume an existing session - returns full message history
async function handleSessionResume(request, env) {
  const user = await requireAuth(request, env);
  if (!user) return json({ error: 'Not authenticated' }, 401);

  try {
    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId) return json({ error: 'sessionId required' }, 400);

    // Verify session belongs to this user
    const row = await env.DB.prepare(`SELECT user_id FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!row) return json({ error: 'Session not found' }, 404);
    if (row.user_id && row.user_id !== user.id) return json({ error: 'Not your session' }, 403);

    // Get full session from KV
    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData) return json({ error: 'Session data expired. Please start a new session.' }, 410);

    const session = JSON.parse(kvData);

    // Strip the initial "Start the interview." user message - the user never typed that
    const displayMessages = (session.messages || []).filter((m, i) => {
      if (i === 0 && m.role === 'user' && m.content === 'Start the interview.') return false;
      return true;
    });

    // Log the resume event
    await logEvent(env, sessionId, 'session_resumed', { phase: session.phase, messageCount: displayMessages.length });

    return json({
      ok: true,
      sessionId: session.id,
      tier: session.tier,
      phase: session.phase || 1,
      messages: displayMessages.map(m => ({ role: m.role, content: m.role === 'assistant' ? stripMetadata(m.content) : m.content })),
      blueprintGenerated: session.blueprintGenerated || false,
      blueprint: session.blueprint || null
    });
  } catch (e) {
    return json({ error: 'Failed to resume session', detail: e.message }, 500);
  }
}


// ════════════════════════════════════════════════════════
// TEST BLUEPRINT GENERATION (fast test endpoint)
// ════════════════════════════════════════════════════════

async function handleTestBlueprint(request, env) {
  // Pre-loaded fake interview data simulating a complete 7-phase session
  const fakeMessages = [
    { role: 'assistant', content: `Before we dive in, let\u2019s take a breath. Seriously. This work goes a lot deeper when you\u2019re not still half-distracted by whatever was happening 10 minutes ago. Take three slow breaths with me. In through the nose, hold for a beat, out through the mouth. I\u2019ll be here.\n\nGood. The reason this matters is that what we are about to do together is not a questionnaire. It\u2019s an excavation. We\u2019re going to find the things about you that most people never bother to articulate. That takes presence. So thank you for showing up ready to actually go there.\n\nI\u2019m your brand strategist for this session. Think of me as a really smart friend who happens to know a lot about positioning, offers, and what actually makes people choose you over everyone else. I don\u2019t do corporate speak. I don\u2019t do fluff. I do honest, and I do deep.\n\nWhat do you do, and how did you end up doing it? Not the elevator pitch version. The real version. The one with the twist in it.\nMETADATA:{"phase":1,"phaseProgress":10,"sessionComplete":false,"key":"Opening the session"}` },

    { role: 'user', content: `I run a leadership coaching company called Peak Performance Partners. I work with mid-level executives at Fortune 500 companies who are stuck in that weird zone where they are too senior for generic training programs but not senior enough for the C-suite coaches. I got into this because I spent 15 years climbing the corporate ladder at Microsoft, made it to VP of Product, and then one day realized I was great at developing my team but terrible at developing myself. I burned out hard, took six months off, did a bunch of therapy and executive coaching myself, and came out the other side thinking "this stuff saved my career and probably my marriage, but most people like me would never seek it out because there is such a stigma." So I started doing it myself. That was four years ago. I have worked with about 200 leaders since then.` },
    { role: 'assistant', content: `That. Right there. "Too senior for generic training, not senior enough for C-suite coaches." That is a real gap and I can already feel the positioning potential in it.\n\nTell me about the burnout. Not the polished version you tell at keynotes. What was the actual moment you knew something had to change?\nMETADATA:{"phase":1,"phaseProgress":35,"sessionComplete":false,"key":"15 years at Microsoft, VP of Product, burned out, found coaching"}` },
    { role: 'user', content: `Honestly it was a Tuesday. I was in a one-on-one with someone on my team, and she was telling me about a problem she was having with a cross-functional partner, and I realized I had zero capacity to care. Not that I did not want to, I physically could not. I had been running on empty for so long that I had nothing left to give. I went home that night and my wife said something totally normal, like "how was your day," and I just started crying. I could not stop. That was the moment. I took medical leave the next week.` },
    { role: 'assistant', content: `Thank you for sharing that. The fact that it was a Tuesday, not some dramatic boardroom moment, is actually what makes your story powerful. Most burnout does not announce itself. It just quietly drains you until there is nothing left.\n\nLet me ask you this: in the four years since, what is the single most surprising thing you have learned about the leaders you work with?\nMETADATA:{"phase":1,"phaseProgress":65,"sessionComplete":false,"key":"Burnout moment was mundane, not dramatic - that's the real story"}` },
    { role: 'user', content: `That almost all of them are terrified. These are people running teams of 50, 100, 200 people, making decisions that affect millions in revenue, and underneath all of that confidence is this deep fear that they are going to be found out. Impostor syndrome at scale. And the higher they climb, the lonelier it gets, so they have nobody to talk to about it. Their spouse does not understand the pressure, their peers are their competition, and their boss is the one they are trying to impress. So they just perform. Until they can not anymore.` },
    { role: 'assistant', content: `"Impostor syndrome at scale." Write that down because we are going to use it.\n\nOkay, let us move into your expertise. You said you have worked with about 200 leaders. What are the results you can actually prove? I do not mean "they felt better." I mean what changed in measurable, undeniable terms?\nMETADATA:{"phase":2,"phaseProgress":15,"sessionComplete":false,"key":"Leaders are terrified - impostor syndrome at scale, loneliness of mid-level leadership"}` },
    { role: 'user', content: `So I track a few things. 83% of my clients have received a promotion within 18 months of starting with me. Average team engagement scores go up 34% in the first year. Three clients have gone on to become C-suite executives. I have a 92% completion rate on my six month program, which is really high for coaching. I have NPS of 87. I also have my PCC credential from the ICF, I am a certified Enneagram practitioner, and I did my Masters in Organizational Psychology at Columbia. But honestly the thing that gives me the most credibility is that I have been in their exact shoes. I know what it feels like to lead a team of 150 people while pretending you have it all figured out.` },
    { role: 'assistant', content: `Those numbers are genuinely strong. 83% promotion rate is a headline stat. The "I have been in their shoes" credibility is your biggest asset though because no amount of credentials replaces lived experience.\n\nNow here is the harder question. What are you NOT great at? What is the gap between what you promise and what you can actually deliver? I need you to be honest here because if we do not address it now, it becomes a positioning landmine later.\nMETADATA:{"phase":2,"phaseProgress":60,"sessionComplete":false,"key":"83% promotion rate, 34% engagement increase, PCC + Columbia - strong proof points"}` },
    { role: 'user', content: `Fair question. I am not great with people who want a quick fix. If someone comes to me expecting three sessions and a transformation, I am going to disappoint them. My process takes time. I am also not the best fit for people in deeply toxic work environments because my approach assumes the system is basically functional and the leader is the variable. If the whole system is broken, coaching alone will not fix it. And honestly, I am still building my reputation. I am not a household name. I do not have a book. I do not have a TED talk. My marketing has basically been word of mouth and LinkedIn posts.` },
    { role: 'assistant', content: `That is a beautifully honest assessment. The "quick fix" thing is actually a positioning strength, not a weakness. It means you can filter out the wrong clients before they waste your time.\n\nLet us get into your beliefs. What is the thing you believe about leadership development that most people in your industry would disagree with? The hot take that might make some people uncomfortable.\nMETADATA:{"phase":3,"phaseProgress":10,"sessionComplete":false,"key":"Honest about gaps: not for quick fixes, not for toxic systems, no book/TED talk yet"}` },
    { role: 'user', content: `I believe most leadership training is a waste of money. Companies spend billions on it and almost none of it sticks because it is designed to be delivered at scale, not to actually change behavior. Real leadership development is deeply personal. It requires vulnerability, which you cannot get in a room full of your peers and your boss. The entire industry is built on the premise that you can train leadership like you train a skill, but leadership is not a skill. It is an identity shift. And identity shifts require safety, time, and someone who will call you on your own patterns. That is why one-on-one coaching works and two-day workshops do not.` },
    { role: 'assistant', content: `"Leadership is not a skill, it is an identity shift." That is a belief worth building an entire brand around.\n\nGive me another one. What do you believe about the people you serve that they might not want to hear?\nMETADATA:{"phase":3,"phaseProgress":40,"sessionComplete":false,"key":"Leadership is an identity shift, not a skill - most training is wasted money"}` },
    { role: 'user', content: `I believe most mid-level leaders are addicted to being needed. They say they want to delegate, they say they want their team to be more autonomous, but deep down they are terrified of becoming irrelevant. Their identity is wrapped up in being the person who solves the problem, who stays late, who everyone depends on. And until they untangle their self-worth from their productivity, no amount of time management tips or delegation frameworks will help. The real work is internal. Always.` },
    { role: 'assistant', content: `That is going to resonate deeply with your ideal client because it is the thing they secretly know but have never heard anyone say out loud.\n\nLet us talk about your people. Describe your absolute best client. Not a demographic profile. Tell me about one specific person you have worked with who was a perfect fit.\nMETADATA:{"phase":4,"phaseProgress":10,"sessionComplete":false,"key":"Leaders addicted to being needed - identity wrapped in productivity"}` },
    { role: 'user', content: `Sarah. She was a Senior Director of Engineering at a Series D startup. 38 years old, two kids under five, married to someone who also had a demanding career. She was managing a team of 60 engineers and had just been passed over for VP because, according to her boss, she was "too in the weeds." She came to me frustrated, exhausted, and honestly a little angry. She knew she was good at her job but could not figure out why it was not translating into advancement. Over six months we worked on her executive presence, her ability to let go of technical decisions, and most importantly, her belief that asking for help was a sign of weakness. She got the VP title eight months after we started. But more importantly, she told me she actually enjoys her job again. She stops working at 6pm most nights. Her marriage improved. That is the transformation I am going for.` },
    { role: 'assistant', content: `Sarah is a goldmine for positioning. She is specific enough to be real but universal enough that thousands of leaders will see themselves in her.\n\nWhat words does someone like Sarah use when describing her problem to a friend? Not how she would describe it to her boss or in a coaching intake form. How does she talk about it at dinner with her college roommate?\nMETADATA:{"phase":4,"phaseProgress":50,"sessionComplete":false,"key":"Sarah: Sr Director, passed over for VP, 'too in the weeds', transformed in 6 months"}` },
    { role: 'user', content: `She would say something like "I feel like I am running on a treadmill that keeps getting faster and I cannot figure out how to get off without everything falling apart." Or "I know I should delegate more but every time I do, it does not get done right and I end up doing it myself anyway." Or "I feel like I am killing it at work and failing at home, or failing at work and killing it at home, but never both at the same time." The big one is "I do not even know what I want anymore. I have been so focused on the next promotion that I forgot to ask myself if I actually want the job."` },
    { role: 'assistant', content: `Every single one of those is a headline waiting to happen. "Running on a treadmill that keeps getting faster" is the kind of language that makes people stop scrolling.\n\nLet us shift to your voice and visual identity. When someone interacts with your brand, what three feelings do you want them to walk away with?\nMETADATA:{"phase":5,"phaseProgress":10,"sessionComplete":false,"key":"Client language: treadmill getting faster, killing it at work failing at home"}` },
    { role: 'user', content: `I want them to feel safe, challenged, and understood. Safe enough to be honest about what is not working. Challenged enough to stop making excuses. And understood in a way that feels like "finally, someone gets it." I do not want my brand to feel clinical or academic. I want it to feel like that conversation you have with a mentor over whiskey where they tell you the truth you have been avoiding but you do not feel judged. Warm but direct. Smart but not pretentious. Professional but human.` },
    { role: 'assistant', content: `"Mentor over whiskey." That is your brand in three words. Warm, direct, human.\n\nWhat brands do you admire? Not necessarily in coaching. What brands make you think "that is the vibe I want"?\nMETADATA:{"phase":5,"phaseProgress":40,"sessionComplete":false,"key":"Safe, challenged, understood - mentor over whiskey vibe"}` },
    { role: 'user', content: `Brene Brown is an obvious one but specifically her earlier work before it became too corporate. Patagonia for how they communicate values without being preachy. The School of Life for how they make psychology feel accessible. And honestly, Peloton for how they make something difficult feel like a community experience. I do not want to look like a corporate consulting firm. I do not want stock photos of people in suits shaking hands. I want something that feels more like a high end editorial magazine mixed with a really well designed personal blog.` },
    { role: 'assistant', content: `Great references. The editorial magazine meets personal blog is a really clear visual direction.\n\nLet us talk about your market. Who else does what you do? Who are the competitors that your ideal client is comparing you to, even if they are not a direct match?\nMETADATA:{"phase":6,"phaseProgress":10,"sessionComplete":false,"key":"Brand references: Brene Brown, Patagonia, School of Life, Peloton - editorial + personal"}` },
    { role: 'user', content: `The main competitors in my space are BetterUp which is the big tech-enabled platform for executive coaching, there is also Reboot.io which is Jerry Colonna's company that does CEO coaching with a more emotional depth approach, and then there are a ton of independent coaches who mostly market through LinkedIn. BetterUp is more scalable but less personal. Reboot is amazing but they focus on founders and CEOs, not the mid-level leader. Most independent coaches do not have the corporate experience I have. They come from a counseling or therapy background, not a Fortune 500 VP background. That is my gap: I am not a platform, I am not C-suite only, and I am not a therapist pretending to be a business coach. I am the person who has actually done the job my clients are doing.` },
    { role: 'assistant', content: `"Not a platform, not C-suite only, not a therapist pretending to be a business coach." That right there is your competitive wedge.\n\nWhat positioning territory do you think is completely unclaimed in this space?\nMETADATA:{"phase":6,"phaseProgress":55,"sessionComplete":false,"key":"Competitors: BetterUp (scalable/impersonal), Reboot (CEO only), independent coaches (no corp experience)"}` },
    { role: 'user', content: `Nobody is specifically owning the "middle leadership" space. Everyone is either going after the C-suite because the fees are higher, or they are doing mass-market stuff like online courses for first-time managers. The director and VP level is this massive underserved market. These people have real budgets, their companies will pay for coaching, and they are at the exact inflection point where the right support can change the entire trajectory of their career. But nobody is speaking directly to them with messaging that says "I see you, I was you, and I know exactly what you need."` },
    { role: 'assistant', content: `You have identified a legitimate blue ocean. The "forgotten middle" of leadership. Let us design your offers around this.\n\nLet us think about a three-tier structure. What is the entry point for someone who is interested but not ready to commit to a full coaching engagement?\nMETADATA:{"phase":7,"phaseProgress":10,"sessionComplete":false,"key":"Blue ocean: middle leadership (directors/VPs) is massively underserved"}` },
    { role: 'user', content: `I have been thinking about this. For the entry level, I want to do a "Leadership Audit" which is a single 90-minute deep dive session where I assess where they are, identify their top three blind spots, and give them an action plan. Price it around $497. It gives them a taste of the work without a big commitment. For my core offer, it is a six-month coaching engagement, two sessions per month, with async Slack support between sessions. That is $12,000 for the six months. And for premium, I want to do an annual retainer that includes the six-month intensive plus ongoing monthly sessions, quarterly 360 reviews with their team, and a spot in a small peer group of other leaders I work with. That would be $30,000 per year. The ascension makes sense because the audit identifies the problems, the six-month program solves them, and the annual retainer maintains and deepens the growth.` },
    { role: 'assistant', content: `That is a clean, logical offer ladder. The Leadership Audit at $497 is smart because it is low enough risk that their company will approve it without a procurement process, and it gives you a chance to demonstrate value.\n\nThe pricing feels right for the market. $12K for six months of executive coaching with async support is competitive. $30K for the annual retainer with peer group and 360 reviews is premium but justifiable given the scope.\n\nI have everything I need to generate your complete brand blueprint. Give me a moment to synthesize everything we have discussed across all seven phases into your comprehensive blueprint document.\nMETADATA:{"phase":7,"phaseProgress":100,"sessionComplete":false,"key":"Three-tier: $497 audit, $12K 6-month coaching, $30K annual retainer with peer group"}`  }
  ];

  // Create a test session in KV
  const sessionId = 'test_blueprint_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const session = {
    id: sessionId,
    tier: 'blueprint',
    phase: 8,
    messages: fakeMessages,
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: new Date().toISOString(),
    systemPrompt: DEEP_WORK_SYSTEM_PROMPT
  };

  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });

  // Now call Claude with the full conversation + synthesis request
  session.messages.push({ role: 'user', content: 'I am ready. Please generate my complete brand blueprint now.' });

  const recentMessages = session.messages.slice(-40);

  // Set up streaming response
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const streamPromise = (async () => {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8192,
          stream: true,
          system: [{ type: 'text', text: session.systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages: recentMessages
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        await sendEvent({ type: 'error', message: 'Claude API error: ' + res.status });
        await writer.close();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: 'delta', content: chunk });
              }
            } catch (_) {}
          }
        }
      }

      // Check for blueprint JSON
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
        } catch (_) {}
      }

      session.messages.push({ role: 'assistant', content: fullContent });
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });

      await sendEvent({ type: 'metadata', phase: 8, phaseProgress: 100, sessionComplete: true, blueprint });
      await sendEvent({ type: 'done', sessionId });
      await writer.close();
    } catch (err) {
      try {
        await sendEvent({ type: 'error', message: err.message });
        await writer.close();
      } catch (_) {}
    }
  })();

  return new Response(readable, {
    headers: { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  });
}


// ════════════════════════════════════════════════════════
// CHAT (STREAMING)
// ════════════════════════════════════════════════════════

// ── RATE LIMIT HELPER ────────────────────────────────────────
// Returns true if the request should be blocked (too many requests)
async function isRateLimited(env, userId, sessionId) {
  const key = `rl:${userId || sessionId}`;
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 60;

  try {
    const raw = await env.SESSIONS.get(key);
    const now = Date.now();
    const record = raw ? JSON.parse(raw) : { count: 0, windowStart: now };

    if (now - record.windowStart > windowMs) {
      // New window
      await env.SESSIONS.put(key, JSON.stringify({ count: 1, windowStart: now }), { expirationTtl: 3600 });
      return false;
    }

    if (record.count >= maxRequests) return true;

    record.count += 1;
    await env.SESSIONS.put(key, JSON.stringify(record), { expirationTtl: 3600 });
    return false;
  } catch (_) {
    return false; // fail open — never block on a rate limit error
  }
}

async function handleChat(request, env) {
  const body = await request.json();
  const { sessionId, message } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  // ── GUARDRAIL 1: Blueprint already generated ─────────────
  if (session.blueprintGenerated) {
    return json({
      error: 'interview_complete',
      message: 'Your Deep Work Interview is complete and your blueprint has been generated. If you need to start a new session, please contact support.'
    }, 403);
  }

  // ── GUARDRAIL 2: Session expiry (30 days from creation) ──
  const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
  if (session.createdAt && (Date.now() - new Date(session.createdAt).getTime()) > SESSION_MAX_AGE_MS) {
    return json({
      error: 'session_expired',
      message: 'This session has expired. Please contact support to have your access refreshed.'
    }, 403);
  }

  // ── GUARDRAIL 3: Message cap (200 messages = ~100 exchanges) ──
  const MESSAGE_CAP = 200;
  if (session.messages && session.messages.length >= MESSAGE_CAP) {
    return json({
      error: 'message_limit',
      message: 'You have reached the message limit for this session. Your interview should be complete — check your blueprint above. If you believe this is an error, contact support.'
    }, 429);
  }

  // ── GUARDRAIL 4: Rate limiting (60 requests per hour per user) ──
  const limited = await isRateLimited(env, session.userId, sessionId);
  if (limited) {
    return json({
      error: 'rate_limited',
      message: 'You are sending messages too quickly. Please wait a moment and try again.'
    }, 429);
  }

  // Add user message
  session.messages.push({ role: 'user', content: message });

  // Log event
  await logEvent(env, sessionId, 'message_sent', { phase: session.phase, messageCount: session.messages.length });

  // Build messages for Claude (trim to last 40 to manage context size)
  const recentMessages = session.messages.slice(-40);

  // Set up streaming response
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Run Claude call in background
  const streamPromise = (async () => {
    try {
      const apiStart = Date.now();
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          stream: true,
          system: [
            {
              type: 'text',
              text: session.systemPrompt || DEEP_WORK_SYSTEM_PROMPT,
              cache_control: { type: 'ephemeral' }
            }
          ],
          messages: recentMessages
        })
      });

      // Track the API call
      trackAPICall(env, 'anthropic', '/v1/messages', res.status, Date.now() - apiStart);

      if (!res.ok) {
        const errText = await res.text();
        await sendEvent({ type: 'error', message: 'We hit a temporary issue generating your response. Please try sending your message again.' });
        await logError(env, { endpoint: '/api/chat', method: 'POST', statusCode: res.status, errorType: 'anthropic_api', errorMessage: errText, sessionId });
        await trackFunnelEvent(env, 'ai_error', { phase: session.phase, status: res.status });
        await writer.close();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: 'delta', content: chunk });
              }
            } catch (_) {}
          }
        }
      }

      // Parse metadata from Claude's response
      const metadataMatch = fullContent.match(/METADATA:\{([^}]+)\}/);
      let metadata = { phase: session.phase, phaseProgress: 0, sessionComplete: false };
      if (metadataMatch) {
        try {
          metadata = JSON.parse(`{${metadataMatch[1]}}`);
        } catch (_) {}
      }

      // Check for blueprint JSON
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          session.blueprint = blueprint;
          session.blueprintGenerated = true;

          // Save blueprint to R2
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));

          // Save to RAG D1 table
          await saveToRAG(env, session, blueprint);

          // Fire interview_completed event to drip worker (non-blocking)
          if (session.userId) {
            getUserById(env, session.userId).then(user => {
              if (user?.email) {
                fireEventToDripWorker(env, user.email, 'interview_completed', {
                  name: user.name || '',
                  phone: session.phone || session.userData?.phone || ''
                }).catch(() => {});
              }
            }).catch(() => {});
          }
        } catch (_) {}
      }

      // Update session
      const cleanContent = fullContent
        .replace(/METADATA:\{[^\n]*\}/g, '')
        .replace(/```json[\s\S]*?```/g, '')
        .trim();

      session.messages.push({ role: 'assistant', content: fullContent });
      if (metadata.phase) session.phase = metadata.phase;

      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

      // Update D1 phase tracking
      await updateSessionPhaseInD1(env, sessionId, session.phase, session.messages.length, session.blueprintGenerated);
      await logEvent(env, sessionId, 'message_received', {
        phase: session.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete
      });

      // Send final metadata event
      await sendEvent({
        type: 'metadata',
        phase: metadata.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete || session.blueprintGenerated,
        blueprint: blueprint
      });

      await sendEvent({ type: 'done' });
      await writer.close();

    } catch (err) {
      console.error('Stream error:', err);
      try {
        await sendEvent({ type: 'error', message: err.message });
        await writer.close();
      } catch (_) {}
    }
  })();

  // Don't await — let it stream
  // Use waitUntil to keep the stream alive
  // (The writer runs independently, we return the readable immediately)

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...CORS
    }
  });
}


// ════════════════════════════════════════════════════════
// FILE UPLOAD
// ════════════════════════════════════════════════════════

async function handleUpload(request, env) {
  const formData = await request.formData();
  const file = formData.get('file');
  const sessionId = formData.get('sessionId');

  if (!file) return json({ error: 'No file provided' }, 400);

  const ext = file.name.split('.').pop().toLowerCase();
  const key = `uploads/${sessionId}/${Date.now()}_${Math.random().toString(36).slice(2,7)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  await env.UPLOADS.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type }
  });

  return json({ ok: true, key, name: file.name });
}


// ════════════════════════════════════════════════════════
// IMAGE GENERATION (IMAGEN 4 VIA GEMINI PROXY)
// ════════════════════════════════════════════════════════

async function handleGenerateImages(request, env) {
  const body = await request.json();
  const { sessionId } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);
  const blueprint = session.blueprint;

  if (!blueprint) return json({ error: 'Blueprint not ready' }, 400);

  const PROXY_URL = 'https://gemini-proxy.james-d13.workers.dev';
  const PROXY_TOKEN = env.GEMINI_PROXY_TOKEN || 'U$X2eQQST$mz4$vu';

  const generatedImages = [];

  // Generate 4 moodboard images
  for (let i = 0; i < 4; i++) {
    try {
      const prompt = i === 0
        ? imagePrompts.hero(blueprint.blueprint)
        : imagePrompts.moodboard(blueprint.blueprint, i - 1);

      const res = await fetch(`${PROXY_URL}/v1beta/models/imagen-4.0-generate-001:predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PROXY_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: i === 0 ? '16:9' : '1:1'
          }
        })
      });

      const data = await res.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const imgData = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;

        // Store in R2
        const imgKey = `sessions/${sessionId}/images/img_${i}.png`;
        const imgBytes = Uint8Array.from(atob(data.predictions[0].bytesBase64Encoded), c => c.charCodeAt(0));
        await env.UPLOADS.put(imgKey, imgBytes, { httpMetadata: { contentType: 'image/png' } });

        generatedImages.push(imgData);
      }
    } catch (e) {
      console.error('Image gen error:', e);
    }
  }

  // Store image keys in session
  session.generatedImageKeys = generatedImages.map((_, i) => `sessions/${sessionId}/images/img_${i}.png`);
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

  return json({ ok: true, images: generatedImages });
}


// ════════════════════════════════════════════════════════
// SITE GENERATION (SITE IN SIXTY)
// ════════════════════════════════════════════════════════

async function handleGenerateSite(request, env) {
  const body = await request.json();
  const { sessionId } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  if (!session.blueprint) return json({ error: 'Blueprint not ready' }, 400);

  // Build the prompt + CSS scaffold — Claude only writes HTML body content (no CSS)
  let prompt, head;
  try {
    const result = SITE_GENERATION_PROMPT(session.blueprint.blueprint || session.blueprint);
    prompt = result.prompt;
    head = result.head;
  } catch (e) {
    return json({ error: 'Prompt build failed: ' + e.message }, 500);
  }

  // Call Claude for site generation — dedicated function, no prompt caching (prompt changes every time)
  const bodyContent = await callClaudeSiteGen(env, prompt, 3000);

  // Assemble the final HTML: pre-built head + Claude's body
  // Strip any <style> blocks Claude may have written despite instructions
  let bodyHtml = bodyContent.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Strip stray <html>, <head>, <body> wrappers
  bodyHtml = bodyHtml
    .replace(/<\/html>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/head>/gi, '')
    .replace(/<head[\s\S]*?>/gi, '')
    .trim();
  // Trim everything before the first <nav (drop any leading whitespace/doctype)
  const navIdx = bodyHtml.search(/<nav[\s>]/i);
  if (navIdx > 0) bodyHtml = bodyHtml.slice(navIdx);

  // Footer fallback — inject if Claude ran out of tokens before writing one
  if (!/<footer[\s>]/i.test(bodyHtml)) {
    const bp = session.blueprint?.blueprint || session.blueprint || {};
    const fallbackBrand = bp.part1?.brandNames?.[0] || 'Brand';
    const fallbackEmail = bp.part1?.contactEmail || '';
    const year = new Date().getFullYear();
    bodyHtml += `
<section class="cta-section" id="contact">
  <div class="container text-center">
    <p class="eyebrow">Let's Work Together</p>
    <h2>Ready to take the next step?</h2>${fallbackEmail ? `\n    <a href="mailto:${fallbackEmail}" class="btn btn--primary" style="margin-top:28px">Get In Touch</a>` : `\n    <a href="#" class="btn btn--primary" style="margin-top:28px">Get In Touch</a>`}
  </div>
</section>
<footer>
  <div class="container footer-inner">
    <div class="footer-logo">${fallbackBrand}</div>
    <div class="footer-copy">&copy; ${year} ${fallbackBrand}. All rights reserved.</div>
    <div class="footer-links">
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
</footer>`;
  }

  const cleanHtml = `<!DOCTYPE html>\n<html lang="en">\n${head}\n<body>\n${bodyHtml}\n</body>\n</html>`;

  // Store in R2
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, cleanHtml, {
    httpMetadata: { contentType: 'text/html' }
  });

  session.siteGenerated = true;
  session.siteHtml = cleanHtml.substring(0, 500); // Store preview only in KV
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

  await logEvent(env, sessionId, 'site_generated', {});

  return json({ ok: true, html: cleanHtml });
}


// ════════════════════════════════════════════════════════
// CLOUDFLARE PAGES DEPLOY
// ════════════════════════════════════════════════════════

async function handleDeploy(request, env) {
  const body = await request.json();
  const { sessionId, cfToken } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  if (!session.siteGenerated) return json({ error: 'Site not generated yet' }, 400);

  // Get site HTML from R2
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj) return json({ error: 'Site file not found' }, 404);
  const siteHtml = await siteObj.text();

  // Generate a project name from blueprint
  const projectName = session.blueprint?.blueprint?.part1?.brandNames?.[0]
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 28) + '-' + Math.random().toString(36).slice(2, 6)
    || `deep-work-${Math.random().toString(36).slice(2, 9)}`;

  try {
    // Step 1: Get account ID from Cloudflare
    const acctRes = await fetch('https://api.cloudflare.com/client/v4/accounts', {
      headers: { 'Authorization': `Bearer ${cfToken}` }
    });
    const acctData = await acctRes.json();
    const accountId = acctData.result?.[0]?.id;
    if (!accountId) return json({ error: 'Could not find Cloudflare account. Check your token permissions.' }, 400);

    // Step 2: Create Pages project
    const createRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        production_branch: 'main'
      })
    });
    const createData = await createRes.json();

    if (!createData.success && !createData.result?.name) {
      return json({ error: createData.errors?.[0]?.message || 'Could not create Pages project.' }, 400);
    }

    // Step 3: Deploy via direct upload
    const formData = new FormData();
    formData.append('index.html', new Blob([siteHtml], { type: 'text/html' }), 'index.html');

    const deployRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cfToken}` },
        body: formData
      }
    );
    const deployData = await deployRes.json();

    const liveUrl = `https://${projectName}.pages.dev`;

    session.cfDeployed = true;
    session.pagesUrl = liveUrl;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

    await logEvent(env, sessionId, 'site_deployed', { url: liveUrl });

    return json({ ok: true, url: liveUrl, projectName });

  } catch (e) {
    console.error('Deploy error:', e);
    return json({ error: 'Deployment failed: ' + e.message }, 500);
  }
}


// ════════════════════════════════════════════════════════
// EXPORT (TAKE IT WITH YOU ZIP)
// ════════════════════════════════════════════════════════

async function handleExport(request, env) {
  const body = await request.json();
  const { sessionId } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  // Build export as a structured HTML page (ZIP requires a library;
  // for now we output a self-contained HTML file with everything embedded)
  const blueprint = session.blueprint;
  const exportHtml = buildExportHTML(blueprint, session);

  await logEvent(env, sessionId, 'export_downloaded', {});

  return new Response(exportHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': 'attachment; filename="deep-work-blueprint.html"',
      ...CORS
    }
  });
}

function buildExportHTML(blueprint, session) {
  const b = blueprint?.blueprint;
  if (!b) return '<html><body>Blueprint not available</body></html>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${b.name} — Brand Blueprint</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.7; }
  h1 { font-size: 36px; margin-bottom: 8px; }
  h2 { font-size: 22px; color: #b8860b; margin-top: 40px; border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
  h3 { font-size: 16px; color: #666; text-transform: uppercase; letter-spacing: 0.06em; font-family: sans-serif; margin-bottom: 4px; }
  p { margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .card { background: #f9f7f4; padding: 16px; border-radius: 8px; }
  .color-dot { display: inline-block; width: 16px; height: 16px; border-radius: 4px; margin-right: 8px; vertical-align: middle; }
  .starter-prompt { background: #1a1a1a; color: #f0ede8; padding: 24px; border-radius: 8px; font-family: monospace; font-size: 13px; white-space: pre-wrap; margin-top: 40px; }
  .section { margin-bottom: 40px; }
  @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>

<h1>${b.name}</h1>
<p style="color:#666;font-family:sans-serif;font-size:14px">Brand Blueprint — Generated ${new Date().toLocaleDateString()}</p>

<h2>Part 1: Brand Foundation</h2>
<div class="section">
  <div class="grid">
    <div class="card">
      <h3>Brand Names</h3>
      <p>${b.part1.brandNames.join('<br>')}</p>
    </div>
    <div class="card">
      <h3>Taglines</h3>
      <p>${b.part1.taglines.join('<br>')}</p>
    </div>
    <div class="card">
      <h3>Color Palette</h3>
      <p>${b.part1.visualDirection.colors.map(c => `<span class="color-dot" style="background:${c.hex}"></span>${c.name} ${c.hex}`).join('<br>')}</p>
    </div>
    <div class="card">
      <h3>Core Brand Promise</h3>
      <p>${b.part1.coreBrandPromise}</p>
    </div>
  </div>
</div>

<h2>Part 2: Ideal Customer Avatar</h2>
<div class="section">
  <p><strong>${b.part2.name}</strong>, ${b.part2.ageRange} — ${b.part2.lifeSituation}</p>
  <div class="grid">
    <div class="card">
      <h3>What They Want</h3>
      <p>${b.part2.tryingToAchieve}</p>
    </div>
    <div class="card">
      <h3>What Stops Them</h3>
      <p>${b.part2.whatIsStoppingThem}</p>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <h3>Their Exact Words</h3>
    <p>${b.part2.exactWords.map(w => `"${w}"`).join('<br>')}</p>
  </div>
</div>

<h2>Part 3: Niche Positioning</h2>
<div class="section">
  <p style="font-size:20px;font-weight:bold">${b.part3.nicheStatement}</p>
  <div class="card">
    <h3>Unique Mechanism</h3>
    <p>${b.part3.uniqueMechanism}</p>
    <h3 style="margin-top:12px">Competitive Edge</h3>
    <p>${b.part3.competitorGap}</p>
  </div>
</div>

<h2>Part 4: Offer Suite</h2>
<div class="section">
  <div class="grid">
    <div class="card">
      <h3>Entry Offer</h3>
      <p><strong>${b.part4.entryOffer.name}</strong><br>${b.part4.entryOffer.description}<br><strong>${b.part4.entryOffer.price}</strong></p>
    </div>
    <div class="card">
      <h3>Core Offer</h3>
      <p><strong>${b.part4.coreOffer.name}</strong><br>${b.part4.coreOffer.description}<br><strong>${b.part4.coreOffer.price}</strong></p>
    </div>
    <div class="card" style="grid-column:1/-1">
      <h3>Premium Offer</h3>
      <p><strong>${b.part4.premiumOffer.name}</strong><br>${b.part4.premiumOffer.description}<br><strong>${b.part4.premiumOffer.price}</strong></p>
    </div>
  </div>
</div>

<h2>Part 7: Headlines</h2>
<div class="section">
  ${b.part7.heroHeadlineOptions.map((h, i) => `<p>${i + 1}. ${h}</p>`).join('')}
</div>

<h2>Take This to Claude.ai</h2>
<p style="font-family:sans-serif;font-size:14px;color:#666">Use the prompt below to continue building on your brand in any Claude conversation. All your context is already included.</p>

<div class="starter-prompt">I have completed a deep work brand strategy session. Here is my complete brand blueprint:

${JSON.stringify(b, null, 2)}

I want to continue building on this brand. Please act as my brand strategist and help me with whatever I ask next. You have full context on my positioning, offers, ideal client, and visual direction.</div>

</body>
</html>`;
}


// ════════════════════════════════════════════════════════
// BLUEPRINT PDF (via HTML response the browser can print)
// ════════════════════════════════════════════════════════

async function handleBlueprintPDF(request, env) {
  const body = await request.json();
  const { sessionId } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  const exportHtml = buildExportHTML(session.blueprint, session);

  return new Response(exportHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': 'attachment; filename="brand-blueprint.html"',
      ...CORS
    }
  });
}


// ════════════════════════════════════════════════════════
// FEEDBACK
// ════════════════════════════════════════════════════════

async function handleFeedback(request, env) {
  const body = await request.json();
  const { sessionId, rating, mostValuable, whatWasOff } = body;

  try {
    await env.DB.prepare(`
      UPDATE sessions
      SET satisfaction_score = ?, feedback_most_valuable = ?, feedback_what_was_off = ?
      WHERE id = ?
    `).bind(rating, mostValuable, whatWasOff, sessionId).run();
  } catch (e) {
    console.error('Feedback save error:', e);
  }

  return json({ ok: true });
}


// ════════════════════════════════════════════════════════
// D1 DATABASE HELPERS
// ════════════════════════════════════════════════════════

async function initSessionInD1(env, session) {
  try {
    // Migrate schema: add new columns if not present (safe to run repeatedly)
    const migrations = [
      `ALTER TABLE sessions ADD COLUMN email TEXT`,
      `ALTER TABLE sessions ADD COLUMN phone TEXT`,
      `ALTER TABLE sessions ADD COLUMN last_active_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN abandonment_notified_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN blueprint_generated INTEGER DEFAULT 0`,
    ];
    for (const sql of migrations) {
      try { await env.DB.exec(sql); } catch (_) { /* column already exists */ }
    }

    // Resolve email from user record
    let email = null;
    if (session.userId) {
      try {
        const user = await getUserById(env, session.userId);
        email = user?.email || null;
      } catch (_) {}
    }

    const now = new Date().toISOString();
    await env.DB.prepare(`
      INSERT OR IGNORE INTO sessions
      (id, tier, phase, created_at, message_count, satisfaction_score, user_id, status, email, phone, last_active_at, blueprint_generated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.id,
      session.tier,
      session.phase,
      session.createdAt || now,
      0,
      null,
      session.userId || null,
      'active',
      email,
      session.phone || session.userData?.phone || null,
      now,
      0
    ).run();
  } catch (e) {
    console.error('D1 session init error:', e);
  }
}

async function updateSessionPhaseInD1(env, sessionId, phase, messageCount, blueprintDone = false) {
  try {
    const now = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE sessions
      SET phase = ?, message_count = ?, updated_at = ?, last_active_at = ?,
          blueprint_generated = CASE WHEN ? = 1 THEN 1 ELSE blueprint_generated END
      WHERE id = ?
    `).bind(phase, messageCount, now, now, blueprintDone ? 1 : 0, sessionId).run();
  } catch (e) {}
}

async function logEvent(env, sessionId, eventType, data) {
  try {
    await env.DB.prepare(`
      INSERT INTO session_events (session_id, event_type, phase, data, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      sessionId || 'system',
      eventType,
      data.phase || null,
      JSON.stringify(data),
      new Date().toISOString()
    ).run();
  } catch (e) {}
}

async function saveToRAG(env, session, blueprint) {
  try {
    const b = blueprint.blueprint;
    const content = `
Brand: ${b.name}
Niche: ${b.part3?.nicheStatement || ''}
Avatar: ${b.part2?.name}, ${b.part2?.ageRange}
Core Promise: ${b.part1?.coreBrandPromise || ''}
Entry Offer: ${b.part4?.entryOffer?.name} at ${b.part4?.entryOffer?.price}
Core Offer: ${b.part4?.coreOffer?.name} at ${b.part4?.coreOffer?.price}
Headlines: ${b.part7?.heroHeadlineOptions?.slice(0, 3).join(' | ')}
    `.trim();

    await env.DB.prepare(`
      INSERT OR REPLACE INTO rag_documents
      (key, category, title, content, size_bytes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      `deep-work-sessions/${session.id}.md`,
      'deep-work',
      `${b.name} Brand Blueprint`,
      content,
      content.length,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();
  } catch (e) {}
}


// ════════════════════════════════════════════════════════
// CLAUDE HELPER
// ════════════════════════════════════════════════════════

// Dedicated site generation call — no prompt caching (prompt is dynamic every time)
async function callClaudeSiteGen(env, systemPrompt, maxTokens = 6000) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: 'Write the HTML body sections now. Begin your response with the nav element. Do not include any CSS, style tags, or head elements.' }]
    })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown error');
    throw new Error(`Anthropic API error ${res.status}: ${err.substring(0, 300)}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callClaude(env, systemPrompt, messages, streaming = false, maxTokens = 1024) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-beta': 'prompt-caching-2024-07-31',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      stream: false,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages
    })
  });

  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function stripMetadata(text) {
  return text
    .replace(/METADATA:\{[^\n]*\}/g, '')
    .replace(/```json[\s\S]*?```/g, '')
    .trim();
}


// ════════════════════════════════════════════════════════
// STRIPE HELPERS
// ════════════════════════════════════════════════════════

async function stripePost(env, path, params) {
  return fetch(`https://api.stripe.com${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
}

async function stripeGet(env, path) {
  return fetch(`https://api.stripe.com${path}`, {
    headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}` }
  });
}


// ════════════════════════════════════════════════════════
// WEB FETCH HELPER (for context enrichment)
// ════════════════════════════════════════════════════════

async function fetchAndSummarize(env, url, instruction) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeepWorkBot/1.0)' },
      signal: AbortSignal.timeout(8000)
    });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    if (!text) return '';

    // Use Claude Haiku for cheap summarization
    const res2 = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: `${instruction}\n\n${text}` }]
      })
    });
    const data = await res2.json();
    return data.content?.[0]?.text || '';
  } catch (e) {
    return '';
  }
}


// ════════════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════════════

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });
}


// ════════════════════════════════════════════════════════
// AUTH HANDLERS
// ════════════════════════════════════════════════════════

async function handleAuthLogin(request, env) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return json({ error: 'Please enter both your email and password.' }, 400);

    const user = await getUserByEmail(env, email);
    if (!user) return json({ error: 'No account found with that email. Double check your address or try the Magic Link option.' }, 401);

    if (!user.password_hash) return json({ error: 'This account uses passwordless login. Click "Magic Link" above and we\'ll email you a sign-in link.' }, 401);

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      await trackFunnelEvent(env, 'login_failed', { email, reason: 'wrong_password' });
      return json({ error: 'Incorrect password. Try again or click "Forgot password?" to reset it.' }, 401);
    }

    await updateLastLogin(env, user.id);

    const secret = env.JWT_SECRET || 'dev-secret-change-me';
    const token = await createSessionToken(user.id, user.role, secret);

    await trackFunnelEvent(env, 'login_success', { userId: user.id, method: 'password' });

    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    await logError(env, { endpoint: '/api/auth/login', method: 'POST', statusCode: 500, errorType: 'auth_error', errorMessage: e.message, stack: e.stack });
    return json({ error: 'Something went wrong signing you in. Please try again in a moment.' }, 500);
  }
}

async function handleAuthRegister(request, env) {
  try {
    const { email, name, password } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    const existing = await getUserByEmail(env, email);
    if (existing) return json({ error: 'Email already registered' }, 409);

    const passwordHash = password ? await hashPassword(password) : null;
    const user = await createUser(env, { email, name, role: 'user' });

    if (passwordHash) {
      await updateUserPassword(env, user.id, passwordHash);
    }

    const secret = env.JWT_SECRET || 'dev-secret-change-me';
    const token = await createSessionToken(user.id, user.role, secret);

    return json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, 201);
  } catch (e) {
    return json({ error: 'Registration failed' }, 500);
  }
}

async function handleAuthMagic(request, env) {
  // Verify a magic token and return a session token
  try {
    const { token } = await request.json();
    if (!token) return json({ error: 'Token required' }, 400);

    const row = await consumeMagicToken(env, token);
    if (!row) return json({ error: 'Invalid or expired token' }, 401);

    const user = await getUserById(env, row.user_id);
    if (!user) return json({ error: 'User not found' }, 404);

    await updateLastLogin(env, user.id);

    const secret = env.JWT_SECRET || 'dev-secret-change-me';
    const sessionToken = await createSessionToken(user.id, user.role, secret);

    return json({
      token: sessionToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    return json({ error: 'Magic auth failed' }, 500);
  }
}

async function handleRequestMagic(request, env) {
  // Send a magic link email to the given address (or just return it in dev)
  try {
    const { email } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    let user = await getUserByEmail(env, email);
    if (!user) {
      // Auto-create account on first magic link request
      user = await createUser(env, { email, name: '', role: 'user' });
    }

    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, 'magic_login', 24);

    const origin = env.APP_ORIGIN || 'https://app.jamesguldan.com';
    const magicUrl = `${origin}/magic?token=${token}`;

    // Send via Resend (or log in dev if no key)
    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Deep Work App <noreply@jamesguldan.com>',
          to: [email],
          subject: 'Your Deep Work App login link',
          html: `<p>Click the link below to log in. It expires in 24 hours.</p>
<p><a href="${magicUrl}" style="font-size:18px;font-weight:bold;">Log In to Deep Work App</a></p>
<p style="color:#888;font-size:12px;">If you did not request this, you can ignore this email.</p>`
        })
      });
    }

    return json({ ok: true, message: 'Magic link sent', debug_url: env.DEBUG_MAGIC ? magicUrl : undefined });
  } catch (e) {
    return json({ error: 'Failed to send magic link' }, 500);
  }
}

async function handleAuthMe(request, env) {
  const user = await requireAuth(request, env);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  return json({ id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier });
}

async function handleSetPassword(request, env) {
  try {
    const user = await requireAuth(request, env);
    if (!user) return json({ error: 'Unauthorized' }, 401);

    const { password } = await request.json();
    if (!password || password.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);

    const hash = await hashPassword(password);
    await updateUserPassword(env, user.id, hash);

    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Failed to set password' }, 500);
  }
}

async function handleForgotPassword(request, env) {
  try {
    const { email } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    const user = await getUserByEmail(env, email);
    // Always return ok — don't reveal whether the email exists
    if (!user) return json({ ok: true, message: 'If that email exists, a reset link is on its way.' });

    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, 'password_reset', 2); // 2-hour expiry

    const origin = env.APP_ORIGIN || 'https://app.jamesguldan.com';
    const resetUrl = `${origin}/reset-password?token=${token}`;

    if (env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'James Guldan <noreply@jamesguldan.com>',
          to: [email],
          subject: 'Reset your Deep Work App password',
          html: getPasswordResetEmail(resetUrl, email)
        })
      });
    }

    return json({
      ok: true,
      message: 'If that email exists, a reset link is on its way.',
      // Only expose URL if debug mode is on (for testing without email)
      debug_url: env.DEBUG_MAGIC ? resetUrl : undefined
    });
  } catch (e) {
    return json({ error: 'Failed to send reset email' }, 500);
  }
}

async function handleResetPassword(request, env) {
  try {
    const { token, password } = await request.json();
    if (!token) return json({ error: 'Reset token required' }, 400);
    if (!password || password.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);

    // Consume the token
    const row = await env.DB.prepare(
      `SELECT user_id, type FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')`
    ).bind(token).first().catch(() => null);

    if (!row || row.type !== 'password_reset') {
      return json({ error: 'This reset link is invalid or has expired. Please request a new one.' }, 400);
    }

    // Mark token as used
    await env.DB.prepare(`UPDATE auth_tokens SET used = 1 WHERE token = ?`).bind(token).run();

    // Update password
    const hash = await hashPassword(password);
    await updateUserPassword(env, row.user_id, hash);

    // Return a session so they're immediately logged in
    const user = await getUserById(env, row.user_id);
    const secret = env.JWT_SECRET || 'dev-secret-change-me';
    const sessionToken = await createSessionToken(user.id, user.role, secret);

    return json({
      ok: true,
      token: sessionToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier }
    });
  } catch (e) {
    return json({ error: 'Failed to reset password' }, 500);
  }
}

function serveResetPasswordPage(request, env, url) {
  const token = url.searchParams.get('token');
  return new Response(getResetPasswordHTML(token), { headers: htmlHeaders() });
}

function getPasswordResetEmail(resetUrl, email) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FDFCFA;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFCFA;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#1a1a1a;">JAMES GULDAN</p>
        </td></tr>
        <tr><td style="background:#fff;border:1px solid #EAE7E2;border-radius:20px;padding:40px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#c4703f;">Deep Work App</p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1a1a1a;line-height:1.2;">Reset your password</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.6;">Someone requested a password reset for <strong>${email}</strong>. Click the button below to set a new one. This link expires in 2 hours.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:16px 32px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Reset My Password &rarr;</a>
          <p style="margin:32px 0 0;font-size:13px;color:#999;line-height:1.6;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
          <hr style="border:none;border-top:1px solid #EAE7E2;margin:28px 0;">
          <p style="margin:0;font-size:12px;color:#bbb;">Or copy this link: <a href="${resetUrl}" style="color:#c4703f;word-break:break-all;">${resetUrl}</a></p>
        </td></tr>
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#bbb;">&copy; 2025 Align Growth LLC &nbsp;&middot;&nbsp; <a href="https://app.jamesguldan.com/legal/privacy" style="color:#bbb;">Privacy</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getResetPasswordHTML(token) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Password — Deep Work App</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --bg: #FDFCFA; --bg2: #F5F1EC; --accent: #c4703f; --text: #1a1a1a; --muted: #666; --border: #EAE7E2; --error: #c0392b; --success: #2d7a4f; }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  body {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; padding: 32px 20px;
    background-image: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(196,112,63,0.07) 0%, transparent 70%);
  }
  nav {
    position: fixed; top: 0; left: 0; right: 0; height: 64px;
    display: flex; align-items: center; padding: 0 48px;
    background: rgba(253,252,250,0.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); z-index: 10;
  }
  .nav-logo { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--text); text-decoration: none; }
  .card { width: 100%; max-width: 420px; margin-top: 32px; }
  .card-header { text-align: center; margin-bottom: 32px; }
  .card-header h1 { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .card-header p { font-size: 15px; color: var(--muted); line-height: 1.6; }
  .card-header em { font-style: italic; font-family: 'Playfair Display', serif; color: var(--accent); }
  .panel { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px; box-shadow: 0 2px 12px rgba(26,26,26,0.06), 0 8px 40px rgba(26,26,26,0.06); }
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.6px; }
  input[type="password"] {
    width: 100%; padding: 13px 16px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-size: 15px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(196,112,63,0.12); }
  input::placeholder { color: #bbb; }
  .password-strength { height: 3px; border-radius: 2px; margin-top: 8px; background: var(--border); overflow: hidden; }
  .password-strength-bar { height: 100%; border-radius: 2px; width: 0; transition: width 0.3s, background 0.3s; }
  .strength-hint { font-size: 12px; color: var(--muted); margin-top: 5px; }
  .btn-primary {
    width: 100%; padding: 14px 32px; background: var(--text); border: none; border-radius: 50px;
    color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 8px;
    transition: background 0.2s, transform 0.1s; font-family: 'Inter', sans-serif; letter-spacing: 0.01em;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }
  .btn-primary:hover { background: #333; transform: translateY(-1px); }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .status-box { display: none; margin-top: 16px; padding: 13px 16px; border-radius: 10px; font-size: 14px; line-height: 1.5; }
  .status-box.error { background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.2); color: var(--error); display: block; }
  .status-box.success { background: rgba(45,122,79,0.06); border: 1px solid rgba(45,122,79,0.2); color: var(--success); display: block; }
  .footer-note { text-align: center; margin-top: 24px; font-size: 13px; color: var(--muted); }
  .footer-note a { color: var(--accent); text-decoration: none; font-weight: 500; }
  .btn-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
<nav><a href="/" class="nav-logo">James Guldan</a></nav>

<div class="card">
  <div class="card-header">
    <h1>Set a new password</h1>
    <p>Choose something strong for your <em>Deep Work</em> account.</p>
  </div>

  <div class="panel" id="mainPanel">
    <div class="form-group">
      <label>New Password</label>
      <input type="password" id="pwd1" placeholder="At least 8 characters" oninput="checkStrength(this.value)" autocomplete="new-password">
      <div class="password-strength"><div class="password-strength-bar" id="strengthBar"></div></div>
      <div class="strength-hint" id="strengthHint"></div>
    </div>
    <div class="form-group">
      <label>Confirm Password</label>
      <input type="password" id="pwd2" placeholder="Same password again" autocomplete="new-password" onkeydown="if(event.key==='Enter')doReset()">
    </div>
    <button class="btn-primary" id="btnReset" onclick="doReset()">Set New Password →</button>
    <div class="status-box" id="statusBox"></div>
  </div>

  <p class="footer-note"><a href="/">← Back to sign in</a></p>
</div>

<script>
const RESET_TOKEN = ${token ? JSON.stringify(token) : 'null'};

if (!RESET_TOKEN) {
  document.querySelector('.panel').innerHTML = '<div style="text-align:center;padding:20px"><p style="font-size:28px;margin-bottom:12px;">⚠️</p><p style="color:#c0392b;font-size:15px;">No reset token found. Please use the link from your email.</p></div>';
}

function checkStrength(v) {
  const bar = document.getElementById('strengthBar');
  const hint = document.getElementById('strengthHint');
  if (!v) { bar.style.width = '0'; hint.textContent = ''; return; }
  let score = 0;
  if (v.length >= 8)  score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const configs = [
    { w: '20%', bg: '#e74c3c', label: 'Too short' },
    { w: '40%', bg: '#e67e22', label: 'Weak' },
    { w: '60%', bg: '#f1c40f', label: 'Fair' },
    { w: '80%', bg: '#2ecc71', label: 'Good' },
    { w: '100%', bg: '#27ae60', label: 'Strong' },
  ];
  const c = configs[Math.min(score, 4)];
  bar.style.width = c.w;
  bar.style.background = c.bg;
  hint.textContent = c.label;
  hint.style.color = c.bg;
}

async function doReset() {
  const p1 = document.getElementById('pwd1').value;
  const p2 = document.getElementById('pwd2').value;
  const status = document.getElementById('statusBox');
  status.className = 'status-box';

  if (!p1 || p1.length < 8) { showStatus('error', 'Password must be at least 8 characters.'); return; }
  if (p1 !== p2) { showStatus('error', 'Passwords do not match.'); return; }
  if (!RESET_TOKEN) { showStatus('error', 'Invalid reset link. Please request a new one.'); return; }

  const btn = document.getElementById('btnReset');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>Setting password...';

  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: RESET_TOKEN, password: p1 })
    });
    const data = await res.json();

    if (data.ok && data.token) {
      localStorage.setItem('dw_session', data.token);
      if (data.user?.role === 'admin') localStorage.setItem('dw_admin_token', data.token);
      document.cookie = 'dw_session=' + data.token + '; path=/; max-age=' + (30*24*3600) + '; secure; samesite=lax';
      showStatus('success', 'Password set! Signing you in...');
      setTimeout(() => { window.location.href = data.user?.role === 'admin' ? '/admin' : '/app'; }, 1200);
    } else {
      showStatus('error', data.error || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Set New Password →';
    }
  } catch(e) {
    showStatus('error', 'Connection error. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Set New Password →';
  }
}

function showStatus(type, msg) {
  const el = document.getElementById('statusBox');
  el.className = 'status-box ' + type;
  el.textContent = msg;
}
</script>
</body>
</html>`;
}

async function handleMagicLink(request, env, url) {
  // GET /magic?token=XXX
  // Peek at the token type WITHOUT consuming it, then redirect to the
  // right page with ?magic=TOKEN so the client-side JS can exchange it.
  // (Consuming happens in POST /api/auth/magic called by the frontend.)
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response('Missing token', { status: 400 });
  }

  // Peek — don't consume
  const row = await env.DB.prepare(
    `SELECT type FROM auth_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')`
  ).bind(token).first().catch(() => null);

  if (!row) {
    // Show a user-friendly expired page
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Link Expired</title>
<style>body{font-family:sans-serif;background:#0a0a0f;color:#e8e8f0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;}
a{color:#6c63ff;}</style></head><body>
<div><h2>This link has expired or already been used.</h2>
<p style="margin-top:12px"><a href="/">Request a new one</a></p></div>
</body></html>`, { status: 410, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }

  // Redirect to the right page — frontend will POST /api/auth/magic to exchange
  const origin = new URL(request.url).origin;
  const redirect = url.searchParams.get('redirect') || '';
  const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect)}` : '';
  const dest = row.type === 'admin_magic'
    ? `${origin}/admin?magic=${encodeURIComponent(token)}`
    : `${origin}/?magic=${encodeURIComponent(token)}${redirectParam}`;

  return Response.redirect(dest, 302);
}


// ════════════════════════════════════════════════════════
// ADMIN API HANDLERS
// ════════════════════════════════════════════════════════

async function handleAdminStats(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const [usersRow, sessionsRow, revenueRow, completedRow] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first(),
      env.DB.prepare(`SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='succeeded'`).first().catch(() => ({ total: 0 })),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE phase >= 8`).first().catch(() => ({ cnt: 0 }))
    ]);

    // Funnel: sessions started today, this week, this month
    const funnelRows = await env.DB.prepare(`
      SELECT
        SUM(CASE WHEN created_at >= date('now') THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN created_at >= date('now','-7 days') THEN 1 ELSE 0 END) as week,
        SUM(CASE WHEN created_at >= date('now','-30 days') THEN 1 ELSE 0 END) as month
      FROM sessions
    `).first().catch(() => ({ today: 0, week: 0, month: 0 }));

    return json({
      users: usersRow?.cnt || 0,
      sessions: sessionsRow?.cnt || 0,
      revenue: revenueRow?.total || 0,
      completed: completedRow?.cnt || 0,
      funnel: funnelRows
    });
  } catch (e) {
    return json({ error: 'Stats query failed', detail: e.message }, 500);
  }
}

async function handleAdminListUsers(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query, params;
    if (search) {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [`%${search}%`, `%${search}%`, limit, offset];
    } else {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }

    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();

    return json({ users: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: 'Failed to list users', detail: e.message }, 500);
  }
}

async function handleAdminCreateUser(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { email, name, role, password } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    const existing = await getUserByEmail(env, email);
    if (existing) return json({ error: 'Email already exists' }, 409);

    const user = await createUser(env, { email, name: name || '', role: role || 'user' });

    if (password) {
      const hash = await hashPassword(password);
      await updateUserPassword(env, user.id, hash);
    }

    return json({ user }, 201);
  } catch (e) {
    return json({ error: 'Failed to create user', detail: e.message }, 500);
  }
}

async function handleAdminListSessions(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const url = new URL(request.url);
    const tier = url.searchParams.get('tier') || '';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query, params;
    if (tier) {
      query = `SELECT id, user_id, tier, phase, completed, created_at, updated_at FROM sessions WHERE tier = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [tier, limit, offset];
    } else {
      query = `SELECT id, user_id, tier, phase, completed, created_at, updated_at FROM sessions ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }

    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first();

    return json({ sessions: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: 'Failed to list sessions', detail: e.message }, 500);
  }
}

async function handleAdminGetSession(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const sessionId = path.split('/').pop();

    // Get D1 record
    const session = await env.DB.prepare(`SELECT * FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!session) return json({ error: 'Session not found' }, 404);

    // Get KV conversation history
    let messages = [];
    try {
      const kvData = await env.SESSIONS.get(sessionId, 'json');
      if (kvData?.messages) messages = kvData.messages;
    } catch (_) {}

    // Get events
    let events = [];
    try {
      const evRows = await env.DB.prepare(`SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
      events = evRows.results || [];
    } catch (_) {}

    return json({ session, messages, events });
  } catch (e) {
    return json({ error: 'Failed to get session', detail: e.message }, 500);
  }
}

async function handleAdminMagicLink(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { userId, type } = await request.json();
    if (!userId) return json({ error: 'userId required' }, 400);

    const user = await getUserById(env, userId);
    if (!user) return json({ error: 'User not found' }, 404);

    const token = generateMagicToken();
    const linkType = type || (user.role === 'admin' ? 'admin_magic' : 'magic_login');
    await storeMagicToken(env, token, userId, linkType, 72);

    const origin = env.APP_ORIGIN || 'https://app.jamesguldan.com';
    const magicUrl = `${origin}/magic?token=${token}`;

    return json({ url: magicUrl, token, expires_in_hours: 72 });
  } catch (e) {
    return json({ error: 'Failed to generate magic link', detail: e.message }, 500);
  }
}

async function handleAdminGetSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const settings = await getAllSettings(env);
    return json({ settings });
  } catch (e) {
    return json({ error: 'Failed to get settings', detail: e.message }, 500);
  }
}

async function handleAdminSaveSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const body = await request.json();
    const allowed = ['calendar_link', 'site_banner', 'maintenance_mode', 'stripe_price_blueprint', 'stripe_price_call', 'stripe_price_site'];

    for (const key of allowed) {
      if (key in body) {
        await setSetting(env, key, String(body[key]));
      }
    }

    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Failed to save settings', detail: e.message }, 500);
  }
}

async function handleAdminGetPrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    // Get latest active prompt version
    const row = await env.DB.prepare(`
      SELECT * FROM prompt_versions ORDER BY version DESC LIMIT 1
    `).first().catch(() => null);

    // Fall back to the hardcoded system prompt info
    if (!row) {
      const { DEEP_WORK_SYSTEM_PROMPT: p } = await import('./prompts.js').catch(() => ({}));
      return json({ version: 0, prompt: p || '', notes: 'Default (hardcoded)', active: true });
    }

    return json(row);
  } catch (e) {
    return json({ error: 'Failed to get prompt', detail: e.message }, 500);
  }
}

async function handleAdminSavePrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { prompt, notes } = await request.json();
    if (!prompt) return json({ error: 'Prompt required' }, 400);

    // Get current max version
    const vRow = await env.DB.prepare(`SELECT MAX(version) as max_v FROM prompt_versions`).first().catch(() => ({ max_v: 0 }));
    const nextVersion = (vRow?.max_v || 0) + 1;

    await env.DB.prepare(`
      INSERT INTO prompt_versions (version, prompt, notes, active, created_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `).bind(nextVersion, prompt, notes || '').run();

    // Mark all others inactive
    await env.DB.prepare(`UPDATE prompt_versions SET active = 0 WHERE version != ?`).bind(nextVersion).run();

    return json({ ok: true, version: nextVersion });
  } catch (e) {
    return json({ error: 'Failed to save prompt', detail: e.message }, 500);
  }
}


// ════════════════════════════════════════════════════════
// MONITORING ADMIN HANDLERS
// ════════════════════════════════════════════════════════

async function handleHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const result = await runFullHealthCheck(env);
  return json(result);
}

async function handleMonitoring(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const data = await handleMonitoringDashboard(env);
  return json(data);
}

async function handleDigest(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const digest = await generateDailyDigest(env);
  return json(digest);
}

async function handleAdminErrors(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const errors = await env.DB.prepare(`SELECT * FROM error_log ORDER BY created_at DESC LIMIT ?`).bind(limit).all();
  return json({ errors: errors.results || [] });
}

async function handleAPIUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const url = new URL(request.url);
  const hours = parseInt(url.searchParams.get('hours') || '24');

  const [calls, byProvider, byStatus, latencyTrend] = await Promise.all([
    env.DB.prepare(`
      SELECT COUNT(*) as total FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
    `).first(),
    env.DB.prepare(`
      SELECT metric_name, COUNT(*) as calls, ROUND(AVG(metric_value),0) as avg_latency_ms,
             MAX(metric_value) as max_latency_ms
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY metric_name ORDER BY calls DESC
    `).all(),
    env.DB.prepare(`
      SELECT tags, COUNT(*) as cnt FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      AND tags LIKE '%429%'
      GROUP BY tags ORDER BY cnt DESC LIMIT 10
    `).all(),
    env.DB.prepare(`
      SELECT
        strftime('%Y-%m-%d %H:00', created_at) as hour,
        COUNT(*) as calls,
        ROUND(AVG(metric_value), 0) as avg_latency
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY hour ORDER BY hour
    `).all(),
  ]);

  return json({
    period: `${hours}h`,
    totalCalls: calls?.total || 0,
    byProvider: byProvider.results || [],
    rateLimitHits: byStatus.results || [],
    latencyTrend: latencyTrend.results || [],
  });
}

async function handleResolveAlert(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const { alertId } = await request.json();
  await env.DB.prepare(`UPDATE alerts SET resolved = 1, resolved_at = datetime('now') WHERE id = ?`).bind(alertId).run();
  return json({ ok: true });
}

// ════════════════════════════════════════════════════════
// DRIP WORKER INTEGRATION
// ════════════════════════════════════════════════════════

const DRIP_WORKER_URL = 'https://email-drip-worker.james-d13.workers.dev';

async function fireEventToDripWorker(env, email, eventType, data = {}) {
  try {
    const res = await fetch(`${DRIP_WORKER_URL}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, event_type: eventType, data }),
    });
    if (!res.ok) {
      console.error(`Drip worker event ${eventType} failed for ${email}: ${res.status}`);
    }
    return res.ok;
  } catch (e) {
    console.error('Drip worker call failed:', e.message);
    return false;
  }
}

// ════════════════════════════════════════════════════════
// ABANDONMENT DETECTION (runs on cron)
// ════════════════════════════════════════════════════════

async function runAbandonmentCheck(env) {
  try {
    // Find sessions with no activity in 24-48 hours, not yet complete, not already notified
    const abandoned = await env.DB.prepare(`
      SELECT s.id, s.email, s.phone, s.phase, s.last_active_at, u.name
      FROM sessions s
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.blueprint_generated = 0
        AND s.status = 'active'
        AND s.abandonment_notified_at IS NULL
        AND s.email IS NOT NULL
        AND s.last_active_at < datetime('now', '-24 hours')
        AND s.last_active_at > datetime('now', '-7 days')
      LIMIT 50
    `).all();

    let fired = 0;
    for (const session of (abandoned.results || [])) {
      const ok = await fireEventToDripWorker(env, session.email, 'interview_abandoned', {
        name: session.name || '',
        phone: session.phone || '',
        phase: session.phase,
        session_id: session.id,
      });
      if (ok) {
        await env.DB.prepare(`
          UPDATE sessions SET abandonment_notified_at = datetime('now') WHERE id = ?
        `).bind(session.id).run();
        fired++;
      }
    }
    console.log(`Abandonment check: ${fired} notifications sent`);
    return fired;
  } catch (e) {
    console.error('Abandonment check error:', e.message);
    return 0;
  }
}

// ════════════════════════════════════════════════════════
// SYSTEM HEALTH CHECK
// ════════════════════════════════════════════════════════

async function runDailyHealthCheck(env) {
  const results = {};
  const checks = [
    { name: 'deep_work_api',    url: 'https://app.jamesguldan.com/health' },
    { name: 'email_drip',       url: `${DRIP_WORKER_URL}/health` },
    { name: 'stripe_ghl',       url: 'https://stripe-ghl-webhook.james-d13.workers.dev/' },
    { name: 'product_access',   url: 'https://product-access-api.james-d13.workers.dev/health' },
    { name: 'gemini_proxy',     url: 'https://gemini-proxy.james-d13.workers.dev/health' },
    { name: 'rag_search',       url: 'https://rag-search.james-d13.workers.dev/stats' },
  ];

  for (const check of checks) {
    try {
      const start = Date.now();
      const res = await fetch(check.url, { signal: AbortSignal.timeout(8000) });
      results[check.name] = { ok: res.ok, status: res.status, latency_ms: Date.now() - start };
    } catch (e) {
      results[check.name] = { ok: false, error: e.message };
    }
  }

  // Also verify D1 is reachable
  try {
    await env.DB.prepare(`SELECT 1`).run();
    results.d1_database = { ok: true };
  } catch (e) {
    results.d1_database = { ok: false, error: e.message };
  }

  const allOk = Object.values(results).every(r => r.ok);
  await logEvent(env, null, 'daily_health_check', { results, allOk });

  if (!allOk) {
    const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([name]) => name);
    console.error(`Daily health check FAILED for: ${failed.join(', ')}`);
  }

  return { allOk, results, timestamp: new Date().toISOString() };
}

async function handleSystemHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const result = await runDailyHealthCheck(env);
  return json(result);
}

// ════════════════════════════════════════════════════════
// ADMIN: MANUAL TEST TRIGGER
// ════════════════════════════════════════════════════════

async function handleAdminTestTrigger(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  const { event_type, email, name, phone, phase } = await request.json();

  if (!email || !event_type) {
    return json({ error: 'email and event_type are required' }, 400);
  }

  const validEvents = ['interview_started', 'interview_completed', 'interview_abandoned', 'call_booked'];
  if (!validEvents.includes(event_type)) {
    return json({ error: `event_type must be one of: ${validEvents.join(', ')}` }, 400);
  }

  const ok = await fireEventToDripWorker(env, email, event_type, {
    name: name || '',
    phone: phone || '',
    phase: phase || null,
    test: true,
  });

  await logEvent(env, null, 'admin_test_trigger', { event_type, email, ok });

  return json({
    ok,
    event_type,
    email,
    message: ok
      ? `Event "${event_type}" fired to drip worker for ${email}`
      : `Drip worker call failed — check logs`,
  });
}
