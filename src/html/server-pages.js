// src/html/server-pages.js
// Server-side HTML page generators (non-app pages)

export function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work App \u2014 Sign In</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #FFFFFF;
    --bg2:     #FAFAFA;
    --accent:  #1D1D1F;
    --accent2: #2d2d2f;
    --text:    #1D1D1F;
    --muted:   #86868B;
    --border:  #F0F0F0;
    --border2: #E8E8E8;
    --error:   #c0392b;
    --success: #2d7a4f;
    --gold:    #C4703F;
  }

  html, body {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 80px 20px 40px;
  }

  /* NAV */
  .site-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 32px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    z-index: 10;
  }

  .nav-logo {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text);
    text-decoration: none;
  }

  /* CARD */
  .card {
    width: 100%;
    max-width: 400px;
  }

  .card-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .card-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    font-style: italic;
    color: var(--text);
    margin-bottom: 10px;
    line-height: 1.2;
  }

  .card-header p {
    font-size: 15px;
    color: var(--muted);
    line-height: 1.6;
  }

  .card-header em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--accent);
  }

  /* PANEL */
  .panel {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.07);
  }

  /* FORM */
  .form-group { margin-bottom: 16px; }

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    margin-bottom: 7px;
  }

  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 14px 16px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }

  input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }

  input::placeholder { color: #C4C0BB; }

  /* BUTTONS */
  .btn-primary {
    width: 100%;
    padding: 16px 32px;
    background: var(--accent);
    border: none;
    border-radius: 50px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.01em;
  }

  .btn-primary:hover {
    background: var(--accent2);
  }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

  /* STATUS */
  .status-box {
    display: none;
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
  }

  .status-box.error {
    background: rgba(192,57,43,0.06);
    border: 1px solid rgba(192,57,43,0.18);
    color: var(--error);
    display: block;
  }

  .status-box.success {
    background: rgba(45,122,79,0.06);
    border: 1px solid rgba(45,122,79,0.18);
    color: var(--success);
    display: block;
  }

  /* FOOTER */
  .footer-note {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }

  .footer-note a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
  }

  .legal-links {
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #C4C0BB;
  }

  .legal-links a {
    color: #C4C0BB;
    text-decoration: none;
    transition: color 0.2s;
  }

  .legal-links a:hover { color: var(--muted); }

  /* LOADING OVERLAY */
  .loading-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(253,252,250,0.96);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    align-items: center;
    justify-content: center;
    z-index: 100;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .loading-overlay.show { display: flex; }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .loading-overlay p {
    font-size: 15px;
    color: var(--muted);
  }

  .btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* VIEW TRANSITIONS */
  .view { display: none; animation: fadeSlideIn 0.22s cubic-bezier(0.4, 0, 0.2, 1); }
  .view.active { display: block; }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* CHECK EMAIL */
  .check-email-icon {
    width: 60px;
    height: 60px;
    background: rgba(196,112,63,0.08);
    border: 1.5px solid rgba(196,112,63,0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin: 0 auto 20px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }
  .back-link:hover { color: var(--text); }

  @media (max-width: 480px) {
    .site-nav { padding: 0 20px; }
    .panel { padding: 28px 24px; border-radius: 16px; }
    .card-header h1 { font-size: 26px; }
  }
</style>
</head>
<body>

<nav class="site-nav">
  <a href="https://jamesguldan.com" class="nav-logo">James Guldan</a>
</nav>

<div class="loading-overlay" id="loadingOverlay">
  <div class="loading-spinner"></div>
  <p id="loadingMsg">Signing you in...</p>
</div>

<div class="card">
  <div class="card-header" id="cardHeader">
    <h1>Remember who you are.</h1>
    <p>Sign in to continue your Deep Work session.</p>
  </div>

  <div class="panel">

    <!-- \u2500\u2500 MAGIC LINK SIGN IN \u2500\u2500 -->
    <div class="view active" id="viewSignIn">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="magicEmail" placeholder="you@example.com" autocomplete="email">
      </div>
      <button class="btn-primary" id="btnMagic" onclick="doMagic()">Send Sign In Link</button>
      <div class="status-box" id="magicStatus"></div>
      <div class="status-box" id="loginStatus"></div>
    </div>

    <!-- \u2500\u2500 VIEW: CHECK EMAIL \u2500\u2500 -->
    <div class="view" id="viewCheckEmail" style="text-align:center;padding:8px 0 4px;">
      <div class="check-email-icon">\u2709\uFE0F</div>
      <h2 style="font-family:'Outfit',sans-serif;font-size:22px;font-weight:700;margin-bottom:10px;color:var(--text)">Check your inbox</h2>
      <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:24px;" id="checkEmailMsg">
        A sign in link is on its way. Tap the link in the email to continue.
      </p>
      <p style="font-size:13px;color:var(--muted);margin-bottom:20px;">
        Did not get it? Check your spam folder, or
        <a onclick="showView('viewSignIn')" style="color:var(--accent);cursor:pointer;font-weight:500;text-decoration:none;">try again</a>.
      </p>
      <button class="back-link" onclick="showView('viewSignIn')" style="justify-content:center;width:100%">
        &larr; Back
      </button>
    </div>

  </div>

  <div style="margin:20px auto 4px;max-width:400px;text-align:center;">
    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
      <span style="font-size:12px;color:#B8B4AF;display:inline-flex;align-items:center;gap:4px;">Encrypted &amp; private</span>
      <span style="font-size:12px;color:#B8B4AF;display:inline-flex;align-items:center;gap:4px;">60&ndash;90 min session</span>
      <span style="font-size:12px;color:#B8B4AF;display:inline-flex;align-items:center;gap:4px;">&#10003; Pause &amp; resume any time</span>
    </div>
  </div>
  <p class="footer-note" id="footerNote">Don't have access yet? <a href="https://jamesguldan.com/deep-work" target="_blank">Learn more \u2192</a></p>\n  <div class="legal-links">\n    <a href="/terms" target="_blank">Terms</a>\n    &nbsp;&middot;&nbsp;\n    <a href="/privacy" target="_blank">Privacy</a>\n    &nbsp;&middot;&nbsp;\n    &copy; 2026 Align Consulting LLC\n  </div>\n</div>\n\n<script>\n// \u2500\u2500 Handle ?magic=TOKEN in URL (redirect from /magic) \u2500\u2500\n(async function checkMagicInUrl() {\n  const params = new URLSearchParams(window.location.search);\n  const magic = params.get('magic');\n  if (!magic) return;\n\n  showLoading('Verifying your link...');\n  try {\n    const res = await fetch('/api/auth/magic', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ token: magic })\n    });\n    const data = await res.json();\n    if (data.token) {\n      storeSession(data.token, data.user);\n      redirectAfterLogin(data.user);\n    } else {\n      hideLoading();\n      showStatus('loginStatus', 'error', data.error || 'This link has expired or already been used. Please request a new one.');\n    }\n  } catch(e) {\n    hideLoading();\n    showStatus('loginStatus', 'error', 'Something went wrong. Please try again.');\n  }\n})();\n\n// \u2500\u2500 Check existing session \u2014 auto-redirect to app if logged in \u2500\u2500\n(function checkExistingSession() {\n  const params = new URLSearchParams(window.location.search);\n  if (params.has('logout') || params.has('switch')) return;\n  const token = localStorage.getItem('dw_session');\n  if (!token) return;\n  // Immediately redirect \u2014 don't show login page at all
  fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(r => r.json())
    .then(user => {
      if (user?.id) {
        // User is authenticated \u2014 skip login entirely and go to app
        window.location.href = '/app';
      }
    })
    .catch(() => {});
})();

