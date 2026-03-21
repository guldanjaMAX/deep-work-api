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
import { getPrivacyPolicyHTML, getTermsOfServiceHTML } from './legal.js';
import {
  DEEP_WORK_SYSTEM_PROMPT,
  SITE_GENERATION_PROMPT,
  SITE_CSS_FOUNDATION,
  imagePrompts,
  contextEnrichmentPrompt,
  buildImagenPrompt,
  STRATEGIST_DEBRIEF_PROMPT
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

// ── XSS ESCAPE & FONT GUARD ─────────────────────────────
function esc(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
const KNOWN_FONTS = new Set(['Inter','Playfair Display','Lora','Merriweather','Roboto','Open Sans','Montserrat','Raleway','Poppins','Oswald','Source Sans Pro','Nunito','PT Serif','Libre Baskerville','Cormorant Garamond','DM Sans','Work Sans','Space Grotesk','Bitter','Crimson Text','Georgia','Arial','Helvetica','Times New Roman']);
function safeFont(f, fallback) { if (!f) return fallback; if (KNOWN_FONTS.has(f)) return f; const close = [...KNOWN_FONTS].find(k => k.toLowerCase() === f.toLowerCase()); return close || fallback; }

// ── MODEL ROUTING ────────────────────────────────────────
// Opus for high-impact moments, Sonnet for everything else
const MODEL_OPUS = 'claude-opus-4-6';
const MODEL_SONNET = 'claude-sonnet-4-6';
const OPUS_MESSAGE_THRESHOLD = 16; // first 8 exchanges = 16 messages (user+assistant)
function pickChatModel(session) {
  const msgCount = (session.messages || []).length;
  // Opus for first 8 exchanges (the opening rapport)
  if (msgCount <= OPUS_MESSAGE_THRESHOLD) return MODEL_OPUS;
  // Opus for first message of each new phase transition
  const currentPhase = session.phase || 1;
  const lastOpusPhase = session.lastPhaseOpusUsed || 1;
  if (currentPhase > lastOpusPhase) return MODEL_OPUS;
  return MODEL_SONNET;
}

// ── COST TRACKING ────────────────────────────────────────
// Per-million-token pricing in cents
const MODEL_COSTS = {
  [MODEL_OPUS]:   { input: 1500, output: 7500, cacheRead: 150, cacheWrite: 1875 },
  [MODEL_SONNET]: { input: 300, output: 1500, cacheRead: 30, cacheWrite: 375 },
  'claude-haiku-4-5-20251001': { input: 80, output: 400, cacheRead: 8, cacheWrite: 100 },
};
function calcCostCents(model, inputTokens, outputTokens, cacheRead, cacheWrite) {
  const r = MODEL_COSTS[model] || MODEL_COSTS[MODEL_SONNET];
  return ((inputTokens * r.input) + (outputTokens * r.output) + ((cacheRead||0) * r.cacheRead) + ((cacheWrite||0) * r.cacheWrite)) / 1_000_000;
}
async function trackTokenUsage(env, { sessionId, userId, model, endpoint, inputTokens, outputTokens, cacheRead, cacheWrite, phase }) {
  try {
    const cost = calcCostCents(model, inputTokens||0, outputTokens||0, cacheRead||0, cacheWrite||0);
    await env.DB.prepare(`INSERT INTO token_usage (session_id, user_id, model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))`)
      .bind(sessionId||'unknown', userId||null, model, endpoint, inputTokens||0, outputTokens||0, cacheRead||0, cacheWrite||0, Math.round(cost*100)/100, phase||null).run();
  } catch(e) { /* non-blocking */ }
}

// ── STRATEGIST DEBRIEF GENERATION (Opus) ─────────────────
async function generateStrategistDebrief(env, session, blueprint, sessionId) {
  try {
    // Build a condensed version of the interview for context
    const interviewMessages = (session.messages || [])
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => {
        const clean = m.content
          .replace(/METADATA:\{[^\n]*\}/g, '')
          .replace(/```json[\s\S]*?```/g, '')
          .trim();
        return { role: m.role, content: clean.slice(0, 800) }; // cap each message
      })
      .slice(-30); // last 30 messages to keep context manageable

    const bpSummary = blueprint?.blueprint || {};
    const userContext = `
## Blueprint Summary
Name: ${bpSummary.name || 'Unknown'}
Brand Promise: ${bpSummary.part1?.coreBrandPromise || 'N/A'}
Ideal Client: ${bpSummary.part2?.name || 'N/A'} — ${bpSummary.part2?.lifeSituation || ''}
Niche: ${bpSummary.part3?.nicheStatement || 'N/A'}
First Move: ${bpSummary.part6?.firstMove || 'N/A'}
Recommendation: ${bpSummary.part8?.recommendation || 'self_guided'}
${bpSummary.part8?.personalizedMessage ? 'Part8 Message: ' + bpSummary.part8.personalizedMessage : ''}

## Lead Intelligence
${blueprint?.leadIntel ? JSON.stringify(blueprint.leadIntel, null, 2) : 'Not available'}
`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL_OPUS,
        max_tokens: 1024,
        system: STRATEGIST_DEBRIEF_PROMPT,
        messages: [
          ...interviewMessages,
          { role: 'user', content: `The interview is complete. Here is the blueprint and lead intelligence that was generated:\n\n${userContext}\n\nNow write the strategist debrief as a personal letter to this person. Return ONLY the JSON object.` }
        ]
      })
    });

    if (!response.ok) {
      console.error('Debrief API error:', response.status);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Track usage
    trackTokenUsage(env, {
      sessionId,
      userId: session.userId,
      model: MODEL_OPUS,
      endpoint: '/debrief-generation',
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0,
      cacheRead: 0,
      cacheWrite: 0,
      phase: 8
    });

    // Parse JSON from response (handle possible markdown fences)
    let debrief = null;
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*"reflection"[\s\S]*\}/);
    if (jsonMatch) {
      debrief = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } else {
      debrief = JSON.parse(text);
    }

    return debrief;
  } catch (e) {
    console.error('Debrief generation failed:', e.message);
    return null;
  }
}

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
  'Permissions-Policy': 'camera=(), microphone=(self), geolocation=()',
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

      // ── Generated site serving (/s/{slug}) ──────────────
      if (path.startsWith('/s/')) {
        return handleServeSite(path, env);
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

      // ── Legal pages ──────────────────────────────────
      if (path === '/privacy') return new Response(getPrivacyPolicyHTML(), { headers: htmlHeaders() });
      if (path === '/terms')   return new Response(getTermsOfServiceHTML(), { headers: htmlHeaders() });

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
      if (path === '/api/admin/generate-debrief'       && request.method === 'POST') return handleAdminGenerateDebrief(request, env);
      if (path === '/api/admin/generate-test-blueprint' && request.method === 'POST') return handleAdminTestBlueprint(request, env);
      if (path === '/api/admin/quick-test-session'      && request.method === 'POST') return handleAdminQuickTestSession(request, env);

      // ── API routes ────────────────────────────────────
      if (path === '/api/create-payment-intent' && request.method === 'POST') {
        return handleCreatePaymentIntent(request, env);
      }
      if (path === '/api/fulfill-payment' && request.method === 'POST') {
        return handleFulfillPayment(request, env);
      }
      if (path === '/api/payment-status' && request.method === 'GET') {
        return handlePaymentStatus(request, env, url);
      }
      if (path === '/api/checkout' && request.method === 'POST') {
        return handleCheckout(request, env);
      }
      if (path === '/api/webhook' && request.method === 'POST') {
        return handleWebhook(request, env);
      }
      if (path === '/api/session/start' && request.method === 'POST') {
        return handleSessionStart(request, env);
      }
      if (path === '/api/session/claim' && request.method === 'POST') {
        return handleSessionClaim(request, env);
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
      if (path === '/api/refine-site' && request.method === 'POST') {
        return handleRefineSite(request, env);
      }
      if (path === '/api/export' && request.method === 'POST') {
        return handleExport(request, env);
      }
      if (path === '/api/export-site' && request.method === 'GET') {
        return handleExportSite(request, env);
      }
      if (path === '/api/blueprint/pdf' && request.method === 'POST') {
        return handleBlueprintPDF(request, env);
      }
      if (path === '/api/feedback' && request.method === 'POST') {
        return handleFeedback(request, env);
      }
      if (path === '/api/log-event' && request.method === 'POST') {
        return handleLogEvent(request, env);
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
      if (path === '/api/admin/usage'         && request.method === 'GET')  return handleAdminUsage(request, env);
      if (path === '/api/admin/usage/user'    && request.method === 'GET')  return handleAdminUserUsage(request, env);

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

function getStripeKeys(request, env) {
  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  const isTest = origin.includes('dev.') || origin.includes('localhost') || origin.includes('127.0.0.1');
  return {
    secretKey:      isTest ? (env.STRIPE_TEST_SECRET_KEY      || env.STRIPE_SECRET_KEY)      : env.STRIPE_SECRET_KEY,
    publishableKey: isTest ? (env.STRIPE_TEST_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY) : env.STRIPE_PUBLISHABLE_KEY,
    testMode:       isTest,
  };
}

async function handleCreatePaymentIntent(request, env) {
  try {
    const body = await request.json();
    const { tiers } = body;
    if (!Array.isArray(tiers) || tiers.length === 0) {
      return json({ error: 'Invalid tiers' }, 400);
    }
    const PRICES = { blueprint: 6700, site: 13000, call: 13000 };
    const amount = tiers.reduce((sum, t) => sum + (PRICES[t] || 0), 0);
    if (amount === 0) return json({ error: 'Invalid tiers: no known products' }, 400);

    const { secretKey, publishableKey, testMode } = getStripeKeys(request, env);
    if (!secretKey) return json({ error: 'Stripe not configured' }, 500);

    const params = new URLSearchParams({
      amount:   amount.toString(),
      currency: 'usd',
      'metadata[tiers]': tiers.join(','),
      'payment_method_types[]': 'card',
    });

    const res = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const pi = await res.json();
    if (!pi.client_secret) {
      return json({ error: pi.error?.message || 'Failed to create payment intent' }, 500);
    }

    return json({ clientSecret: pi.client_secret, publishableKey, amount, paymentIntentId: pi.id, testMode });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleFulfillPayment(request, env) {
  try {
    const { paymentIntentId, email, tiers } = await request.json();
    if (!paymentIntentId || !email) {
      return json({ error: 'Missing paymentIntentId or email' }, 400);
    }

    const { secretKey, testMode } = getStripeKeys(request, env);

    let verified = false;
    let resolvedTiers = tiers || ['blueprint'];
    try {
      const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
        headers: { 'Authorization': `Bearer ${secretKey}` },
      });
      const pi = await res.json();
      verified = pi.status === 'succeeded';
      if (pi.metadata?.tiers) resolvedTiers = pi.metadata.tiers.split(',');
    } catch (e) {
      verified = testMode;
    }

    if (!verified) {
      return json({ error: 'Payment not verified' }, 402);
    }

    const tier = resolvedTiers[0] || 'blueprint';

    try {
      await createUser(env, email, null, { tier, source: 'payment', paymentIntentId });
    } catch (e) {
      // User may already exist
    }

    const appOrigin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    let sessionUrl = appOrigin;
    try {
      const token = await generateMagicToken();
      await storeMagicToken(env, token, email);
      sessionUrl = `${appOrigin}/magic?token=${token}&redirect=/app`;
    } catch (e) {
      // Magic token generation failed
    }

    return json({ success: true, sessionUrl });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handlePaymentStatus(request, env, url) {
  const piId = url.searchParams.get('pi');
  if (!piId) return json({ error: 'Missing pi parameter' }, 400);

  const { secretKey, testMode } = getStripeKeys(request, env);

  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}`, {
      headers: { 'Authorization': `Bearer ${secretKey}` },
    });
    const pi = await res.json();
    return json({ status: pi.status, testMode });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function handleCheckout(request, env) {
  const body = await request.json();
  const { tier, sessionId: existingSessionId } = body;

  const PRICE_MAP = {
    blueprint: 'price_1TCXL7FArNSFW9mB5DDauxQg',
    call:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
    site:      'price_1TCpHrFArNSFW9mBu0kQISZi',   // $130 add-on (was $197 bundle)
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
    const origin = new URL(request.url).origin;
    return Response.redirect(`${origin}/`, 302);
  }

  // Verify payment with Stripe
  let verified = false;
  if (!env.STRIPE_SECRET_KEY) {
    // No Stripe key — block unless origin is localhost/dev
    const origin2 = new URL(request.url).origin;
    const isLocal = origin2.includes('localhost') || origin2.includes('127.0.0.1') || origin2.includes('.dev');
    if (!isLocal) {
      return new Response('Payment processing is not configured. Please contact support.', { status: 503 });
    }
    verified = true; // allow through only on local/dev
  } else {
    try {
      const res = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`);
      const session = await res.json();
      verified = session.payment_status === 'paid';
    } catch (e) {
      await logError(env, { endpoint: '/payment-success', method: 'GET', statusCode: 500, errorType: 'stripe_verify_error', errorMessage: e.message });
    }
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
      // Generate a one-time access token for this session
      const upgradeAccess = await generateSessionAccessToken(env, existingSessionId);
      return Response.redirect(`${origin}/app?session=${existingSessionId}&tier=${tier}&upgraded=true&access=${upgradeAccess}`, 302);
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

  // Generate a one-time access token so only the buyer can claim this session
  const accessToken = await generateSessionAccessToken(env, sessionId);

  // Redirect to app — the client will exchange the access token for a session JWT
  return Response.redirect(`${origin}/app?session=${sessionId}&tier=${tier}&access=${accessToken}`, 302);
}

// Generate and store a short-lived (4-hour) one-time access token for a session
async function generateSessionAccessToken(env, sessionId) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b => b.toString(16).padStart(2, '0')).join('');
  await env.SESSIONS.put(`session_access:${token}`, JSON.stringify({ sessionId, createdAt: Date.now() }), { expirationTtl: 60 * 60 * 4 }); // 4-hour TTL
  return token;
}

