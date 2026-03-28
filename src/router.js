// src/router.js
// Route dispatch table

import { getCORSHeaders, htmlHeaders, json } from './utils/helpers.js';
import { logError, createAlert, getErrorPageHTML, ERROR_PAGES } from './monitor.js';

// Pages
import {
  handleRoot, handleApp, handleAdmin, handleLogout,
  handlePrivacy, handleTerms, handleLegalTerms, handleLegalPrivacy, handleHealth
} from './routes/pages.js';

// Auth
import {
  handleAuthLogin, handleAuthRegister, handleAuthMagic, handleRequestMagic,
  handleAuthMe, handleFastResume, handleSetPassword, handleMagicLink, handlePaymentSuccess
} from './routes/auth.js';

// Session
import {
  handleSessionStart, handleSessionClaim, handleSessionResume, handleSessionRestart,
  handleGetSession, handleUserActiveSession
} from './routes/session.js';

// Interview
import { handleChat, handleIntakeChat, handleTestBlueprint } from './routes/interview.js';

// Upload
import {
  handleUpload, handlePhotoProcess, handleGenerateImages,
  handleGenerateSectionImage, handleGenerateSectionVariants
} from './routes/upload.js';

// Site
import {
  handleGenerateSite, handleSaveSectionChoices, handleDeployPickerSite,
  handleDeploy, handleRefineSite, handleExport, handleExportSite, handleServeSite
} from './routes/site.js';

// Payment
import {
  handleCreatePaymentIntent, handleFulfillPayment, handlePaymentStatus,
  handleCheckout, handleWebhook
} from './routes/payment.js';

// Blueprint
import { handleBlueprintPDF } from './routes/blueprint.js';
  import { handleBlueprintRender } from './html/blueprint-render.js';

// Feedback
import { handleFeedback, handleLogEvent } from './routes/feedback.js';

// Admin
import {
  handleAdminStats, handleAdminListUsers, handleAdminCreateUser,
  handleAdminListSessions, handleAdminGetSession, handleAdminMagicLink,
  handleAdminInjectDebrief, handleAdminGenerateDebrief, handleAdminTestBlueprint,
  handleAdminQuickTestSession, handleAdminGetSettings, handleAdminSaveSettings,
  handleAdminGetPrompt, handleAdminSavePrompt, handleHealthCheck, handleMonitoring,
  handleDigest, handleAdminErrors, handleAPIUsage, handleResolveAlert,
  handleAdminTestTrigger, handleSystemHealthCheck, handleAdminUsage,
  handleAdminUserUsage, handleAdminPurgeKV
} from './routes/admin.js';

import { CORS } from './utils/internal.js';

