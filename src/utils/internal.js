// internal.js — Server-side helper functions extracted from index.js
// These are pure ES module exports, no __name() wrappers, no @__PURE__ annotations.

import { getCORSHeaders } from './helpers.js';
import { logError, trackFunnelEvent } from '../monitor.js';
import { getUserById, getUserByEmail, createUser } from '../auth.js';
import { esc } from '../html/brand-guide.js';
export { STRATEGIST_DEBRIEF_PROMPT, DEEP_WORK_SYSTEM_PROMPT } from '../prompts.js';

export const CORS = getCORSHeaders(null);

// ---------------------------------------------------------------------------
// Model constants
// ---------------------------------------------------------------------------

export const MODEL_OPUS = 'claude-opus-4-6';
export const MODEL_SONNET = 'claude-sonnet-4-6';
export const OPUS_MESSAGE_THRESHOLD = 16;

export const MODEL_COSTS = {
  [MODEL_OPUS]: { input: 1500, output: 7500, cacheRead: 150, cacheWrite: 1875 },
  [MODEL_SONNET]: { input: 300, output: 1500, cacheRead: 30, cacheWrite: 375 },
  'claude-haiku-4-5-20251001': { input: 80, output: 400, cacheRead: 8, cacheWrite: 100 }
};

// ---------------------------------------------------------------------------
// Model helpers
// ---------------------------------------------------------------------------

export function pickChatModel(session) {
  const msgCount = (session.messages || []).length;
  if (msgCount <= OPUS_MESSAGE_THRESHOLD)
    return MODEL_OPUS;
  const currentPhase = session.phase || 1;
  const lastOpusPhase = session.lastPhaseOpusUsed || 1;
  if (currentPhase > lastOpusPhase)
    return MODEL_OPUS;
  return MODEL_SONNET;
}

export function calcCostCents(model, inputTokens, outputTokens, cacheRead, cacheWrite) {
  const r = MODEL_COSTS[model] || MODEL_COSTS[MODEL_SONNET];
  return (inputTokens * r.input + outputTokens * r.output + (cacheRead || 0) * r.cacheRead + (cacheWrite || 0) * r.cacheWrite) / 1e6;
}

// ---------------------------------------------------------------------------
// Token usage tracking
// ---------------------------------------------------------------------------

