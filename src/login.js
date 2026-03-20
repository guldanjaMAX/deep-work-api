// ============================================================
// DEEP WORK APP — LOGIN PAGE
// Brand: matches jamesguldan.com/deep-work exactly
// Colors: #FDFCFA bg, #c4703f accent, #1a1a1a text
// Fonts: Outfit (headings), Inter (body), Playfair Display (accent)
// ============================================================

export function getLoginHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work App — Sign In</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #FDFCFA;
    --bg2:     #F5F2EE;
    --accent:  #c4703f;
    --accent2: #d4855a;
    --text:    #111111;
    --muted:   #6B6B6B;
    --border:  #E8E5E1;
    --border2: #D4D0CB;
    --error:   #c0392b;
    --success: #2d7a4f;
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
    box-shadow: 0 4px 16px rgba(196,112,63,0.3);
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

    <!-- ── MAGIC LINK SIGN IN ── -->
    <div class="view active" id="viewSignIn">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="magicEmail" placeholder="you@example.com" autocomplete="email">
      </div>
      <button class="btn-primary" id="btnMagic" onclick="doMagic()">Send Sign In Link</button>
      <div class="status-box" id="magicStatus"></div>
      <div class="status-box" id="loginStatus"></div>
    </div>

    <!-- ── VIEW: CHECK EMAIL ── -->
    <div class="view" id="viewCheckEmail" style="text-align:center;padding:8px 0 4px;">
      <div class="check-email-icon">✉️</div>
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

  <p class="footer-note" id="footerNote">Don't have access yet? <a href="https://jamesguldan.com/deep-work" target="_blank">Learn more →</a></p>
  <div class="legal-links">
    <a href="/terms" target="_blank">Terms</a>
    &nbsp;&middot;&nbsp;
    <a href="/privacy" target="_blank">Privacy</a>
    &nbsp;&middot;&nbsp;
    &copy; 2026 Align Growth LLC
  </div>
</div>

<script>
// ── Handle ?magic=TOKEN in URL (redirect from /magic) ──
(async function checkMagicInUrl() {
  const params = new URLSearchParams(window.location.search);
  const magic = params.get('magic');
  if (!magic) return;

  showLoading('Verifying your link...');
  try {
    const res = await fetch('/api/auth/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: magic })
    });
    const data = await res.json();
    if (data.token) {
      storeSession(data.token, data.user);
      redirectAfterLogin(data.user);
    } else {
      hideLoading();
      showStatus('loginStatus', 'error', data.error || 'This link has expired or already been used. Please request a new one.');
    }
  } catch(e) {
    hideLoading();
    showStatus('loginStatus', 'error', 'Something went wrong. Please try again.');
  }
})();

// ── Check existing session — auto-redirect to app if logged in ──
(function checkExistingSession() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('logout') || params.has('switch')) return;
  const token = localStorage.getItem('dw_session');
  if (!token) return;
  // Immediately redirect — don't show login page at all
  fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(r => r.json())
    .then(user => {
      if (user?.id) {
        // User is authenticated — skip login entirely and go to app
        window.location.href = '/app';
      }
    })
    .catch(() => {});
})();

// ── VIEW MANAGEMENT ──────────────────────────────────────
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
</script>
</body>
</html>`;
}