// Exchange a one-time access token for a session JWT (30-day)
async function handleSessionClaim(request, env) {
  try {
    const { accessToken, sessionId } = await request.json();
    if (!accessToken || !sessionId) return json({ error: 'Missing accessToken or sessionId' }, 400);

    const kvKey = `session_access:${accessToken}`;
    const raw = await env.SESSIONS.get(kvKey);
    if (!raw) return json({ error: 'Invalid or expired access token' }, 401);

    const record = JSON.parse(raw);
    if (record.sessionId !== sessionId) return json({ error: 'Token does not match session' }, 401);

    // Consume the one-time token
    await env.SESSIONS.delete(kvKey);

    // Issue a 30-day session JWT
    const jwt = await createSessionToken({ sessionId, type: 'session_access' }, env.JWT_SECRET || 'dev-secret-change-me', 60 * 60 * 24 * 30);
    return json({ token: jwt, sessionId });
  } catch (e) {
    return json({ error: 'Claim failed', detail: e.message }, 500);
  }
}

async function handleWebhook(request, env) {
  const body = await request.text();

  // ── Stripe signature verification ───────────────────────
  if (env.STRIPE_WEBHOOK_SECRET) {
    const sigHeader = request.headers.get('stripe-signature') || '';
    const valid = await verifyStripeSignature(body, sigHeader, env.STRIPE_WEBHOOK_SECRET);
    if (!valid) {
      await logError(env, { endpoint: '/api/webhook', method: 'POST', statusCode: 400, errorType: 'invalid_stripe_signature', errorMessage: 'Webhook signature mismatch' });
      return json({ error: 'Invalid signature' }, 400);
    }
  }

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

// HMAC-SHA256 verification for Stripe webhook signatures
async function verifyStripeSignature(payload, sigHeader, secret) {
  try {
    // sigHeader format: t=TIMESTAMP,v1=SIG1,v1=SIG2,...
    const parts = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
    const timestamp = parts.t;
    const signatures = sigHeader.split(',').filter(p => p.startsWith('v1=')).map(p => p.slice(3));
    if (!timestamp || signatures.length === 0) return false;

    // Reject webhooks older than 5 minutes
    if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signedPayload));
    const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

    return signatures.some(s => s === expected);
  } catch (_) {
    return false;
  }
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

  // Auto-research competitors if user didn't provide any but we have other data
  if ((!competitorUrls || competitorUrls.length === 0) && (session.userData.existingWebsiteAnalysis || session.userData.linkedinData)) {
    try {
      const autoCompetitors = await autoResearchCompetitors(env, session.userData.existingWebsiteAnalysis, session.userData.linkedinData);
      if (autoCompetitors) {
        session.userData.autoResearchedCompetitors = autoCompetitors;
      }
    } catch (_) {}
  }

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
    // First check for completed sessions (blueprint already generated)
    const completedRow = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND blueprint_generated = 1
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();

    if (completedRow) {
      // Verify it still exists in KV
      const kvData = await env.SESSIONS.get(completedRow.id);
      if (kvData) {
        const session = JSON.parse(kvData);
        return json({
          hasActiveSession: true,
          blueprintComplete: true,
          session: {
            id: completedRow.id,
            tier: completedRow.tier,
            phase: session.phase || completedRow.phase,
            messageCount: session.messages ? session.messages.length : completedRow.message_count,
            createdAt: completedRow.created_at,
            updatedAt: completedRow.updated_at
          }
        });
      } else {
        // KV expired, mark session as expired in D1
        await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(completedRow.id).run();
      }
    }

    // Then check for in-progress sessions (not yet completed)
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
      blueprintComplete: false,
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
      blueprint: session.blueprint || null,
      strategistDebrief: session.strategistDebrief || null
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

  // Blueprint generation uses Opus for highest quality synthesis
  const streamPromise = (async () => {
    try {
      const bpAbort = new AbortController();
      const bpTimeout = setTimeout(() => bpAbort.abort(), 480000); // 8 min timeout for blueprint
      let res;
      try {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: bpAbort.signal,
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-beta': 'prompt-caching-2024-07-31',
          },
          body: JSON.stringify({
            model: MODEL_OPUS,
            max_tokens: 8192,
            stream: true,
            system: [{ type: 'text', text: session.systemPrompt, cache_control: { type: 'ephemeral' } }],
            messages: recentMessages
          })
        });
      } catch (fetchErr) {
        clearTimeout(bpTimeout);
        const isTimeout = fetchErr.name === 'AbortError';
        await logError(env, { endpoint: '/api/generate-blueprint', method: 'POST', statusCode: 0, errorType: isTimeout ? 'timeout' : 'fetch_error', errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: 'error', message: isTimeout ? 'Blueprint generation timed out. Please try again — your conversation is saved.' : 'Connection error during blueprint generation. Please try again.' });
        await writer.close();
        return;
      }
      clearTimeout(bpTimeout);

      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: '/api/generate-blueprint', method: 'POST', statusCode: res.status, errorType: 'anthropic_api', errorMessage: `Model: ${MODEL_OPUS}. ${errText.substring(0, 500)}`, sessionId });
        await sendEvent({ type: 'error', message: 'Blueprint generation hit a temporary issue (error ' + res.status + '). Please try again — your conversation is saved.' });
        await writer.close();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let bpUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

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
              if (ev.type === 'message_start' && ev.message?.usage) {
                bpUsage.input = ev.message.usage.input_tokens || 0;
                bpUsage.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                bpUsage.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === 'message_delta' && ev.usage) {
                bpUsage.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {}
          }
        }
      }

      // Track blueprint generation cost
      trackTokenUsage(env, { sessionId, userId: session.userId, model: MODEL_OPUS, endpoint: '/api/generate-blueprint', inputTokens: bpUsage.input, outputTokens: bpUsage.output, cacheRead: bpUsage.cacheRead, cacheWrite: bpUsage.cacheWrite, phase: 8 });

      // Check for blueprint JSON
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));

          // Store lead intelligence in D1 for CRM/GHL sync
          const li = blueprint?.leadIntel;
          if (li) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`)
                .bind(
                  sessionId,
                  session.userId || null,
                  session.email || session.phone || null,
                  session.phone || null,
                  li.estimatedRevenue || 'Unknown',
                  li.industry || 'Unknown',
                  li.yearsInBusiness || 'Unknown',
                  li.teamSize || 'Unknown',
                  li.hasExistingBrand ? 1 : 0,
                  li.hasExistingWebsite ? 1 : 0,
                  li.hasInternalTeam ? 1 : 0,
                  li.brandMaturity || 'Unknown',
                  li.buyingTemperature || 'Unknown',
                  li.biggestPainPoint || '',
                  li.budgetSignals || '',
                  li.bestFitService || '',
                  li.bestFitReason || '',
                  JSON.stringify(li.notableQuotes || []),
                  li.followUpAngle || '',
                  blueprint?.blueprint?.part8?.recommendation || 'self_guided'
                ).run();
            } catch (liErr) { /* non-blocking */ }
          }
        } catch (_) {}
      }

      session.messages.push({ role: 'assistant', content: fullContent });

      // Generate strategist debrief (Opus) — runs after blueprint, before session save
      if (blueprint) {
        try {
          await sendEvent({ type: 'debrief_status', message: 'Your strategist is writing you a personal note...' });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: 'debrief', debrief });
          }
        } catch (debriefErr) { /* non-blocking */ }
      }

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

  // Run Claude call in background — Opus for first 8 exchanges + phase transitions
  const chatModel = pickChatModel(session);
  // Mark this phase as having received its Opus message
  if (chatModel === MODEL_OPUS && (session.phase || 1) > (session.lastPhaseOpusUsed || 1)) {
    session.lastPhaseOpusUsed = session.phase || 1;
  }
  const streamPromise = (async () => {
    try {
      const apiStart = Date.now();
      const chatAbort = new AbortController();
      const chatTimeout = setTimeout(() => chatAbort.abort(), 90000); // 90s timeout
      let res;
      try {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          signal: chatAbort.signal,
          headers: {
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-beta': 'prompt-caching-2024-07-31',
          },
          body: JSON.stringify({
            model: chatModel,
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
      } catch (fetchErr) {
        clearTimeout(chatTimeout);
        const isTimeout = fetchErr.name === 'AbortError';
        await logError(env, { endpoint: '/api/chat', method: 'POST', statusCode: 0, errorType: isTimeout ? 'timeout' : 'fetch_error', errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: 'error', message: isTimeout ? 'The AI took too long to respond. Please try again.' : 'Connection error. Please check your internet and try again.' });
        await writer.close();
        return;
      }
      clearTimeout(chatTimeout);

      // Track the API call
      trackAPICall(env, 'anthropic', '/v1/messages', res.status, Date.now() - apiStart);

      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: '/api/chat', method: 'POST', statusCode: res.status, errorType: 'anthropic_api', errorMessage: `Model: ${chatModel}. ${errText.substring(0, 500)}`, sessionId });
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
      let usageData = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

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
              if (ev.type === 'message_start' && ev.message?.usage) {
                usageData.input = ev.message.usage.input_tokens || 0;
                usageData.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                usageData.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === 'message_delta' && ev.usage) {
                usageData.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {}
          }
        }
      }

      // Track token usage (non-blocking)
      trackTokenUsage(env, { sessionId, userId: session.userId, model: chatModel, endpoint: '/api/chat', inputTokens: usageData.input, outputTokens: usageData.output, cacheRead: usageData.cacheRead, cacheWrite: usageData.cacheWrite, phase: session.phase });

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

          // Store lead intelligence in D1 for CRM/GHL sync
          const li2 = blueprint?.leadIntel;
          if (li2) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`)
                .bind(
                  sessionId,
                  session.userId || null,
                  session.email || session.phone || null,
                  session.phone || null,
                  li2.estimatedRevenue || 'Unknown',
                  li2.industry || 'Unknown',
                  li2.yearsInBusiness || 'Unknown',
                  li2.teamSize || 'Unknown',
                  li2.hasExistingBrand ? 1 : 0,
                  li2.hasExistingWebsite ? 1 : 0,
                  li2.hasInternalTeam ? 1 : 0,
                  li2.brandMaturity || 'Unknown',
                  li2.buyingTemperature || 'Unknown',
                  li2.biggestPainPoint || '',
                  li2.budgetSignals || '',
                  li2.bestFitService || '',
                  li2.bestFitReason || '',
                  JSON.stringify(li2.notableQuotes || []),
                  li2.followUpAngle || '',
                  blueprint?.blueprint?.part8?.recommendation || 'self_guided'
                ).run();
            } catch (liErr) { /* non-blocking */ }
          }

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

      // Generate strategist debrief if blueprint was just created (Opus)
      if (blueprint) {
        try {
          await sendEvent({ type: 'debrief_status', message: 'Your strategist is writing you a personal note...' });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: 'debrief', debrief });
          }
        } catch (debriefErr) { /* non-blocking */ }
      }

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

  // Security: validate file type
  const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const ALLOWED_DOC_EXTS = ['pdf', 'txt', 'md'];
  const allAllowed = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_DOC_EXTS];

  if (!allAllowed.includes(ext)) {
    return json({ error: `File type .${ext} is not supported. Allowed: images (JPG, PNG, WebP), documents (PDF, TXT).` }, 400);
  }

  // Security: file size limits (10MB for images, 5MB for documents)
  const maxSize = ALLOWED_DOC_EXTS.includes(ext) ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > maxSize) {
    return json({ error: `File too large. Maximum ${maxSize / 1024 / 1024}MB for this file type.` }, 400);
  }

  const key = `uploads/${sessionId}/${Date.now()}_${Math.random().toString(36).slice(2,7)}.${ext}`;

  await env.UPLOADS.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type }
  });

  // For document files, extract text and add to session context
  const isDocument = ALLOWED_DOC_EXTS.includes(ext);
  let extractedText = '';

  if (isDocument) {
    extractedText = await extractDocumentText(env, key);

    if (extractedText) {
      // Update session context with the document content
      const raw = await env.SESSIONS.get(sessionId);
      if (raw) {
        const session = JSON.parse(raw);
        if (!session.userData) session.userData = {};
        if (!session.userData.uploadedDocuments) session.userData.uploadedDocuments = [];

        session.userData.uploadedDocuments.push(`[Document: ${file.name}]\n${extractedText}`);

        // Rebuild system prompt with new context
        const contextExtra = contextEnrichmentPrompt(session.userData);
        session.systemPrompt = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? '\n\n' + contextExtra : '');

        await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
      }
    }
  }

  return json({
    ok: true,
    key,
    name: file.name,
    isDocument,
    textExtracted: !!extractedText,
    textPreview: extractedText ? extractedText.slice(0, 200) + '...' : undefined
  });
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

  // Build Imagen 4 prompt from blueprint
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const imagenPromptText = buildImagenPrompt(bp.part1 || {}, bp.part3 || {});

  // Run Claude + Imagen 4 in parallel to stay within the 49s wall-clock limit
  const GEMINI_PROXY = 'https://gemini-proxy.james-d13.workers.dev';
  const PROXY_AUTH = env.GEMINI_PROXY_TOKEN || '';

  // Use Cloudflare Service Binding if available (avoids workers.dev HTTP restriction)
  const geminiCall = (env.GEMINI_PROXY ? env.GEMINI_PROXY.fetch.bind(env.GEMINI_PROXY) : fetch);

  const [bodyContent, imagenResult] = await Promise.allSettled([
    callClaudeSiteGen(env, prompt, 3000),
    geminiCall(`${GEMINI_PROXY}/v1beta/models/imagen-4.0-generate-001:predict`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PROXY_AUTH}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{ prompt: imagenPromptText }],
        parameters: { sampleCount: 1, aspectRatio: '16:9' }
      })
    }).then(r => r.json()).catch(() => null)
  ]);

  const claudeBody = bodyContent.status === 'fulfilled' ? bodyContent.value : '';

  // Extract base64 image from Imagen 4 response
  let heroImageDataUrl = null;
  if (imagenResult.status === 'fulfilled' && imagenResult.value?.predictions?.[0]?.bytesBase64Encoded) {
    const b64 = imagenResult.value.predictions[0].bytesBase64Encoded;
    const mimeType = imagenResult.value.predictions[0].mimeType || 'image/jpeg';
    heroImageDataUrl = `data:${mimeType};base64,${b64}`;
  }

  // Assemble the final HTML: pre-built head + Claude's body
  // Strip any <style> blocks Claude may have written despite instructions
  let bodyHtml = claudeBody.replace(/<style[\s\S]*?<\/style>/gi, '');
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

  // Embed Imagen 4 hero image as CSS background on the .hero section
  let styledHead = head;
  if (heroImageDataUrl) {
    const heroStyle = `<style>.hero{background-image:linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('${heroImageDataUrl}');background-size:cover;background-position:center;background-repeat:no-repeat;}</style>`;
    styledHead = head.replace('</head>', `${heroStyle}\n</head>`);
  }

  const cleanHtml = `<!DOCTYPE html>\n<html lang="en">\n${styledHead}\n<body>\n${bodyHtml}\n</body>\n</html>`;

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
// SEO + OG + FAVICON + SCHEMA OPTIMIZATION
// ════════════════════════════════════════════════════════