export async function trackTokenUsage(env, { sessionId, userId, model, endpoint, inputTokens, outputTokens, cacheRead, cacheWrite, phase }) {
  try {
    const cost = calcCostCents(model, inputTokens || 0, outputTokens || 0, cacheRead || 0, cacheWrite || 0);
    await env.DB.prepare(`INSERT INTO token_usage (session_id, user_id, model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(sessionId || 'unknown', userId || null, model, endpoint, inputTokens || 0, outputTokens || 0, cacheRead || 0, cacheWrite || 0, Math.round(cost * 100) / 100, phase || null).run();
  } catch (e) {
  }
}

// ---------------------------------------------------------------------------
// Strategist debrief generation
// ---------------------------------------------------------------------------

export async function generateStrategistDebrief(env, session, blueprint, sessionId) {
  try {
    const interviewMessages = (session.messages || []).filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => {
      const clean = m.content.replace(/METADATA:\{[^\n]*\}/g, '').replace(/```json[\s\S]*?```/g, '').trim();
      return { role: m.role, content: clean.slice(0, 800) };
    }).slice(-30);
    const bpSummary = blueprint?.blueprint || {};
    const userContext = `
## Blueprint Summary
Name: ${bpSummary.name || 'Unknown'}
Brand Promise: ${bpSummary.part1?.coreBrandPromise || 'N/A'}
Ideal Client: ${bpSummary.part2?.name || 'N/A'} \u2014 ${bpSummary.part2?.lifeSituation || ''}
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

// ---------------------------------------------------------------------------
// JWT + Auth helpers
// ---------------------------------------------------------------------------

export function getJWTSecret(env) {
  if (!env.JWT_SECRET)
    throw new Error('JWT_SECRET environment variable is required');
  return env.JWT_SECRET;
}

export async function isRateLimited(env, userId, sessionId) {
  const key = `rl:${userId || sessionId}`;
  const windowMs = 60 * 60 * 1e3;
  const maxRequests = 60;
  try {
    const raw = await env.SESSIONS.get(key);
    const now = Date.now();
    const record = raw ? JSON.parse(raw) : { count: 0, windowStart: now };
    if (now - record.windowStart > windowMs) {
      await env.SESSIONS.put(key, JSON.stringify({ count: 1, windowStart: now }), { expirationTtl: 3600 });
      return false;
    }
    if (record.count >= maxRequests)
      return true;
    record.count += 1;
    await env.SESSIONS.put(key, JSON.stringify(record), { expirationTtl: 3600 });
    return false;
  } catch (_) {
    return false;
  }
}

export async function authRateLimit(env, identifier) {
  const key = `auth_rl:${identifier.toLowerCase().trim().substring(0, 100)}`;
  const windowMs = 15 * 60 * 1e3;
  const maxAttempts = 5;
  try {
    const raw = await env.SESSIONS.get(key);
    const now = Date.now();
    const rec = raw ? JSON.parse(raw) : { count: 0, windowStart: now };
    if (now - rec.windowStart > windowMs) {
      await env.SESSIONS.put(key, JSON.stringify({ count: 1, windowStart: now }), { expirationTtl: 900 });
      return false;
    }
    if (rec.count >= maxAttempts)
      return true;
    rec.count += 1;
    await env.SESSIONS.put(key, JSON.stringify(rec), { expirationTtl: 900 });
    return false;
  } catch (_) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Stripe helpers
// ---------------------------------------------------------------------------

export function getStripeKeys(request, env) {
  const isTest = env.STRIPE_MODE === 'test' || env.ENVIRONMENT === 'development';
  return {
    secretKey: isTest ? env.STRIPE_TEST_SECRET_KEY || env.STRIPE_SECRET_KEY : env.STRIPE_SECRET_KEY,
    publishableKey: isTest ? env.STRIPE_TEST_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY : env.STRIPE_PUBLISHABLE_KEY,
    testMode: isTest
  };
}

export async function stripePost(env, path, params, extraHeaders = {}) {
  return fetch(`https://api.stripe.com${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...extraHeaders
    },
    body: params.toString()
  });
}

export async function stripeGet(env, path) {
  return fetch(`https://api.stripe.com${path}`, {
    headers: { 'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}` }
  });
}

// ---------------------------------------------------------------------------
// Session access token
// ---------------------------------------------------------------------------

export async function generateSessionAccessToken(env, sessionId) {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(24))).map((b) => b.toString(16).padStart(2, '0')).join('');
  await env.SESSIONS.put(`session_access:${token}`, JSON.stringify({ sessionId, createdAt: Date.now() }), { expirationTtl: 60 * 60 * 4 });
  return token;
}

// ---------------------------------------------------------------------------
// Blueprint validation and auto-repair
// ---------------------------------------------------------------------------

export function validateBlueprint(blueprint) {
  const issues = [];
  const warnings = [];
  const bp = blueprint?.blueprint || blueprint || {};
  if (!bp.name || bp.name.trim().length < 2)
    issues.push({ id: 'NO_NAME', msg: 'Blueprint missing client name', severity: 'major' });
  if (!bp.part1)
    issues.push({ id: 'NO_PART1', msg: 'Missing Part 1 (Brand Foundation)', severity: 'critical' });
  if (!bp.part2)
    issues.push({ id: 'NO_PART2', msg: 'Missing Part 2 (Ideal Customer Avatar)', severity: 'major' });
  if (!bp.part3)
    issues.push({ id: 'NO_PART3', msg: 'Missing Part 3 (Niche Positioning)', severity: 'major' });
  if (!bp.part4)
    issues.push({ id: 'NO_PART4', msg: 'Missing Part 4 (Offer Suite)', severity: 'critical' });
  if (!bp.part5)
    issues.push({ id: 'NO_PART5', msg: 'Missing Part 5 (Website Blueprint)', severity: 'critical' });
  if (!bp.part7)
    warnings.push({ id: 'NO_PART7', msg: 'Missing Part 7 (Headlines)', severity: 'minor' });
  if (!bp.part8)
    warnings.push({ id: 'NO_PART8', msg: 'Missing Part 8 (Next Step)', severity: 'minor' });
  const p1 = bp.part1 || {};
  if (!p1.brandNames || !p1.brandNames.length || !p1.brandNames[0])
    issues.push({ id: 'NO_BRAND_NAME', msg: 'No brand name provided in part1.brandNames', severity: 'critical' });
  const colors = p1.visualDirection?.colors || [];
  if (colors.length < 3)
    issues.push({ id: 'FEW_COLORS', msg: 'Only ' + colors.length + ' colors defined (minimum 3: primary, secondary, accent)', severity: 'major' });
  colors.forEach((c, i) => {
    if (!c.hex || !/^#[0-9A-Fa-f]{6}$/.test(c.hex))
      issues.push({ id: 'BAD_COLOR_' + i, msg: 'Color ' + (i + 1) + ' (' + (c.name || 'unnamed') + ') has invalid hex: ' + (c.hex || 'missing'), severity: 'major' });
  });
  if (!p1.visualDirection?.fonts)
    warnings.push({ id: 'NO_FONTS', msg: 'No font definitions in visualDirection', severity: 'minor' });
  if (!p1.coreBrandPromise || p1.coreBrandPromise.length < 10)
    warnings.push({ id: 'WEAK_PROMISE', msg: 'Brand promise is missing or very short', severity: 'minor' });
  const p2 = bp.part2 || {};
  if (!p2.name || p2.name.length < 2)
    warnings.push({ id: 'NO_AVATAR_NAME', msg: 'Ideal client avatar has no name', severity: 'minor' });
  const p3 = bp.part3 || {};
  if (!p3.nicheStatement || p3.nicheStatement.length < 10)
    issues.push({ id: 'NO_NICHE', msg: 'Niche statement is missing or too short', severity: 'major' });
  const p4 = bp.part4 || {};
  const offerSlots = ['entryOffer', 'coreOffer', 'premiumOffer'];
  let validOffers = 0;
  offerSlots.forEach((slot) => {
    const o = p4[slot];
    if (o && o.name && o.name.length > 2) {
      validOffers++;
      if (!o.price || o.price.length < 1)
        warnings.push({ id: 'NO_PRICE_' + slot, msg: slot + ' (' + o.name + ') has no price', severity: 'minor' });
    }
  });
  if (validOffers === 0)
    issues.push({ id: 'NO_OFFERS', msg: 'No valid offers defined (need at least one with a name)', severity: 'critical' });
  const p5 = bp.part5 || {};
  const heroHeadlines = p5.heroHeadlines || [];
  if (heroHeadlines.length === 0 || !heroHeadlines[0] || heroHeadlines[0].length < 5) {
    issues.push({ id: 'NO_HERO_HEADLINES', msg: 'No hero headlines defined or first headline too short', severity: 'critical' });
  }
  if (!p5.heroSubheadline || p5.heroSubheadline.length < 10)
    warnings.push({ id: 'WEAK_HERO_SUB', msg: 'Hero subheadline missing or too short', severity: 'minor' });
  if (!p5.heroCTA || p5.heroCTA.length < 3)
    issues.push({ id: 'NO_HERO_CTA', msg: 'Hero CTA button text missing', severity: 'major' });
  const sections = p5.sections || [];
  if (sections.length < 3)
    issues.push({ id: 'FEW_SECTIONS', msg: 'Only ' + sections.length + ' website sections defined (minimum 3)', severity: 'critical' });
  if (sections.length > 12)
    warnings.push({ id: 'MANY_SECTIONS', msg: sections.length + ' sections defined, may produce a very long page', severity: 'minor' });
  const sectionNames = new Set();
  sections.forEach((s, i) => {
    if (!s.name || s.name.length < 2)
      issues.push({ id: 'EMPTY_SECTION_NAME_' + i, msg: 'Section ' + (i + 1) + ' has no name', severity: 'major' });
    if (!s.purpose || s.purpose.length < 5)
      issues.push({ id: 'EMPTY_SECTION_PURPOSE_' + i, msg: 'Section ' + (i + 1) + ' (' + (s.name || '?') + ') has no purpose', severity: 'major' });
    if (!s.content || s.content.length < 5)
      warnings.push({ id: 'EMPTY_SECTION_CONTENT_' + i, msg: 'Section ' + (i + 1) + ' (' + (s.name || '?') + ') has empty or very short content guidance', severity: 'minor' });
    if (s.name && sectionNames.has(s.name.toLowerCase()))
      warnings.push({ id: 'DUP_SECTION_' + i, msg: 'Duplicate section name: ' + s.name, severity: 'minor' });
    if (s.name)
      sectionNames.add(s.name.toLowerCase());
  });
  const sectionNamesLower = sections.map((s) => (s.name || '').toLowerCase());
  const hasOfferSection = sectionNamesLower.some((n) => n.includes('offer') || n.includes('pricing') || n.includes('package') || n.includes('service') || n.includes('work with'));
  const hasAboutSection = sectionNamesLower.some((n) => n.includes('about') || n.includes('story') || n.includes('who') || n.includes('meet'));
  if (!hasOfferSection)
    warnings.push({ id: 'NO_OFFER_SECTION', msg: 'No offers/pricing section found in website sections', severity: 'minor' });
  if (!hasAboutSection)
    warnings.push({ id: 'NO_ABOUT_SECTION', msg: 'No about/story section found in website sections', severity: 'minor' });
  if (!p5.pageNarrative)
    warnings.push({ id: 'NO_PAGE_NARRATIVE', msg: 'No page narrative / story arc defined for cohesive flow', severity: 'minor' });
  if (!p5.heroImageTheme)
    warnings.push({ id: 'NO_HERO_IMAGE_THEME', msg: 'No hero image theme defined', severity: 'minor' });
  const sectionsWithRationale = sections.filter((s) => s.rationale && s.rationale.length > 10).length;
  const sectionsWithConfidence = sections.filter((s) => typeof s.confidence === 'number').length;
  if (sections.length > 0 && sectionsWithRationale === 0)
    warnings.push({ id: 'NO_SECTION_RATIONALE', msg: 'No sections have rationale explaining why they exist', severity: 'minor' });
  if (sections.length > 0 && sectionsWithConfidence === 0)
    warnings.push({ id: 'NO_SECTION_CONFIDENCE', msg: 'No sections have confidence scores', severity: 'minor' });
  const p7 = bp.part7 || {};
  if (!p7.heroHeadlineOptions || p7.heroHeadlineOptions.length < 3)
    warnings.push({ id: 'FEW_HEADLINES', msg: 'Fewer than 3 headline options in part7', severity: 'minor' });
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const majorCount = issues.filter((i) => i.severity === 'major').length;
  const passed = criticalCount === 0 && majorCount <= 2;
  return {
    passed,
    score: Math.max(0, 100 - criticalCount * 25 - majorCount * 10 - warnings.length * 3),
    issues,
    warnings,
    summary: passed ? 'PASS' : criticalCount > 0 ? 'FAIL_CRITICAL' : 'FAIL_MAJOR'
  };
}

export function autoRepairBlueprint(blueprint) {
  const bp = blueprint?.blueprint || blueprint || {};
  const repairs = [];
  if (!blueprint.blueprint && bp.part1) {
    blueprint = { blueprint: bp };
    repairs.push('Wrapped raw blueprint in { blueprint: ... } envelope');
  }
  const b = blueprint.blueprint || blueprint;
  if (!b.part1)
    b.part1 = { title: 'Brand Foundation' };
  if (!b.part1.brandNames || !b.part1.brandNames.length || !b.part1.brandNames[0]) {
    const fallbackName = b.name || 'My Brand';
    b.part1.brandNames = [fallbackName];
    repairs.push('Set brand name to "' + fallbackName + '" from blueprint name');
  }
  if (!b.part1.visualDirection)
    b.part1.visualDirection = {};
  const colors = b.part1.visualDirection.colors || [];
  if (colors.length < 5) {
    const defaults = [
      { name: 'Primary', hex: '#1C2B3A' },
      { name: 'Secondary', hex: '#C4703F' },
      { name: 'Accent', hex: '#E8C97A' },
      { name: 'Background', hex: '#F7F5F0' },
      { name: 'Text', hex: '#1A1A1A' }
    ];
    for (let i = colors.length; i < 5; i++) {
      colors.push(defaults[i]);
    }
    b.part1.visualDirection.colors = colors;
    repairs.push('Filled missing colors to reach 5 (had ' + (colors.length - (5 - colors.length)) + ')');
  }
  b.part1.visualDirection.colors.forEach((c, i) => {
    if (!c.hex || !/^#[0-9A-Fa-f]{6}$/.test(c.hex)) {
      const fallbacks = ['#1C2B3A', '#C4703F', '#E8C97A', '#F7F5F0', '#1A1A1A'];
      c.hex = fallbacks[i] || '#1C2B3A';
      repairs.push('Fixed invalid hex for color ' + (i + 1) + ' (' + (c.name || 'unnamed') + ')');
    }
  });
  if (!b.part1.visualDirection.fonts) {
    b.part1.visualDirection.fonts = { heading: 'Playfair Display', body: 'Inter' };
    repairs.push('Set default fonts (Playfair Display / Inter)');
  }
  if (!b.part5)
    b.part5 = { title: 'Website Blueprint' };
  const p5 = b.part5;
  if (!p5.heroHeadlines || !p5.heroHeadlines.length) {
    const p7headlines = (b.part7?.heroHeadlineOptions || []).slice(0, 3);
    if (p7headlines.length) {
      p5.heroHeadlines = p7headlines;
      repairs.push('Copied hero headlines from part7.heroHeadlineOptions');
    } else {
      p5.heroHeadlines = [b.part1?.coreBrandPromise || b.part3?.nicheStatement || 'Transform Your Business Today'];
      repairs.push('Generated fallback hero headline from brand promise or niche');
    }
  }
  if (!p5.heroCTA || p5.heroCTA.length < 3) {
    p5.heroCTA = 'Get Started';
    repairs.push('Set default hero CTA: "Get Started"');
  }
  if (!p5.heroSubheadline || p5.heroSubheadline.length < 5) {
    p5.heroSubheadline = b.part3?.nicheStatement || b.part1?.coreBrandPromise || 'Discover how we can help you achieve your goals.';
    repairs.push('Set hero subheadline from niche statement or brand promise');
  }
  if (!p5.sections)
    p5.sections = [];
  if (p5.sections.length < 3) {
    const defaultSections = [
      { name: 'The Problem', purpose: 'Name the pain your ideal client feels', content: 'Describe the struggles and frustrations your audience faces.' },
      { name: 'The Solution', purpose: 'Introduce your unique method', content: 'Show how your approach solves their problem differently.' },
      { name: 'How It Works', purpose: 'Walk through the process', content: 'Break down the steps so it feels achievable.' },
      { name: 'Offers', purpose: 'Present your packages', content: 'Show your entry, core, and premium offers with clear pricing.' },
      { name: 'About', purpose: 'Build trust and connection', content: 'Share your story and why you do this work.' },
      { name: 'Testimonials', purpose: 'Provide social proof', content: 'Let past clients speak to the transformation.' },
      { name: 'FAQ', purpose: 'Handle objections', content: 'Answer the most common questions and concerns.' }
    ];
    const existingNames = new Set(p5.sections.map((s) => (s.name || '').toLowerCase()));
    for (const ds of defaultSections) {
      if (p5.sections.length >= 5)
        break;
      if (!existingNames.has(ds.name.toLowerCase())) {
        p5.sections.push(ds);
        existingNames.add(ds.name.toLowerCase());
      }
    }
    repairs.push('Added default sections to reach minimum (now ' + p5.sections.length + ')');
  }
  p5.sections.forEach((s, i) => {
    if (!s.name || s.name.length < 2) {
      s.name = 'Section ' + (i + 1);
      repairs.push('Named empty section ' + (i + 1));
    }
    if (!s.purpose || s.purpose.length < 3) {
      s.purpose = 'Support the overall page narrative';
      repairs.push('Set fallback purpose for section "' + s.name + '"');
    }
    if (!s.content)
      s.content = '';
  });
  if (!b.part4)
    b.part4 = { title: 'Offer Suite' };
  if (!b.part4.coreOffer || !b.part4.coreOffer.name) {
    b.part4.coreOffer = { name: 'Core Program', description: 'Our signature offering', price: 'Book a Call', delivery: 'Custom' };
    repairs.push('Created placeholder core offer');
  }
  if (!b.part7)
    b.part7 = { title: 'Headlines and Positioning Statements' };
  if (!b.part7.heroHeadlineOptions || b.part7.heroHeadlineOptions.length < 3) {
    b.part7.heroHeadlineOptions = [...p5.heroHeadlines || []];
    while (b.part7.heroHeadlineOptions.length < 3) {
      b.part7.heroHeadlineOptions.push(b.part1?.coreBrandPromise || 'Your Transformation Starts Here');
    }
    repairs.push('Populated part7 headline options from part5 hero headlines');
  }
  if (p5.sections && p5.sections.length) {
    p5.sections.forEach((s, i) => {
      if (!s.visualMood) {
        const name = (s.name || '').toLowerCase();
        if (/offer|pricing|package|service|program/i.test(name)) {
          s.visualMood = 'dark';
        } else if (/solution|method|framework|how/i.test(name)) {
          s.visualMood = 'dark';
        } else {
          s.visualMood = 'light';
        }
      }
      if (typeof s.confidence !== 'number') {
        s.confidence = 85;
      }
      if (!s.imageTheme) {
        s.imageTheme = 'none';
      }
    });
    repairs.push('Set default visualMood/confidence/imageTheme on sections missing them');
  }
  return { blueprint, repairs, repairCount: repairs.length };
}

// ---------------------------------------------------------------------------
// Claude API wrappers
// ---------------------------------------------------------------------------

export async function callClaude(env, systemPrompt, messages, streaming = false, maxTokens = 1024) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-beta': 'prompt-caching-2024-07-31'
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

export async function callClaudeSiteGen(env, systemPrompt, maxTokens = 6e3) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
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

export function stripMetadata(text) {
  return text.replace(/METADATA:\{[^\n]*\}/g, '').replace(/```json[\s\S]*?```/g, '').trim();
}

// ---------------------------------------------------------------------------
// JSON response helper
// ---------------------------------------------------------------------------

export function jsonCORS(data, status, req) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...getCORSHeaders(req) }
  });
}

