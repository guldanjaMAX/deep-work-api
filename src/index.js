// ============================================================
// DEEP WORK APP — CLOUDFLARE WORKER (deployed 2026-03-19T17:00)
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
import {
  DEEP_WORK_SYSTEM_PROMPT,
  SITE_GENERATION_PROMPT,
  imagePrompts,
  contextEnrichmentPrompt
} from './prompts.js';

// ── CORS HEADERS ─────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsHeaders(extra = {}) {
  return { ...CORS, ...extra };
}

// ── MAIN EXPORT ──────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    try {
      // ── Frontend ──────────────────────────────────────
      if (path === '/' || path === '') {
        const html = getHTML({
          STRIPE_PRICE_BLUEPRINT: 'price_1TCXL7FArNSFW9mB5DDauxQg',
          STRIPE_PRICE_CALL:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
          STRIPE_PRICE_SITE:      'price_1TCXL9FArNSFW9mBr189gJuC',
        });
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
      }

      // ── Payment success redirect ───────────────────────
      if (path === '/payment-success') {
        return handlePaymentSuccess(request, env, url);
      }

      // ── Buy redirect (creates checkout + redirects to Stripe) ─
      if (path.startsWith('/buy/') && request.method === 'GET') {
        const tier = path.split('/').pop();
        return handleBuyRedirect(request, env, tier);
      }

      // ── Magic link login ──────────────────────────────────
      if (path === '/magic' && request.method === 'GET') {
        return handleMagicLink(request, env, url);
      }

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
      if (path.startsWith('/api/session/') && request.method === 'GET') {
        return handleGetSession(request, env, path);
      }

      // ── Health check ──────────────────────────────────
      if (path === '/health') {
        return json({ ok: true, ts: Date.now() });
      }

      return new Response('Not found', { status: 404 });

    } catch (err) {
      console.error('Worker error:', err);
      return json({ error: 'Internal server error' }, 500);
    }
  }
};


// ════════════════════════════════════════════════════════
// PAYMENT
// ════════════════════════════════════════════════════════

async function handleCheckout(request, env) {
  const body = await request.json();
  const { tier } = body;

  const PRICE_MAP = {
    blueprint: 'price_1TCXL7FArNSFW9mB5DDauxQg',
    call:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
    site:      'price_1TCXL9FArNSFW9mBr189gJuC',
  };

  const priceId = PRICE_MAP[tier];
  if (!priceId) return json({ error: 'Invalid tier' }, 400);

  const origin = new URL(request.url).origin;
  const successUrl = `${origin}/payment-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/`;

  const res = await stripePost(env, '/v1/checkout/sessions', new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': successUrl,
    'cancel_url': cancelUrl,
    'metadata[tier]': tier,
  }));

  const session = await res.json();
  if (session.url) {
    return json({ url: session.url });
  }
  return json({ error: 'Failed to create checkout session', detail: session.error }, 500);
}