function injectSEO(html, blueprint, liveUrl, slug) {
  const p1 = blueprint.part1 || {};
  const p2 = blueprint.part2 || {};
  const p3 = blueprint.part3 || {};
  const p5 = blueprint.part5 || {};

  const brandName = p1.brandNames?.[0] || 'Brand';
  const tagline = p1.tagline || p1.coreBrandPromise || '';
  const description = (p3.nicheStatement || p1.coreBrandPromise || tagline || '').substring(0, 160);
  const avatarName = p2.name || '';
  const keywords = [
    brandName,
    ...(p1.brandVoice?.doSay || []).slice(0, 3),
    p3.uniqueMechanism || '',
    avatarName ? `for ${avatarName}` : ''
  ].filter(Boolean).join(', ').substring(0, 255);

  // Extract primary color for favicon and theme
  const colors = p1.visualDirection?.colors || [];
  const primaryColor = colors.find(c => c.name?.toLowerCase().includes('primary') || c.name?.toLowerCase().includes('dark'))?.hex || colors[0]?.hex || '#1C2B3A';
  const accentColor = colors.find(c => c.name?.toLowerCase().includes('gold') || c.name?.toLowerCase().includes('accent'))?.hex || colors[1]?.hex || '#C9A96E';

  // Generate SVG favicon from brand initials
  const initials = brandName.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primaryColor}"/><text x="32" y="42" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="${accentColor}" text-anchor="middle">${initials}</text></svg>`;
  const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  // Build JSON-LD Schema
  const schemaType = (p5.businessModel?.toLowerCase() || '').includes('coaching') ? 'Person' :
    (p5.businessModel?.toLowerCase() || '').includes('agency') ? 'Organization' : 'Organization';
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: brandName,
    url: liveUrl,
    description: description,
    ...(p1.contactEmail ? { email: p1.contactEmail } : {}),
    ...(tagline ? { slogan: tagline } : {}),
    ...(p3.nicheStatement ? { knowsAbout: p3.nicheStatement } : {}),
    sameAs: []
  };

  // Build meta tags block
  const seoBlock = `
  <!-- SEO Optimization -->
  <meta name="description" content="${esc(description)}" />
  <meta name="keywords" content="${esc(keywords)}" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="${esc(brandName)}" />
  <link rel="canonical" href="${esc(liveUrl)}" />
  <meta name="theme-color" content="${primaryColor}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(brandName + (tagline ? ' | ' + tagline : ''))}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(liveUrl)}" />
  <meta property="og:site_name" content="${esc(brandName)}" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(brandName + (tagline ? ' | ' + tagline : ''))}" />
  <meta name="twitter:description" content="${esc(description)}" />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />
  <link rel="apple-touch-icon" href="${faviconDataUri}" />

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">${JSON.stringify(schema)}</script>`;

  // Remove any existing duplicate meta tags before injecting
  let cleaned = html
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:title"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:description"[^>]*>/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<link\s+rel="icon"[^>]*>/gi, '')
    .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

  // Inject before </head>
  cleaned = cleaned.replace('</head>', seoBlock + '\n</head>');

  return cleaned;
}

// ════════════════════════════════════════════════════════
// DEPLOY TO SITE SERVER
// ════════════════════════════════════════════════════════