// \u2500\u2500 VIEW MANAGEMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const VIEW_HEADERS = {
  viewSignIn:     { h: 'Remember who you are.',  p: 'Sign in to continue your Deep Work session.' },
  viewCheckEmail: { h: 'Check your email.',      p: 'A sign in link is on its way.' },
};

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const header = VIEW_HEADERS[id];
  if (header) {
    document.querySelector('#cardHeader h1').textContent = header.h;
    document.querySelector('#cardHeader p').innerHTML = header.p;
  }
}

async function doMagic() {
  const email = document.getElementById('magicEmail').value.trim();
  if (!email) return showStatus('magicStatus', 'error', 'Please enter your email address.');
  setBtnLoading('btnMagic', true, 'Send Sign In Link');
  clearStatus('magicStatus');
  try {
    const res = await fetch('/api/auth/request-magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('checkEmailMsg').innerHTML =
        'A sign in link is on its way to <strong>' + email + '</strong>. Tap it to continue.';
      showView('viewCheckEmail');
    } else {
      showStatus('magicStatus', 'error', data.error || 'Could not send link. Please try again.');
    }
  } catch(e) {
    showStatus('magicStatus', 'error', 'Connection error. Please try again.');
  } finally {
    setBtnLoading('btnMagic', false, 'Send Sign In Link');
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') doMagic();
});