// ---------------------------------------------------------------------------
// Web research helpers
// ---------------------------------------------------------------------------

export async function fetchAndSummarize(env, url, instruction) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeepWorkBot/1.0)' },
      signal: AbortSignal.timeout(8e3)
    });
    const html = await res.text();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3e3);
    if (!text)
      return '';
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

export async function autoResearchCompetitors(env, websiteAnalysis, linkedinData) {
  if (!websiteAnalysis && !linkedinData)
    return '';
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
          content: `Based on this person's business information, identify 3 to 5 likely competitors or similar businesses in their space. For each, provide: the company/person name, what they do, their approximate positioning, and what they seem to do well. Be specific and use real companies/people if you can identify the niche clearly enough. If you cannot determine the niche with confidence, say so.\n\n${context}`
        }]
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || '';
  } catch (e) {
    return '';
  }
}

export async function extractDocumentText(env, r2Key) {
  try {
    const obj = await env.UPLOADS.get(r2Key);
    if (!obj)
      return '';
    const bytes = await obj.arrayBuffer();
    const ext = r2Key.split('.').pop().toLowerCase();
    if (ext === 'txt' || ext === 'md') {
      const text = new TextDecoder().decode(bytes);
      return sanitizeDocumentText(text).slice(0, 5e3);
    }
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
          max_tokens: 2e3,
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

export function sanitizeDocumentText(text) {
  if (!text)
    return '';
  let clean = text.replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?|context)/gi, '[REMOVED]').replace(/\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be|your\s+new\s+instructions?)\b/gi, '[REMOVED]').replace(/\b(system\s*:?\s*prompt|SYSTEM\s*:)/gi, '[REMOVED]').replace(/<\/?script[^>]*>/gi, '').replace(/<\/?iframe[^>]*>/gi, '').replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '');
  return clean.slice(0, 5e3);
}