async function handleServeSite(path, env) {
  // Serve generated sites from R2 at /s/{slug} or /s/{slug}/file
  const parts = path.replace(/^\/s\//, '').split('/');
  const slug = parts[0];
  const filePath = parts.slice(1).join('/') || 'index.html';

  if (!slug || slug.length < 2) {
    return new Response('Not found', { status: 404 });
  }

  const r2Key = `sites/${slug}/${filePath}`;
  const obj = await env.UPLOADS.get(r2Key);

  if (!obj) {
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Site Not Found</title>
<style>body{font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;padding:0 20px;color:#333;text-align:center;}
h1{font-size:1.4rem;}code{background:#eee;padding:2px 8px;border-radius:4px;}</style></head>
<body><h1>Site Not Found</h1><p>No site exists at <code>${slug.replace(/[<>"'&]/g, '')}</code>.</p></body></html>`,
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const ext = filePath.split('.').pop().toLowerCase();
  const types = { html:'text/html; charset=utf-8', css:'text/css', js:'application/javascript',
    json:'application/json', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
    gif:'image/gif', svg:'image/svg+xml', webp:'image/webp', ico:'image/x-icon',
    woff2:'font/woff2', woff:'font/woff', ttf:'font/ttf', pdf:'application/pdf' };
  const ct = types[ext] || 'application/octet-stream';

  const headers = { 'Content-Type': ct, 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' };
  if (ext === 'html') {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  return new Response(obj.body, { headers });
}

async function handleDeploy(request, env) {
  const body = await request.json();
  const { sessionId } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  if (!session.siteGenerated) return json({ error: 'Site not generated yet' }, 400);

  // Get site HTML from R2
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj) return json({ error: 'Site file not found' }, 404);
  const siteHtml = await siteObj.text();

  // Generate a clean slug from blueprint brand name
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const rawBrand = bp.part1?.brandNames?.[0] || '';
  const cleanBrand = rawBrand
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28);
  const slug = cleanBrand
    ? `${cleanBrand}-${Math.random().toString(36).slice(2, 6)}`
    : `site-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    const liveUrl = `${origin}/s/${slug}`;

    // ── SEO + OG + FAVICON + SCHEMA OPTIMIZATION ──
    const optimizedHtml = injectSEO(siteHtml, bp, liveUrl, slug);

    // Write optimized site HTML to R2
    await env.UPLOADS.put(`sites/${slug}/index.html`, optimizedHtml, {
      httpMetadata: { contentType: 'text/html; charset=utf-8' }
    });

    session.cfDeployed = true;
    session.siteUrl = liveUrl;
    session.siteSlug = slug;
    session.seoOptimized = true;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

    await logEvent(env, sessionId, 'site_deployed', { url: liveUrl, slug, seoOptimized: true });

    return json({ ok: true, url: liveUrl, slug, seoOptimized: true });

  } catch (e) {
    console.error('Deploy error:', e);
    return json({ error: 'Deployment failed: ' + e.message }, 500);
  }
}


// ════════════════════════════════════════════════════════
// SITE REFINEMENT
// ════════════════════════════════════════════════════════

async function handleRefineSite(request, env) {
  const body = await request.json();
  const { sessionId, category, option, customText } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  // Get current site HTML from R2
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj) return json({ error: 'No site to refine' }, 404);
  const currentHtml = await siteObj.text();

  // Build refinement instruction
  const instruction = buildRefineInstruction(category, option, customText);

  // Send to Claude for refinement
  const refinedBody = await callClaudeRefine(env, currentHtml, instruction);

  if (!refinedBody || refinedBody.length < 200) {
    return json({ error: 'Refinement produced empty result' }, 500);
  }

  // Extract <head> from current HTML and combine with refined body
  const headMatch = currentHtml.match(/<head[\s\S]*?<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : '<head><meta charset="UTF-8"><title>Site</title></head>';

  // Clean the refined output
  let cleanBody = refinedBody
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/html>/gi, '').replace(/<\/body>/gi, '')
    .replace(/<html[^>]*>/gi, '').replace(/<body[^>]*>/gi, '')
    .replace(/<\/head>/gi, '').replace(/<head[\s\S]*?>/gi, '')
    .trim();

  const finalHtml = `<!DOCTYPE html>\n<html lang="en">\n${headHtml}\n<body>\n${cleanBody}\n</body>\n</html>`;

  // Save to R2
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, finalHtml, {
    httpMetadata: { contentType: 'text/html' }
  });

  // Track refinement
  if (!session.refinements) session.refinements = [];
  session.refinements.push({ category, option, customText, at: new Date().toISOString() });
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

  await logEvent(env, sessionId, 'site_refined', { category, option });

  return json({ ok: true, refinementCount: session.refinements.length });
}

function buildRefineInstruction(category, option, customText) {
  const instructions = {
    colors: {
      warmer: 'Shift the color palette to warmer tones: golds, burnt oranges, terracotta, warm browns. Update all background colors, gradients, and accent colors.',
      cooler: 'Shift the color palette to cooler tones: navy blues, teals, steel grays, icy whites. Update all background colors, gradients, and accent colors.',
      bolder: 'Make the color palette bolder and higher contrast. Use more vivid, saturated colors. Increase contrast between text and backgrounds.',
      softer: 'Make the color palette softer and more muted. Use pastels, soft grays, and gentle tones. Reduce harsh contrasts.',
      dark: 'Convert to a dark mode design. Dark backgrounds (#0f0f0f to #1a1a2e), light text (#e0e0e0 to #ffffff), and adjust accent colors to work on dark.',
      minimal: 'Convert to a minimal monochrome palette. Primarily black, white, and various grays. Keep only ONE accent color for CTAs and highlights.',
    },
    headlines: {
      shorter: 'Make all headlines and copy significantly shorter and punchier. Cut unnecessary words. Each headline should be under 8 words. Paragraphs should be 1 to 2 sentences max.',
      storytelling: 'Rewrite headlines and body copy with more narrative and storytelling. Add emotional hooks, paint vivid pictures, use "you" language.',
      professional: 'Rewrite copy to be more professional and authoritative. Formal tone, credibility markers, industry language. Think consulting firm.',
      conversational: 'Rewrite copy to be more casual and conversational. Like talking to a friend. Use contractions, simple words, warmth.',
      benefit: 'Rewrite all headlines to lead with benefits. Every heading should answer "what does the reader get?" Start with outcomes, not features.',
      urgency: 'Add more urgency and momentum to the copy. Use power words, time sensitivity, scarcity framing. Make the reader feel they should act now.',
    },
    layout: {
      compact: 'Reduce all padding and margins by roughly 40%. Tighter spacing between sections. More content visible without scrolling.',
      spacious: 'Increase padding and margins by roughly 50%. Add generous whitespace between sections. Give the design room to breathe.',
      'single-column': 'Convert to a clean single column layout. Remove side-by-side grids. Stack everything vertically for a focused reading experience.',
      magazine: 'Make the layout more editorial / magazine style. Use multi-column grids, larger hero images, pull quotes, and varied section widths.',
      'sections-reorder': 'Move the primary CTA section to be the second section (right after the hero). Make the CTA prominent and above the fold.',
      'add-testimonials': 'Add a testimonials section with 3 placeholder testimonials. Style it as a card grid with quote marks, names, and roles.',
    },
    imagery: {
      abstract: 'Update imagery styling: use abstract, painterly, artistic images. Add CSS gradients and organic shapes as decorative elements.',
      photographic: 'Update imagery styling: use clean, realistic photography style. Remove any abstract backgrounds. Crisp, professional photo aesthetic.',
      'minimal-img': 'Remove large images. Use simple line icons and small accent graphics instead. Typography focused design.',
      nature: 'Update the visual mood to nature and organic. Earth tones, leaf textures, natural photography. Organic, grounded feel.',
      geometric: 'Update the visual mood to geometric and modern. Sharp shapes, tech gradients, crisp edges. Futuristic, polished feel.',
      'remove-images': 'Remove all images and background images. Make it a pure typography focused design. Use color and whitespace for visual interest.',
    }
  };

  if (category === 'custom' && customText) {
    return `The user has requested the following specific change to their website:\n\n"${customText}"\n\nApply this change while keeping the overall structure and content intact.`;
  }

  const catInstructions = instructions[category];
  if (catInstructions && catInstructions[option]) {
    return catInstructions[option];
  }

  return customText || 'Make the site feel more polished and professional.';
}

async function callClaudeRefine(env, currentHtml, instruction) {
  // Strip base64 data URIs to drastically reduce size (1.5MB → ~30KB)
  // Replace with placeholder markers we can restore later
  const imageMap = {};
  let imgIndex = 0;
  const stripped = currentHtml.replace(/url\(['"]?(data:[^)'"]+)['"]?\)/gi, (match, dataUri) => {
    const key = `__IMG_PLACEHOLDER_${imgIndex}__`;
    imageMap[key] = dataUri;
    imgIndex++;
    return `url('${key}')`;
  }).replace(/src="(data:[^"]+)"/gi, (match, dataUri) => {
    const key = `__IMG_PLACEHOLDER_${imgIndex}__`;
    imageMap[key] = dataUri;
    imgIndex++;
    return `src="${key}"`;
  });

  // Extract just the body content
  const bodyMatch = stripped.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyOnly = bodyMatch ? bodyMatch[1].trim() : stripped;

  // Truncate if still too large
  const truncated = bodyOnly.length > 60000 ? bodyOnly.substring(0, 60000) + '\n<!-- truncated -->' : bodyOnly;

  const systemPrompt = `You are a website designer refining an existing HTML page. Apply ONLY the requested change while keeping everything else intact.

RULES:
- Return ONLY the body content (no <html>, <head>, <body>, <style> tags)
- Keep ALL existing sections, content, and structure unless the instruction says to change them
- Preserve all inline styles, classes, data attributes, and image placeholder markers (__IMG_PLACEHOLDER_N__)
- If about colors: update inline style color values, backgrounds, gradients throughout
- If about copy: rewrite text content but keep HTML structure
- If about layout: adjust structural elements and spacing
- Start response with the first HTML element (typically <nav>)`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Current website body HTML:\n\n${truncated}\n\n---\n\nREFINEMENT: ${instruction}\n\nReturn the updated body content now. Begin with the first element.`
      }]
    })
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    throw new Error(`Claude API error ${res.status}: ${err.substring(0, 200)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';

  // Re-inject base64 images that were stripped before sending to Claude
  let restored = text;
  for (const [key, dataUri] of Object.entries(imageMap)) {
    restored = restored.split(key).join(dataUri);
  }
  return restored;
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
  return buildBrandGuideHTML(blueprint, session);
}
// ── EXPORT SITE (download generated site HTML) ────────────────
async function handleExportSite(request, env) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId');
  if (!sessionId) return json({ error: 'Missing sessionId' }, 400);

  // ── Verify caller owns this session ───────────────────────────
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = await verifySessionToken(token, env.JWT_SECRET || 'dev-secret-change-me').catch(() => null);
    if (!payload || payload.sessionId !== sessionId) {
      return json({ error: 'Unauthorized' }, 401);
    }
  }
  // (If no auth header is present we still allow — existing sessions without claim flow)

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

  const siteObj = await env.UPLOADS.get('sessions/' + sessionId + '/site.html');
  if (!siteObj) return json({ error: 'Site not generated yet. Build your website first.' }, 404);

  const siteHtml = await siteObj.text();

  const bp = session.blueprint?.blueprint || {};
  const brandName = bp.part1?.brandNames?.[0] || 'my-site';
  const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-site';

  await logEvent(env, sessionId, 'site_downloaded', {});

  return new Response(siteHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': 'attachment; filename="' + safeName + '.html"',
      ...CORS
    }
  });
}


function buildBrandGuideHTML(blueprint, session) {
  const b = blueprint?.blueprint;
  if (!b) return '<html><body>Blueprint not available</body></html>';

  const p1 = b.part1 || {};
  const p2 = b.part2 || {};
  const p3 = b.part3 || {};
  const p4 = b.part4 || {};
  const p5 = b.part5 || {};
  const p6 = b.part6 || {};
  const p7 = b.part7 || {};
  const p8 = b.part8 || {};

  const brandName  = esc((p1.brandNames || [])[0] || b.name || 'Your Brand');
  const tagline    = esc((p1.taglines || [])[0] || '');
  const colors     = p1.visualDirection?.colors || [];
  const primary    = esc((colors[0]?.hex) || '#1C2B3A');
  const secondary  = esc((colors[1]?.hex) || '#C4703F');
  const accent     = esc((colors[2]?.hex) || '#E8C97A');
  const bgColor    = esc((colors[3]?.hex) || '#F7F5F0');
  const textColor  = esc((colors[4]?.hex) || '#1A1A1A');
  const rawHeadingFont = p1.visualDirection?.fonts?.heading || 'Georgia';
  const rawBodyFont    = p1.visualDirection?.fonts?.body || 'Inter';
  const headingFont = safeFont(rawHeadingFont, 'Playfair Display');
  const bodyFont    = safeFont(rawBodyFont, 'Inter');
  const aesthetic   = esc(p1.visualDirection?.aesthetic || '');

  const nicheStatement = esc(p3.nicheStatement || '');
  const mechanism      = esc(p3.uniqueMechanism || '');
  const compGap        = esc(p3.competitorGap || '');
  const whoServe       = esc(p3.whoTheyServe || '');
  const whoNotServe    = esc(p3.whoTheyDoNotServe || '');

  const entryOffer   = p4.entryOffer   || {};
  const coreOffer    = p4.coreOffer    || {};
  const premiumOffer = p4.premiumOffer || {};
  const ascensionLogic = esc(p4.ascensionLogic || '');

  const headlines = (p7.heroHeadlineOptions || []).map(h => esc(h));
  const posStatements = p7.positioningStatements || {};
  const posWeb     = esc(posStatements.website || '');
  const posSocial  = esc(posStatements.social || '');
  const posPerson  = esc(posStatements.inPerson || '');

  // Beliefs: might be strings or objects — normalize
  const rawBeliefs = (p5.brandBeliefs || p6.coreBeliefs || p6.credibilityGaps || []);
  const beliefs = rawBeliefs.map(item => {
    if (typeof item === 'string') return esc(item);
    if (item?.belief) return esc(item.belief);
    if (item?.gap) return esc(item.gap);
    return esc(JSON.stringify(item));
  });

  // Credibility gaps from part6
  const credGaps = (p6.credibilityGaps || []).map(g => esc(typeof g === 'string' ? g : g?.gap || JSON.stringify(g)));
  const mktOpportunities = (p6.marketingOpportunities || []).map(o => esc(typeof o === 'string' ? o : JSON.stringify(o)));
  const firstMove = esc(p6.firstMove || '');

  // Part 8: Personalized recommendation
  const recType = p8.recommendation || 'self_guided';
  const recHeadline = esc(p8.headline || '');
  const recMessage = esc(p8.personalizedMessage || '');
  const recWhyNow = esc(p8.whyNow || '');
  const recBenefit = esc(p8.specificBenefit || '');

  // Brand voice
  const descriptors = (p1.brandVoice?.descriptors || []).map(d => esc(d));
  const doSay       = (p1.brandVoice?.doSay || []).map(d => esc(d));
  const neverSay    = (p1.brandVoice?.neverSay || []).map(d => esc(d));

  const exactWords   = (p2.exactWords || []).map(w => esc(w));
  const alreadyTried = (p2.alreadyTried || []).map(t => esc(t));
  const whyNotWork   = esc(p2.whyItDidNotWork || '');
  const avatarName   = esc(p2.name || 'Your Ideal Client');
  const avatarAge    = esc(p2.ageRange || '');
  const avatarSit    = esc(p2.lifeSituation || '');
  const avatarWant   = esc(p2.tryingToAchieve || '');
  const avatarBlock  = esc(p2.whatIsStoppingThem || '');

  // Website blueprint sections from AI (part5) or generate generic
  const aiSections = (p5.sections || []).map(s => ({
    name: esc(s.name || ''),
    purpose: esc(s.purpose || ''),
    content: esc(s.content || '')
  }));
  const heroSub = esc(p5.heroSubheadline || '');
  const heroCTA = esc(p5.heroCTA || '');
  const testimonialFraming = esc(p5.testimonialFraming || '');

  const coreBrandPromise = esc(p1.coreBrandPromise || nicheStatement);

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Site blueprint sections — generated from blueprint data
  const siteSections = [
    {
      name: 'Navigation',
      emoji: '01',
      purpose: 'First impression and wayfinding. Sets tone before a single word is read.',
      headline: `Logo: "${brandName}" — minimal, confident. Links: About, Work With Me, Results. CTA button in accent color.`,
      supporting: 'Sticky on scroll. Transparent over hero, solid on scroll.',
      cta: 'Primary button links to your entry offer or contact form.'
    },
    {
      name: 'Hero Section',
      emoji: '02',
      purpose: 'The hook. Must answer "is this for me?" in under 4 seconds. Creates immediate recognition.',
      headline: headlines[0] ? `"${headlines[0]}"` : `Lead with the tension your ideal client is living in right now.`,
      supporting: `Subheadline: "${nicheStatement.substring(0, 120)}" — be specific about who, what, and the transformation.`,
      cta: `Primary: "${entryOffer.name || 'Work With Me'}" — Secondary: "See How This Works"`
    },
    {
      name: 'The Problem You Name',
      emoji: '03',
      purpose: 'Validates their experience. Makes them feel seen before you offer anything. This is where trust starts.',
      headline: `Headline names the specific gap or tension your people are living in. Use their exact words: ${exactWords.slice(0,2).map(w => `"${w}"`).join(', ')}`,
      supporting: 'A short paragraph or 2-column layout: what they have already tried vs. why it did not work. No blame. Pure recognition.',
      cta: 'Soft CTA or none — let them breathe here before the ask.'
    },
    {
      name: 'Why You',
      emoji: '04',
      purpose: 'Your credibility and origin. Not a resume — the story of why this became your life\'s work.',
      headline: `The inciting moment or the transformation you lived. Not "I help people" — the specific thing that happened to you that made this your purpose.`,
      supporting: `Connect your story directly to their situation. The thread: you were where they are. You found the way out. "${mechanism}" is your proof.`,
      cta: '"Learn More About My Approach" or a link to your full story.'
    },
    {
      name: 'What I Believe',
      emoji: '05',
      purpose: 'Your worldview and the things you believe that most people in your space get wrong. Creates polarization in the best way — repels the wrong clients, magnetizes the right ones.',
      headline: `"Here is what I know to be true that most ${(nicheStatement.split(' ')[3] || 'experts')} will never tell you."`,
      supporting: beliefs.length ? `3 to 5 belief statements. Lead with: "${(typeof beliefs[0] === 'string' ? beliefs[0] : beliefs[0]?.belief || '').substring(0, 80)}..."` : '3 to 5 contrarian beliefs that reflect your genuine conviction. The more specific and honest, the better.',
      cta: 'None needed here. Let the conviction speak.'
    },
    {
      name: 'Results and Social Proof',
      emoji: '06',
      purpose: 'Evidence. Not generic testimonials — specific outcomes with context. Shows the transformation is real and repeatable.',
      headline: `"Here is what actually happens when the work is real."`,
      supporting: 'Lead with your best stat or most dramatic transformation. Then 3 client stories or quotes. Name, role, specific result. No vague "life-changing" language.',
      cta: '"See More Results" or "Read Full Case Studies"'
    },
    {
      name: 'Your Offers',
      emoji: '07',
      purpose: 'Gives visitors a clear next step at every commitment level. Removes the "I am not sure how to start" hesitation.',
      headline: `"Three ways to work together. One clear place to start."`,
      supporting: `Entry: ${entryOffer.name || 'Entry Offer'} at ${entryOffer.price || 'low price'} — low risk, high value, easy yes. Core: ${coreOffer.name || 'Core Program'} at ${coreOffer.price || 'mid price'} — the transformation. Premium: ${premiumOffer.name || 'Premium'} at ${premiumOffer.price || 'high price'} — the full experience.`,
      cta: 'Each card has its own CTA. Entry offer CTA is the most prominent.'
    },
    {
      name: 'Contact and Final CTA',
      emoji: '08',
      purpose: 'The close. For the visitor who has read everything and is ready to take the step.',
      headline: headlines[1] ? `"${headlines[1]}"` : `One more direct call to action. Name the exact person this is for.`,
      supporting: 'Simple form or direct calendar link. Remove friction. One or two fields maximum. No long forms.',
      cta: `"${entryOffer.name || 'Book a Call'}" — make it as easy as possible to say yes.`
    }
  ];

  // 90-day plan
  const plan90 = [
    {
      month: 'Month 1',
      title: 'Foundation and First Proof',
      items: [
        firstMove ? `Your first move: ${firstMove}` : 'Finalize your brand guide and apply it everywhere: bio, email signature, social profiles',
        `Launch your entry offer: "${entryOffer.name || 'entry offer'}" — deliver it 3 times at any price to build case studies`,
        'Identify your 20 best potential clients — people who already know and trust you',
        'Publish your origin story in long form: LinkedIn article, email, or blog post',
        'Set up a simple one-page site or landing page using this site blueprint'
      ]
    },
    {
      month: 'Month 2',
      title: 'Momentum and Market Proof',
      items: [
        'Collect 3 specific testimonials from Month 1 delivery — get exact numbers and outcomes',
        `Begin promoting your core offer: "${coreOffer.name || 'core program'}" to your warm audience`,
        'Reach out to 5 potential referral partners or collaborators in adjacent spaces',
        'Start one consistent content channel — one platform, one format, once per week minimum',
        'Host one live event: webinar, workshop, or group call to build your list'
      ]
    },
    {
      month: 'Month 3',
      title: 'Scale the Proven System',
      items: [
        `Launch your premium offer: "${premiumOffer.name || 'premium program'}" to your most engaged clients`,
        'Build a simple referral process — ask every happy client for one introduction',
        'Document your unique mechanism as a framework: name it, diagram it, teach it publicly',
        'Raise prices on at least one offer based on demand signals from Months 1 and 2',
        'Review: what worked, what to cut, what to double down on going into Month 4+'
      ]
    }
  ];

  const colorSwatches = colors.map(c => `
    <div class="swatch-item">
      <div class="swatch-block" style="background-color:${c.hex} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
      <div class="swatch-name">${esc(c.name)}</div>
      <div class="swatch-hex">${esc(c.hex)}</div>
    </div>`).join('');

  const googleFontParam = [headingFont, bodyFont]
    .filter(f => !['Georgia','serif','sans-serif','monospace','system-ui'].includes(f))
    .map(f => f.replace(/ /g, '+'))
    .join('&family=');
  const fontImport = googleFontParam
    ? `@import url('https://fonts.googleapis.com/css2?family=${googleFontParam}:wght@400;500;600;700;900&display=swap');`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${brandName} — Brand Guide</title>
<style>
${fontImport}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }

:root {
  --primary: ${primary};
  --secondary: ${secondary};
  --accent: ${accent};
  --bg: ${bgColor};
  --text: ${textColor};
  --font-display: '${headingFont}', Georgia, serif;
  --font-body: '${bodyFont}', system-ui, sans-serif;
}

body {
  font-family: var(--font-body);
  background: #fff;
  color: var(--text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

/* ── PAGE LAYOUT ── */
.page {
  width: 8.5in;
  margin: 0 auto;
  position: relative;
  background: #fff;
}
.page.cover {
  min-height: 11in;
  overflow: hidden;
  page-break-after: always;
}
.page.content-page {
  padding-bottom: 40px;
  page-break-inside: auto;
}
.page.force-break {
  page-break-before: always;
}

/* ── COVER ── */
.cover {
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}
.cover-body {
  padding: 1.2in 0.9in 0.6in;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cover-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 40px;
}
.cover-name {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 700;
  color: #fff;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}
.cover-tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 48px;
  max-width: 5.5in;
  line-height: 1.5;
}
.cover-meta {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.04em;
}
.cover-color-bar {
  display: flex;
  height: 60px;
  width: 100%;
}
.cover-color-bar div {
  flex: 1;
}

/* ── INNER PAGE LAYOUT ── */
.inner-page {
  padding: 0.75in 0.85in;
}
.page-rule {
  width: 100%;
  height: 5px;
  background: var(--primary);
  margin-bottom: 0;
}
.page-rule-accent {
  width: 48px;
  height: 5px;
  background: var(--secondary);
  display: inline-block;
}
.page-header {
  padding: 0.4in 0.85in 0.35in;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-header-brand {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.02em;
}
.page-header-section {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.35);
}

/* ── TYPOGRAPHY ── */
.section-number {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--secondary);
  display: block;
  margin-bottom: 10px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.15;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
}
.section-title em {
  font-style: italic;
  color: var(--secondary);
}
.section-intro {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0,0,0,0.7);
  margin-bottom: 32px;
  max-width: 6in;
}
.divider {
  width: 44px;
  height: 3px;
  background: var(--secondary);
  margin: 24px 0;
}

/* ── CARDS AND BLOCKS ── */
.card {
  background: var(--bg);
  border-radius: 8px;
  padding: 24px 28px;
  margin-bottom: 16px;
}
.card-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 8px;
}
.card-content {
  font-size: 15px;
  line-height: 1.75;
  color: var(--text);
}
.card-content strong {
  color: var(--primary);
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

/* ── PULL QUOTE ── */
.pull-quote {
  border-left: 4px solid var(--secondary);
  padding: 20px 28px;
  margin: 24px 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.02), transparent);
}
.pull-quote p {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 20px;
  line-height: 1.55;
  color: var(--primary);
}
.pull-quote cite {
  display: block;
  font-family: var(--font-body);
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.35);
  margin-top: 12px;
}

/* ── OFFER CARDS ── */
.offer-card {
  border: 1.5px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  padding: 24px;
  position: relative;
}
.offer-card.featured {
  border-color: var(--secondary);
  background: linear-gradient(135deg, rgba(0,0,0,0.015), transparent);
}
.offer-tier {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 6px;
}
.offer-name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6px;
}
.offer-price {
  font-size: 26px;
  font-weight: 800;
  color: var(--secondary);
  margin-bottom: 10px;
  font-family: var(--font-body);
}
.offer-desc {
  font-size: 13px;
  line-height: 1.7;
  color: rgba(0,0,0,0.6);
}

/* ── COLOR SWATCHES ── */
.swatches {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.swatch-item {
  flex: 1;
  text-align: center;
}
.swatch-block {
  width: 100%;
  height: 72px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08);
}
.swatch-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 2px;
}
.swatch-hex {
  font-size: 10px;
  font-family: monospace;
  color: rgba(0,0,0,0.4);
}

/* ── FONT DISPLAY ── */
.font-display {
  background: var(--primary);
  color: #fff;
  border-radius: 8px;
  padding: 20px 24px;
}
.font-sample-heading {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}
.font-sample-body {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
}
.font-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 6px;
}

/* ── SITE BLUEPRINT SECTIONS ── */
.site-section-card {
  border-left: 3px solid var(--primary);
  padding: 18px 22px;
  margin-bottom: 18px;
  background: var(--bg);
  border-radius: 0 8px 8px 0;
}
.site-section-num {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 4px;
}
.site-section-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}
.site-section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.site-section-field {
  font-size: 11px;
  line-height: 1.6;
}
.site-section-field-label {
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.4);
  display: block;
  margin-bottom: 3px;
}

/* ── 90-DAY PLAN ── */
.plan-month {
  margin-bottom: 28px;
}
.plan-month-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.plan-month-label {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}
.plan-month-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--secondary);
  letter-spacing: 0.03em;
}
.plan-item {
  display: flex;
  gap: 10px;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(0,0,0,0.7);
  margin-bottom: 8px;
  padding: 8px 12px;
  background: var(--bg);
  border-radius: 6px;
}
.plan-item::before {
  content: '→';
  color: var(--secondary);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ── CLAUDE STARTER ── */
.starter-block {
  background: var(--primary);
  border-radius: 10px;
  padding: 28px 32px;
  margin-top: 8px;
}
.starter-block pre {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: rgba(255,255,255,0.75);
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── BELIEF ITEM ── */
.belief-item {
  padding: 14px 18px;
  margin-bottom: 10px;
  border-left: 3px solid var(--accent);
  background: var(--bg);
  border-radius: 0 6px 6px 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text);
}

/* ── PRINT ── */
@media print {
  @page {
    size: letter;
    margin: 0;
  }
  body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .page {
    width: 100%;
    margin: 0;
  }
  .page.cover {
    min-height: 100vh;
    page-break-after: always;
    break-after: page;
  }
  .page.content-page {
    page-break-inside: auto;
  }
  .page.force-break {
    page-break-before: always;
    break-before: page;
  }
  .card {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .part-header {
    page-break-after: avoid;
    break-after: avoid;
  }
  .two-col {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .swatch-block, .cover, .cover-color-bar div, .font-display, .starter-block, .pull-quote, .card {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .no-print { display: none !important; }
}

/* ── SCREEN ONLY ── */
@media screen {
  body { background: #e8e4de; padding: 32px 0; }
  .page { box-shadow: 0 8px 48px rgba(0,0,0,0.18); margin-bottom: 24px; }
  .page.content-page { min-height: auto; }
}
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover" style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
  <div class="cover-body">
    <span class="cover-label">Brand Guide</span>
    <div class="cover-name">${brandName}</div>
    ${tagline ? `<div class="cover-tagline">"${tagline}"</div>` : ''}
    <div class="cover-meta">Generated ${today} &nbsp;·&nbsp; Confidential</div>
  </div>
  <div class="cover-color-bar">
    ${colors.length ? colors.map(c => `<div style="background-color:${c.hex} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>`).join('') : `<div style="background-color:${primary} !important;"></div><div style="background-color:${secondary} !important;"></div><div style="background-color:${accent} !important;"></div>`}
  </div>
</div>

<!-- PAGE 2: BRAND ESSENCE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Brand Essence</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part One</span>
    <h2 class="section-title">Who You Are<br>and <em>What You Stand For</em></h2>
    <div class="divider"></div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-label">Core Brand Promise</div>
      <div class="card-content" style="font-size:17px;font-style:italic;font-family:var(--font-display);color:var(--primary);line-height:1.6;">"${p1.coreBrandPromise || nicheStatement}"</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">Brand Names</div>
        <div class="card-content">${(p1.brandNames || [brandName]).map((n,i) => `<div style="margin-bottom:4px;${i===0?'font-weight:700;color:var(--primary)':''}">${i===0?'★ ':''} ${n}</div>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-label">Taglines</div>
        <div class="card-content">${(p1.taglines || [tagline]).filter(Boolean).map((t,i) => `<div style="margin-bottom:6px;font-style:italic;${i===0?'font-weight:600;':''}">${i===0?'★ ':''}"${t}"</div>`).join('')}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-label">Brand Voice</div>
      <div class="card-content">${descriptors.length ? descriptors.join(', ') : (typeof p1.brandVoice === 'string' ? esc(p1.brandVoice) : 'Direct, warm, occasionally irreverent. Speaks like a smart friend with real expertise. Never corporate. Never generic.')}</div>
    </div>

    ${p1.visualDirection?.aesthetic ? `<div class="card">
      <div class="card-label">Visual Identity Direction</div>
      <div class="card-content">${aesthetic}</div>
    </div>` : ''}
  </div>
</div>

<!-- PAGE 3: VISUAL IDENTITY -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Visual Identity</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Two</span>
    <h2 class="section-title">Colors, Type,<br>and <em>How You Look</em></h2>
    <div class="divider"></div>

    <div class="card-label" style="margin-bottom:12px;">Color Palette</div>
    <div class="swatches">${colorSwatches || `<div class="swatch-item"><div class="swatch-block" style="background:${primary};"></div><div class="swatch-name">Primary</div><div class="swatch-hex">${primary}</div></div><div class="swatch-item"><div class="swatch-block" style="background:${secondary};"></div><div class="swatch-name">Secondary</div><div class="swatch-hex">${secondary}</div></div><div class="swatch-item"><div class="swatch-block" style="background:${accent};"></div><div class="swatch-name">Accent</div><div class="swatch-hex">${accent}</div></div>`}</div>

    <div class="grid-2" style="margin-top:24px;">
      <div>
        <div class="card-label" style="margin-bottom:12px;">Typography</div>
        <div class="font-display">
          <div class="font-label">Display / Heading</div>
          <div class="font-sample-heading">${headingFont}</div>
          <div class="font-label" style="margin-top:16px;">Body / Interface</div>
          <div class="font-sample-body">${bodyFont} — readable, purposeful, consistent.</div>
        </div>
      </div>
      <div>
        <div class="card-label" style="margin-bottom:12px;">Aesthetic Direction</div>
        <div class="card" style="height:calc(100% - 30px);">
          <div class="card-content" style="font-style:italic;font-family:var(--font-display);font-size:15px;line-height:1.8;color:var(--primary);">${aesthetic || 'A brand that feels premium without being unapproachable. Clean, intentional, and unmistakably human.'}</div>
        </div>
      </div>
    </div>

    ${p1.brandVoice ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Voice in Practice</div>
      <div class="grid-2">
        <div class="card" style="border-left:3px solid var(--secondary);">
          <div class="card-label">Sounds Like</div>
          <div class="card-content" style="font-size:13px;">${doSay.length ? doSay.join('. ') + '.' : 'Confident without arrogance. Direct without coldness. Uses plain language. Calls things what they are.'}</div>
        </div>
        <div class="card" style="border-left:3px solid rgba(0,0,0,0.15);">
          <div class="card-label">Never Sounds Like</div>
          <div class="card-content" style="font-size:13px;">${neverSay.length ? neverSay.join('. ') + '.' : 'Corporate jargon. Vague benefit language. Overly polished to the point of feeling distant. Generic coaches or consultants.'}</div>
        </div>
      </div>
    </div>` : ''}
  </div>
</div>

<!-- PAGE 4: YOUR PEOPLE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Ideal Client Portrait</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Three</span>
    <h2 class="section-title">The Person<br>You Are <em>Built For</em></h2>
    <div class="divider"></div>

    <div class="card" style="background:var(--primary);margin-bottom:20px;">
      <div class="card-label" style="color:rgba(255,255,255,0.5);">Who They Are</div>
      <div class="card-content" style="color:#fff;font-size:16px;font-family:var(--font-display);font-style:italic;">${avatarName}${avatarAge ? ` · ${avatarAge}` : ''}${avatarSit ? ` · ${avatarSit}` : ''}</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">What They Are Trying to Achieve</div>
        <div class="card-content" style="font-size:14px;">${p2.tryingToAchieve || 'Defined in your session notes.'}</div>
      </div>
      <div class="card">
        <div class="card-label">What Is Stopping Them</div>
        <div class="card-content" style="font-size:14px;">${p2.whatIsStoppingThem || 'Defined in your session notes.'}</div>
      </div>
    </div>

    ${exactWords.length ? `<div style="margin-top:8px;">
      <div class="card-label" style="margin-bottom:12px;">Their Exact Words — Use These in Your Copy</div>
      ${exactWords.slice(0,4).map(w => `<div class="pull-quote" style="margin-bottom:12px;"><p>"${w}"</p><cite>Your Ideal Client, in Their Own Words</cite></div>`).join('')}
    </div>` : ''}

    ${(p2.alreadyTried||[]).length ? `<div class="card" style="margin-top:8px;">
      <div class="card-label">What They Have Already Tried</div>
      <div class="card-content" style="font-size:14px;">${(p2.alreadyTried||[]).join('. ')}${p2.whyItDidNotWork ? '. '+p2.whyItDidNotWork : ''}</div>
    </div>` : ''}
  </div>
</div>

<!-- PAGE 5: POSITIONING -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Market Positioning</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Four</span>
    <h2 class="section-title">Your Niche,<br>Your <em>Unfair Advantage</em></h2>
    <div class="divider"></div>

    <div class="pull-quote" style="background:var(--primary);border-left:4px solid var(--secondary);padding:28px 32px;margin-bottom:24px;">
      <p style="color:#fff;font-size:20px;">${nicheStatement}</p>
      <cite style="color:rgba(255,255,255,0.4);">Your Niche Statement</cite>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-label">Your Unique Mechanism</div>
        <div class="card-content">${mechanism}</div>
      </div>
      <div class="card">
        <div class="card-label">Your Competitive Edge</div>
        <div class="card-content">${compGap}</div>
      </div>
    </div>

    ${beliefs.length ? `<div style="margin-top:20px;">
      <div class="card-label" style="margin-bottom:12px;">What You Believe That Others Get Wrong</div>
      ${beliefs.slice(0,4).map(bi => {
        const bt = typeof bi === 'string' ? bi : (bi?.belief || bi?.gap || String(bi));
        return `<div class="belief-item">${bt}</div>`;
      }).join('')}
    </div>` : ''}
  </div>
</div>

<!-- PAGE 6: OFFERS -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Offer Suite</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Five</span>
    <h2 class="section-title">Three Ways In,<br><em>One Clear Place to Start</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Every business needs an ascension model. The goal is to make it easy to say yes at any commitment level, while creating a natural path to the highest-value offer.</p>

    <div class="grid-3">
      <div class="offer-card">
        <div class="offer-tier">Entry Offer</div>
        <div class="offer-name">${entryOffer.name || 'Entry Offer'}</div>
        <div class="offer-price">${entryOffer.price || 'TBD'}</div>
        <div class="offer-desc">${entryOffer.description || 'Low risk, high value. Designed to create trust and demonstrate your method before the bigger ask.'}</div>
      </div>
      <div class="offer-card featured">
        <div class="offer-tier">Core Offer ★</div>
        <div class="offer-name">${coreOffer.name || 'Core Offer'}</div>
        <div class="offer-price">${coreOffer.price || 'TBD'}</div>
        <div class="offer-desc">${coreOffer.description || 'The primary transformation. This is where your unique mechanism is fully deployed and real results happen.'}</div>
      </div>
      <div class="offer-card">
        <div class="offer-tier">Premium Offer</div>
        <div class="offer-name">${premiumOffer.name || 'Premium Offer'}</div>
        <div class="offer-price">${premiumOffer.price || 'TBD'}</div>
        <div class="offer-desc">${premiumOffer.description || 'For clients who want everything — maximum access, maximum support, maximum results.'}</div>
      </div>
    </div>

    <div class="card" style="margin-top:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">The Ascension Logic</div>
      <div class="card-content" style="font-size:14px;">
        The entry offer creates trust and proves your method. The core offer is where the transformation actually happens — this is your main revenue driver. The premium offer serves your best clients and commands the highest fees. Most people start at entry, move to core within 90 days, and upgrade to premium when they see results.
      </div>
    </div>
  </div>
</div>

<!-- PAGE 7: KEY MESSAGES -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Key Messaging</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Six</span>
    <h2 class="section-title">The Words That<br><em>Make People Stop</em></h2>
    <div class="divider"></div>

    <div class="card-label" style="margin-bottom:14px;">Hero Headline Options</div>
    ${headlines.map((h, i) => `<div class="pull-quote" style="margin-bottom:14px;${i===0?'border-left-color:var(--secondary);':''}" ><p style="${i===0?'font-size:22px;':''}">${h}</p>${i===0?'<cite>Recommended Primary Headline</cite>':''}</div>`).join('')}

    ${exactWords.length ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Language From Their Mouths — Use Verbatim</div>
      <div class="grid-2">
        ${exactWords.slice(0,6).map(w => `<div class="card" style="padding:14px 18px;"><div class="card-content" style="font-style:italic;font-size:13px;">"${w}"</div></div>`).join('')}
      </div>
    </div>` : ''}

    ${(posWeb || posSocial || posPerson) ? `<div style="margin-top:24px;">
      <div class="card-label" style="margin-bottom:12px;">Your Positioning Statement — Tailored by Context</div>
      <div class="grid-3">
        ${posWeb ? `<div class="card"><div class="card-label">Website</div><div class="card-content" style="font-size:13px;">${posWeb}</div></div>` : ''}
        ${posSocial ? `<div class="card"><div class="card-label">Social Media</div><div class="card-content" style="font-size:13px;">${posSocial}</div></div>` : ''}
        ${posPerson ? `<div class="card"><div class="card-label">In Person</div><div class="card-content" style="font-size:13px;">${posPerson}</div></div>` : ''}
      </div>
    </div>` : ''}
  </div>
</div>

<!-- PAGE 7B: YOUR STORY + OUTREACH -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Story and Outreach</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Your Origin</span>
    <h2 class="section-title">Your Story<br>in <em>3 Sentences</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Use this wherever you need a condensed origin story: bios, email signatures, podcast intros, speaker pages, or the first paragraph of your about page.</p>

    <div class="pull-quote" style="background:var(--primary);border-left:4px solid var(--secondary);padding:28px 32px;margin-bottom:24px;">
      <p style="color:#fff;font-size:17px;line-height:1.7;">
        <strong style="color:var(--accent);">The Problem I Lived:</strong> ${avatarBlock || 'I was exactly where my clients are now — stuck, frustrated, and surrounded by advice that did not work.'}
        <br><br><strong style="color:var(--accent);">The Breakthrough:</strong> ${mechanism || 'I discovered a different approach — one that actually worked — and I built my career around it.'}
        <br><br><strong style="color:var(--accent);">The Mission:</strong> ${coreBrandPromise || nicheStatement || 'Now I help others do the same.'}
      </p>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-label">Short Bio (Copy and Paste Ready)</div>
      <div class="card-content" style="font-size:14px;font-style:italic;">${brandName} helps ${(whoServe || 'people who are ready for change').toLowerCase()} ${avatarWant ? avatarWant.charAt(0).toLowerCase() + avatarWant.slice(1) : 'get real results'} through ${mechanism || 'a proven method'}.${tagline ? ' "' + tagline + '"' : ''}</div>
    </div>

    <span class="section-number" style="margin-top:28px;">First Contact</span>
    <h2 class="section-title" style="font-size:28px;">Cold Outreach<br><em>Template</em></h2>
    <div class="divider"></div>
    <p class="section-intro" style="font-size:14px;">Send this to warm contacts, past colleagues, or people who already know your name. Personalize the first line. Keep it short.</p>

    <div class="starter-block" style="background:var(--bg);border:1.5px solid rgba(0,0,0,0.1);border-radius:10px;">
      <pre style="color:var(--text);font-size:12px;line-height:1.8;">Hey [First Name],

I have been thinking about you because [specific reason — something you noticed about their work, a post they shared, or a challenge you know they are facing].

I recently launched ${brandName} — I help ${whoServe || '[your people]'} ${avatarWant ? avatarWant.toLowerCase() : 'get real results'} without ${avatarBlock ? avatarBlock.toLowerCase().substring(0, 80) : 'the usual frustration'}.

${entryOffer.name ? 'Right now I am offering "' + entryOffer.name + '"' + (entryOffer.price ? ' at ' + entryOffer.price : '') + ' — it is a quick way to see if this is a fit.' : 'I am offering a free intro session to see if this is a fit.'}

Would you be open to a 15 minute conversation? No pitch, just want to hear what you are working on.

${p1.brandNames?.[0] || 'Your Name'}</pre>
    </div>

    ${credGaps.length ? `<div class="card" style="margin-top:20px;border-left:3px solid var(--accent);">
      <div class="card-label">Credibility Gaps to Address</div>
      <div class="card-content" style="font-size:13px;">${credGaps.join(' · ')}</div>
    </div>` : ''}
  </div>
</div>

<!-- PAGE 8: WEBSITE BLUEPRINT -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Website Blueprint</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Seven</span>
    <h2 class="section-title">Your Website,<br><em>Section by Section</em></h2>
    <div class="divider"></div>
    <p class="section-intro" style="margin-bottom:20px;">This is not a template. This is a content brief — the story your site tells, the emotional job each section does, and exactly what belongs there. Hand this to any designer or developer and they can build something that actually converts.</p>

    ${siteSections.slice(0,5).map(s => `
    <div class="site-section-card">
      <div class="site-section-num">Section ${s.emoji}</div>
      <div class="site-section-name">${s.name}</div>
      <div class="site-section-grid">
        <div class="site-section-field"><span class="site-section-field-label">Emotional Job</span>${s.purpose}</div>
        <div class="site-section-field"><span class="site-section-field-label">Headline Direction</span>${s.headline}</div>
        <div class="site-section-field"><span class="site-section-field-label">CTA</span>${s.cta}</div>
      </div>
    </div>`).join('')}
  </div>
</div>

<!-- PAGE 9: WEBSITE BLUEPRINT CONTINUED -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Website Blueprint (continued)</div>
  </div>
  <div class="inner-page" style="padding-top:0.5in;">
    ${siteSections.slice(5).map(s => `
    <div class="site-section-card">
      <div class="site-section-num">Section ${s.emoji}</div>
      <div class="site-section-name">${s.name}</div>
      <div class="site-section-grid">
        <div class="site-section-field"><span class="site-section-field-label">Emotional Job</span>${s.purpose}</div>
        <div class="site-section-field"><span class="site-section-field-label">Headline Direction</span>${s.headline}</div>
        <div class="site-section-field"><span class="site-section-field-label">CTA</span>${s.cta}</div>
      </div>
    </div>`).join('')}

    <div class="card" style="margin-top:20px;background:var(--primary);">
      <div class="card-label" style="color:rgba(255,255,255,0.5);">The One Rule for Your Site</div>
      <div class="card-content" style="color:#fff;font-style:italic;font-family:var(--font-display);font-size:16px;line-height:1.7;">Every section should make your ideal client feel more seen than the last one. If a section does not do emotional work — cut it.</div>
    </div>
  </div>
</div>

<!-- PAGE 10: 90-DAY PLAN -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">90-Day Launch Plan</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Part Eight</span>
    <h2 class="section-title">Your First<br><em>90 Days</em></h2>
    <div class="divider"></div>
    <p class="section-intro">The goal is not to build the perfect brand. The goal is to get your first 3 paying clients inside 90 days and use those results to sharpen everything else.</p>

    ${mktOpportunities.length ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--accent);">
      <div class="card-label">Marketing Opportunities Identified</div>
      <div class="card-content" style="font-size:13px;">${mktOpportunities.join(' · ')}</div>
    </div>` : ''}

    ${plan90.map(m => `
    <div class="plan-month">
      <div class="plan-month-header">
        <div class="plan-month-label">${m.month}</div>
        <div class="plan-month-title">${m.title}</div>
      </div>
      ${m.items.map(item => `<div class="plan-item">${item}</div>`).join('')}
    </div>`).join('')}
  </div>
</div>

${recMessage ? `<!-- PAGE 10B: YOUR RECOMMENDED NEXT STEP -->
<div class="page content-page">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Your Next Step</div>
  </div>
  <div class="inner-page">
    <span class="section-number">After Getting to Know You</span>
    <h2 class="section-title">Here Is What I Think<br><em>You Should Do Next</em></h2>
    <div class="divider"></div>

    <div class="pull-quote" style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-left:4px solid var(--accent);padding:32px 36px;margin-bottom:28px;">
      <p style="color:#fff;font-size:22px;line-height:1.4;">${recHeadline}</p>
    </div>

    <div class="card" style="margin-bottom:20px;padding:28px 32px;">
      <div class="card-content" style="font-size:16px;line-height:1.8;">${recMessage}</div>
    </div>

    ${recWhyNow ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">Why Now Matters</div>
      <div class="card-content" style="font-size:14px;">${recWhyNow}</div>
    </div>` : ''}

    ${recBenefit ? `<div class="card" style="margin-bottom:20px;border-left:3px solid var(--accent);">
      <div class="card-label">What You Will Walk Away With</div>
      <div class="card-content" style="font-size:14px;">${recBenefit}</div>
    </div>` : ''}

    <div style="margin-top:32px;text-align:center;">
      ${recType === 'site_in_sixty' ? `
        <div style="background-color:${secondary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:10px;padding:32px;color:#fff;">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;margin-bottom:12px;">Ready to Make This Live?</div>
          <div style="font-size:15px;line-height:1.7;opacity:0.85;max-width:5in;margin:0 auto 20px;">Your strategy is done. Your messaging is locked. Your visual identity is set. The only thing left is putting it in front of the people who need to see it.</div>
          <a href="https://love.jamesguldan.com/app" style="display:inline-block;background:#fff;color:${secondary};font-weight:700;font-size:15px;padding:16px 36px;border-radius:6px;text-decoration:none;">Get Your Vision Live</a>
        </div>` : recType === 'coaching' ? `
        <div style="background-color:${primary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:10px;padding:32px;color:#fff;">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;margin-bottom:12px;">Let's Work Together</div>
          <div style="font-size:15px;line-height:1.7;opacity:0.85;max-width:5in;margin:0 auto 20px;">Send this blueprint to your team. Then let me help you and your leadership make sure every decision ladders up to this brand.</div>
          <a href="https://jamesguldan.com" style="display:inline-block;background:${secondary};color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:6px;text-decoration:none;">Book a Strategy Call</a>
        </div>` : `
        <div style="background:var(--bg);border-radius:10px;padding:32px;border:1.5px solid rgba(0,0,0,0.1);">
          <div style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--primary);margin-bottom:12px;">You Have Everything You Need</div>
          <div style="font-size:15px;line-height:1.7;color:rgba(0,0,0,0.7);max-width:5in;margin:0 auto;">Your blueprint is your north star. Execute on it, and when you are ready for the next level, reach out. I will be here.</div>
        </div>`}
    </div>
  </div>
</div>` : ''}

<!-- PAGE 11: CONTINUE IN CLAUDE -->
<div class="page content-page force-break">
  <div class="page-rule"></div>
  <div class="page-header">
    <div class="page-header-brand">${brandName}</div>
    <div class="page-header-section">Continue Your Brand Work</div>
  </div>
  <div class="inner-page">
    <span class="section-number">Take It Further</span>
    <h2 class="section-title">Continue Building<br>in <em>Claude.ai</em></h2>
    <div class="divider"></div>
    <p class="section-intro">Your brand blueprint is a living document — not a one-time exercise. Copy the prompt below into any Claude.ai conversation to pick up exactly where you left off, with all your brand context already loaded.</p>

    <div class="starter-block">
      <pre>I have completed a Deep Work brand strategy session. Here is my complete brand blueprint:

Brand: ${brandName}
Tagline: ${tagline}
Niche: ${nicheStatement}
Core Promise: ${p1.coreBrandPromise || ''}
Unique Mechanism: ${mechanism}
Ideal Client: ${avatarName}${avatarAge ? `, ${avatarAge}` : ''}
Their Pain: ${p2.whatIsStoppingThem || ''}
Entry Offer: ${entryOffer.name || ''} at ${entryOffer.price || ''}
Core Offer: ${coreOffer.name || ''} at ${coreOffer.price || ''}
Premium Offer: ${premiumOffer.name || ''} at ${premiumOffer.price || ''}
Visual: ${aesthetic.substring(0, 120)}

Full Blueprint JSON: ${JSON.stringify(b).substring(0, 800)}...

I want to continue building on this brand. Please act as my senior brand strategist and help me with: [your question here]

Some starting points you could ask about:
- "Write my LinkedIn bio using my brand voice"
- "Create my first 5 pieces of content for LinkedIn"
- "Write the copy for my hero section"
- "Help me craft my first outreach message to warm leads"
- "Build me a 30-day content calendar"</pre>
    </div>

    <div class="card" style="margin-top:20px;border-left:3px solid var(--secondary);">
      <div class="card-label">What to Work On Next</div>
      <div class="card-content" style="font-size:14px;">
        Your brand guide is ready. Your site blueprint is ready. Your 90-day plan is ready. The only thing left is execution. Start with the one thing that will get you in front of your ideal client the fastest — and do that one thing before you build anything else.
      </div>
    </div>
  </div>
</div>

<div class="page cover" style="background-color:${secondary} !important;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
<div class="cover-body" style="text-align:center;align-items:center">
<span class="cover-label" style="color:rgba(255,255,255,.6)">Your Next Step</span>
<div class="cover-name" style="font-size:44px">Get Your<br>Vision Live</div>
<div style="max-width:5in;color:rgba(255,255,255,.85);font-size:16px;line-height:1.8;font-family:var(--font-body);margin:0 auto">You did the deep work. Your brand strategy, messaging, and visual identity are locked in. Now it is time to put all of it in front of the people who need to see it. Go back to your blueprint and click the button. Your site can be live in 60 seconds.</div>
<div style="margin-top:28px;display:flex;flex-direction:column;align-items:center;gap:16px;">
  <a href="https://love.jamesguldan.com/app" style="display:inline-block;background:#fff;color:${secondary};font-weight:700;font-size:16px;padding:18px 42px;border-radius:6px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.2);">Get Your Vision Live</a>
  <div style="color:rgba(255,255,255,.6);font-size:13px;max-width:4in;text-align:center;line-height:1.6;">Your blueprint already has everything we need. One click and the AI turns your strategy into a real, live website.</div>
</div>
<div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,.15);display:flex;justify-content:center;gap:40px;color:rgba(255,255,255,.5);font-size:12px;">
  <span>love.jamesguldan.com</span>
  <span>Powered by Align Growth LLC</span>
</div>
</div></div>

<button class="pdf-btn no-print" style="position:fixed;bottom:32px;right:32px;background:var(--primary);color:#fff;font-family:var(--font-body);font-size:14px;font-weight:600;padding:14px 28px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.25);z-index:1000" onclick="this.style.display='none';window.print();setTimeout(()=>{this.style.display=''},1000)">Save as PDF ↓</button>
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

  const exportHtml = buildBrandGuideHTML(session.blueprint, session);

  return new Response(exportHtml, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
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

async function handleLogEvent(request, env) {
  try {
    const body = await request.json();
    const { type, action, detail, sessionId, email, timestamp } = body;

    // Only accept known event types
    if (!['help_bot', 'site_review', 'refinement'].includes(type)) {
      return json({ ok: true }); // silently ignore unknown types
    }

    await env.DB.prepare(`
      INSERT INTO event_log (type, action, detail, session_id, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      type || 'unknown',
      action || '',
      (detail || '').slice(0, 500),
      sessionId || '',
      email || '',
      timestamp || new Date().toISOString()
    ).run();
  } catch (e) {
    // Don't fail the request if logging fails
    console.error('Event log error:', e);
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

// Auto-research competitors when user doesn't provide them
// Uses their website analysis + niche to find relevant competitors
async function autoResearchCompetitors(env, websiteAnalysis, linkedinData) {
  if (!websiteAnalysis && !linkedinData) return '';
  try {
    const context = [
      websiteAnalysis ? `Website: ${websiteAnalysis}` : '',
      linkedinData ? `LinkedIn: ${linkedinData}` : ''
    ].filter(Boolean).join('\n\n');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Based on this person's business information, identify 3 to 5 likely competitors or similar businesses in their space. For each, provide: the company/person name, what they do, their approximate positioning, and what they seem to do well. Be specific and use real companies/people if you can identify the niche clearly enough. If you cannot determine the niche with confidence, say so.

${context}`
        }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || '';
  } catch (e) {
    return '';
  }
}

// Parse and extract text from uploaded documents (PDF/DOCX)
// Returns plain text content, sanitized for safety
async function extractDocumentText(env, r2Key) {
  try {
    const obj = await env.UPLOADS.get(r2Key);
    if (!obj) return '';
    const bytes = await obj.arrayBuffer();
    const ext = r2Key.split('.').pop().toLowerCase();

    if (ext === 'txt' || ext === 'md') {
      const text = new TextDecoder().decode(bytes);
      return sanitizeDocumentText(text).slice(0, 5000);
    }

    // For PDF and DOCX, use Claude to extract text from the raw content
    // We send the file as base64 to Claude which can read these formats
    if (ext === 'pdf') {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'document',
                source: { type: 'base64', media_type: 'application/pdf', data: base64 }
              },
              {
                type: 'text',
                text: 'Extract all the text content from this document. Return only the text, no commentary. If there are tables, format them clearly. Maximum 5000 characters.'
              }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      return sanitizeDocumentText(text);
    }

    return '';
  } catch (e) {
    return '';
  }
}

// Sanitize document text to prevent prompt injection
function sanitizeDocumentText(text) {
  if (!text) return '';
  // Remove common injection patterns
  let clean = text
    .replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?|context)/gi, '[REMOVED]')
    .replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|your\s+new\s+instructions?)\b/gi, '[REMOVED]')
    .replace(/\b(system\s*:?\s*prompt|SYSTEM\s*:)/gi, '[REMOVED]')
    .replace(/<\/?script[^>]*>/gi, '')
    .replace(/<\/?iframe[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  // Truncate to prevent context flooding
  return clean.slice(0, 5000);
}


// ════════════════════════════════════════════════════════
// UTILS
// ═══════════���════════════════════════════════════════════

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

    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
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

    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
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
          <p style="margin:0;font-size:12px;color:#bbb;">&copy; 2025 Align Growth LLC &nbsp;&middot;&nbsp; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#bbb;">Privacy</a></p>
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

    // Auto-generate magic link for the new user
    const token = generateMagicToken();
    const linkType = user.role === 'admin' ? 'admin_magic' : 'magic_login';
    await storeMagicToken(env, token, user.id, linkType, 72);
    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    const magicLink = `${origin}/magic?token=${token}`;

    return json({ user, magicLink }, 201);
  } catch (e) {
    return json({ error: 'Failed to create user', detail: e.message }, 500);
  }
}

async function handleAdminGenerateDebrief(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { sessionId } = await request.json();
    if (!sessionId) return json({ error: 'sessionId required' }, 400);

    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData) return json({ error: 'Session not found in KV' }, 404);

    const session = JSON.parse(kvData);
    if (!session.blueprint) return json({ error: 'No blueprint in this session' }, 400);

    const debrief = await generateStrategistDebrief(env, session, session.blueprint, sessionId);
    if (!debrief) return json({ error: 'Debrief generation failed' }, 500);

    // Save back to KV
    session.strategistDebrief = debrief;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

    return json({ ok: true, debrief });
  } catch (e) {
    return json({ error: 'Failed to generate debrief', detail: e.message }, 500);
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
    const { userId, email, type, createIfMissing, tier } = await request.json();

    let user = null;

    // Look up by userId first, then by email
    if (userId) {
      user = await getUserById(env, userId);
    } else if (email) {
      user = await getUserByEmail(env, email);
      // Auto-create if requested and user doesn't exist
      if (!user && createIfMissing) {
        user = await createUser(env, { email, name: '', role: 'user' });
      }
    }

    if (!user) return json({ error: 'User not found' }, 404);

    const token = generateMagicToken();
    const linkType = type || (user.role === 'admin' ? 'admin_magic' : 'magic_login');
    await storeMagicToken(env, token, user.id, linkType, 72);

    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    const magicLink = `${origin}/magic?token=${token}`;

    return json({ magicLink, url: magicLink, token, expires_in_hours: 72 });
  } catch (e) {
    return json({ error: 'Failed to generate magic link', detail: e.message }, 500);
  }
}

async function handleAdminTestBlueprint(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { email, brandName, niche } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    // Find user
    const user = await getUserByEmail(env, email);
    if (!user) return json({ error: 'User not found. Create them first.' }, 404);

    // Find their most recent session from D1
    const sessionRow = await env.DB.prepare('SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').bind(user.id).first();
    if (!sessionRow) return json({ error: 'No session found for this user. They need to start the app first.' }, 404);

    const sessionId = sessionRow.id;

    // Load session from KV
    const raw = await env.SESSIONS.get(sessionId);
    if (!raw) return json({ error: 'Session not found in KV.' }, 404);
    const session = JSON.parse(raw);

    // Generate a realistic blueprint using Claude Haiku
    const bpRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Generate a complete brand blueprint JSON for a person named "${brandName}" in the niche "${niche}". The blueprint should be realistic and detailed with all 8 parts filled out. Follow this exact JSON structure:

{
  "blueprint": {
    "name": "Full Name",
    "generatedAt": "${new Date().toISOString()}",
    "part1": { "title": "Brand Foundation", "brandNames": ["Name 1", "Name 2", "Name 3"], "taglines": ["Tag 1", "Tag 2", "Tag 3"], "visualDirection": { "colors": [{"name":"Primary","hex":"#1B3A4B"},{"name":"Secondary","hex":"#C17F3E"},{"name":"Accent","hex":"#E8B86D"},{"name":"Background","hex":"#F8F5F0"},{"name":"Text","hex":"#1A1A1A"}], "fonts": {"heading":"Playfair Display","body":"Inter"}, "aesthetic": "2 sentences" }, "brandVoice": { "descriptors": ["word1","word2","word3","word4","word5"], "doSay": ["ex1","ex2","ex3"], "neverSay": ["ex1","ex2","ex3"] }, "coreBrandPromise": "One sentence" },
    "part2": { "title": "Ideal Customer Avatar", "name": "First name", "ageRange": "range", "lifeSituation": "2 sentences", "tryingToAchieve": "goal", "whatIsStoppingThem": "obstacle", "exactWords": ["phrase1","phrase2","phrase3"], "alreadyTried": ["thing1","thing2"], "whyItDidNotWork": "pattern" },
    "part3": { "title": "Niche Positioning", "nicheStatement": "I help X do Y without Z", "whoTheyServe": "desc", "whoTheyDoNotServe": "desc", "uniqueMechanism": "methodology name", "competitorGap": "differentiation" },
    "part4": { "title": "Offer Suite", "entryOffer": {"name":"","description":"","price":"","delivery":""}, "coreOffer": {"name":"","description":"","price":"","delivery":""}, "premiumOffer": {"name":"","description":"","price":"","delivery":""}, "ascensionLogic": "how each leads to next" },
    "part5": { "title": "Website Blueprint", "heroHeadlines": ["1","2","3"], "heroSubheadline": "one line", "heroCTA": "button text", "sections": [{"name":"Section","purpose":"purpose","content":"content"}], "testimonialFraming": "approach" },
    "part6": { "title": "Gap Analysis", "credibilityGaps": ["gap1","gap2","gap3"], "marketingOpportunities": ["opp1","opp2","opp3"], "firstMove": "most important first step" },
    "part7": { "title": "Headlines and Positioning Statements", "heroHeadlineOptions": ["1","2","3","4","5","6","7","8","9","10"], "taglineOptions": ["1","2","3","4","5"], "positioningStatements": {"website":"for homepage","social":"for bios","inPerson":"for introductions"} },
    "part8": { "title": "Your Recommended Next Step", "recommendation": "site_in_sixty", "headline": "compelling one liner", "personalizedMessage": "3 to 5 sentences", "whyNow": "1 to 2 sentences", "specificBenefit": "concrete benefit" },
    "leadIntel": { "estimatedRevenue": "100K to 500K", "industry": "${niche}", "yearsInBusiness": "1 to 3", "teamSize": "Solo", "hasExistingBrand": false, "hasExistingWebsite": false, "hasInternalTeam": false, "brandMaturity": "Starting fresh", "buyingTemperature": "Hot", "biggestPainPoint": "main pain", "budgetSignals": "signal", "bestFitService": "site_in_sixty", "bestFitReason": "1 sentence", "notableQuotes": ["quote1","quote2","quote3"], "followUpAngle": "angle" }
  }
}

Return ONLY the JSON, no other text.`
        }]
      })
    });

    const bpData = await bpRes.json();
    let blueprintText = bpData.content?.[0]?.text || '';

    // Parse the JSON
    let blueprint;
    try {
      // Try to extract JSON from code block if present
      const jsonMatch = blueprintText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, blueprintText];
      blueprint = JSON.parse(jsonMatch[1]);
    } catch (parseErr) {
      return json({ error: 'Failed to parse generated blueprint JSON', detail: blueprintText.slice(0, 500) }, 500);
    }

    // Update the session
    session.blueprint = blueprint;
    session.blueprintGenerated = true;
    session.phase = 8;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

    // Save blueprint to R2
    await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));

    // Update D1 — MUST set blueprint_generated = 1 so active-session query finds it
    await env.DB.prepare('UPDATE sessions SET status = ?, phase = ?, blueprint_generated = 1 WHERE id = ?')
      .bind('blueprint_complete', 8, sessionId).run();

    // Generate magic link for convenience
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, 'magic_login', 72);
    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    const magicLink = `${origin}/magic?token=${token}`;

    return json({ ok: true, sessionId, magicLink, brandName: blueprint?.blueprint?.part1?.brandNames?.[0] || brandName });
  } catch (e) {
    return json({ error: 'Failed to generate test blueprint', detail: e.message }, 500);
  }
}