export async function routeRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCORSHeaders(request) });
  }

  try {
    // Static pages
    if (path === '/' || path === '') return handleRoot(request, env);
    if (path === '/app') return handleApp(request, env);
    if (path === '/admin') return handleAdmin(request, env);
    if (path === '/logout') return handleLogout(request, env);
    if (path === '/privacy') return handlePrivacy(request, env);
    if (path === '/terms') return handleTerms(request, env);
    if (path === '/legal/terms') return handleLegalTerms(request, env);
    if (path === '/legal/privacy') return handleLegalPrivacy(request, env);
    if (path === '/health') return handleHealth(request, env);

    // Site serving (public)
    if (path.startsWith('/s/')) return handleServeSite(path, env);

    // Auth
    if (path === '/magic') return handleMagicLink(request, env, url);
    if (path === '/payment-success') return handlePaymentSuccess(request, env, url);
    if (path === '/api/auth/login' && request.method === 'POST') return handleAuthLogin(request, env);
    if (path === '/api/auth/register' && request.method === 'POST') return handleAuthRegister(request, env);
    if (path === '/api/auth/magic' && request.method === 'POST') return handleAuthMagic(request, env);
    if (path === '/api/auth/request-magic' && request.method === 'POST') return handleRequestMagic(request, env);
    if (path === '/api/auth/me' && request.method === 'GET') return handleAuthMe(request, env);
    if (path === '/api/auth/fast-resume' && request.method === 'GET') return handleFastResume(request, env);
    if (path === '/api/auth/set-password' && request.method === 'POST') return handleSetPassword(request, env);

    // Session
    if (path === '/api/session/start' && request.method === 'POST') return handleSessionStart(request, env);
    if (path === '/api/session/claim' && request.method === 'POST') return handleSessionClaim(request, env);
    if (path === '/api/session/resume' && request.method === 'POST') return handleSessionResume(request, env);
    if (path === '/api/session/restart' && request.method === 'POST') return handleSessionRestart(request, env);
    if (path === '/api/user/active-session' && request.method === 'GET') return handleUserActiveSession(request, env);
    if (path.startsWith('/api/session/') && request.method === 'GET') return handleGetSession(request, env, path);

    // Phone update (inline — no dedicated handler)
    if (path.match(/^\/api\/sessions\/[^/]+\/phone$/) && request.method === 'POST') {
      const sessionId = path.split('/')[3];
      const body = await request.json();
      const phone = (body.phone || '').replace(/[^0-9+]/g, '');
      if (phone.length >= 10) {
        await env.DB.prepare('UPDATE sessions SET phone = ? WHERE id = ?').bind(phone, sessionId).run();
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    // Chat / Interview
    if (path === '/api/chat' && request.method === 'POST') return handleChat(request, env);
    if (path === '/api/intake/chat' && request.method === 'POST') return handleIntakeChat(request, env);
    if (path === '/api/test/blueprint' && request.method === 'POST') return handleTestBlueprint(request, env);

    // Upload / Images
    if (path === '/api/upload' && request.method === 'POST') return handleUpload(request, env);
    if (path === '/api/photo/process' && request.method === 'POST') return handlePhotoProcess(request, env);
    if (path === '/api/generate/images' && request.method === 'POST') return handleGenerateImages(request, env);
    if (path === '/api/generate/section-image' && request.method === 'POST') return handleGenerateSectionImage(request, env);
    if (path === '/api/generate/section-variants' && request.method === 'POST') return handleGenerateSectionVariants(request, env);

    // Section image serve (inline — R2 proxy)
    if (path === '/api/section-image' && request.method === 'GET') {
      const siSid = url.searchParams.get('sessionId');
      const siIdx = url.searchParams.get('idx');
      if (!siSid || siIdx === null) return new Response('Missing params', { status: 400 });
      const siKey = `sessions/${siSid}/picker-images/section_${siIdx}.png`;
      try {
        const siObj = await env.UPLOADS.get(siKey);
        if (!siObj) return new Response('Not found', { status: 404 });
        const siBytes = await siObj.arrayBuffer();
        return new Response(siBytes, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } });
      } catch (_) {
        return new Response('Error', { status: 500 });
      }
    }

    // Site generation
    if (path === '/api/generate/site' && request.method === 'POST') return handleGenerateSite(request, env);
    if (path === '/api/generate/save-section-choices' && request.method === 'POST') return handleSaveSectionChoices(request, env);
    if (path === '/api/generate/deploy-picker-site' && request.method === 'POST') return handleDeployPickerSite(request, env);
    if (path === '/api/deploy' && request.method === 'POST') return handleDeploy(request, env);
    if (path === '/api/refine-site' && request.method === 'POST') return handleRefineSite(request, env);
    if (path === '/api/export' && request.method === 'POST') return handleExport(request, env);
    if (path === '/api/export-site' && request.method === 'GET') return handleExportSite(request, env);

    // Blueprint
    if (path === '/api/blueprint/pdf' && request.method === 'POST') return handleBlueprintPDF(request, env);
  if (path === '/api/blueprint/render' && request.method === 'POST') return handleBlueprintRender(request, env);

    // Feedback
    if (path === '/api/feedback' && request.method === 'POST') return handleFeedback(request, env);
    if (path === '/api/log-event' && request.method === 'POST') return handleLogEvent(request, env);

    // Payment
    if (path === '/api/create-payment-intent' && request.method === 'POST') return handleCreatePaymentIntent(request, env);
    if (path === '/api/fulfill-payment' && request.method === 'POST') return handleFulfillPayment(request, env);
    if (path === '/api/payment-status' && request.method === 'GET') return handlePaymentStatus(request, env, url);
    if (path === '/api/checkout' && request.method === 'POST') return handleCheckout(request, env);
    if (path === '/api/webhook' && request.method === 'POST') return handleWebhook(request, env);

    // Admin
    if (path === '/api/admin/stats' && request.method === 'GET') return handleAdminStats(request, env);
    if (path === '/api/admin/users' && request.method === 'GET') return handleAdminListUsers(request, env);
    if (path === '/api/admin/users' && request.method === 'POST') return handleAdminCreateUser(request, env);
    if (path === '/api/admin/sessions' && request.method === 'GET') return handleAdminListSessions(request, env);
    if (path.startsWith('/api/admin/session/') && request.method === 'GET') return handleAdminGetSession(request, env, path);
    if (path === '/api/admin/magic-link' && request.method === 'POST') return handleAdminMagicLink(request, env);
    if (path === '/api/admin/settings' && request.method === 'GET') return handleAdminGetSettings(request, env);
    if (path === '/api/admin/settings' && request.method === 'POST') return handleAdminSaveSettings(request, env);
    if (path === '/api/admin/prompt' && request.method === 'GET') return handleAdminGetPrompt(request, env);
    if (path === '/api/admin/prompt' && request.method === 'POST') return handleAdminSavePrompt(request, env);
    if (path === '/api/admin/generate-debrief' && request.method === 'POST') return handleAdminGenerateDebrief(request, env);
    if (path === '/api/admin/inject-debrief' && request.method === 'POST') return handleAdminInjectDebrief(request, env);
    if (path === '/api/admin/generate-test-blueprint' && request.method === 'POST') return handleAdminTestBlueprint(request, env);
    if (path === '/api/admin/quick-test-session' && request.method === 'POST') return handleAdminQuickTestSession(request, env);
    if (path === '/api/admin/health' && request.method === 'GET') return handleHealthCheck(request, env);
    if (path === '/api/admin/monitoring' && request.method === 'GET') return handleMonitoring(request, env);
    if (path === '/api/admin/digest' && request.method === 'POST') return handleDigest(request, env);
    if (path === '/api/admin/errors' && request.method === 'GET') return handleAdminErrors(request, env);
    if (path === '/api/admin/api-usage' && request.method === 'GET') return handleAPIUsage(request, env);
    if (path === '/api/admin/resolve-alert' && request.method === 'POST') return handleResolveAlert(request, env);
    if (path === '/api/admin/test-trigger' && request.method === 'POST') return handleAdminTestTrigger(request, env);
    if (path === '/api/admin/system-health' && request.method === 'GET') return handleSystemHealthCheck(request, env);
    if (path === '/api/admin/usage' && request.method === 'GET') return handleAdminUsage(request, env);
    if (path === '/api/admin/usage/user' && request.method === 'GET') return handleAdminUserUsage(request, env);
    if (path === '/api/admin/purge-kv' && request.method === 'POST') return handleAdminPurgeKV(request, env);

    // 404
    return new Response(getErrorPageHTML(404, 'Page Not Found', ERROR_PAGES[404].message), {
      status: 404,
      headers: htmlHeaders()
    });

  } catch (err) {
    console.error('Worker error:', err);
    const reqId = crypto.randomUUID().slice(0, 8);
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
    } catch (_) {}
    if (path.startsWith('/api/')) {
      return json({ error: 'Something went wrong', requestId: reqId }, 500);
    }
    return new Response(
      getErrorPageHTML(500, 'Something Went Wrong', ERROR_PAGES[500].message + `<br><span style="font-size:12px;color:#ccc;margin-top:8px;display:inline-block;">Ref: ${reqId}</span>`),
      { status: 500, headers: htmlHeaders() }
    );
  }
}