// ---------------------------------------------------------------------------
// D1 session helpers
// ---------------------------------------------------------------------------

export async function initSessionInD1(env, session) {
  try {
    const migrations = [
      `ALTER TABLE sessions ADD COLUMN email TEXT`,
      `ALTER TABLE sessions ADD COLUMN phone TEXT`,
      `ALTER TABLE sessions ADD COLUMN last_active_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN abandonment_notified_at TEXT`,
      `ALTER TABLE sessions ADD COLUMN blueprint_generated INTEGER DEFAULT 0`
    ];
    for (const sql of migrations) {
      try {
        await env.DB.exec(sql);
      } catch (_) {
      }
    }
    let email = null;
    if (session.userId) {
      try {
        const user = await getUserById(env, session.userId);
        email = user?.email || null;
      } catch (_) {
      }
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

export async function updateSessionPhaseInD1(env, sessionId, phase, messageCount, blueprintDone = false) {
  try {
    const now = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE sessions
      SET phase = ?, message_count = ?, updated_at = ?, last_active_at = ?,
          blueprint_generated = CASE WHEN ? = 1 THEN 1 ELSE blueprint_generated END
      WHERE id = ?
    `).bind(phase, messageCount, now, now, blueprintDone ? 1 : 0, sessionId).run();
  } catch (e) {
    logError(env, { endpoint: 'updateSessionPhaseInD1', method: 'internal', statusCode: 500, errorType: 'd1_write_failure', errorMessage: e.message, sessionId }).catch(() => {
    });
  }
}

export async function logEvent(env, sessionId, eventType, data) {
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
  } catch (e) {
  }
}

export async function saveToRAG(env, session, blueprint) {
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
  } catch (e) {
  }
}

// ---------------------------------------------------------------------------
// Drip worker / scheduled jobs
// ---------------------------------------------------------------------------

export const DRIP_WORKER_URL = 'https://email-drip-worker.james-d13.workers.dev';

export async function fireEventToDripWorker(env, email, eventType, data = {}) {
  try {
    const res = await fetch(`${DRIP_WORKER_URL}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, event_type: eventType, data })
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

export async function runAbandonmentCheck(env) {
  try {
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
    for (const session of abandoned.results || []) {
      const ok = await fireEventToDripWorker(env, session.email, 'interview_abandoned', {
        name: session.name || '',
        phone: session.phone || '',
        phase: session.phase,
        session_id: session.id
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

export async function runDailyHealthCheck(env) {
  const results = {};
  const checks = [
    { name: 'deep_work_api', url: 'https://love.jamesguldan.com/health' },
    { name: 'email_drip', url: `${DRIP_WORKER_URL}/health` },
    { name: 'stripe_ghl', url: 'https://stripe-ghl-webhook.james-d13.workers.dev/' },
    { name: 'product_access', url: 'https://product-access-api.james-d13.workers.dev/health' },
    { name: 'gemini_proxy', url: 'https://gemini-proxy.james-d13.workers.dev/health' },
    { name: 'rag_search', url: 'https://rag-search.james-d13.workers.dev/stats' }
  ];
  for (const check of checks) {
    try {
      const start = Date.now();
      const res = await fetch(check.url, { signal: AbortSignal.timeout(8e3) });
      results[check.name] = { ok: res.ok, status: res.status, latency_ms: Date.now() - start };
    } catch (e) {
      results[check.name] = { ok: false, error: e.message };
    }
  }
  try {
    await env.DB.prepare(`SELECT 1`).run();
    results.d1_database = { ok: true };
  } catch (e) {
    results.d1_database = { ok: false, error: e.message };
  }
  const allOk = Object.values(results).every((r) => r.ok);
  await logEvent(env, null, 'daily_health_check', { results, allOk });
  if (!allOk) {
    const failed = Object.entries(results).filter(([, r]) => !r.ok).map(([name]) => name);
    console.error(`Daily health check FAILED for: ${failed.join(', ')}`);
  }
  return { allOk, results, timestamp: new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// SEO injection
// ---------------------------------------------------------------------------

export function injectSEO(html, blueprint, liveUrl, slug) {
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
  const colors = p1.visualDirection?.colors || [];
  const primaryColor = colors.find((c) => c.name?.toLowerCase().includes('primary') || c.name?.toLowerCase().includes('dark'))?.hex || colors[0]?.hex || '#1C2B3A';
  const accentColor = colors.find((c) => c.name?.toLowerCase().includes('gold') || c.name?.toLowerCase().includes('accent'))?.hex || colors[1]?.hex || '#C9A96E';
  const initials = brandName.split(/\s+/).map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primaryColor}"/><text x="32" y="42" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="${accentColor}" text-anchor="middle">${initials}</text></svg>`;
  const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
  const schemaType = (p5.businessModel?.toLowerCase() || '').includes('coaching') ? 'Person' : (p5.businessModel?.toLowerCase() || '').includes('agency') ? 'Organization' : 'Organization';
  const schema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: brandName,
    url: liveUrl,
    description,
    ...(p1.contactEmail ? { email: p1.contactEmail } : {}),
    ...(tagline ? { slogan: tagline } : {}),
    ...(p3.nicheStatement ? { knowsAbout: p3.nicheStatement } : {}),
    sameAs: []
  };
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
  <script type="application/ld+json">${JSON.stringify(schema)}<\/script>`;
  let cleaned = html.replace(/<meta\s+name="description"[^>]*>/gi, '').replace(/<meta\s+property="og:title"[^>]*>/gi, '').replace(/<meta\s+property="og:description"[^>]*>/gi, '').replace(/<meta\s+name="robots"[^>]*>/gi, '').replace(/<link\s+rel="canonical"[^>]*>/gi, '').replace(/<link\s+rel="icon"[^>]*>/gi, '').replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace('</head>', seoBlock + '\n</head>');
  return cleaned;
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

export function getMagicLinkEmail(magicUrl, email) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 20px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
      <tr><td style="padding-bottom:28px;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1a1a1a;">JAMES GULDAN</p>
      </td></tr>
      <tr><td style="background:#1a1a1a;border-radius:20px 20px 0 0;padding:40px 40px 36px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c4703f;">Deep Work</p>
        <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Your session is ready.</h1>
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.75;">You are one click away from your complete brand blueprint. Eight conversations. One complete strategy. Built around who you actually are.</p>
      </td></tr>
      <tr><td style="background:#ffffff;border-left:1px solid #EAE7E2;border-right:1px solid #EAE7E2;border-bottom:1px solid #EAE7E2;border-radius:0 0 20px 20px;padding:36px 40px 40px;">
        <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
          <tr><td style="border-radius:50px;background:#1a1a1a;">
            <a href="${magicUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Begin My Deep Work Session &rarr;</a>
          </td></tr>
        </table>
        <p style="margin:0 0 24px;font-size:13px;color:#999;line-height:1.7;">This link is for <strong style="color:#555;">${email}</strong> and expires in 24 hours. Do not share it with anyone.</p>
        <hr style="border:none;border-top:1px solid #EAE7E2;margin:0 0 24px;">
        <p style="margin:0 0 6px;font-size:12px;color:#bbb;">Button not working? Paste this into your browser:</p>
        <p style="margin:0;font-size:11px;"><a href="${magicUrl}" style="color:#c4703f;word-break:break-all;">${magicUrl}</a></p>
      </td></tr>
      <tr><td style="padding-top:24px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;color:#bbb;">Didn&rsquo;t request this? You can safely ignore it.</p>
        <p style="margin:0;font-size:12px;color:#bbb;">&copy; ${year} Align Consulting LLC &nbsp;&middot;&nbsp; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#bbb;text-decoration:none;">Privacy Policy</a> &nbsp;&middot;&nbsp; <a href="mailto:james@jamesguldan.com" style="color:#bbb;text-decoration:none;">Support</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