async function handleAdminQuickTestSession(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);

  try {
    const { email, tier } = await request.json();
    if (!email) return json({ error: 'Email required' }, 400);

    // Create or find user
    let user = await getUserByEmail(env, email);
    if (!user) {
      user = await createUser(env, { email, name: '', role: 'user' });
    }

    // Create a new session
    const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const session = {
      id: sessionId,
      tier: tier || 'blueprint',
      phase: 1,
      messages: [],
      userData: {},
      userId: user.id,
      email: email,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: new Date().toISOString(),
      systemPrompt: DEEP_WORK_SYSTEM_PROMPT
    };

    // If tier is 'site', also generate a test blueprint
    let hasBlueprint = false;
    if (tier === 'site') {
      // Use the test blueprint endpoint logic inline
      const bpRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: 'Generate a complete brand blueprint JSON for a fictional executive coaching business. The person is "Alex Rivera" who helps mid-level tech managers become better leaders. Return ONLY valid JSON with this structure: {"blueprint":{"name":"Alex Rivera","generatedAt":"' + new Date().toISOString() + '","part1":{"title":"Brand Foundation","brandNames":["Rivera Leadership","The Rivera Method","Alex Rivera Coaching"],"taglines":["tag1","tag2","tag3"],"visualDirection":{"colors":[{"name":"Primary","hex":"#2C3E50"},{"name":"Secondary","hex":"#C0842D"},{"name":"Accent","hex":"#E8B86D"},{"name":"Background","hex":"#FAFAF8"},{"name":"Text","hex":"#1A1A1A"}],"fonts":{"heading":"Playfair Display","body":"Inter"},"aesthetic":"desc"},"brandVoice":{"descriptors":["w1","w2","w3","w4","w5"],"doSay":["s1","s2","s3"],"neverSay":["s1","s2","s3"]},"coreBrandPromise":"promise"},"part2":{"title":"Ideal Customer Avatar","name":"Name","ageRange":"30 to 45","lifeSituation":"desc","tryingToAchieve":"goal","whatIsStoppingThem":"obstacle","exactWords":["p1","p2","p3"],"alreadyTried":["t1","t2"],"whyItDidNotWork":"reason"},"part3":{"title":"Niche Positioning","nicheStatement":"statement","whoTheyServe":"desc","whoTheyDoNotServe":"desc","uniqueMechanism":"method","competitorGap":"gap"},"part4":{"title":"Offer Suite","entryOffer":{"name":"n","description":"d","price":"$497","delivery":"del"},"coreOffer":{"name":"n","description":"d","price":"$5000","delivery":"del"},"premiumOffer":{"name":"n","description":"d","price":"$2500/mo","delivery":"del"},"ascensionLogic":"logic"},"part5":{"title":"Website Blueprint","heroHeadlines":["h1","h2","h3"],"heroSubheadline":"sub","heroCTA":"cta","sections":[{"name":"s","purpose":"p","content":"c"}],"testimonialFraming":"frame"},"part6":{"title":"Gap Analysis","credibilityGaps":["g1","g2","g3"],"marketingOpportunities":["o1","o2","o3"],"firstMove":"move"},"part7":{"title":"Headlines and Positioning Statements","heroHeadlineOptions":["1","2","3","4","5","6","7","8","9","10"],"taglineOptions":["1","2","3","4","5"],"positioningStatements":{"website":"w","social":"s","inPerson":"p"}},"part8":{"title":"Your Recommended Next Step","recommendation":"site_in_sixty","headline":"h","personalizedMessage":"msg","whyNow":"why","specificBenefit":"benefit"},"leadIntel":{"estimatedRevenue":"100K to 500K","industry":"Executive coaching","yearsInBusiness":"1 to 3","teamSize":"Solo","hasExistingBrand":false,"hasExistingWebsite":false,"hasInternalTeam":false,"brandMaturity":"Starting fresh","buyingTemperature":"Hot","biggestPainPoint":"pain","budgetSignals":"signal","bestFitService":"site_in_sixty","bestFitReason":"reason","notableQuotes":["q1","q2","q3"],"followUpAngle":"angle"}}}'
          }]
        })
      });

      const bpData = await bpRes.json();
      let bpText = bpData.content?.[0]?.text || '';
      try {
        const match = bpText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, bpText];
        const blueprint = JSON.parse(match[1]);
        session.blueprint = blueprint;
        session.blueprintGenerated = true;
        session.phase = 8;
        hasBlueprint = true;
        await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
      } catch (_) {
        // Blueprint generation failed, just create session without it
      }
    }

    // Save to KV
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });

    // Save to D1
    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO sessions (id, user_id, tier, phase, status, email, created_at, message_count) VALUES (?,?,?,?,?,?,?,?)')
      .bind(sessionId, user.id, tier || 'blueprint', hasBlueprint ? 8 : 1, hasBlueprint ? 'blueprint_complete' : 'active', email, now, 0).run();

    // Generate magic link
    const magicToken = generateMagicToken();
    await storeMagicToken(env, magicToken, user.id, 'magic_login', 72);
    const origin = env.APP_ORIGIN || 'https://love.jamesguldan.com';
    const magicLink = `${origin}/magic?token=${magicToken}`;

    return json({ ok: true, userId: user.id, sessionId, tier: tier || 'blueprint', hasBlueprint, magicLink });
  } catch (e) {
    return json({ error: 'Failed to create test session', detail: e.message }, 500);
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
    { name: 'deep_work_api',    url: 'https://love.jamesguldan.com/health' },
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
// ADMIN: TOKEN USAGE & COST TRACKING
// ════════════════════════════════════════════════════════

async function handleAdminUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30');
  const since = new Date(Date.now() - days * 86400000).toISOString();

  // All time totals
  const allTime = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cache_read_tokens) as cache_read, SUM(cache_write_tokens) as cache_write, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage`).first();

  // This month
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const monthly = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage WHERE created_at >= ?`).bind(monthStart.toISOString()).first();

  // Per model breakdown
  const byModel = await env.DB.prepare(`SELECT model, COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE created_at >= ? GROUP BY model`).bind(since).all();

  // Daily costs (last N days)
  const daily = await env.DB.prepare(`SELECT DATE(created_at) as day, SUM(cost_cents) as cost_cents, COUNT(*) as calls, SUM(input_tokens+output_tokens) as total_tokens FROM token_usage WHERE created_at >= ? GROUP BY DATE(created_at) ORDER BY day DESC`).bind(since).all();

  // Top users by cost
  const topUsers = await env.DB.prepare(`SELECT t.user_id, u.email, u.name, COUNT(*) as calls, SUM(t.input_tokens) as input, SUM(t.output_tokens) as output, SUM(t.cost_cents) as cost_cents, COUNT(DISTINCT t.session_id) as sessions, MAX(t.created_at) as last_active FROM token_usage t LEFT JOIN users u ON t.user_id = u.id WHERE t.user_id IS NOT NULL GROUP BY t.user_id ORDER BY cost_cents DESC LIMIT 25`).all();

  // Per user average
  const avgPerUser = allTime.users > 0 ? { avgCostCents: Math.round((allTime.cost_cents || 0) / allTime.users * 100) / 100, avgCalls: Math.round((allTime.calls || 0) / allTime.users), avgTokens: Math.round(((allTime.input||0) + (allTime.output||0)) / allTime.users) } : { avgCostCents: 0, avgCalls: 0, avgTokens: 0 };

  return json({
    allTime: { calls: allTime.calls, inputTokens: allTime.input, outputTokens: allTime.output, costCents: Math.round((allTime.cost_cents||0)*100)/100, costDollars: '$' + ((allTime.cost_cents||0)/100).toFixed(2), sessions: allTime.sessions, users: allTime.users },
    thisMonth: { calls: monthly.calls, costCents: Math.round((monthly.cost_cents||0)*100)/100, costDollars: '$' + ((monthly.cost_cents||0)/100).toFixed(2), sessions: monthly.sessions, users: monthly.users },
    avgPerUser,
    byModel: byModel.results,
    daily: daily.results,
    topUsers: topUsers.results
  });
}

