// src/routes/pages.js
// Static page handlers (HTML, legal, logout, health)
// These wrap the template functions from src/html/ and src/legal.js

import { json, htmlHeaders } from '../utils/helpers.js';
import { getHTML } from '../html/templates.js';
import {
  getLoginHTML, getPrivacyPolicyHTML, getTermsOfServiceHTML, getLegalHTML
} from '../html/server-pages.js';
import { getAdminHTML } from '../html/admin.js';

export function handleRoot(request, env) {
  return new Response(getLoginHTML(), { headers: htmlHeaders() });
}

export function handleApp(request, env) {
  const html = getHTML({
    STRIPE_PRICE_BLUEPRINT: "price_1TCXL7FArNSFW9mB5DDauxQg",
    STRIPE_PRICE_CALL: "price_1TCXL8FArNSFW9mBBtiWVRCb",
    STRIPE_PRICE_SITE: "price_1TCpHrFArNSFW9mBu0kQISZi"
  });
  return new Response(html, { headers: htmlHeaders() });
}

export function handleAdmin(request, env) {
  return new Response(getAdminHTML(), { headers: htmlHeaders() });
}

export function handleLogout(request, env) {
  return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>Signing out...</title>
<style>body{font-family:sans-serif;background:#FDFCFA;display:flex;align-items:center;justify-content:center;height:100vh;color:#1a1a1a;}</style>
</head><body><p>Signing out...</p>
<script>
localStorage.removeItem('dw_session');
localStorage.removeItem('dw_admin_token');
document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
window.location.replace('/');
<\/script></body></html>`, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Set-Cookie": "dw_session=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax; HttpOnly"
    }
  });
}

export function handlePrivacy(request, env) {
  return new Response(getPrivacyPolicyHTML(), { headers: htmlHeaders() });
}

export function handleTerms(request, env) {
  return new Response(getTermsOfServiceHTML(), { headers: htmlHeaders() });
}

export function handleLegalTerms(request, env) {
  return new Response(getLegalHTML("Terms of Service", `
    <p>Last updated: March 2025</p>
    <h2>1. Service Description</h2>
    <p>Deep Work App is an AI-powered brand strategy tool provided by Align Consulting LLC ("we", "us", "our"). By purchasing and using this service, you agree to these terms.</p>
    <h2>2. Payment & Refunds</h2>
    <p>Payments are processed securely via Stripe. Due to the digital and instant-delivery nature of this product, all sales are final. If you experience a technical issue that prevents access, contact us at james@jamesguldan.com within 7 days.</p>
    <h2>3. Intellectual Property</h2>
    <p>All content you generate through the service is owned by you. The platform, prompts, and software are owned by Align Consulting LLC.</p>
    <h2>4. Acceptable Use</h2>
    <p>You may not use this service for unlawful purposes, to generate spam, or to reverse-engineer our AI systems. We reserve the right to terminate access for misuse.</p>
    <h2>5. Disclaimer</h2>
    <p>Results are not guaranteed. The AI-generated brand strategy is a starting point, not a substitute for professional business advice.</p>
    <h2>6. Contact</h2>
    <p>Questions? Email <a href="mailto:james@jamesguldan.com">james@jamesguldan.com</a></p>
  `), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}

export function handleLegalPrivacy(request, env) {
  return new Response(getLegalHTML("Privacy Policy", `
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
  `), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}

export function handleHealth(request, env) {
  return json({ ok: true, ts: Date.now() });
}
