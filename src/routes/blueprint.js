// src/routes/blueprint.js
// Blueprint route handlers — PDF export and server-side rendering

import { json } from '../utils/helpers.js';
import { CORS } from '../utils/internal.js';
import { buildBrandGuideHTML } from '../html/brand-guide.js';

export async function handleBlueprintPDF(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const exportHtml = buildBrandGuideHTML(session.blueprint, session);
  return new Response(exportHtml, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      ...CORS
    }
  });
}

// ── Server-side blueprint rendering (new design) ──────────────

function escHtml(str) {
  if (!str)
    return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function formatProse(prose, keyInsight) {
  if (!prose)
    return "";
  var escaped = escHtml(prose);
  if (keyInsight) {
    var escapedInsight = escHtml(keyInsight);
    var idx = escaped.indexOf(escapedInsight);
    if (idx !== -1) {
      escaped = escaped.slice(0, idx) + '<blockquote class="bp-letter-pullquote">' + escapedInsight + "</blockquote>" + escaped.slice(idx + escapedInsight.length);
    }
  }
  escaped = escaped.replace(/\n\n+/g, '</p><p style="margin-top:16px;">');
  escaped = escaped.replace(/\n/g, "<br>");
  return "<p>" + escaped + "</p>";
}
function getBlueprintCSS() {
  return `
/* === RESET & VARIABLES === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #FFFFFF; --bg2: #FAFAFA; --bg3: #F0F0F0;
  --border: #F0F0F0; --border2: #E8E8E8;
  --gold: #C4703F; --text: #1D1D1F; --text2: #86868B; --text3: #C0C0C0;
  --radius: 16px; --radius-sm: 10px;
  --amber: #D97706;
}
html, body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

/* === TYPOGRAPHY HELPERS === */
.eyebrow {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold);
}

/* === LAYOUT === */
.bp-page { max-width: 100%; overflow-x: hidden; }
.bp-section { padding: 80px 24px; }
.bp-inner { max-width: 680px; margin: 0 auto; }
.bp-inner-wide { max-width: 960px; margin: 0 auto; }
.bp-center { text-align: center; }

/* === CHAPTER DIVIDER === */
.chapter-divider {
  padding: 48px 24px; text-align: center;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.chapter-divider-label {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold);
  display: block; margin-bottom: 8px;
}
.chapter-divider-sub {
  font-size: 13px; color: var(--text2); font-family: 'Inter', sans-serif;
  font-style: italic;
}

/* === CARDS === */
.bp-card {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px;
}

/* === BUTTONS === */
.btn-primary {
  background: var(--text); color: #fff; border: none;
  border-radius: 50px; padding: 14px 28px;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px;
  cursor: pointer; display: inline-block; text-decoration: none; text-align: center;
}
.btn-secondary {
  background: transparent; color: var(--text);
  border: 1px solid var(--border2); border-radius: 50px; padding: 13px 28px;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px;
  cursor: pointer; display: inline-block; text-decoration: none; text-align: center;
}
.btn-copy {
  background: #fff; color: var(--text);
  border: 1px solid var(--border2); border-radius: 6px; padding: 6px 12px;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 11px;
  cursor: pointer; transition: border-color 0.2s, color 0.2s;
}
.btn-copy.copied { border-color: #4ade80; color: #4ade80; }

/* === ANIMATIONS === */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-opacity {
  0%, 100% { opacity: 0.3; } 50% { opacity: 1; }
}
.fade-up { opacity: 0; animation: fadeUp 1.2s ease forwards; }
.fade-up-d1 { animation-delay: 0.5s; }
.fade-up-d2 { animation-delay: 1.2s; }
.fade-up-d3 { animation-delay: 2.0s; }

/* === CHAPTER 1: HERO REVEAL === */
.bp-hero-reveal {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  position: relative; background: var(--bg); padding: 80px 24px 0;
}
.bp-hero-top-border {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, #C4703F, transparent);
}
.bp-hero-inner {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; flex: 1; justify-content: center;
}
.bp-hero-badge {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  color: #C4703F; border: 1px solid rgba(196,112,63,0.25);
  border-radius: 50px; padding: 7px 18px; margin-bottom: 32px;
}
.bp-hero-name {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 72px; letter-spacing: -0.03em; color: #1D1D1F;
  line-height: 1; margin-bottom: 16px;
}
.bp-hero-niche {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 20px; color: #86868B; line-height: 1.4; margin-bottom: 0;
}
.bp-hero-divider {
  width: 48px; height: 2px; background: #C4703F;
  margin: 40px auto;
}
.bp-hero-hook {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 28px; color: #1D1D1F; max-width: 540px;
  line-height: 1.45; margin-bottom: 20px;
}
.bp-hero-proof {
  font-family: 'Inter', sans-serif; font-weight: 400;
  font-size: 13px; color: #86868B;
}
.bp-hero-count {
  font-weight: 600; color: #1D1D1F;
}
.bp-hero-begin {
  position: absolute; bottom: 0; left: 0; right: 0;
  border-top: 1px solid #F0F0F0; padding: 0 0 28px;
  display: flex; flex-direction: column; align-items: center;
  padding-top: 20px;
}
.bp-hero-begin-text {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
  color: #C0C0C0; margin-bottom: 10px;
}
.bp-hero-begin-line {
  width: 1px; height: 24px;
  background: linear-gradient(to bottom, #C0C0C0, transparent);
}
.bp-scroll-indicator {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-decoration: none;
}
.bp-scroll-text {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3);
}
.bp-scroll-line {
  width: 1px; height: 24px; background: var(--border2);
  animation: pulse-opacity 2s ease-in-out infinite;
}

/* === CHAPTER 1: PERSONAL LETTER === */
.bp-letter-card {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 48px;
  max-width: 620px; margin: 0 auto;
}
.bp-letter-salutation {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 18px; color: var(--text); margin-bottom: 24px;
}
.bp-letter-italic {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: #555; line-height: 1.75;
  margin-bottom: 24px;
}
.bp-letter-body {
  font-family: 'Inter', sans-serif; font-size: 15px;
  color: #555; line-height: 1.85;
}
.bp-letter-pullquote {
  border-left: 2px solid var(--gold);
  background: rgba(196,112,63,0.03);
  padding: 16px 24px; border-radius: 0 12px 12px 0;
  margin: 28px 0;
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: var(--text); line-height: 1.6;
}
.bp-letter-signoff { margin-top: 36px; }
.bp-letter-signoff-name {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 14px; color: var(--text);
}
.bp-letter-signoff-studio {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 12px; color: var(--text2); margin-top: 2px;
}

/* === CHAPTER 2: CREDIBILITY SCORE === */
.bp-bridge-para {
  font-size: 16px; color: #555; max-width: 520px;
  margin: 0 auto 40px; text-align: center; line-height: 1.7;
  font-family: 'Inter', sans-serif;
}
.bp-score-ring-wrap { display: flex; flex-direction: column; align-items: center; margin: 0 0 24px; }
.bp-score-ring { position: relative; width: 200px; height: 200px; }
.bp-score-ring svg { transform: rotate(-90deg); }
.bp-score-number {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%); text-align: center;
}
.bp-score-num {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: 56px; color: var(--text); line-height: 1;
}
.bp-score-grade {
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 20px; color: var(--amber); margin-top: 4px;
}
.bp-context-line {
  font-size: 13px; color: var(--text2); text-align: center;
  max-width: 520px; margin: 0 auto 32px;
}
.bp-score-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px; margin-bottom: 28px;
}
.bp-score-card {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); padding: 12px 16px;
}
.bp-score-card-name {
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 12px; color: var(--text); margin-bottom: 4px;
}
.bp-score-card-grade { font-size: 13px; font-family: 'Outfit', sans-serif; font-weight: 700; }
.bp-score-card-explanation { font-size: 12px; color: var(--text2); margin-top: 4px; line-height: 1.5; }
.bp-score-card-move {
  font-size: 11px; color: var(--gold); margin-top: 6px;
  font-family: 'Outfit', sans-serif; font-weight: 600;
}
.grade-ab { border-left: 4px solid #2D7A4F; }
.grade-c  { border-left: 4px solid #D97706; }
.grade-df { border-left: 4px solid #DC2626; }
.bp-reframe {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: var(--text); text-align: center;
  max-width: 500px; margin: 28px auto 0; line-height: 1.6;
}

/* === CHAPTER 2: MARKET LANDSCAPE === */
.bp-competitor-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 16px 0; border-bottom: 1px solid var(--border); min-height: 60px;
}
.bp-competitor-name {
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 14px; color: var(--text); min-width: 140px; flex-shrink: 0;
}
.bp-competitor-pos { font-size: 13px; color: var(--text2); flex: 1; line-height: 1.5; }
.bp-competitor-gap {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 12px; color: var(--gold); min-width: 100px; text-align: right; flex-shrink: 0;
}
.bp-market-quotes {
  margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--border);
  text-align: center;
}
.bp-quote-mark {
  font-size: 48px; color: var(--gold); opacity: 0.35; line-height: 1;
  font-family: 'Playfair Display', serif; margin-bottom: -8px;
}
.bp-quote-text {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: #555; max-width: 560px; margin: 0 auto 8px;
  line-height: 1.6;
}
.bp-quote-descriptor { font-size: 12px; color: var(--text2); }
.bp-quote-item { margin-bottom: 36px; }
.bp-advantage-hero {
  margin: 40px auto 0; padding: 28px; background: var(--bg2);
  border-radius: 12px; text-align: center;
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 22px; color: var(--text); line-height: 1.5; max-width: 700px;
}

/* === CHAPTER 3: IDEAL CLIENT === */
.bp-portrait {
  font-size: 16px; color: var(--text); line-height: 1.8;
  margin-bottom: 36px; font-family: 'Inter', sans-serif;
}
.bp-client-label {
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text2); margin-bottom: 10px; display: block;
}
.bp-client-text { font-size: 15px; color: #555; line-height: 1.75; margin-bottom: 24px; }
.bp-connection {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 18px; color: var(--gold); line-height: 1.65; margin-top: 40px;
}

/* === CHAPTER 3: BRAND FOUNDATION === */
.bp-brand-name-hero { text-align: center; margin: 80px 0 48px; }
.bp-brand-name {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: 36px; color: var(--text); letter-spacing: -0.02em; margin-bottom: 12px;
}
.bp-brand-tagline {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 20px; color: var(--text2);
}
.bp-color-strip {
  display: flex; gap: 20px; flex-wrap: wrap; margin: 32px 0 48px;
}
.bp-color-swatch-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.bp-color-swatch {
  width: 64px; height: 64px; border-radius: 50%;
  border: 1px solid var(--border);
}
.bp-color-hex {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 11px; color: var(--text2);
}
.bp-color-narrative {
  font-size: 10px; color: var(--text3); text-align: center;
  max-width: 80px; line-height: 1.4;
}
.bp-type-specimen {
  margin: 28px 0; padding: 24px;
  border: 1px solid var(--border); border-radius: var(--radius);
}
.bp-type-label {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 10px; color: var(--gold); text-transform: uppercase;
  letter-spacing: 0.1em; margin-top: 12px; display: block;
}
.bp-voice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
.bp-voice-col { border-radius: var(--radius-sm); overflow: hidden; }
.bp-voice-header { padding: 10px 16px; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 12px; }
.bp-voice-do .bp-voice-header { background: #E8F5E9; color: #2E7D32; }
.bp-voice-dont .bp-voice-header { background: #FFEBEE; color: #C62828; }
.bp-voice-items { padding: 12px 16px; background: var(--bg2); border: 1px solid var(--border); border-top: none; border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
.bp-voice-item { font-size: 13px; line-height: 1.6; padding: 4px 0; }
.bp-voice-do .bp-voice-item { color: #2E7D32; }
.bp-voice-dont .bp-voice-item { color: #C62828; }
.bp-positioning-hero {
  border-left: 4px solid var(--gold);
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 24px; color: var(--text); padding-left: 32px;
  margin: 48px 0; line-height: 1.5;
}

/* === CHAPTER 4: FIRST 3 MOVES === */
.bp-moves-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px;
}
.bp-move-card {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px;
}
.bp-move-num {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: 32px; color: var(--gold); margin-bottom: 8px;
}
.bp-move-gap-tag {
  display: inline-block; font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 10px; color: var(--gold); text-transform: uppercase; letter-spacing: 0.04em;
  border: 1px solid var(--border2); border-radius: 20px;
  padding: 3px 10px; margin-bottom: 12px;
}
.bp-move-title {
  font-family: 'Outfit', sans-serif; font-weight: 700;
  font-size: 16px; color: var(--text); margin-bottom: 10px;
}
.bp-move-instruction { font-size: 13px; color: #555; line-height: 1.65; margin-bottom: 16px; }
.bp-copy-block {
  background: rgba(0,0,0,0.025); border: 1px solid var(--border);
  border-radius: 6px; padding: 12px; margin-bottom: 10px;
  font-family: 'ui-monospace', 'Courier New', monospace;
  font-size: 12px; color: #555; line-height: 1.6; white-space: pre-wrap; word-break: break-word;
}
.bp-move-deadline {
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 11px; color: var(--text2); text-transform: uppercase;
  letter-spacing: 0.04em; margin-top: 12px;
}
.bp-score-projection {
  text-align: center; padding: 24px; background: var(--bg2);
  border: 1px solid var(--border); border-radius: var(--radius);
  font-size: 14px; color: #555;
}
.bp-projection-num {
  font-family: 'Outfit', sans-serif; font-weight: 800;
  font-size: 18px; color: var(--gold);
}

/* === CHAPTER 4: CLOSING FORK === */
.bp-closing-line {
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: 22px; color: var(--text); line-height: 1.65;
  max-width: 600px; margin: 80px auto 48px; text-align: center;
}
/* \u2500\u2500 The Gap CTA \u2500\u2500 */
.bp-gap-cta { margin-top: 56px; border-radius: 16px; overflow: hidden; border: 1px solid #F0F0F0; }
.bp-gap-top { background: #FAFAFA; padding: 48px 48px 40px; text-align: center; border-bottom: 1px solid #F0F0F0; }
.bp-gap-eyebrow { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #C4703F; margin-bottom: 16px; }
.bp-gap-headline { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 30px; color: #1D1D1F; line-height: 1.3; margin-bottom: 12px; }
.bp-gap-sub { font-family: 'Inter', sans-serif; font-size: 14px; color: #86868B; line-height: 1.7; max-width: 440px; margin: 0 auto; }
.bp-gap-columns { display: grid; grid-template-columns: 1fr 1fr; }
.bp-gap-col { padding: 36px 32px; }
.bp-gap-col:first-child { border-right: 1px solid #F0F0F0; }
.bp-gap-col-label { font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #C0C0C0; margin-bottom: 16px; }
.bp-gap-col:last-child .bp-gap-col-label { color: #C4703F; }
.bp-gap-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.6; }
.bp-gap-col:first-child .bp-gap-item { color: #86868B; }
.bp-gap-col:last-child .bp-gap-item { color: #1D1D1F; }
.bp-gap-check { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-top: 2px; }
.bp-gap-col:first-child .bp-gap-check { background: #F0F0F0; color: #86868B; }
.bp-gap-col:last-child .bp-gap-check { background: #C4703F; color: white; }
.bp-gap-bottom { padding: 40px 48px; text-align: center; border-top: 1px solid #F0F0F0; }
.bp-gap-prep { font-family: 'Inter', sans-serif; font-size: 14px; color: #1D1D1F; line-height: 1.8; max-width: 560px; margin: 0 auto 16px; text-align: left; }
.bp-gap-pull-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: 17px; color: #1D1D1F; line-height: 1.6; max-width: 560px; margin: 0 auto 32px; padding: 20px 24px; background: white; border-left: 3px solid #C4703F; border-radius: 0 8px 8px 0; text-align: left; }
.bp-gap-price { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 36px; color: #1D1D1F; margin-bottom: 4px; }
.bp-gap-price-note { font-family: 'Inter', sans-serif; font-size: 12px; color: #86868B; margin-bottom: 20px; }
.bp-gap-book-btn { display: inline-flex; align-items: center; gap: 8px; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px; color: white; background: #1D1D1F; padding: 16px 40px; border-radius: 50px; text-decoration: none; }
.bp-gap-book-btn:hover { opacity: 0.85; }
.bp-gap-guarantee { font-family: 'Inter', sans-serif; font-size: 11px; color: #C0C0C0; margin-top: 14px; }
.bp-gap-reply { font-family: 'Inter', sans-serif; font-size: 13px; color: #86868B; text-decoration: none; border-bottom: 1px solid #E8E8E8; padding-bottom: 1px; }
/* \u2500\u2500 Build With AI \u2500\u2500 */
.bp-ai-builder { margin-top: 40px; padding: 40px; background: #FAFAFA; border-radius: 16px; border: 1px solid #F0F0F0; text-align: center; }
.bp-ai-builder-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 18px; color: #1D1D1F; margin-bottom: 8px; }
.bp-ai-builder-desc { font-family: 'Inter', sans-serif; font-size: 13px; color: #86868B; line-height: 1.7; max-width: 460px; margin: 0 auto 20px; }
.bp-ai-builder-tools { font-family: 'Inter', sans-serif; font-size: 11px; color: #C0C0C0; margin-top: 12px; }
.bp-ai-copy-success { display: none; font-family: 'Inter', sans-serif; font-size: 12px; color: #2D7A4F; margin-top: 8px; }
/* \u2500\u2500 PDF Download \u2500\u2500 */
.bp-pdf-section { margin-top: 32px; padding: 32px; text-align: center; border-top: 1px solid #F0F0F0; }
.bp-pdf-section-desc { font-family: 'Inter', sans-serif; font-size: 13px; color: #86868B; line-height: 1.7; margin-bottom: 16px; }
.bp-pdf-footer-note { font-family: 'Inter', sans-serif; font-size: 11px; color: #C0C0C0; margin-top: 16px; }
.bp-pdf-footer-note a { color: #C0C0C0; text-decoration: underline; }

/* === CHAPTER 4: FEEDBACK === */
.bp-feedback {
  margin-top: 60px; padding-top: 32px; border-top: 1px solid var(--border2);
  opacity: 0; transition: opacity 0.6s ease; text-align: center;
  pointer-events: none;
}
.bp-feedback.visible { opacity: 1; pointer-events: auto; }
.bp-feedback-label {
  font-size: 14px; color: var(--text2); margin-bottom: 16px;
  font-family: 'Outfit', sans-serif; font-weight: 500;
}
.bp-feedback-question { font-size: 15px; color: var(--text); margin-bottom: 20px; }
.bp-feedback-pills { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.bp-feedback-pill {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 12px;
  color: var(--text); border: 1px solid var(--border2); background: transparent;
  border-radius: 20px; padding: 8px 18px; cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.bp-feedback-pill:hover { border-color: var(--gold); color: var(--gold); }
.bp-feedback-response {
  font-size: 13px; color: var(--text2); display: none; margin-top: 16px;
  animation: fadeUp 0.6s ease forwards;
}
.bp-feedback-response.visible { display: block; }

/* === MOBILE PROGRESS BAR === */
#bp-progress-bar {
  position: sticky; top: 0; z-index: 20; height: 32px;
  background: rgba(255,255,255,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  display: none; align-items: center; justify-content: center; gap: 12px;
}
.bp-dot {
  width: 8px; height: 8px; border-radius: 4px; background: var(--border2);
  transition: all 0.3s ease; display: flex; align-items: center;
  justify-content: center; overflow: hidden; flex-shrink: 0;
}
.bp-dot.active {
  width: 60px; background: rgba(196,112,63,0.08);
  border: 1px solid var(--gold); border-radius: 12px; height: 22px;
}
.bp-dot-label {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 9px;
  color: var(--gold); text-transform: uppercase; letter-spacing: 0.06em;
  white-space: nowrap; padding: 0 8px; display: none;
}
.bp-dot.active .bp-dot-label { display: block; }

/* === NICHE SECTION === */
.bp-niche-block { margin-bottom: 20px; }

/* === OFFER SUITE === */
.bp-offers-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
.bp-offer-card {
  background: var(--bg2); border-radius: var(--radius); padding: 28px 24px;
  border: 1px solid var(--border); transition: border-color 0.2s;
}
.bp-offer-card:hover { border-color: #E0E0E0; }
.bp-offer-premium { background: #1D1D1F; color: #fff; border-color: #333; }
.bp-offer-premium .bp-offer-tier { color: var(--gold); }
.bp-offer-premium .bp-offer-desc { color: #aaa; }
.bp-offer-premium .bp-offer-delivery { color: #888; }
.bp-offer-tier {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--text2); margin-bottom: 8px;
}
.bp-offer-name {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 18px;
  letter-spacing: -0.01em; margin-bottom: 8px;
}
.bp-offer-price {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px;
  color: var(--gold); margin-bottom: 12px;
}
.bp-offer-desc { font-size: 13px; line-height: 1.65; color: var(--text2); margin-bottom: 12px; }
.bp-offer-delivery { font-size: 11px; color: var(--text3); font-style: italic; }
.bp-ascension {
  padding: 24px 28px; background: var(--bg2); border-radius: var(--radius-sm);
  border-left: 3px solid var(--gold);
}

/* === HEADLINES & POSITIONING === */
.bp-headlines-list { display: flex; flex-direction: column; gap: 12px; }
.bp-headline-option {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px; border-radius: var(--radius-sm);
  background: var(--bg2); border: 1px solid var(--border);
}
.bp-headline-featured { background: #1D1D1F; color: #fff; border-color: #333; }
.bp-headline-featured .bp-headline-num { color: var(--gold); }
.bp-headline-num {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 11px;
  color: var(--text3); flex-shrink: 0; padding-top: 3px;
}
.bp-headline-text {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 16px;
  line-height: 1.5; letter-spacing: -0.01em;
}
.bp-taglines-list { display: flex; flex-direction: column; gap: 8px; }
.bp-tagline-item {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 17px;
  color: var(--text); line-height: 1.6; padding: 8px 0;
  border-bottom: 1px solid var(--border);
}
.bp-positioning-grid { display: flex; flex-direction: column; gap: 16px; }
.bp-positioning-card {
  padding: 20px; background: var(--bg2); border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.bp-positioning-context {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px;
}
.bp-positioning-text { font-size: 14px; line-height: 1.7; color: var(--text); }

/* === WEBSITE BLUEPRINT === */
.bp-website-hero-preview {
  padding: 32px; background: var(--bg2); border-radius: var(--radius);
  border: 1px solid var(--border); margin-bottom: 32px;
}
.bp-website-hero-headline {
  font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 28px;
  letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 12px;
}
.bp-website-hero-sub { font-size: 15px; color: var(--text2); line-height: 1.65; margin-bottom: 16px; }
.bp-website-hero-cta {
  display: inline-block; padding: 10px 24px; background: var(--gold); color: #fff;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
  border-radius: 8px; letter-spacing: 0.02em;
}
.bp-alt-headlines { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }
.bp-alt-headline {
  font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text2);
  padding: 6px 0; line-height: 1.5;
}
.bp-website-sections { display: flex; flex-direction: column; gap: 16px; }
.bp-website-section-card {
  padding: 24px; background: var(--bg2); border-radius: var(--radius-sm);
  border: 1px solid var(--border); position: relative;
}
.bp-section-dark { background: #1D1D1F; color: #fff; border-color: #333; }
.bp-section-dark .bp-website-section-purpose { color: #aaa; }
.bp-section-dark .bp-website-section-content { color: #ccc; }
.bp-section-dark .bp-website-section-conf { color: #888; }
.bp-section-accent { background: #FFF8F0; border-color: rgba(196,112,63,0.2); }
.bp-website-section-num {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 11px;
  color: var(--gold); margin-bottom: 4px;
}
.bp-website-section-name {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 16px;
  margin-bottom: 8px;
}
.bp-website-section-purpose { font-size: 12px; color: var(--text2); margin-bottom: 8px; font-style: italic; }
.bp-website-section-content { font-size: 13px; line-height: 1.65; color: #555; }
.bp-website-section-conf {
  font-family: 'Outfit', sans-serif; font-size: 10px; color: var(--text3);
  margin-top: 8px; text-transform: uppercase; letter-spacing: 0.08em;
}
.bp-proof-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.bp-proof-item { text-align: center; padding: 20px; background: var(--bg2); border-radius: var(--radius-sm); }
.bp-proof-stat {
  font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 36px;
  color: var(--gold); letter-spacing: -0.02em;
}
.bp-proof-label {
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--text); margin-top: 4px;
}
.bp-proof-context { font-size: 12px; color: var(--text2); margin-top: 6px; line-height: 1.5; }
.bp-best-testimonial {
  margin-top: 40px; padding: 32px; text-align: center;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.bp-testimonial-mark {
  font-family: 'Playfair Display', serif; font-size: 48px; color: var(--gold); line-height: 1;
}
.bp-testimonial-quote {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 20px;
  line-height: 1.6; color: var(--text); margin: 8px 0 12px;
}
.bp-testimonial-attr { font-size: 12px; color: var(--text2); }

/* === BLUEPRINT FOOTER === */
.bp-blueprint-footer { margin-top: 48px; }
.bp-footer-copper-divider {
  height: 1px; margin: 0 56px;
  background: linear-gradient(90deg, transparent, #C4703F, transparent);
}
.bp-footer-content {
  padding: 64px 56px 48px; text-align: center;
}
.bp-footer-headline {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 32px; color: #1D1D1F; line-height: 1.3; margin-bottom: 16px;
}
.bp-footer-subtext {
  font-family: 'Inter', sans-serif; font-size: 14px; color: #86868B;
  max-width: 460px; margin: 0 auto 32px; line-height: 1.7;
}
.bp-footer-primary-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #1D1D1F; color: #fff; border: none; cursor: pointer;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 15px;
  padding: 16px 36px; border-radius: 50px; margin-bottom: 12px;
  transition: opacity 0.2s;
}
.bp-footer-primary-btn:hover { opacity: 0.85; }
.bp-footer-hint {
  font-family: 'Inter', sans-serif; font-size: 12px; color: #C0C0C0;
  margin-bottom: 32px;
}
.bp-footer-or {
  display: flex; align-items: center; gap: 12px;
  max-width: 300px; margin: 0 auto 24px;
}
.bp-footer-or-line { flex: 1; height: 1px; background: #F0F0F0; }
.bp-footer-or-text {
  font-family: 'Inter', sans-serif; font-size: 11px; color: #C0C0C0;
}
.bp-footer-secondary-btns {
  display: flex; gap: 16px; justify-content: center; margin-bottom: 48px;
  flex-wrap: wrap;
}
.bp-footer-secondary-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #1D1D1F; text-decoration: none;
  border: 1px solid #E8E8E8; border-radius: 50px;
  font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px;
  padding: 12px 24px; transition: border-color 0.2s;
}
.bp-footer-secondary-btn:hover { border-color: #C4703F; }
.bp-footer-signature {
  border-top: 1px solid #F0F0F0; padding-top: 32px; text-align: center;
}
.bp-footer-sig-copper {
  width: 32px; height: 2px; background: #C4703F; margin: 0 auto 16px;
}
.bp-footer-sig-desc {
  font-family: 'Inter', sans-serif; font-size: 12px; color: #C0C0C0;
  max-width: 380px; margin: 0 auto 12px; line-height: 1.6;
}
.bp-footer-sig-name {
  font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px; color: #1D1D1F;
  margin-bottom: 4px;
}
.bp-footer-sig-role {
  font-family: 'Inter', sans-serif; font-size: 11px; color: #86868B;
}

/* === MOBILE === */
@media (max-width: 768px) {
  #bp-progress-bar { display: flex; }
  .bp-hero-name { font-size: 48px; }
  .bp-hero-hook { font-size: 22px; }
  .bp-hero-niche { font-size: 16px; }
  .bp-letter-card { padding: 28px 20px; }
  .bp-letter-italic { font-size: 16px; color: #555; }
  .bp-letter-pullquote { padding: 14px 18px; font-size: 16px; }
  .bp-moves-grid { grid-template-columns: 1fr; }
  .bp-gap-columns { grid-template-columns: 1fr; }
  .bp-gap-col:first-child { border-right: none; border-bottom: 1px solid #F0F0F0; }
  .bp-gap-top { padding: 32px 24px 28px; }
  .bp-gap-headline { font-size: 24px; }
  .bp-gap-bottom { padding: 28px 24px; }
  .bp-gap-prep { font-size: 13px; }
  .bp-ai-builder { padding: 28px 20px; }
  .bp-color-strip {
    overflow-x: auto; scroll-snap-type: x mandatory;
    flex-wrap: nowrap; padding-bottom: 12px; -webkit-overflow-scrolling: touch;
  }
  .bp-color-swatch-wrap { scroll-snap-align: center; }
  .bp-color-swatch { width: 60px; height: 60px; }
  .bp-voice-grid { grid-template-columns: 1fr; }
  .bp-section { padding: 48px 20px; }
  .bp-client-text { font-size: 14px; line-height: 1.6; color: #555; }
  .bp-connection { font-size: 16px; color: var(--gold); }
  .chapter-divider { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .chapter-divider-label { font-size: 11px; }
  .bp-advantage-hero { font-size: 18px; }
  .bp-competitor-row { flex-wrap: wrap; }
  .bp-competitor-gap { text-align: left; min-width: auto; }
  .bp-positioning-hero { font-size: 20px; }
  .bp-closing-line { font-size: 18px; margin: 48px auto 32px; }
  .bp-offers-grid { grid-template-columns: 1fr; }
  .bp-offer-name { font-size: 16px; }
  .bp-headline-text { font-size: 14px; }
  .bp-website-hero-headline { font-size: 22px; }
  .bp-proof-strip { grid-template-columns: 1fr; }
  .bp-proof-stat { font-size: 28px; }
  .bp-testimonial-quote { font-size: 17px; }
  .bp-footer-content { padding: 48px 28px; }
  .bp-footer-headline { font-size: 26px; }
  .bp-footer-secondary-btns { flex-direction: column; align-items: center; }
  .bp-footer-copper-divider { margin: 0 24px; }
}
`;
}
function getBlueprintJS(sessionId, firstName) {
  var sid = (sessionId || "").replace(/\'/g, "\\'");
  var fnSafe = (firstName || "brand").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-").toLowerCase() || "brand";
  return `
function copyBlock(btn, text) {
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'Copied';
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  }).catch(function() {
    btn.textContent = 'Copy'; btn.classList.remove('copied');
  });
}

function submitFeedback(rating) {
  var pills = document.querySelectorAll('.bp-feedback-pill');
  pills.forEach(function(p) { p.style.display = 'none'; });
  var responses = {
    'Deeply': 'That is the whole point. You have given us a gift by being here.',
    'Somewhat': 'We can refine this. What did not land? Reply to the email.',
    'Not quite': 'Tell us what missed. That feedback shapes everything we build.'
  };
  var el = document.querySelector('.bp-feedback-response');
  if (el) { el.textContent = responses[rating] || ''; el.classList.add('visible'); }
  fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: '` + sid + `', rating: rating })
  }).catch(function() {});
}

// Show feedback after 90s + scrolled past CTA fork
(function() {
  var shown = false; var timeReady = false; var scrollReady = false;
  setTimeout(function() { timeReady = true; check(); }, 90000);
  var cta = document.querySelector('.bp-blueprint-footer');
  if (cta) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].boundingClientRect.bottom < 0) { scrollReady = true; check(); }
    }, { threshold: 0 });
    obs.observe(cta);
  }
  function check() {
    if (shown || !timeReady || !scrollReady) return;
    shown = true;
    var el = document.querySelector('.bp-feedback');
    if (el) el.classList.add('visible');
  }
})();

// Mobile chapter progress dots
(function() {
  var chapters = document.querySelectorAll('[data-chapter]');
  var dots = document.querySelectorAll('.bp-dot');
  if (!chapters.length || !dots.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = parseInt(entry.target.getAttribute('data-chapter'), 10) - 1;
        dots.forEach(function(d) { d.classList.remove('active'); });
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  chapters.forEach(function(c) { obs.observe(c); });
  if (dots[0]) dots[0].classList.add('active');
})();

// Score ring animation
(function() {
  var ring = document.querySelector('.bp-score-progress');
  if (!ring) return;
  var score = parseFloat(ring.getAttribute('data-score')) || 0;
  var r = 96; var circumference = 2 * Math.PI * r;
  var offset = circumference - (score / 100) * circumference;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference;
  setTimeout(function() {
    ring.style.transition = 'stroke-dashoffset 1.5s ease';
    ring.style.strokeDashoffset = offset;
  }, 600);
})();

function downloadBlueprintPDF() {
  var btn = event && event.target;
  var originalHTML = btn ? btn.innerHTML : '';
  try {
    var element = document.querySelector('.bp-page');
    if (!element) {
      alert('Blueprint content not found. Please refresh and try again.');
      return;
    }
    if (btn) { btn.innerHTML = 'Generating\u2026'; btn.disabled = true; }
    var clone = element.cloneNode(true);
    clone.querySelectorAll('.bp-feedback, button, .no-print').forEach(function(el) { el.remove(); });
    var footer = document.createElement('div');
    footer.style.cssText = 'margin-top:40px;padding-top:20px;border-top:1px solid #F0F0F0;text-align:center;font-size:11px;color:#86868B;font-family:Inter,sans-serif;';
    footer.textContent = 'Powered by Deep Work Interview \u2014 jamesguldan.com/deep-work';
    clone.appendChild(footer);
    var opt = {
      margin: [0.5, 0.5, 0.75, 0.5],
      filename: '` + fnSafe + `-blueprint.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    if (typeof html2pdf === 'undefined') {
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
      alert('PDF library not loaded. Please save this page as a PDF using File \u2192 Print \u2192 Save as PDF.');
      return;
    }
    html2pdf().set(opt).from(clone).save().then(function() {
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
      fetch('/api/track', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: '` + sid + `', eventType: 'pdf_downloaded' }) }).catch(function(){});
    }).catch(function(err) {
      console.error('PDF generation failed:', err);
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
      alert('PDF generation failed. You can save this page as a PDF using File \u2192 Print \u2192 Save as PDF.');
    });
  } catch(e) {
    if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
    alert('PDF generation failed. You can save this page as a PDF using File \u2192 Print \u2192 Save as PDF.');
  }
}

function copyBlueprintForAI() {
  var bp = window.__blueprintData;
  if (!bp) {
    alert('Blueprint data not available. Please refresh the page.');
    return;
  }
  var p1 = bp.part1 || {};
  var p2 = bp.part2 || {};
  var p3 = bp.part3 || {};
  var p4 = bp.part4 || {};
  var p5 = bp.part5 || {};
  var p7 = bp.part7 || {};
  var brandName = (Array.isArray(p1.brandNames) && p1.brandNames[0]) || '';
  var tagline = '';
  if (Array.isArray(p1.taglines) && p1.taglines.length) {
    var t0 = p1.taglines[0];
    tagline = typeof t0 === 'string' ? t0 : (t0.text || t0.tagline || '');
  }
  var colors = '';
  if (Array.isArray(p1.visualDirection && p1.visualDirection.colors)) {
    colors = p1.visualDirection.colors.map(function(c) { return '  ' + (c.name || 'Color') + ': ' + (c.hex || c); }).join('
');
  }
  var fonts = (p1.visualDirection && Array.isArray(p1.visualDirection.fonts)) ? p1.visualDirection.fonts : ['Outfit', 'Inter'];
  var aesthetic = (p1.visualDirection && p1.visualDirection.aesthetic) || 'Premium minimal. Clean white backgrounds. No gradients.';
  var brandVoice = Array.isArray(p1.brandVoice) ? p1.brandVoice.join(', ') : (p1.brandVoice || '');
  var coreBrandPromise = p1.coreBrandPromise || '';
  var wantToAchieve = p2.tryingToAchieve || p2.goalStatement || '';
  var whatStops = p2.whatIsStoppingThem || p2.barriers || '';
  var exactWords = '';
  if (Array.isArray(p2.exactWords) && p2.exactWords.length) {
    exactWords = p2.exactWords.map(function(w) { return typeof w === 'string' ? w : (w.text || w.quote || ''); }).filter(Boolean).join(' | ');
  }
  var nicheStatement = p3.nicheStatement || p3.uniqueMechanism || '';
  var headlines = '';
  if (Array.isArray(p7.heroHeadlineOptions) && p7.heroHeadlineOptions.length) {
    headlines = p7.heroHeadlineOptions.map(function(h, i) { return (i + 1) + '. ' + (typeof h === 'string' ? h : (h.text || h.headline || '')); }).join('
');
  }
  var offerLines = [];
  if (p4.entryOffer) offerLines.push((p4.entryOffer.name || 'Entry') + ' (' + (p4.entryOffer.price || 'TBD') + '): ' + (p4.entryOffer.description || ''));
  if (p4.coreOffer) offerLines.push((p4.coreOffer.name || 'Core') + ' (' + (p4.coreOffer.price || 'TBD') + '): ' + (p4.coreOffer.description || ''));
  if (p4.coreOffer2) offerLines.push((p4.coreOffer2.name || 'Core+') + ' (' + (p4.coreOffer2.price || 'TBD') + '): ' + (p4.coreOffer2.description || ''));
  if (p4.premiumOffer) offerLines.push((p4.premiumOffer.name || 'Premium') + ' (' + (p4.premiumOffer.price || 'TBD') + '): ' + (p4.premiumOffer.description || ''));
  var heroHeadline = (Array.isArray(p5.heroHeadlines) && p5.heroHeadlines[0]) || (Array.isArray(p7.heroHeadlineOptions) && p7.heroHeadlineOptions[0]) || '';
  if (typeof heroHeadline !== 'string') heroHeadline = heroHeadline.text || heroHeadline.headline || '';
  var heroSub = p5.heroSubheadline || '';
  var heroCTA = p5.heroCTA || 'Get Started';
  var sections = '';
  if (Array.isArray(p5.sections) && p5.sections.length) {
    sections = p5.sections.map(function(s) { return (s.name || s.title || s.section || '') + ': ' + (s.content || s.description || s.copy || ''); }).join('
');
  }
  var handoff = '## Design System

' +
    'Brand: ' + (brandName || 'My Brand') + '
' +
    'Niche: ' + nicheStatement + '

' +
    'Colors:
' + (colors || '  Primary: #1D1D1F
  Accent: #C4703F
  Background: #FFFFFF') + '

' +
    'Typography:
' +
    '  Headlines: ' + (fonts[0] || 'Outfit') + ' 700
' +
    '  Body: ' + (fonts[1] || 'Inter') + ' 400
' +
    '  Emotional: Playfair Display Italic (quotes and taglines only)

' +
    'Aesthetic: ' + aesthetic + '
' +
    'Buttons: Dark fill (#1D1D1F), white text, pill shape (50px radius). No copper button fills.

' +
    '## Brand Foundation

' +
    (tagline ? 'Tagline: ' + tagline + '
' : '') +
    (brandVoice ? 'Brand Voice: ' + brandVoice + '
' : '') +
    (coreBrandPromise ? 'Core Promise: ' + coreBrandPromise + '
' : '') +
    '
## Ideal Client

' +
    (wantToAchieve ? 'What they want: ' + wantToAchieve + '
' : '') +
    (whatStops ? 'What stops them: ' + whatStops + '
' : '') +
    (exactWords ? 'Their exact words: ' + exactWords + '
' : '') +
    '
## Positioning

' +
    'Niche: ' + nicheStatement + '

' +
    'Headline Options:
' + (headlines || 'None generated') + '

' +
    '## Offers

' + (offerLines.join('
') || 'None generated') + '

' +
    '## Website Blueprint

' +
    (heroHeadline ? 'Hero Headline: ' + heroHeadline + '
' : '') +
    (heroSub ? 'Hero Subheadline: ' + heroSub + '
' : '') +
    'Hero CTA: ' + heroCTA + '

' +
    (sections ? 'Page Sections:
' + sections + '

' : '') +
    '## Instructions

' +
    'Build a complete personal brand website using this blueprint. Follow the design tokens exactly. Start with the hero section using the headline and CTA above, then build each page section in order. Use clean white (#FFFFFF) backgrounds, the specified fonts from Google Fonts, and the color palette above. No emojis. No gradients. No dark mode. No dashes in copy (use periods, commas, or em dashes instead). Buttons should be dark pill shapes, never copper/accent colored.

' +
    'Learn more about Deep Work Interview: jamesguldan.com/deep-work';
  function showCopySuccess() {
    var toast = document.getElementById('bpAiCopySuccess');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(function() { toast.style.display = ''; }, 3000);
    }
    fetch('/api/track', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: '` + sid + `', eventType: 'ai_builder_copied' }) }).catch(function(){});
  }
  navigator.clipboard.writeText(handoff).then(function() {
    showCopySuccess();
  }).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = handoff;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(_) {}
    document.body.removeChild(ta);
    showCopySuccess();
  });
}
`;
}
function gradeClass(g) {
  if (!g)
    return "grade-c";
  var u = String(g).toUpperCase();
  if (u[0] === "A" || u[0] === "B")
    return "grade-ab";
  if (u[0] === "C")
    return "grade-c";
  return "grade-df";
}
function extractNicheLabel(bp) {
  var mech = bp.part3 ? bp.part3.uniqueMechanism || "" : "";
  if (mech) {
    var afterDash = mech.indexOf(" \u2014 ");
    var afterHyphen = mech.indexOf(" - ");
    var start = afterDash > 0 ? afterDash + 3 : afterHyphen > 0 ? afterHyphen + 3 : -1;
    if (start > 0) {
      var phrase = mech.substring(start);
      var stopPatterns = [" that ", " which ", " who ", " for ", " with ", " when ", " and ", ".", ","];
      var endIdx = phrase.length;
      for (var si = 0; si < stopPatterns.length; si++) {
        var sidx = phrase.toLowerCase().indexOf(stopPatterns[si]);
        if (sidx > 2 && sidx < endIdx)
          endIdx = sidx;
      }
      phrase = phrase.substring(0, endIdx).trim();
      var words = phrase.split(" ").slice(0, 4);
      return words.map(function(w) {
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      }).join(" ");
    }
  }
  var industry = bp.leadIntel ? bp.leadIntel.industry || "" : "";
  if (industry)
    return industry;
  return "";
}
function renderChapter1(bp, firstName, messageCount) {
  var letter = bp.personalLetter || {};
  var salutation = letter.salutation || firstName + ",";
  var italicOpening = letter.italicOpening || bp.personalIntro || "";
  var proseBody = letter.proseBody || "";
  if (!proseBody && bp.debrief) {
    proseBody = (bp.debrief.paragraph1 || "") + " " + (bp.debrief.paragraph2 || "") + " " + (bp.debrief.paragraph3 || "");
    proseBody = proseBody.trim();
  }
  if (!proseBody && bp.personalLetter && typeof bp.personalLetter === "string") {
    proseBody = bp.personalLetter;
  }
  if (!proseBody && bp.part1) {
    var parts = [];
    var promise = bp.part1.coreBrandPromise || "";
    var niche = bp.part3 ? bp.part3.nicheStatement || "" : "";
    var avatarName = bp.part2 ? bp.part2.name || "" : "";
    var avatarSituation = bp.part2 ? bp.part2.lifeSituation || "" : "";
    var firstMove = bp.part6 ? bp.part6.firstMove || "" : "";
    if (promise)
      parts.push("After everything you shared, one thing is unmistakably clear: " + promise + ". That is not a tagline someone wrote for you. That came directly from who you are and how you show up.");
    if (niche)
      parts.push(niche + (avatarName ? " " + avatarName + (avatarSituation ? ", " + avatarSituation.charAt(0).toLowerCase() + avatarSituation.slice(1) : "") + ", is out there right now looking for exactly what you offer." : "."));
    if (bp.part6 && Array.isArray(bp.part6.credibilityGaps) && bp.part6.credibilityGaps.length > 0)
      parts.push("There are a few gaps to close, and the blueprint below maps them out honestly. But the foundation you are building on is real.");
    if (firstMove)
      parts.push("Your first move: " + firstMove);
    proseBody = parts.join("\n\n");
  }
  var keyInsight = letter.keyInsight || "";
  var nicheLabel = extractNicheLabel(bp);
  var pillContent = nicheLabel ? escHtml(firstName) + " \xB7 " + escHtml(nicheLabel) : escHtml(firstName);
  var hasCount = typeof messageCount === "number" && messageCount > 0;
  var heroHTML = '<section class="bp-hero-reveal"><div class="bp-hero-top-border"></div><div class="bp-hero-inner"><div class="bp-hero-badge fade-up fade-up-d1">' + pillContent + '</div><div class="bp-hero-name fade-up fade-up-d1">' + escHtml(firstName) + "</div>" + (nicheLabel ? '<div class="bp-hero-niche fade-up fade-up-d2">' + escHtml(nicheLabel) + "</div>" : "") + '<div class="bp-hero-divider fade-up fade-up-d2"></div><div class="bp-hero-hook fade-up fade-up-d3">Here is what the world needs to hear from you.</div>' + (hasCount ? '<div class="bp-hero-proof"><strong class="bp-hero-count">' + messageCount + "</strong> messages. Every word below was built from yours.</div>" : "") + '</div><div class="bp-hero-begin"><span class="bp-hero-begin-text">Begin Reading</span><div class="bp-hero-begin-line"></div></div></section>';
  var letterHTML = '<section class="bp-section" style="padding-top: 48px;" id="bp-debrief-letter"><div class="bp-letter-card"><div class="bp-letter-salutation">' + escHtml(salutation) + "</div>" + (italicOpening ? '<div class="bp-letter-italic">' + escHtml(italicOpening) + "</div>" : "") + '<div style="height:24px;"></div><div class="bp-letter-body">' + formatProse(proseBody, keyInsight) + '</div><div class="bp-letter-signoff"><div class="bp-letter-signoff-name">James Guldan</div><div class="bp-letter-signoff-studio">Deep Work Studio</div></div></div></section>';
  return '<div data-chapter="1">' + heroHTML + letterHTML + "</div>";
}
function renderChapter2(bp) {
  var cs = bp.credibilityScore || {};
  var rawCs = bp.credibilityScore;
  if (typeof rawCs === "number") {
    cs = {};
  }
  if (!rawCs && bp.part6 && Array.isArray(bp.part6.credibilityGaps)) {
    var gapCount = bp.part6.credibilityGaps.length;
    var derivedScore = Math.max(20, 65 - gapCount * 12);
    var derivedGrade = derivedScore >= 60 ? "C+" : derivedScore >= 45 ? "C" : "C-";
    cs = {
      score: derivedScore,
      grade: derivedGrade,
      contextLine: "Most people in your space score between 30 and 55. This is a starting line, not a ceiling.",
      reframeLine: "Every gap below is a specific opportunity with a clear fix.",
      categories: bp.part6.credibilityGaps.map(function(gap, i) {
        var label = gap.length > 60 ? gap.substring(0, gap.indexOf(" ", 40)) || gap.substring(0, 60) : gap;
        return { name: "Gap " + (i + 1), grade: "D+", explanation: gap, nextStep: bp.part6.marketingOpportunities && bp.part6.marketingOpportunities[i] || "" };
      })
    };
  }
  var score = cs.score !== void 0 ? cs.score : typeof rawCs === "number" ? rawCs : 0;
  score = Number(score) || 0;
  var grade = cs.grade || "";
  var contextLine = cs.contextLine || "";
  var reframeLine = cs.reframeLine || "";
  var categories = Array.isArray(cs.categories) ? cs.categories : [];
  var ml = bp.marketLandscape || {};
  var competitors = Array.isArray(ml.competitors) ? ml.competitors : [];
  var quotes = Array.isArray(ml.marketQuotes) ? ml.marketQuotes : [];
  var rawAdv = ml.competitiveAdvantage || bp.marketBrief || "";
  var advantage = typeof rawAdv === "string" ? rawAdv : "";
  var r = 96;
  var circumference = 2 * Math.PI * r;
  var categoryHTML = categories.map(function(cat) {
    return '<div class="bp-score-card ' + gradeClass(cat.grade) + '"><div class="bp-score-card-name">' + escHtml(cat.name) + '</div><div class="bp-score-card-grade">' + escHtml(cat.grade) + '</div><div class="bp-score-card-explanation">' + escHtml(cat.explanation) + "</div>" + (cat.relatedMove ? '<div class="bp-score-card-move">Addressed by Move ' + cat.relatedMove + "</div>" : "") + "</div>";
  }).join("");
  var competitorHTML = competitors.length ? competitors.map(function(c) {
    return '<div class="bp-competitor-row"><div class="bp-competitor-name">' + escHtml(c.name) + '</div><div class="bp-competitor-pos">' + escHtml(c.positioning) + '</div><div class="bp-competitor-gap">' + escHtml(c.gap) + "</div></div>";
  }).join("") : "";
  var quotesHTML = quotes.length ? quotes.map(function(q) {
    return '<div class="bp-quote-item"><div class="bp-quote-mark">\u201C</div><div class="bp-quote-text">' + escHtml(q.quote) + '</div><div class="bp-quote-descriptor">' + escHtml(q.descriptor) + "</div></div>";
  }).join("") : "";
  return '<div id="chapter2" data-chapter="2"><div class="chapter-divider"><span class="chapter-divider-label">Chapter 2: The Diagnosis</span></div><section class="bp-section"><div class="bp-inner bp-center"><div class="bp-score-ring-wrap"><div class="bp-score-ring"><svg width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="' + r + '" fill="none" stroke="#F0F0F0" stroke-width="8"/><circle class="bp-score-progress" cx="100" cy="100" r="' + r + '" fill="none" stroke="#D97706" stroke-width="8" stroke-linecap="round" data-score="' + Number(score) + '" style="stroke-dasharray:' + circumference.toFixed(2) + ";stroke-dashoffset:" + circumference.toFixed(2) + '"/></svg><div class="bp-score-number"><div class="bp-score-num">' + Number(score) + '</div><div class="bp-score-grade">' + escHtml(grade) + "</div></div></div></div>" + (contextLine ? '<div class="bp-context-line">' + escHtml(contextLine) + "</div>" : "") + (categoryHTML ? '<div class="bp-score-grid">' + categoryHTML + "</div>" : "") + (reframeLine ? '<div class="bp-reframe">' + escHtml(reframeLine) + "</div>" : "") + "</div></section>" + (competitorHTML || quotesHTML || advantage ? '<section class="bp-section" style="padding-top: 0;"><div class="bp-inner"><div class="eyebrow" style="margin-bottom:24px;">Market Landscape</div>' + (competitorHTML ? "<div>" + competitorHTML + "</div>" : "") + (quotesHTML ? '<div class="bp-market-quotes">' + quotesHTML + "</div>" : "") + (advantage ? '<div class="bp-advantage-hero">' + escHtml(advantage) + "</div>" : "") + "</div></section>" : "") + "</div>";
}
function renderChapter3(bp) {
  var ic = bp.idealClient || {};
  if (!ic.portrait && bp.part2) {
    ic.portrait = (bp.part2.name || "") + (bp.part2.ageRange ? ", " + bp.part2.ageRange : "") + (bp.part2.lifeSituation ? ". " + bp.part2.lifeSituation : "");
    ic.fears = bp.part2.whatIsStoppingThem || "";
    ic.exactWords = Array.isArray(bp.part2.exactWords) ? bp.part2.exactWords.join(". ") : bp.part2.exactWords || "";
    ic.triedSolutions = (Array.isArray(bp.part2.alreadyTried) ? bp.part2.alreadyTried.join(". ") : "") + (bp.part2.whyItDidNotWork ? " " + bp.part2.whyItDidNotWork : "");
    ic.wants = bp.part2.tryingToAchieve || "";
  }
  if (!ic.portrait && bp.part3) {
    ic.portrait = bp.part3.dreamCustomer || "";
  }
  if (!ic.connectionStatement && bp.part3) {
    ic.connectionStatement = bp.part3.nicheStatement || "";
  }
  var bf = bp.brandFoundation || {};
  if (!bf.brandName && bp.part1) {
    bf.brandName = Array.isArray(bp.part1.brandNames) ? bp.part1.brandNames[0] : bp.part1.brandName || "";
    bf.tagline = Array.isArray(bp.part1.taglines) ? bp.part1.taglines[0] : bp.part1.tagline || "";
    bf.positioningStatement = bp.part1.coreBrandPromise || "";
    if (bp.part1.brandVoice) {
      bf.voiceGuide = { doSay: bp.part1.brandVoice.doSay || bp.part1.toneKeywords || [], neverSay: bp.part1.brandVoice.neverSay || [] };
    } else if (bp.part1.toneKeywords) {
      bf.voiceGuide = { doSay: bp.part1.toneKeywords, neverSay: [] };
    }
  }
  if (!bf.colorPalette && bp.part1 && bp.part1.visualDirection && Array.isArray(bp.part1.visualDirection.colors)) {
    bf.colorPalette = bp.part1.visualDirection.colors.map(function(c) {
      return { hex: c.hex, name: c.name, narrative: "" };
    });
    if (bp.part1.visualDirection.fonts) {
      bf.typographySpec = {
        headline: { family: bp.part1.visualDirection.fonts.heading || "Outfit", weight: "700", sample: bf.tagline || bf.brandName || "" },
        body: { family: bp.part1.visualDirection.fonts.body || "Inter", weight: "400", sample: bp.part1.visualDirection.aesthetic || "" }
      };
    }
  }
  if (!bf.colorPalette && bp.part8) {
    var colors = bp.part8.brandColors || [];
    var names = bp.part8.colorNames || [];
    bf.colorPalette = colors.map(function(hex, i) {
      return { hex, name: names[i] || hex, narrative: "" };
    });
  }
  var palette = Array.isArray(bf.colorPalette) ? bf.colorPalette : [];
  var voice = bf.voiceGuide || {};
  var doSay = Array.isArray(voice.doSay) ? voice.doSay : [];
  var neverSay = Array.isArray(voice.neverSay) ? voice.neverSay : [];
  var typo = bf.typographySpec || {};
  var hl = typo.headline || {};
  var bd = typo.body || {};
  var swatchHTML = palette.map(function(c) {
    return '<div class="bp-color-swatch-wrap"><div class="bp-color-swatch" style="background:' + escHtml(c.hex) + ';"></div><div class="bp-color-hex">' + escHtml(c.hex) + "</div>" + (c.narrative ? '<div class="bp-color-narrative">' + escHtml(c.narrative) + "</div>" : "") + "</div>";
  }).join("");
  return '<div id="chapter3" data-chapter="3"><div class="chapter-divider"><span class="chapter-divider-label">Chapter 3: The Blueprint</span><div class="chapter-divider-sub">Everything from here forward was built to reach one specific person.</div></div><section class="bp-section"><div class="bp-inner"><div class="eyebrow" style="margin-bottom:24px;">Your Ideal Client</div>' + (ic.portrait ? '<div class="bp-portrait">' + escHtml(ic.portrait) + "</div>" : "") + (ic.fears ? '<span class="bp-client-label">What Keeps Them Up</span><div class="bp-client-text">' + escHtml(ic.fears) + "</div>" : "") + (ic.exactWords ? '<span class="bp-client-label">Their Exact Words</span><div class="bp-client-text">' + escHtml(ic.exactWords) + "</div>" : "") + (ic.triedSolutions ? `<span class="bp-client-label">What They've Tried</span><div class="bp-client-text">` + escHtml(ic.triedSolutions) + "</div>" : "") + (ic.wants ? '<span class="bp-client-label">What They Want</span><div class="bp-client-text">' + escHtml(ic.wants) + "</div>" : "") + (ic.connectionStatement ? '<div class="bp-connection">' + escHtml(ic.connectionStatement) + "</div>" : "") + '</div></section><section class="bp-section" style="border-top:1px solid var(--border); padding-top: 48px;"><div class="bp-inner"><div class="eyebrow" style="margin-bottom:16px;">Brand Foundation</div>' + (bf.brandName || bf.tagline ? '<div class="bp-brand-name-hero">' + (bf.brandName ? '<div class="bp-brand-name">' + escHtml(bf.brandName) + "</div>" : "") + (bf.tagline ? '<div class="bp-brand-tagline">' + escHtml(bf.tagline) + "</div>" : "") + "</div>" : "") + (swatchHTML ? '<div class="eyebrow" style="margin-bottom:16px;">Color Palette</div><div class="bp-color-strip">' + swatchHTML + "</div>" : "") + (hl.sample || bd.sample ? '<div class="bp-type-specimen">' + (hl.sample ? '<div style="font-family:Outfit,sans-serif;font-weight:700;font-size:28px;color:var(--text);letter-spacing:-0.02em;">' + escHtml(hl.sample) + '</div><span class="bp-type-label">' + escHtml(hl.family || "Outfit") + " " + escHtml(hl.weight || "700") + " &mdash; Headline</span>" : "") + (bd.sample ? '<div style="font-family:Inter,sans-serif;font-size:15px;color:#555;line-height:1.75;margin-top:20px;">' + escHtml(bd.sample) + '</div><span class="bp-type-label">' + escHtml(bd.family || "Inter") + " " + escHtml(bd.weight || "400") + " &mdash; Body</span>" : "") + "</div>" : "") + (doSay.length || neverSay.length ? '<div class="bp-voice-grid"><div class="bp-voice-col bp-voice-do"><div class="bp-voice-header">Do Say</div><div class="bp-voice-items">' + doSay.map(function(s) {
    return '<div class="bp-voice-item">' + escHtml(s) + "</div>";
  }).join("") + '</div></div><div class="bp-voice-col bp-voice-dont"><div class="bp-voice-header">Never Say</div><div class="bp-voice-items">' + neverSay.map(function(s) {
    return '<div class="bp-voice-item">' + escHtml(s) + "</div>";
  }).join("") + "</div></div></div>" : "") + (bf.positioningStatement ? '<div class="bp-positioning-hero">' + escHtml(bf.positioningStatement) + "</div>" : "") + "</div></section></div>";
}
function renderChapter4(bp, sessionId, firstName) {
  var moves = Array.isArray(bp.firstThreeMoves) ? bp.firstThreeMoves : [];
  if (!moves.length && bp.firstMoves) {
    if (typeof bp.firstMoves === "string") {
      moves = [{ title: "First Move", instruction: bp.firstMoves }];
    } else if (Array.isArray(bp.firstMoves)) {
      moves = bp.firstMoves.map(function(m) {
        return typeof m === "string" ? { title: "", instruction: m } : m;
      });
    }
  }
  if (!moves.length && bp.part6) {
    if (bp.part6.firstMove) {
      moves.push({ title: "Your First Move", instruction: bp.part6.firstMove, deadline: "DO THIS THIS WEEK" });
    }
    if (Array.isArray(bp.part6.marketingOpportunities)) {
      bp.part6.marketingOpportunities.slice(0, 2).forEach(function(opp, i) {
        var shortTitle = opp.length > 80 ? opp.substring(0, opp.indexOf(" ", 40) || 80) : opp;
        var firstSentenceEnd = shortTitle.indexOf(".");
        if (firstSentenceEnd > 10 && firstSentenceEnd < 80)
          shortTitle = shortTitle.substring(0, firstSentenceEnd);
        else if (shortTitle.indexOf(" \u2014 ") > 0)
          shortTitle = shortTitle.substring(0, shortTitle.indexOf(" \u2014 "));
        else if (shortTitle.indexOf(" - ") > 0)
          shortTitle = shortTitle.substring(0, shortTitle.indexOf(" - "));
        moves.push({ title: shortTitle, instruction: opp });
      });
    }
  }
  var proj = bp.projectedScore || {};
  var closingLine = bp.closingLine || "You walked in here as someone with a business. You are leaving as someone with a brand. The difference is, now it sounds like you.";
  var sid = escHtml(sessionId || "");
  var moveCards = moves.map(function(move, i) {
    return '<div class="bp-move-card"><div class="bp-move-num">0' + (i + 1) + "</div>" + (move.addressesGap ? '<div class="bp-move-gap-tag">Addresses: ' + escHtml(move.addressesGap) + "</div>" : "") + (move.title ? '<div class="bp-move-title">' + escHtml(move.title) + "</div>" : "") + (move.instruction ? '<div class="bp-move-instruction">' + escHtml(move.instruction) + "</div>" : "") + (move.copyContent ? '<div class="bp-copy-block" id="copy-block-' + i + '">' + escHtml(move.copyContent) + `</div><button class="btn-copy" onclick="copyBlock(this, document.getElementById('copy-block-` + i + `').textContent)">Copy</button>` : "") + (move.deadline ? '<div class="bp-move-deadline">' + escHtml(move.deadline) + "</div>" : "") + "</div>";
  }).join("");
  var calendlyBase = bp.part8 && bp.part8.guidedPath && bp.part8.guidedPath.calendlyUrl || "https://calendly.com/james-jamesguldan/deep-work-review-consult";
  var calendlyParams = "utm_source=blueprint&utm_medium=footer&utm_campaign=dwi";
  if (firstName && firstName !== "Friend")
    calendlyParams += "&name=" + encodeURIComponent(firstName);
  var calendlyUrl = calendlyBase + (calendlyBase.indexOf("?") >= 0 ? "&" : "?") + calendlyParams;
  var footerHTML = `<div class="bp-blueprint-footer"><div class="bp-footer-copper-divider"></div><div class="bp-footer-content"><div class="bp-gap-cta"><div class="bp-gap-top"><div class="bp-gap-eyebrow">YOUR BLUEPRINT IS READY. YOUR STRATEGY ISN'T.</div><div class="bp-gap-headline">You have the map.<br>Let's build the route.</div><div class="bp-gap-sub">Your blueprint shows you what to build. A strategy call shows you what to build first, what to skip, and what will actually move the needle in the next 30 days.</div></div><div class="bp-gap-columns"><div class="bp-gap-col"><div class="bp-gap-col-label">WHAT YOUR BLUEPRINT GIVES YOU</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Brand positioning and voice</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Ideal client profile</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Offer suite and pricing</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Website structure and headlines</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Credibility gaps identified</div></div><div class="bp-gap-col"><div class="bp-gap-col-label">WHAT THE STRATEGY CALL ADDS</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Prioritized 90-day action plan</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Which offer to launch first (and why)</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Content strategy for your first 10 posts</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Tech stack recommendations for your budget</div><div class="bp-gap-item"><div class="bp-gap-check">&#x2713;</div>Live review of your biggest credibility gap</div></div></div><div class="bp-gap-bottom"><div class="bp-gap-prep">Before we talk, I will read through your complete blueprint. Your narrative brief, your positioning, your offer structure, your gap analysis. All of it.</div><div class="bp-gap-prep">On the call we spend about an hour on three things: what I see from the outside that is hard to spot from inside your own brand, the specific gap between where you are and where you are headed, and the most impactful next move given what came up in your session.</div><div class="bp-gap-prep">Some people leave with a clear plan they execute on their own. Some want ongoing support. Both are good outcomes.</div><div class="bp-gap-pull-quote">This is not a sales call. It is a working session. Come ready to think.</div><div class="bp-gap-price">$197</div><div class="bp-gap-price-note">60-minute 1:1 strategy call with James</div><a class="bp-gap-book-btn" href="` + escHtml(calendlyUrl) + `" target="_blank" rel="noopener" onclick="fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'` + escHtml(sessionId) + `',eventType:'cta_book_call'})}).catch(function(){})">Book Your Strategy Call</a><div class="bp-gap-guarantee">100% satisfaction guaranteed. If the call doesn't give you a clear next step, you pay nothing.</div></div></div><div class="bp-ai-builder"><div class="bp-ai-builder-title">Build Your Site With AI</div><div class="bp-ai-builder-desc">Copy your brand blueprint as a design spec and paste it into any AI website builder. Your colors, typography, voice, positioning, and headlines are all included.</div><button style="display:inline-flex;align-items:center;gap:8px;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;color:white;background:#1D1D1F;padding:12px 28px;border-radius:50px;border:none;cursor:pointer;" onclick="copyBlueprintForAI()"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="8" height="10" rx="1.5" stroke="white" stroke-width="1.2"/><path d="M5 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" stroke="white" stroke-width="1.2"/></svg>Copy Blueprint for AI Builder</button><div class="bp-ai-copy-success" id="bpAiCopySuccess">Copied. Paste into Lovable, Bolt, v0, or Cursor.</div><div class="bp-ai-builder-tools">Works with Lovable, Bolt, v0, Cursor, Replit, and more</div></div><div class="bp-pdf-section"><div class="bp-pdf-section-desc">Want to keep a copy? Download your full blueprint as a PDF to reference anytime.</div><button style="display:inline-flex;align-items:center;gap:8px;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;color:#1D1D1F;background:transparent;padding:12px 28px;border-radius:50px;border:1px solid #E8E8E8;cursor:pointer;" onclick="downloadBlueprintPDF()" id="bpPdfBtn"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M7 9l-3-3M7 9l3-3M1 12h12" stroke="#1D1D1F" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Download Blueprint PDF</button></div><div class="bp-footer-signature"><div class="bp-footer-sig-copper"></div><div class="bp-footer-sig-desc">Built from your words during a Deep Work Interview. Every insight was scored for depth and structured for you to build on.</div><div class="bp-footer-sig-name">James Guldan</div><div class="bp-footer-sig-role">Deep Work Studio &mdash; <a href="https://jamesguldan.com/deep-work" style="color:#C4703F;text-decoration:none;">jamesguldan.com/deep-work</a></div></div></div></div>`;
  return '<div id="chapter4" data-chapter="4"><div class="chapter-divider"><span class="chapter-divider-label">Chapter 4: The Action</span><div class="chapter-divider-sub">Three things to do this week that change everything.</div></div><section class="bp-section"><div class="bp-inner-wide">' + (moveCards ? '<div class="bp-moves-grid">' + moveCards + "</div>" : "") + (proj.current && proj.projected ? '<div class="bp-score-projection">Complete all 3 moves and your Credibility Score jumps from <span class="bp-projection-num">' + Number(proj.current) + '</span> to an estimated <span class="bp-projection-num">' + Number(proj.projected) + '</span> (<span class="bp-projection-num">' + escHtml(proj.projectedGrade || "") + "</span>).</div>" : "") + '</div></section><section class="bp-section" style="padding-top: 0;"><div class="bp-inner"><div class="bp-closing-line">' + escHtml(closingLine) + "</div>" + footerHTML + '<div class="bp-feedback"><div class="bp-feedback-label">One last thing.</div><div class="bp-feedback-question">Did this feel like it really understood you?</div><div class="bp-feedback-pills">' + ["Deeply", "Somewhat", "Not quite"].map(function(label) {
    return `<button class="bp-feedback-pill" onclick="submitFeedback('` + escHtml(label) + `')">` + escHtml(label) + "</button>";
  }).join("") + '</div><div class="bp-feedback-response"></div></div></div></section></div>';
}
function renderNicheSection(bp) {
  var p3 = bp.part3;
  if (!p3)
    return "";
  var hasContent = p3.whoTheyServe || p3.whoTheyDoNotServe || p3.uniqueMechanism || p3.competitorGap;
  if (!hasContent)
    return "";
  return '<section class="bp-section" style="border-top:1px solid var(--border); padding-top: 48px;"><div class="bp-inner"><div class="eyebrow" style="margin-bottom:24px;">Niche Positioning</div>' + (p3.uniqueMechanism ? `<div style="font-family:'Playfair Display',serif;font-style:italic;font-size:22px;color:var(--text);line-height:1.6;margin-bottom:32px;text-align:center;">` + escHtml(p3.uniqueMechanism) + "</div>" : "") + (p3.whoTheyServe ? '<div class="bp-niche-block"><span class="bp-client-label">Who You Serve</span><div class="bp-client-text">' + escHtml(p3.whoTheyServe) + "</div></div>" : "") + (p3.whoTheyDoNotServe ? '<div class="bp-niche-block"><span class="bp-client-label">Who You Do Not Serve</span><div class="bp-client-text" style="color:var(--text2);">' + escHtml(p3.whoTheyDoNotServe) + "</div></div>" : "") + (p3.competitorGap ? '<div class="bp-niche-block" style="margin-top:24px;padding:24px;background:var(--bg2);border-radius:var(--radius-sm);"><span class="bp-client-label">Your Competitive Gap</span><div class="bp-client-text">' + escHtml(p3.competitorGap) + "</div></div>" : "") + "</div></section>";
}
function renderOfferSuite(bp) {
  var p4 = bp.part4;
  if (!p4)
    return "";
  var offers = [];
  if (p4.entryOffer)
    offers.push(p4.entryOffer);
  if (p4.coreOffer)
    offers.push(p4.coreOffer);
  if (p4.coreOffer2)
    offers.push(p4.coreOffer2);
  if (p4.premiumOffer)
    offers.push(p4.premiumOffer);
  if (!offers.length)
    return "";
  var tierLabels = ["Entry", "Core", "Core+", "Premium"];
  var offerCards = offers.map(function(o, i) {
    var isPremium = i === offers.length - 1 && offers.length > 1;
    return '<div class="bp-offer-card' + (isPremium ? " bp-offer-premium" : "") + '"><div class="bp-offer-tier">' + escHtml(tierLabels[i] || "") + '</div><div class="bp-offer-name">' + escHtml(o.name || "") + "</div>" + (o.price ? '<div class="bp-offer-price">' + escHtml(o.price) + "</div>" : "") + (o.description ? '<div class="bp-offer-desc">' + escHtml(o.description) + "</div>" : "") + (o.delivery ? '<div class="bp-offer-delivery">' + escHtml(o.delivery) + "</div>" : "") + "</div>";
  }).join("");
  return '<div class="chapter-divider"><span class="chapter-divider-label">Your Offer Suite</span><div class="chapter-divider-sub">Four doors. Each one built for a different version of your ideal client.</div></div><section class="bp-section"><div class="bp-inner-wide"><div class="bp-offers-grid">' + offerCards + "</div>" + (p4.ascensionLogic ? '<div class="bp-ascension"><div class="eyebrow" style="margin-bottom:12px;">The Ascension Logic</div><div class="bp-client-text" style="font-style:italic;color:var(--text2);">' + escHtml(p4.ascensionLogic) + "</div></div>" : "") + "</div></section>";
}
function renderHeadlines(bp) {
  var p7 = bp.part7;
  if (!p7)
    return "";
  var headlines = Array.isArray(p7.heroHeadlineOptions) ? p7.heroHeadlineOptions : [];
  var taglines = Array.isArray(p7.taglineOptions) ? p7.taglineOptions : [];
  var pos = p7.positioningStatements || {};
  if (!headlines.length && !taglines.length && !pos.website)
    return "";
  var headlineHTML = headlines.length ? '<div class="eyebrow" style="margin-bottom:16px;">Hero Headline Options</div><div class="bp-headlines-list">' + headlines.map(function(h, i) {
    return '<div class="bp-headline-option' + (i === 0 ? " bp-headline-featured" : "") + '"><span class="bp-headline-num">0' + (i + 1) + '</span><span class="bp-headline-text">' + escHtml(h) + "</span></div>";
  }).join("") + "</div>" : "";
  var taglineHTML = taglines.length ? '<div class="eyebrow" style="margin-bottom:16px;margin-top:32px;">Tagline Options</div><div class="bp-taglines-list">' + taglines.map(function(t) {
    return '<div class="bp-tagline-item">' + escHtml(t) + "</div>";
  }).join("") + "</div>" : "";
  var posHTML = "";
  if (pos.website || pos.social || pos.inPerson) {
    posHTML = '<div style="margin-top:40px;"><div class="eyebrow" style="margin-bottom:16px;">Positioning Statements</div><div class="bp-positioning-grid">' + (pos.website ? '<div class="bp-positioning-card"><div class="bp-positioning-context">Website</div><div class="bp-positioning-text">' + escHtml(pos.website) + "</div></div>" : "") + (pos.social ? '<div class="bp-positioning-card"><div class="bp-positioning-context">Social Media</div><div class="bp-positioning-text">' + escHtml(pos.social) + "</div></div>" : "") + (pos.inPerson ? '<div class="bp-positioning-card"><div class="bp-positioning-context">In Person</div><div class="bp-positioning-text">' + escHtml(pos.inPerson) + "</div></div>" : "") + "</div></div>";
  }
  return '<div class="chapter-divider"><span class="chapter-divider-label">Your Headlines &amp; Positioning</span><div class="chapter-divider-sub">The exact words that make the right person stop scrolling.</div></div><section class="bp-section"><div class="bp-inner">' + headlineHTML + taglineHTML + posHTML + "</div></section>";
}
function renderWebsiteBlueprint(bp) {
  var p5 = bp.part5;
  if (!p5)
    return "";
  var sections = Array.isArray(p5.sections) ? p5.sections : [];
  var heroHeadlines = Array.isArray(p5.heroHeadlines) ? p5.heroHeadlines : [];
  var proofNumbers = Array.isArray(p5.proofNumbers) ? p5.proofNumbers : [];
  if (!sections.length && !heroHeadlines.length && !p5.pageNarrative)
    return "";
  var narrativeHTML = p5.pageNarrative ? `<div style="font-family:'Playfair Display',serif;font-style:italic;font-size:18px;color:var(--text);line-height:1.7;margin-bottom:40px;padding:24px 32px;border-left:3px solid var(--gold);">` + escHtml(p5.pageNarrative) + "</div>" : "";
  var heroHTML = "";
  if (heroHeadlines.length || p5.heroSubheadline || p5.heroCTA) {
    heroHTML = '<div class="bp-website-hero-preview"><div class="eyebrow" style="margin-bottom:12px;">Hero Section</div>' + (heroHeadlines.length ? '<div class="bp-website-hero-headline">' + escHtml(heroHeadlines[0]) + "</div>" : "") + (p5.heroSubheadline ? '<div class="bp-website-hero-sub">' + escHtml(p5.heroSubheadline) + "</div>" : "") + (p5.heroCTA ? '<div class="bp-website-hero-cta">' + escHtml(p5.heroCTA) + "</div>" : "") + (heroHeadlines.length > 1 ? '<div class="bp-alt-headlines"><span class="bp-client-label">Alternate Headlines</span>' + heroHeadlines.slice(1).map(function(h) {
      return '<div class="bp-alt-headline">' + escHtml(h) + "</div>";
    }).join("") + "</div>" : "") + "</div>";
  }
  var sectionsHTML = sections.length ? '<div class="eyebrow" style="margin-bottom:20px;margin-top:40px;">Page Sections</div><div class="bp-website-sections">' + sections.map(function(s, i) {
    return '<div class="bp-website-section-card ' + (s.visualMood === "dark" ? "bp-section-dark" : s.visualMood === "accent" ? "bp-section-accent" : "") + '"><div class="bp-website-section-num">0' + (i + 1) + '</div><div class="bp-website-section-name">' + escHtml(s.name || "") + "</div>" + (s.purpose ? '<div class="bp-website-section-purpose">' + escHtml(s.purpose) + "</div>" : "") + (s.content ? '<div class="bp-website-section-content">' + escHtml(s.content) + "</div>" : "") + (s.confidence ? '<div class="bp-website-section-conf">Confidence: ' + s.confidence + "%</div>" : "") + "</div>";
  }).join("") + "</div>" : "";
  var proofHTML = proofNumbers.length ? '<div class="eyebrow" style="margin-bottom:16px;margin-top:40px;">Proof Numbers</div><div class="bp-proof-strip">' + proofNumbers.map(function(p) {
    return '<div class="bp-proof-item"><div class="bp-proof-stat">' + escHtml(p.stat) + '</div><div class="bp-proof-label">' + escHtml(p.label) + "</div>" + (p.context ? '<div class="bp-proof-context">' + escHtml(p.context) + "</div>" : "") + "</div>";
  }).join("") + "</div>" : "";
  var testimonialHTML = p5.bestTestimonial && p5.bestTestimonial.quote ? '<div class="bp-best-testimonial"><div class="bp-testimonial-mark">\u201C</div><div class="bp-testimonial-quote">' + escHtml(p5.bestTestimonial.quote) + "</div>" + (p5.bestTestimonial.attribution ? '<div class="bp-testimonial-attr">' + escHtml(p5.bestTestimonial.attribution) + "</div>" : "") + "</div>" : "";
  var contraryHTML = p5.contraryBelief ? '<div style="margin-top:40px;padding:28px;background:var(--bg2);border-radius:var(--radius-sm);"><div class="eyebrow" style="margin-bottom:12px;">Your Contrary Belief</div><div class="bp-client-text" style="font-style:italic;">' + escHtml(p5.contraryBelief) + "</div></div>" : "";
  return '<div class="chapter-divider"><span class="chapter-divider-label">Your Website Blueprint</span><div class="chapter-divider-sub">The page that turns a stranger into someone who says &ldquo;how did she know.&rdquo;</div></div><section class="bp-section"><div class="bp-inner">' + narrativeHTML + heroHTML + sectionsHTML + proofHTML + testimonialHTML + contraryHTML + "</div></section>";
}
function renderBlueprintResults(bp, userName, apolloData, messageCount) {
  var firstName = (userName || "Friend").split(" ")[0];
  var sessionId = bp.sessionId || "";
  var bpDataJson = JSON.stringify(bp).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\//g, "\\u002f");
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Deep Work Blueprint</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@1,400;1,600&display=swap" rel="stylesheet"><script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script><style>' + getBlueprintCSS() + '</style></head><body><div id="bp-progress-bar">' + ["Opening", "Diagnosis", "Blueprint", "Action"].map(function(label) {
    return '<div class="bp-dot"><span class="bp-dot-label">' + escHtml(label) + "</span></div>";
  }).join("") + '</div><div class="bp-page">' + renderChapter1(bp, firstName, messageCount) + '<div style="text-align:center; padding: 8px 0 16px; font-size: 12px; color: #86868B; font-family: Inter, sans-serif; letter-spacing: 0.01em;">This blueprint was crafted by AI from your interview. Every insight is drawn from what you shared.</div>' + renderChapter2(bp) + renderChapter3(bp) + renderNicheSection(bp) + renderOfferSuite(bp) + renderHeadlines(bp) + renderWebsiteBlueprint(bp) + renderChapter4(bp, sessionId, firstName) + "</div><script>window.__blueprintData=" + bpDataJson + ";<\/script><script>" + getBlueprintJS(sessionId, firstName) + "<\/script></body></html>";
}
init_resend();
async async function loadBlueprintForSession(env, sessionId) {
  try {
    const metaRaw = await env.SESSIONS.get("bp_meta:" + sessionId);
    if (metaRaw) {
      const meta = JSON.parse(metaRaw);
      if (meta.blueprint)
        return meta;
    }
  } catch (_) {
  }
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return null;
  const session = JSON.parse(raw);
  const bp = session.blueprint?.blueprint || session.blueprint;
  if (!bp)
    return null;
  return {
    blueprint: bp,
    name: bp.name || bp.debrief?.recipientName || session.name || session.userName || "",
    apolloData: session.apolloData || null,
    messageCount: Array.isArray(session.messages) ? session.messages.length : 0
  };
}
async async function handleBlueprintRender(request, env) {
  const { sessionId } = await request.json();
  if (!sessionId)
    return json({ error: "Missing sessionId" }, 400);
  const meta = await loadBlueprintForSession(env, sessionId);
  if (!meta)
    return json({ error: "Blueprint not found" }, 404);
  const html = renderBlueprintResults(meta.blueprint, meta.name, meta.apolloData, meta.messageCount);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", ...CORS }
  });
}

export { handleBlueprintRender };