function storeSession(token, user) {
  localStorage.setItem('dw_session', token);
  if (user?.role === 'admin') localStorage.setItem('dw_admin_token', token);
  document.cookie = 'dw_session=' + token + '; path=/; max-age=' + (30*24*3600) + '; secure; samesite=lax';
}

function redirectAfterLogin(user) {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect && redirect.startsWith('/')) {
    window.location.href = redirect;
  } else {
    window.location.href = '/app';
  }
}

function showLoading(msg) {
  document.getElementById('loadingMsg').textContent = msg || 'Loading...';
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = 'status-box ' + type;
  el.textContent = msg;
}

function clearStatus(id) {
  const el = document.getElementById(id);
  el.className = 'status-box';
  el.textContent = '';
}

function setBtnLoading(id, loading, label) {
  const btn = document.getElementById(id);
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="btn-spinner"></span>Working...'
    : label;
}
<\/script>
</body>
</html>`;
}

export function legalPageShell(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | Deep Work by James Guldan</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #FFFFFF;
    --text: #1a1a1a;
    --text2: #666;
    --accent: #C4703F;
    --border: #e8e4df;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.8;
    padding: 40px 20px 80px;
  }
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
  .back-link {
    display: inline-block;
    color: var(--accent);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 32px;
    font-weight: 500;
  }
  .back-link:hover { text-decoration: underline; }
  h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }
  .effective-date {
    font-size: 14px;
    color: var(--text2);
    margin-bottom: 40px;
  }
  h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 600;
    margin-top: 36px;
    margin-bottom: 12px;
    color: var(--text);
  }
  p {
    margin-bottom: 16px;
    font-size: 15px;
  }
  .contact-block {
    background: #f7f5f2;
    border-radius: 12px;
    padding: 24px;
    margin-top: 32px;
  }
  .contact-block p { margin-bottom: 4px; }
</style>
</head>
<body>
<div class="container">
  <a href="/" class="back-link">\u2190 Back to Deep Work</a>
  ${content}
</div>
</body>
</html>`;
}