async function handlePaymentSuccess(request, env, url) {
  const checkoutSessionId = url.searchParams.get('session_id');
  const tier = url.searchParams.get('tier') || 'blueprint';

  if (!checkoutSessionId) {
    return Response.redirect(new URL('/').toString(), 302);
  }

  // Verify payment with Stripe and extract customer details
  let verified = false;
  let customerEmail = '';
  let customerName = '';
  try {
    const res = await stripeGet(env, `/v1/checkout/sessions/${checkoutSessionId}`);
    const stripeSession = await res.json();
    verified = stripeSession.payment_status === 'paid';
    customerEmail = stripeSession.customer_details?.email || '';
    customerName = stripeSession.customer_details?.name || '';
  } catch (e) {
    // If Stripe key not set yet, allow through for testing
    verified = true;
  }

  if (!verified) {
    return new Response('Payment not verified. Please contact support.', { status: 402 });
  }

  // Create a session ID for this user
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

  // Generate a magic link token (7-day expiry)
  const magicToken = `ml_${Date.now()}_${Math.random().toString(36).slice(2,12)}`;
  await env.SESSIONS.put(`magic:${magicToken}`, JSON.stringify({
    sessionId,
    email: customerEmail,
    createdAt: new Date().toISOString()
  }), { expirationTtl: 60 * 60 * 24 * 7 });

  // Store session in KV (with customer info + magic token)
  await env.SESSIONS.put(sessionId, JSON.stringify({
    id: sessionId,
    tier,
    stripeCheckoutId: checkoutSessionId,
    customerEmail,
    customerName,
    magicToken,
    phase: 1,
    messages: [],
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: new Date().toISOString()
  }), { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days

  // Send magic link email (fire and forget)
  const origin = new URL(request.url).origin;
  const magicUrl = `${origin}/magic?token=${magicToken}`;

  if (customerEmail) {
    sendDeepWorkEmail(customerEmail, customerName, magicUrl, tier, env)
      .catch(e => console.error('Email send error:', e));
  }

  // Log to D1
  await logEvent(env, sessionId, 'payment_success', {
    tier,
    email: customerEmail,
    stripeCheckoutId: checkoutSessionId
  });

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
// BUY REDIRECT + MAGIC LINKS
// ════════════════════════════════════════════════════════

async function handleBuyRedirect(request, env, tier) {
  const PRICE_MAP = {
    blueprint: 'price_1TCXL7FArNSFW9mB5DDauxQg',
    call:      'price_1TCXL8FArNSFW9mBBtiWVRCb',
    site:      'price_1TCXL9FArNSFW9mBr189gJuC',
  };

  const priceId = PRICE_MAP[tier];
  if (!priceId) return new Response('Invalid tier. Use: blueprint, call, or site', { status: 400 });

  const origin = new URL(request.url).origin;
  const successUrl = `${origin}/payment-success?tier=${tier}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = 'https://jamesguldan.com/deep-work/';

  const res = await stripePost(env, '/v1/checkout/sessions', new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': successUrl,
    'cancel_url': cancelUrl,
    'metadata[tier]': tier,
  }));

  const session = await res.json();
  if (session.url) {
    return Response.redirect(session.url, 302);
  }
  return new Response('Checkout creation failed. Please try again.', { status: 500 });
}

async function handleMagicLink(request, env, url) {
  const token = url.searchParams.get('token');
  if (!token) return new Response('Missing token', { status: 400 });

  const raw = await env.SESSIONS.get(`magic:${token}`);
  if (!raw) {
    return new Response(getMagicLinkExpiredHTML(), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }

  const { sessionId } = JSON.parse(raw);
  const origin = new URL(request.url).origin;
  return Response.redirect(`${origin}/?session=${sessionId}`, 302);
}

function getMagicLinkExpiredHTML() {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Link Expired | Deep Work</title>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#FDFCFA;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{text-align:center;max-width:440px}
h1{font-family:'Outfit',sans-serif;font-size:28px;margin-bottom:12px}
p{color:#666;line-height:1.6;margin-bottom:24px}
a{display:inline-block;background:#0d0c0b;color:#fff;padding:14px 32px;border-radius:8px;font-weight:500;text-decoration:none;transition:transform 0.15s ease}
a:hover{transform:translateY(-2px)}
</style></head><body>
<div class="card">
<h1>This link has expired</h1>
<p>Magic links are valid for 7 days. You can request a new one by signing in with your email, or start a new session.</p>
<a href="/">Go to Deep Work App</a>
</div></body></html>`;
}

async function sendDeepWorkEmail(email, name, magicUrl, tier, env) {
  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set — skipping welcome email');
    return;
  }

  const firstName = (name || 'there').split(' ')[0];

  const emailHtml = `<!DOCTYPE html>
<html><head><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;color:#1a1a1a;max-width:560px;margin:0 auto;padding:40px 20px;background:#FDFCFA}
h1{font-size:28px;font-weight:700;margin-bottom:8px}
.accent{color:#c4703f}
.card{background:#fff;border:1px solid #EAE7E2;border-radius:12px;padding:24px;margin:24px 0}
.btn{display:inline-block;background:#0d0c0b;color:#fff !important;padding:16px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px}
.steps{margin:0;padding:0;list-style:none;counter-reset:step}
.steps li{counter-increment:step;padding:8px 0 8px 32px;position:relative}
.steps li::before{content:counter(step);position:absolute;left:0;top:8px;background:#c4703f;color:#fff;width:22px;height:22px;border-radius:50%;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center}
.footer{margin-top:40px;padding-top:20px;border-top:1px solid #EAE7E2;color:#999;font-size:13px}
a{color:#c4703f}
</style></head><body>

<h1>You're in, ${firstName}.</h1>
<p>Your Deep Work Process is ready and waiting. This is the link you will use to pick up your session anytime.</p>

<div style="text-align:center;margin:32px 0">
<a href="${magicUrl}" class="btn">Open Your Session &rarr;</a>
</div>

<div class="card">
<p style="font-weight:600;margin-bottom:12px">Here is how it works:</p>
<ol class="steps">
<li>Click the button above to open your session</li>
<li>Fill in a few details about your business (2 min)</li>
<li>Have an honest conversation with your AI strategist</li>
<li>Walk away with a complete brand blueprint</li>
</ol>
</div>

<p>Block two uninterrupted hours. Close your other tabs. Put your phone face down. The more present you are, the more powerful the output becomes.</p>

<p style="margin-top:24px">Bookmark <a href="${magicUrl}">this link</a> — it is your personal access to this session for the next 7 days.</p>

<p style="margin-top:24px">Questions? Just reply to this email.<br>
<strong>James</strong></p>

<div class="footer">
<p>James Guldan | <a href="https://jamesguldan.com" style="color:#999">jamesguldan.com</a></p>
</div>

</body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'James Guldan <james@jamesguldan.com>',
        to: [email],
        subject: "Your Deep Work Session is Ready",
        html: emailHtml,
      }),
    });
    const result = await res.json();
    if (!res.ok) console.error('Resend error:', result);
    return result;
  } catch (e) {
    console.error('Email send failed:', e);
  }
}


// ════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ════════════════════════════════════════════════════════

async function handleSessionStart(request, env) {
  const body = await request.json();
  const { sessionId, tier, existingWebsiteUrl, linkedinUrl, competitorUrls, testimonials, uploadedKeys } = body;

  // Validate session exists
  const sessionRaw = await env.SESSIONS.get(sessionId);
  if (!sessionRaw) {
    // For dev/testing: create a session if it doesn't exist
    const newSession = {
      id: sessionId || `sess_dev_${Date.now()}`,
      tier: tier || 'blueprint',
      phase: 1,
      messages: [],
      userData: {},
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: new Date().toISOString()
    };
    await env.SESSIONS.put(newSession.id, JSON.stringify(newSession), { expirationTtl: 60 * 60 * 24 * 30 });
  }

  const session = JSON.parse(sessionRaw || '{}') || {
    id: sessionId,
    tier,
    phase: 1,
    messages: [],
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: new Date().toISOString()
  };

  // Enrich with intake data
  session.userData = {
    existingWebsiteUrl: existingWebsiteUrl || '',
    linkedinUrl: linkedinUrl || '',
    competitorUrls: competitorUrls || [],
    testimonials: testimonials || '',
    uploadedKeys: uploadedKeys || [],
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


// ════════════════════════════════════════════════════════
// CHAT (STREAMING)
// ════════════════════════════════════════════════════════

async function handleChat(request, env) {
  const body = await request.json();
  const { sessionId, message } = body;

  const raw = await env.SESSIONS.get(sessionId);
  if (!raw) return json({ error: 'Session not found' }, 404);
  const session = JSON.parse(raw);

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

      if (!res.ok) {
        const errText = await res.text();
        await sendEvent({ type: 'error', message: 'Claude API error: ' + errText });
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
      await updateSessionPhaseInD1(env, sessionId, session.phase, session.messages.length);
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

  // Build the site generation prompt
  const prompt = SITE_GENERATION_PROMPT(session.blueprint.blueprint);

  // Call Claude for site generation (not streaming, single call)
  const siteHtml = await callClaude(env, prompt, [
    { role: 'user', content: 'Generate the complete website HTML now.' }
  ], false, 4096);

  // Extract just the HTML
  const htmlMatch = siteHtml.match(/<!DOCTYPE html>[\s\S]*/i);
  const cleanHtml = htmlMatch ? htmlMatch[0] : siteHtml;

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
    await env.DB.prepare(`
      INSERT OR IGNORE INTO sessions
      (id, tier, phase, created_at, message_count, satisfaction_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      session.id,
      session.tier,
      session.phase,
      session.createdAt,
      0,
      null
    ).run();
  } catch (e) {
    console.error('D1 session init error:', e);
  }
}

async function updateSessionPhaseInD1(env, sessionId, phase, messageCount) {
  try {
    await env.DB.prepare(`
      UPDATE sessions SET phase = ?, message_count = ?, updated_at = ?
      WHERE id = ?
    `).bind(phase, messageCount, new Date().toISOString(), sessionId).run();
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