async function handleAdminUserUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin) return json({ error: 'Forbidden' }, 403);
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const sessionId = url.searchParams.get('sessionId');

  if (userId) {
    const usage = await env.DB.prepare(`SELECT t.session_id, t.model, t.endpoint, t.input_tokens, t.output_tokens, t.cost_cents, t.phase, t.created_at FROM token_usage t WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 200`).bind(userId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, MIN(created_at) as first_use, MAX(created_at) as last_use FROM token_usage WHERE user_id = ?`).bind(userId).first();
    const user = await env.DB.prepare(`SELECT email, name, tier, created_at FROM users WHERE id = ?`).bind(userId).first();
    return json({ user, summary: { ...summary, costDollars: '$' + ((summary.cost_cents||0)/100).toFixed(2) }, calls: usage.results });
  }

  if (sessionId) {
    const usage = await env.DB.prepare(`SELECT model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at FROM token_usage WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE session_id = ?`).bind(sessionId).first();
    return json({ sessionId, summary: { ...summary, costDollars: '$' + ((summary.cost_cents||0)/100).toFixed(2) }, calls: usage.results });
  }

  return json({ error: 'Provide userId or sessionId query param' }, 400);
}

// ════════════════════════════════════════════════════════
// ADMIN: MANUAL TEST TRIGGER
// ════════════════════════════════════