export function getPrivacyPolicyHTML() {
  return legalPageShell("Privacy Policy", `
  <h1>Privacy Policy</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>This Privacy Policy describes how Align Consulting LLC ("we," "us," or "our") collects, uses, and protects your personal information when you use the Deep Work brand strategy application at love.jamesguldan.com (the "Service").</p>

  <h2>1. Information We Collect</h2>

  <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password. If you use magic link authentication, we collect only your email address.</p>

  <p><strong>Interview Responses:</strong> During the Deep Work interview process, you share information about your business, brand, expertise, audience, and personal story. This information is used to generate your personalized brand blueprint.</p>

  <p><strong>Uploaded Files:</strong> You may upload images, logos, or documents during the interview. These files are stored securely and used only to inform your brand strategy.</p>

  <p><strong>Business Intelligence:</strong> Based on your interview responses, our AI system extracts business profile data including estimated revenue range, industry, team size, years in business, and other professional characteristics. This data helps us tailor our recommendations to your specific situation and identify which of our services may be the best fit for you.</p>

  <p><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card numbers or bank account details on our servers. Stripe's privacy policy governs the handling of your payment data.</p>

  <p><strong>Usage Data:</strong> We collect anonymized usage metrics such as session duration, pages visited, and feature engagement to improve the Service.</p>

  <h2>2. How We Use AI</h2>

  <p>The Deep Work interview is conducted by an AI system powered by Anthropic's Claude. Your responses are sent to Anthropic's API to generate contextual follow up questions and your final brand blueprint. Anthropic processes this data according to their privacy policy and does not use API inputs to train their models.</p>

  <p>We also use Google's Gemini API for image generation features within your brand guide. Image prompts derived from your brand attributes may be sent to Google's generative AI service.</p>

  <p>Your interview data may be analyzed by our AI systems to extract business intelligence (described above in Section 1) that helps us provide better recommendations and follow up services tailored to your needs.</p>

  <h2>3. How We Use Your Information</h2>

  <p>We use the information we collect to provide and improve the Service, including generating your brand blueprint, personalizing recommendations, communicating with you about your account and our services, analyzing usage patterns to improve the experience, and identifying which of our service offerings may be relevant to your business needs.</p>

  <h2>4. Data Sharing</h2>

  <p>We do not sell your personal information. We share data only with the following third party services that are necessary to operate the platform: Anthropic (AI interview processing), Google Cloud (image generation), Stripe (payment processing), and Cloudflare (hosting and infrastructure).</p>

  <p>We may also share your contact information and business profile data with our CRM and marketing platforms (such as GoHighLevel) to facilitate follow up communications about our services. You can opt out of marketing communications at any time.</p>

  <h2>5. Data Retention</h2>

  <p>Your account data is retained for as long as your account is active. Interview session data is retained for up to 30 days in our active session store, after which it expires. Your generated brand blueprint is stored indefinitely as part of your account. Business intelligence data extracted from your interview is retained to support our ongoing relationship with you and to improve our services.</p>

  <h2>6. Your Rights</h2>

  <p>You have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your account and associated data, opt out of marketing communications, and request a copy of your data in a portable format. To exercise any of these rights, please contact us at the email below.</p>

  <h2>7. Data Security</h2>

  <p>We implement appropriate technical and organizational measures to protect your personal information, including encryption in transit (HTTPS/TLS), secure token based authentication, isolated session storage, and access controls on our infrastructure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

  <h2>8. Children's Privacy</h2>

  <p>The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

  <h2>9. Changes to This Policy</h2>

  <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the effective date above.</p>

  <h2>10. Contact Us</h2>

  <div class="contact-block">
    <p><strong>Align Consulting LLC</strong></p>
    <p>Email: james@jamesguldan.com</p>
    <p>Website: jamesguldan.com</p>
  </div>
  `);
}

export function getTermsOfServiceHTML() {
  return legalPageShell("Terms of Service", `
  <h1>Terms of Service</h1>
  <p class="effective-date">Effective Date: March 20, 2026</p>

  <p>These Terms of Service ("Terms") govern your use of the Deep Work brand strategy application at love.jamesguldan.com (the "Service"), operated by Align Consulting LLC ("we," "us," or "our"). By creating an account or using the Service, you agree to be bound by these Terms.</p>

  <h2>1. Description of Service</h2>

  <p>Deep Work is an AI powered brand strategy tool that conducts an in depth interview about your business, brand, and vision, then generates a personalized brand blueprint. The Service may also include website generation, brand guide creation, and related deliverables depending on your selected plan.</p>

  <h2>2. AI Generated Content Disclaimer</h2>

  <p>The brand blueprints, recommendations, and other content generated by the Service are produced by artificial intelligence systems. While we design our AI prompts and systems to deliver high quality, thoughtful brand strategy, all AI generated output should be considered a starting point and professional suggestion rather than a guarantee of business results. You are responsible for reviewing, adapting, and applying any recommendations to your specific circumstances. We recommend consulting with appropriate professionals (legal, financial, marketing) before making significant business decisions based solely on AI generated content.</p>

  <h2>3. Account Registration</h2>

  <p>To use the Service, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You must be at least 18 years old to create an account.</p>

  <h2>4. Payment and Refunds</h2>

  <p>Certain features of the Service require payment. All payments are processed securely through Stripe. Prices are displayed at checkout and are subject to change. Because the Service delivers AI generated content immediately upon completion of the interview, refunds are generally not available once your brand blueprint has been generated. If you experience technical issues that prevent you from receiving your deliverables, please contact us and we will work to resolve the issue.</p>

  <h2>5. Intellectual Property</h2>

  <p><strong>Your Content:</strong> You retain ownership of all information, ideas, and content you provide during the interview process. By using the Service, you grant us a limited license to process this content through our AI systems for the purpose of generating your brand deliverables.</p>

  <p><strong>Generated Content:</strong> Upon payment, you receive a perpetual, non exclusive license to use the brand blueprint, brand guide, and any other generated deliverables for your personal and commercial purposes. We retain the right to use anonymized, aggregated insights from our platform to improve the Service.</p>

  <p><strong>Our Platform:</strong> The Deep Work platform, including its design, code, AI prompts, and methodology, remains the intellectual property of Align Consulting LLC.</p>

  <h2>6. Blueprint Access and Sessions</h2>

  <p>Once your brand blueprint has been generated, you can access it by logging into your account. Active interview sessions are preserved for up to 30 days. If your session data expires before you complete the interview, you may need to start a new session. If you wish to regenerate your blueprint, please contact our support team. We generally allow one complimentary regeneration per customer.</p>

  <h2>7. Acceptable Use</h2>

  <p>You agree not to use the Service in any way that violates applicable law, infringes on the rights of others, attempts to gain unauthorized access to our systems, interferes with the proper functioning of the Service, or uses automated tools to access the Service (other than the AI features we provide).</p>

  <h2>8. Limitation of Liability</h2>

  <p>To the maximum extent permitted by law, Align Consulting LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of profits, business opportunities, or data. Our total liability for any claim arising from the Service shall not exceed the amount you paid for the Service in the twelve months preceding the claim.</p>

  <h2>9. Disclaimer of Warranties</h2>

  <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error free, or that AI generated content will be perfectly accurate or suitable for your specific business needs.</p>

  <h2>10. Modifications</h2>

  <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.</p>

  <h2>11. Governing Law</h2>

  <p>These Terms are governed by the laws of the State of Arizona, without regard to its conflict of law provisions.</p>

  <h2>12. Contact Us</h2>

  <div class="contact-block">
    <p><strong>Align Consulting LLC</strong></p>
    <p>Email: james@jamesguldan.com</p>
    <p>Website: jamesguldan.com</p>
  </div>
  `);
}

export function getLegalHTML(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} \u2014 Deep Work App</title>
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
  <a href="/" class="nav-back">\u2190 Back</a>
</nav>
<main>
  <h1>${title}</h1>
  <p class="meta">Align Consulting LLC &nbsp;\xB7&nbsp; james@jamesguldan.com</p>
  ${content}
</main>
<footer>&copy; 2025 Align Consulting LLC &nbsp;\xB7&nbsp; <a href="/legal/terms">Terms</a> &nbsp;\xB7&nbsp; <a href="/legal/privacy">Privacy</a></footer>
</body>
</html>`;
}

