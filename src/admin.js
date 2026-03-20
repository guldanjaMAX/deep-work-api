// ============================================================
// DEEP WORK APP — ADMIN PANEL
// ============================================================

export const getAdminHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work Admin</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:     #FDFCFA; --bg2: #F5F1EC; --bg3: #EEE9E2; --bg4: #E5E0D8;
    --border: #EAE7E2; --border2: #D8D3CB;
    --gold:   #c4703f; --gold2: #d4855a;
    --text:   #1a1a1a; --text2: #555555; --text3: #888888;
    --green:  #2d7a4f; --red: #c0392b; --blue: #2563eb;
    --radius: 10px; --sidebar: 220px;
  }
  html, body { height: 100%; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  /* ── LAYOUT ── */
  #shell { display: flex; height: 100vh; }

  .sidebar {
    width: var(--sidebar); background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto;
  }

  .sidebar-logo {
    padding: 20px 16px 16px; border-bottom: 1px solid var(--border);
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 13px;
    letter-spacing: 2px; text-transform: uppercase; color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }

  .sidebar-logo span { font-size: 11px; font-weight: 400; color: var(--text3); display: block; }

  .nav { padding: 12px 8px; flex: 1; }

  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px;
    border-radius: 7px; cursor: pointer; color: var(--text2);
    font-size: 13px; font-weight: 500; transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(196,112,63,0.1); color: var(--gold); }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 12px 8px; border-top: 1px solid var(--border);
    font-size: 12px; color: var(--text3);
  }
  .sidebar-footer .admin-email { color: var(--text2); font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .logout-btn { display:block; width:100%; text-align:left; background:none; border:none; cursor:pointer; font-size:12px; color:var(--text3); padding:6px 10px; border-radius:6px; font-family:'Inter',sans-serif; transition:all 0.15s; }
  .logout-btn:hover { background:var(--bg3); color:var(--red); }

  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  .topbar {
    background: rgba(245,241,236,0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(234,231,226,0.8);
    padding: 14px 28px; display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }

  .topbar h1 { font-size: 18px; font-weight: 600; }

  .content { padding: 28px; flex: 1; }

  /* ── STAT CARDS ── */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

  .stat-card {
    background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03);
    transition: box-shadow 0.2s;
  }
  .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }

  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
  .stat-value { font-size: 32px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .stat-sub { font-size: 12px; color: var(--text3); }
  .stat-sub.up { color: var(--green); }
  .stat-sub.down { color: var(--red); }

  /* ── TABLES ── */
  .card { background: #fff; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03); }
  .card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header h2 { font-size: 15px; font-weight: 600; }
  .card-body { padding: 0; }

  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text3); padding: 10px 16px; text-align: left; border-bottom: 1px solid var(--border); background: var(--bg3); }
  td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text2); font-size: 13px; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  .badge {
    display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 100px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .badge-gold { background: rgba(196,112,63,0.12); color: var(--gold); border: 1px solid rgba(196,112,63,0.25); }
  .badge-green { background: rgba(22,163,74,0.12); color: #4ade80; border: 1px solid rgba(22,163,74,0.2); }
  .badge-blue { background: rgba(37,99,235,0.12); color: #60a5fa; border: 1px solid rgba(37,99,235,0.2); }
  .badge-gray { background: var(--bg3); color: var(--text3); border: 1px solid var(--border2); }
  .badge-red { background: rgba(220,38,38,0.12); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.01em;
  }
  .btn-gold { background: var(--gold); color: #fff; box-shadow: 0 1px 3px rgba(196,112,63,0.3); }
  .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(196,112,63,0.3); }
  .btn-gold:active { transform: translateY(0); }
  .btn-outline { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); background: rgba(196,112,63,0.04); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: rgba(220,38,38,0.1); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }

  /* ── FORMS ── */
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
  input, textarea, select {
    width: 100%; background: var(--bg3); border: 1px solid var(--border2); border-radius: 7px;
    padding: 10px 12px; color: var(--text); font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--gold); }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  select option { background: var(--bg3); }
  textarea { resize: vertical; min-height: 80px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ── FUNNEL CHART ── */
  .funnel { padding: 20px; }
  .funnel-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .funnel-label { font-size: 12px; color: var(--text2); width: 140px; flex-shrink: 0; }
  .funnel-bar-wrap { flex: 1; background: var(--bg3); border-radius: 4px; height: 24px; overflow: hidden; }
  .funnel-bar { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 4px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; font-weight: 600; color: #fff; transition: width 1s ease; }
  .funnel-count { font-size: 12px; color: var(--text3); width: 60px; text-align: right; flex-shrink: 0; }

  /* ── SESSION VIEWER ── */
  .session-messages { max-height: 500px; overflow-y: auto; padding: 20px; }
  .session-msg { display: flex; gap: 10px; margin-bottom: 14px; }
  .session-msg.user { flex-direction: row-reverse; }
  .session-av { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .session-av.ai { background: var(--gold); color: #fff; }
  .session-av.user { background: var(--bg4); border: 1px solid var(--border2); color: var(--text2); }
  .session-bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.6; max-width: 75%; }
  .session-msg.ai .session-bubble { background: var(--bg3); border: 1px solid var(--border); }
  .session-msg.user .session-bubble { background: var(--bg4); border: 1px solid var(--border2); color: var(--text2); }

  /* ── PROMPT LAB ── */
  .prompt-editor { padding: 20px; }
  .prompt-toolbar { display: flex; gap: 10px; margin-bottom: 14px; align-items: center; }
  .prompt-stats { display: flex; gap: 20px; padding: 14px 20px; background: var(--bg3); border-radius: 7px; margin-bottom: 14px; }
  .prompt-stat { font-size: 12px; color: var(--text2); }
  .prompt-stat strong { color: var(--text); }

  /* ── MODAL ── */
  .modal-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(15,15,15,0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 100;
    align-items: center; justify-content: center;
  }
  .modal-overlay.open { display: flex; }
  .modal {
    background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 32px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
    animation: modalIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .modal p { color: var(--text2); font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* ── MAGIC LINK BOX ── */
  .magic-link-box {
    background: var(--bg3); border: 1px solid var(--border2); border-radius: 7px;
    padding: 14px; font-family: monospace; font-size: 12px; word-break: break-all;
    color: var(--gold); margin: 12px 0; cursor: pointer;
  }

  /* ── TOGGLE ── */
  .toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .toggle-track {
    width: 40px; height: 22px; background: var(--bg3); border: 1px solid var(--border2);
    border-radius: 100px; position: relative; transition: background 0.2s;
  }
  .toggle-track.on { background: var(--gold); border-color: var(--gold); }
  .toggle-thumb {
    width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute;
    top: 2px; left: 3px; transition: left 0.2s;
  }
  .toggle-track.on .toggle-thumb { left: 19px; }

  /* ── TESTING PAGE ── */
  .checklist-group { margin-bottom: 4px; }
  .checklist-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 8px 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
    font-size: 13px; line-height: 1.5; color: var(--text2);
  }
  .checklist-item:last-child { border-bottom: none; }
  .checklist-item.done { color: var(--text3); }
  .checklist-item.done .ci-label { text-decoration: line-through; }
  .ci-box {
    width: 16px; height: 16px; border: 1.5px solid var(--border2); border-radius: 4px;
    flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: all 0.15s;
  }
  .checklist-item.done .ci-box { background: var(--green); border-color: var(--green); color: #fff; }
  .health-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  }
  .health-row:last-child { border-bottom: none; }
  .health-label { color: var(--text2); }
  .health-status { font-weight: 500; font-size: 12px; padding: 3px 8px; border-radius: 4px; }
  .health-ok { background: rgba(45,122,79,0.1); color: var(--green); }
  .health-fail { background: rgba(192,57,43,0.1); color: var(--red); }
  .health-pending { background: var(--bg3); color: var(--text3); }

  /* ── LOGIN SCREEN ── */
  #login-screen {
    display: flex; align-items: center; justify-content: center; min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, rgba(196,112,63,0.07) 0%, transparent 60%);
    position: relative; overflow: hidden;
  }
  .login-box { width: 400px; position: relative; z-index: 2; }
  .login-box h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.5px; }
  .login-box p { color: var(--text2); font-size: 14px; margin-bottom: 28px; line-height: 1.6; }
  .login-panel {
    background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px;
    box-shadow: 0 2px 12px rgba(26,26,26,0.06), 0 8px 40px rgba(26,26,26,0.06);
  }
  .login-divider { text-align: center; color: var(--text3); font-size: 12px; margin: 20px 0; position: relative; letter-spacing: 0.5px; text-transform: uppercase; }
  .login-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border); }
  .login-divider span { background: #fff; padding: 0 12px; position: relative; }
  .login-status { display: none; margin-top: 16px; padding: 12px 16px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
  .login-status.error { display: block; background: rgba(192,57,43,0.06); border: 1px solid rgba(192,57,43,0.2); color: var(--red); }
  .login-status.success { display: block; background: rgba(45,122,79,0.06); border: 1px solid rgba(45,122,79,0.2); color: var(--green); }

  /* ── ADMIN GEO ANIMATIONS ── */
  .admin-geo {
    position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
  }
  .ag-shape {
    position: absolute;
    animation: agFloat 20s ease-in-out infinite;
  }
  .ag-shape.line {
    height: 1.5px; background: linear-gradient(90deg, transparent, rgba(196,112,63,0.12), transparent);
  }
  .ag-shape.circle {
    border: 1.5px solid rgba(196,112,63,0.1); border-radius: 50%;
  }
  .ag-shape.grid-dot {
    background-image: radial-gradient(rgba(196,112,63,0.12) 1.5px, transparent 1.5px);
    background-size: 16px 16px; border-radius: 6px;
  }
  .ag-shape.cross {
    width: 30px; height: 30px; position: absolute;
  }
  .ag-shape.cross::before, .ag-shape.cross::after {
    content: ''; position: absolute; background: rgba(196,112,63,0.1);
  }
  .ag-shape.cross::before { width: 1.5px; height: 100%; left: 50%; transform: translateX(-50%); }
  .ag-shape.cross::after { height: 1.5px; width: 100%; top: 50%; transform: translateY(-50%); }
  .ag-shape.bracket {
    width: 40px; height: 80px;
    border: 1.5px solid rgba(196,112,63,0.08);
    border-right: none; border-radius: 8px 0 0 8px;
  }
  .ag-shape.hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: rgba(196,112,63,0.04);
  }

  /* Positions */
  .ag-1 { width: 200px; top: 15%; left: 5%; animation-duration: 22s; }
  .ag-2 { width: 120px; height: 120px; bottom: 20%; right: 8%; animation-duration: 26s; animation-delay: -4s; }
  .ag-3 { width: 160px; height: 100px; top: 8%; right: 12%; animation-duration: 24s; animation-delay: -8s; }
  .ag-4 { top: 45%; left: 10%; animation-duration: 20s; animation-delay: -3s; }
  .ag-5 { bottom: 15%; left: 20%; animation-duration: 28s; animation-delay: -6s; }
  .ag-6 { width: 80px; height: 80px; top: 25%; right: 5%; animation-duration: 30s; animation-delay: -10s; }
  .ag-7 { width: 180px; bottom: 8%; left: 8%; animation-duration: 25s; animation-delay: -2s; }
  .ag-8 { top: 70%; right: 15%; animation-duration: 21s; animation-delay: -7s; }
  .ag-9 { width: 100px; height: 100px; top: 5%; left: 30%; animation-duration: 27s; animation-delay: -5s; }
  .ag-10 { width: 240px; top: 55%; right: 3%; animation-duration: 23s; animation-delay: -9s; }

  @keyframes agFloat {
    0%, 100% { transform: translateY(0px); opacity: 0.8; }
    25% { transform: translateY(-12px); opacity: 0.5; }
    50% { transform: translateY(-5px); opacity: 0.9; }
    75% { transform: translateY(-16px); opacity: 0.4; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .page { display: none; }
  .page.active { display: block; }

  #toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--bg3); border: 1px solid var(--border2); color: var(--text);
    padding: 10px 18px; border-radius: 7px; font-size: 13px; z-index: 200; transition: transform 0.3s;
    white-space: nowrap;
  }
  #toast.show { transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>

<!-- ── LOGIN SCREEN ── -->
<div id="login-screen">
  <!-- Geometric Background -->
  <div class="admin-geo">
    <div class="ag-shape line ag-1"></div>
    <div class="ag-shape circle ag-2"></div>
    <div class="ag-shape grid-dot ag-3"></div>
    <div class="ag-shape cross ag-4"></div>
    <div class="ag-shape bracket ag-5"></div>
    <div class="ag-shape hex ag-6"></div>
    <div class="ag-shape line ag-7"></div>
    <div class="ag-shape cross ag-8"></div>
    <div class="ag-shape circle ag-9"></div>
    <div class="ag-shape line ag-10"></div>
  </div>

  <div class="login-box">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:16px">Deep Work App</div>
      <h1>Command Center.</h1>
      <p style="margin-bottom:0">Where the strategy meets the system.</p>
    </div>

    <div class="login-panel">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="login-email" placeholder="james@jamesguldan.com" autocomplete="email">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="login-password" placeholder="Your password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
      </div>
      <button class="btn btn-gold" style="width:100%;padding:14px;font-size:14px;border-radius:50px;font-weight:600" onclick="doLogin()" id="login-btn">Sign In</button>
      <div class="login-status" id="login-status"></div>

      <div class="login-divider"><span>or</span></div>
      <div class="form-group">
        <input type="email" id="magic-email" placeholder="Email for magic link">
      </div>
      <button class="btn btn-outline" style="width:100%;padding:14px;font-size:14px;border-radius:50px;font-weight:600" onclick="requestMagicLink()" id="magic-btn">Send Magic Link</button>
      <div class="login-status" id="magic-status"></div>
    </div>

    <p style="text-align:center;margin-top:20px;font-size:12px;color:var(--text3);">&copy; 2025 Align Growth LLC</p>
  </div>
</div>

<!-- ── MAIN SHELL ── -->
<div id="shell" style="display:none">
  <div class="sidebar">
    <div class="sidebar-logo">
      ✦ Deep Work
      <span style="margin-top:2px">Admin Panel</span>
    </div>
    <nav class="nav">
      <div class="nav-item active" onclick="showPage('dashboard')" id="nav-dashboard">
        <span class="icon">📊</span> Dashboard
      </div>
      <div class="nav-item" onclick="showPage('users')" id="nav-users">
        <span class="icon">👥</span> Users
      </div>
      <div class="nav-item" onclick="showPage('sessions')" id="nav-sessions">
        <span class="icon">💬</span> Sessions
      </div>
      <div class="nav-item" onclick="showPage('prompt-lab')" id="nav-prompt-lab">
        <span class="icon">🧪</span> Prompt Lab
      </div>
      <div class="nav-item" onclick="showPage('monitoring')" id="nav-monitoring">
        <span class="icon">📡</span> Monitoring
      </div>
      <div class="nav-item" onclick="showPage('testing')" id="nav-testing">
        <span class="icon">🔬</span> Testing
      </div>
      <div class="nav-item" onclick="showPage('settings')" id="nav-settings">
        <span class="icon">⚙️</span> Settings
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-email" id="sidebar-email">Loading...</div>
      <button class="btn btn-outline btn-sm" onclick="logout()" style="width:100%">Sign out</button>
    </div>
  </div>

  <div class="main">
    <div class="topbar">
      <h1 id="page-title">Dashboard</h1>
      <div style="display:flex;gap:10px">
        <button class="btn btn-outline btn-sm" onclick="refreshPage()">↻ Refresh</button>
        <button class="btn btn-gold btn-sm" onclick="openModal('create-user')">+ New User</button>
      </div>
    </div>

    <div class="content">

      <!-- DASHBOARD -->
      <div class="page active" id="page-dashboard">
        <div class="stat-grid" id="stat-grid">
          <div class="stat-card"><div class="stat-label">Total Sessions</div><div class="stat-value" id="stat-sessions">—</div><div class="stat-sub" id="stat-sessions-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Blueprints Generated</div><div class="stat-value" id="stat-blueprints">—</div><div class="stat-sub" id="stat-blueprints-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Sites Deployed</div><div class="stat-value" id="stat-sites">—</div><div class="stat-sub" id="stat-sites-sub">loading...</div></div>
          <div class="stat-card"><div class="stat-label">Total Users</div><div class="stat-value" id="stat-users">—</div><div class="stat-sub" id="stat-users-sub">loading...</div></div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="card">
            <div class="card-header"><h2>Phase Drop-off Funnel</h2></div>
            <div class="funnel" id="funnel-chart">
              <div style="color:var(--text3);font-size:13px">Loading...</div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Sessions</h2></div>
            <table>
              <thead><tr><th>User</th><th>Tier</th><th>Phase</th><th>Status</th></tr></thead>
              <tbody id="recent-sessions-tbody"><tr><td colspan="4" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- USERS -->
      <div class="page" id="page-users">
        <div class="card">
          <div class="card-header">
            <h2>Users</h2>
            <input type="text" placeholder="Search by email..." id="user-search" style="width:220px;margin:0" oninput="filterUsers(this.value)">
          </div>
          <div class="card-body">
            <table>
              <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Tier</th><th>Sessions</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody id="users-tbody"><tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SESSIONS -->
      <div class="page" id="page-sessions">
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <select id="session-filter-tier" onchange="loadSessions()" style="width:160px;margin:0">
            <option value="">All tiers</option>
            <option value="blueprint">Blueprint</option>
            <option value="site">Site</option>
          </select>
          <select id="session-filter-status" onchange="loadSessions()" style="width:160px;margin:0">
            <option value="">All statuses</option>
            <option value="complete">Blueprint complete</option>
            <option value="deployed">Site deployed</option>
          </select>
        </div>
        <div class="card">
          <div class="card-body">
            <table>
              <thead><tr><th>Session ID</th><th>Tier</th><th>Phase</th><th>Messages</th><th>Blueprint</th><th>Site</th><th>Started</th><th>Actions</th></tr></thead>
              <tbody id="sessions-tbody"><tr><td colspan="8" style="text-align:center;color:var(--text3)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PROMPT LAB -->
      <div class="page" id="page-prompt-lab">
        <div class="card" style="margin-bottom:20px">
          <div class="card-header"><h2>Active System Prompt</h2><div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="loadPrompt()">↻ Reload</button><button class="btn btn-gold btn-sm" onclick="savePrompt()">Save & Deploy</button></div></div>
          <div class="prompt-editor">
            <div class="prompt-stats" id="prompt-stats">
              <div class="prompt-stat">Version: <strong id="ps-version">v1</strong></div>
              <div class="prompt-stat">Avg satisfaction: <strong id="ps-satisfaction">—</strong></div>
              <div class="prompt-stat">Sessions on this version: <strong id="ps-count">—</strong></div>
            </div>
            <div class="form-group" style="margin:0">
              <label>System Prompt (editing this will create a new version and redeploy)</label>
              <textarea id="prompt-editor-ta" style="min-height:400px;font-family:monospace;font-size:12px;line-height:1.5"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- MONITORING -->
      <div class="page" id="page-monitoring">
        <div class="stat-grid" id="health-grid" style="margin-bottom:24px;"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header">
              <h2>Funnel Health</h2>
            </div>
            <div class="card-body" id="funnel-health">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header">
              <h2>API Usage (24h)</h2>
            </div>
            <div class="card-body" id="api-usage">Loading...</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
              <h2>Active Alerts</h2>
            </div>
            <div class="card-body" id="alerts-list">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Errors</h2></div>
            <div class="card-body" id="errors-list" style="max-height:400px;overflow-y:auto;">Loading...</div>
          </div>
        </div>

        <div style="display:flex;gap:12px;">
          <button class="btn btn-gold btn-sm" onclick="runHealthCheck()">Run Health Check</button>
          <button class="btn btn-outline btn-sm" onclick="sendDigest()">Send Daily Digest</button>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="page" id="page-settings">
        <div class="settings-grid">
          <div>
            <div class="card">
              <div class="card-header"><h2>App Settings</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Calendar Link (for strategy call order bump)</label>
                  <input type="url" id="s-calendar-link" placeholder="https://calendly.com/...">
                </div>
                <div class="form-group">
                  <label>Welcome Message (shown before session starts)</label>
                  <textarea id="s-welcome-message" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between">
                    Announcement Banner
                    <div class="toggle" onclick="toggleSetting('banner')">
                      <div class="toggle-track" id="toggle-banner"><div class="toggle-thumb"></div></div>
                    </div>
                  </label>
                  <input type="text" id="s-banner-text" placeholder="Announcement text...">
                </div>
                <div class="form-group">
                  <label>Weekly Report Email</label>
                  <input type="email" id="s-report-email">
                </div>
                <div class="form-group">
                  <label style="display:flex;align-items:center;justify-content:space-between">
                    Auto-save sessions to RAG
                    <div class="toggle" onclick="toggleSetting('rag')">
                      <div class="toggle-track" id="toggle-rag"><div class="toggle-thumb"></div></div>
                    </div>
                  </label>
                </div>
                <button class="btn btn-gold" onclick="saveSettings()">Save Settings</button>
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom:20px">
              <div class="card-header"><h2>Pricing Display</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Blueprint price display</label>
                  <input type="text" id="s-blueprint-price" placeholder="$67">
                </div>
                <div class="form-group">
                  <label>Site package price display</label>
                  <input type="text" id="s-site-price" placeholder="$197">
                </div>
                <div class="form-group">
                  <label>Strategy call price display</label>
                  <input type="text" id="s-call-price" placeholder="$197">
                </div>
                <button class="btn btn-gold" onclick="saveSettings()">Save Pricing</button>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><h2>Generate Magic Link</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Email address</label>
                  <input type="email" id="magic-gen-email" placeholder="user@example.com">
                </div>
                <div class="form-group">
                  <label>Tier access to grant</label>
                  <select id="magic-gen-tier" style="margin:0">
                    <option value="blueprint">Blueprint ($67)</option>
                    <option value="site">Site + Deploy ($197)</option>
                    <option value="admin">Admin access</option>
                  </select>
                </div>
                <button class="btn btn-gold" onclick="generateAdminMagicLink()">Generate Link</button>
                <div id="magic-gen-result" style="margin-top:12px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TESTING -->
      <div class="page" id="page-testing">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

          <!-- Manual Event Trigger -->
          <div class="card">
            <div class="card-header"><h2>Manual Event Trigger</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Fire any lifecycle event on behalf of a user to test email and SMS sequences end to end.</p>
              <div class="form-group">
                <label>Email address</label>
                <input type="email" id="test-email" placeholder="test@example.com">
              </div>
              <div class="form-group">
                <label>Name (optional)</label>
                <input type="text" id="test-name" placeholder="First name">
              </div>
              <div class="form-group">
                <label>Phone (optional, for SMS)</label>
                <input type="tel" id="test-phone" placeholder="+15550001234">
              </div>
              <div class="form-group">
                <label>Event type</label>
                <select id="test-event" style="margin:0">
                  <option value="interview_started">interview_started — queues 24h nudge email</option>
                  <option value="interview_completed">interview_completed — starts SIS pitch in 2 days</option>
                  <option value="interview_abandoned">interview_abandoned — sends recovery email now</option>
                  <option value="sis_purchased">sis_purchased — starts strategy call pitch</option>
                  <option value="call_booked">call_booked — sends call confirmation sequence</option>
                </select>
              </div>
              <div class="form-group">
                <label>Phase reached (optional, for abandoned)</label>
                <input type="number" id="test-phase" placeholder="3" min="0" max="8">
              </div>
              <button class="btn btn-gold" onclick="runTestTrigger()">Fire Event</button>
              <div id="test-trigger-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>

          <!-- System Health Check -->
          <div class="card">
            <div class="card-header">
              <h2>System Health Check</h2>
              <button class="btn btn-outline btn-sm" onclick="runHealthCheck()">Run Now</button>
            </div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Pings every worker and database in the funnel ecosystem. Also runs automatically every day at 9am.</p>
              <div id="health-results">
                <div style="color:var(--text3);font-size:13px;text-align:center;padding:20px 0">Click "Run Now" to check all systems.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ecosystem Testing Checklist -->
        <div class="card">
          <div class="card-header"><h2>Ecosystem Testing Checklist</h2></div>
          <div style="padding:20px">
            <p style="color:var(--text2);font-size:13px;margin-bottom:20px">Full end to end verification steps for the Deep Work funnel. Run through this checklist after any code change or at least once per week.</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
              <div>
                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Purchase Flow</h3>
                <div id="checklist-purchase" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">App Experience</h3>
                <div id="checklist-app" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">Blueprint Output</h3>
                <div id="checklist-blueprint" class="checklist-group"></div>
              </div>

              <div>
                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Email and SMS Sequences</h3>
                <div id="checklist-email" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">Abandonment Recovery</h3>
                <div id="checklist-abandon" class="checklist-group"></div>

                <h3 style="font-size:13px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:20px">GHL Pipeline</h3>
                <div id="checklist-ghl" class="checklist-group"></div>
              </div>
            </div>

            <div style="margin-top:20px;display:flex;gap:10px">
              <button class="btn btn-outline btn-sm" onclick="resetChecklist()">Reset All</button>
              <span id="checklist-score" style="font-size:13px;color:var(--text2);padding:6px 0"></span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /shell -->

<!-- ── MODALS ── -->
<div class="modal-overlay" id="modal-create-user">
  <div class="modal">
    <h3>Create User</h3>
    <p>Create a new user account and optionally generate a magic login link.</p>
    <div class="form-group"><label>Email</label><input type="email" id="new-user-email" placeholder="user@example.com"></div>
    <div class="form-group"><label>Name (optional)</label><input type="text" id="new-user-name" placeholder="First Last"></div>
    <div class="form-group"><label>Role</label><select id="new-user-role" style="margin:0"><option value="user">User</option><option value="admin">Admin</option></select></div>
    <div class="form-group"><label>Tier</label><select id="new-user-tier" style="margin:0"><option value="blueprint">Blueprint</option><option value="site">Site + Deploy</option></select></div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="closeModal('create-user')">Cancel</button>
      <button class="btn btn-gold" onclick="createUser()">Create + Send Magic Link</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-view-session">
  <div class="modal" style="max-width:700px;width:95vw">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 id="session-modal-title">Session</h3>
      <button class="btn btn-outline btn-sm" onclick="closeModal('view-session')">✕ Close</button>
    </div>
    <div class="session-messages" id="session-modal-messages"></div>
  </div>
</div>

<div id="toast"></div>

<script>
// ── STATE ──────────────────────────────────────────────────
let AUTH_TOKEN = localStorage.getItem('dw_admin_token') || localStorage.getItem('dw_session') || '';
let CURRENT_USER = null;
let ALL_USERS = [];
let SETTINGS = {};

const API = '';  // same origin

// ── BOOT ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  // Check for magic token in URL
  const params = new URLSearchParams(location.search);
  const magic = params.get('magic');
  if (magic) {
    await handleMagicLogin(magic);
    return;
  }
  if (AUTH_TOKEN) {
    await tryAutoLogin();
  }
});

async function tryAutoLogin() {
  try {
    const res = await api('GET', '/api/auth/me');
    // handleAuthMe returns { id, email, role, ... } directly (no .user wrapper)
    const user = res.user || res;
    if (user && user.role === 'admin') {
      CURRENT_USER = user;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      showApp();
    } else {
      AUTH_TOKEN = '';
      localStorage.removeItem('dw_admin_token');
    }
  } catch {
    AUTH_TOKEN = '';
    localStorage.removeItem('dw_admin_token');
  }
}

async function handleMagicLogin(token) {
  try {
    const res = await api('POST', '/api/auth/magic', { token });
    if ((res.token || res.sessionToken) && res.user?.role === 'admin') {
      AUTH_TOKEN = res.token || res.sessionToken;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      CURRENT_USER = res.user;
      history.replaceState({}, '', '/admin');
      showApp();
    } else {
      toast('Magic link invalid or expired.');
    }
  } catch {
    toast('Magic link failed.');
  }
}

// ── AUTH ──────────────────────────────────────────────────
function showLoginStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = 'login-status ' + type;
  el.textContent = msg;
}
function clearLoginStatus(id) {
  const el = document.getElementById(id);
  el.className = 'login-status';
  el.textContent = '';
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showLoginStatus('login-status', 'error', 'Enter email and password.'); return; }
  clearLoginStatus('login-status');

  const btn = document.getElementById('login-btn');
  btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px;"></span>Signing in...';
  btn.disabled = true;

  try {
    const res = await api('POST', '/api/auth/login', { email, password });
    if (res.token || res.sessionToken) {
      AUTH_TOKEN = res.token || res.sessionToken;
      localStorage.setItem('dw_admin_token', AUTH_TOKEN);
      CURRENT_USER = res.user;
      if (CURRENT_USER.role !== 'admin') {
        showLoginStatus('login-status', 'error', 'This account does not have admin access.');
        AUTH_TOKEN = ''; localStorage.removeItem('dw_admin_token');
        return;
      }
      showApp();
    } else {
      showLoginStatus('login-status', 'error', res.error || 'Invalid credentials.');
    }
  } catch {
    showLoginStatus('login-status', 'error', 'Login failed. Check your connection.');
  } finally {
    btn.innerHTML = 'Sign In';
    btn.disabled = false;
  }
}

async function requestMagicLink() {
  const email = document.getElementById('magic-email').value.trim();
  if (!email) { showLoginStatus('magic-status', 'error', 'Enter your email.'); return; }
  clearLoginStatus('magic-status');

  const btn = document.getElementById('magic-btn');
  btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(196,112,63,0.4);border-top-color:var(--gold);border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px;"></span>Sending...';
  btn.disabled = true;

  try {
    const res = await api('POST', '/api/auth/request-magic', { email });
    showLoginStatus('magic-status', 'success', 'Check your inbox. A login link is on its way.');
  } catch {
    showLoginStatus('magic-status', 'error', 'Failed to send magic link.');
  } finally {
    btn.innerHTML = 'Send Magic Link';
    btn.disabled = false;
  }
}

function logout() {
  localStorage.removeItem('dw_admin_token');
  localStorage.removeItem('dw_session');
  document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.location.href = '/logout';
}

// ── SHOW APP ──────────────────────────────────────────────
function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('shell').style.display = 'flex';
  document.getElementById('sidebar-email').textContent = CURRENT_USER?.email || '';
  loadDashboard();
}

// ── NAVIGATION ────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');

  const titles = { dashboard: 'Dashboard', users: 'Users', sessions: 'Sessions', 'prompt-lab': 'Prompt Lab', monitoring: 'Monitoring', settings: 'Settings', testing: 'Testing' };
  document.getElementById('page-title').textContent = titles[name] || name;

  if (name === 'users') loadUsers();
  else if (name === 'sessions') loadSessions();
  else if (name === 'settings') loadSettings();
  else if (name === 'prompt-lab') loadPrompt();
  else if (name === 'monitoring') loadMonitoring();
  else if (name === 'testing') loadTesting();
}

function refreshPage() {
  const active = document.querySelector('.page.active')?.id?.replace('page-', '');
  if (active === 'dashboard') loadDashboard();
  else if (active) showPage(active);
}

// ── DASHBOARD ─────────────────────────────────────────────
async function loadDashboard() {
  try {
    const stats = await api('GET', '/api/admin/stats');

    document.getElementById('stat-sessions').textContent = stats.totalSessions ?? '—';
    document.getElementById('stat-sessions-sub').textContent = (stats.sessionsToday ?? 0) + ' today';
    document.getElementById('stat-blueprints').textContent = stats.blueprintsGenerated ?? '—';
    document.getElementById('stat-blueprints-sub').className = 'stat-sub';
    document.getElementById('stat-blueprints-sub').textContent = Math.round((stats.completionRate ?? 0) * 100) + '% completion rate';
    document.getElementById('stat-sites').textContent = stats.sitesDeployed ?? '—';
    document.getElementById('stat-sites-sub').textContent = (stats.sitesGenerated ?? 0) + ' generated';
    document.getElementById('stat-users').textContent = stats.totalUsers ?? '—';
    document.getElementById('stat-users-sub').textContent = (stats.usersThisWeek ?? 0) + ' this week';

    renderFunnel(stats.funnel || []);
    renderRecentSessions(stats.recentSessions || []);
  } catch (e) {
    console.error(e);
  }
}

function renderFunnel(funnel) {
  const max = funnel[0]?.count || 1;
  document.getElementById('funnel-chart').innerHTML = funnel.map(f => \`
    <div class="funnel-row">
      <div class="funnel-label">Phase \${f.phase}: \${f.label}</div>
      <div class="funnel-bar-wrap">
        <div class="funnel-bar" style="width:\${Math.round((f.count/max)*100)}%">\${Math.round((f.count/max)*100)}%</div>
      </div>
      <div class="funnel-count">\${f.count}</div>
    </div>
  \`).join('') || '<div style="color:var(--text3);font-size:13px;padding:10px 0">No sessions yet.</div>';
}

function renderRecentSessions(sessions) {
  document.getElementById('recent-sessions-tbody').innerHTML = sessions.map(s => \`
    <tr>
      <td>\${s.user_email || s.id?.slice(0,14) || 'anon'}</td>
      <td><span class="badge \${s.tier === 'site' ? 'badge-gold' : 'badge-gray'}">\${s.tier}</span></td>
      <td>\${s.phase}/8</td>
      <td>\${s.blueprint_generated ? '<span class="badge badge-green">Done</span>' : '<span class="badge badge-gray">In progress</span>'}</td>
    </tr>
  \`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text3)">No sessions yet.</td></tr>';
}

// ── USERS ─────────────────────────────────────────────────
async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Loading...</td></tr>';
  try {
    const res = await api('GET', '/api/admin/users');
    ALL_USERS = res.users || [];
    renderUsersTable(ALL_USERS);
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text3)">Failed to load.</td></tr>';
  }
}

function renderUsersTable(users) {
  document.getElementById('users-tbody').innerHTML = users.map(u => \`
    <tr>
      <td style="color:var(--text)">\${u.email}</td>
      <td>\${u.name || '—'}</td>
      <td><span class="badge \${u.role === 'admin' ? 'badge-gold' : 'badge-gray'}">\${u.role}</span></td>
      <td>\${u.tier ? '<span class="badge badge-blue">'+u.tier+'</span>' : '—'}</td>
      <td>\${u.sessions_count || 0}</td>
      <td>\${fmtDate(u.created_at)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="sendMagicLink('\${u.id}','\${u.email}')">Magic Link</button>
      </td>
    </tr>
  \`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text3)">No users yet.</td></tr>';
}

function filterUsers(q) {
  const filtered = q ? ALL_USERS.filter(u => u.email.includes(q) || (u.name||'').toLowerCase().includes(q.toLowerCase())) : ALL_USERS;
  renderUsersTable(filtered);
}

async function createUser() {
  const email = document.getElementById('new-user-email').value.trim();
  const name = document.getElementById('new-user-name').value.trim();
  const role = document.getElementById('new-user-role').value;
  const tier = document.getElementById('new-user-tier').value;
  if (!email) { toast('Enter an email.'); return; }

  try {
    const res = await api('POST', '/api/admin/users', { email, name, role, tier });
    if (res.user) {
      closeModal('create-user');
      toast('User created. Magic link copied to clipboard.');
      if (res.magicLink) navigator.clipboard?.writeText(res.magicLink).catch(()=>{});
      loadUsers();
    } else {
      toast(res.error || 'Failed to create user.');
    }
  } catch {
    toast('Failed to create user.');
  }
}

async function sendMagicLink(userId, email) {
  try {
    const res = await api('POST', '/api/admin/magic-link', { userId, email });
    if (res.magicLink) {
      await navigator.clipboard?.writeText(res.magicLink).catch(()=>{});
      toast('Magic link copied to clipboard: ' + res.magicLink.slice(0, 50) + '...');
    }
  } catch {
    toast('Failed to generate magic link.');
  }
}

// ── SESSIONS ──────────────────────────────────────────────
async function loadSessions() {
  const tier = document.getElementById('session-filter-tier')?.value || '';
  const status = document.getElementById('session-filter-status')?.value || '';
  const tbody = document.getElementById('sessions-tbody');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Loading...</td></tr>';

  try {
    const res = await api('GET', \`/api/admin/sessions?tier=\${tier}&status=\${status}&limit=50\`);
    const sessions = res.sessions || [];
    tbody.innerHTML = sessions.map(s => \`
      <tr>
        <td style="font-family:monospace;font-size:11px">\${s.id?.slice(0,20)}...</td>
        <td><span class="badge \${s.tier==='site'?'badge-gold':'badge-gray'}">\${s.tier}</span></td>
        <td>\${s.phase}/8</td>
        <td>\${s.message_count || 0}</td>
        <td>\${s.blueprint_generated ? '✓' : '—'}</td>
        <td>\${s.site_generated ? '✓' : '—'}</td>
        <td>\${fmtDate(s.created_at)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="viewSession('\${s.id}')">View</button></td>
      </tr>
    \`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text3)">No sessions yet.</td></tr>';
  } catch {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3)">Failed to load.</td></tr>';
  }
}

async function viewSession(sessionId) {
  document.getElementById('session-modal-title').textContent = sessionId.slice(0, 20) + '...';
  document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text3);text-align:center;padding:20px">Loading...</div>';
  openModal('view-session');

  try {
    const res = await api('GET', \`/api/admin/session/\${sessionId}\`);
    const messages = res.messages || [];
    document.getElementById('session-modal-messages').innerHTML = messages
      .filter(m => !m.content?.includes('METADATA:'))
      .map(m => \`
        <div class="session-msg \${m.role}">
          <div class="session-av \${m.role === 'assistant' ? 'ai' : 'user'}">\${m.role === 'assistant' ? 'AI' : 'U'}</div>
          <div class="session-bubble">\${(m.content || '').replace(/METADATA:\\{[^\\n]*\\}/g,'').replace(/\`\`\`json[\\s\\S]*?\`\`\`/g,'[Blueprint JSON]').slice(0,600)}</div>
        </div>
      \`).join('') || '<div style="color:var(--text3);text-align:center;padding:20px">No messages.</div>';
  } catch {
    document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text3);text-align:center;padding:20px">Failed to load session.</div>';
  }
}

// ── PROMPT LAB ────────────────────────────────────────────
async function loadPrompt() {
  try {
    const res = await api('GET', '/api/admin/prompt');
    document.getElementById('prompt-editor-ta').value = res.prompt || '';
    document.getElementById('ps-version').textContent = 'v' + (res.version || 1);
    document.getElementById('ps-satisfaction').textContent = res.avgSatisfaction ? res.avgSatisfaction.toFixed(1) + '/10' : '—';
    document.getElementById('ps-count').textContent = res.sessionsCount || 0;
  } catch {
    toast('Failed to load prompt.');
  }
}

async function savePrompt() {
  const prompt = document.getElementById('prompt-editor-ta').value.trim();
  if (!prompt) { toast('Prompt cannot be empty.'); return; }
  try {
    const res = await api('POST', '/api/admin/prompt', { prompt });
    if (res.ok) { toast('Prompt saved. New version is active.'); loadPrompt(); }
    else toast(res.error || 'Failed to save.');
  } catch {
    toast('Failed to save prompt.');
  }
}

// ── SETTINGS ──────────────────────────────────────────────
async function loadSettings() {
  try {
    const res = await api('GET', '/api/admin/settings');
    SETTINGS = res.settings || {};
    document.getElementById('s-calendar-link').value = SETTINGS.calendar_link || '';
    document.getElementById('s-welcome-message').value = SETTINGS.welcome_message || '';
    document.getElementById('s-banner-text').value = SETTINGS.app_banner_text || '';
    document.getElementById('s-report-email').value = SETTINGS.weekly_report_email || '';
    document.getElementById('s-blueprint-price').value = SETTINGS.blueprint_price_display || '';
    document.getElementById('s-site-price').value = SETTINGS.site_price_display || '';
    document.getElementById('s-call-price').value = SETTINGS.call_price_display || '';
    setToggle('banner', SETTINGS.app_banner_enabled === 'true');
    setToggle('rag', SETTINGS.rag_auto_save !== 'false');
  } catch {
    toast('Failed to load settings.');
  }
}

async function saveSettings() {
  try {
    const updates = {
      calendar_link: document.getElementById('s-calendar-link').value.trim(),
      welcome_message: document.getElementById('s-welcome-message').value.trim(),
      app_banner_text: document.getElementById('s-banner-text').value.trim(),
      weekly_report_email: document.getElementById('s-report-email').value.trim(),
      blueprint_price_display: document.getElementById('s-blueprint-price').value.trim(),
      site_price_display: document.getElementById('s-site-price').value.trim(),
      call_price_display: document.getElementById('s-call-price').value.trim(),
      app_banner_enabled: String(document.getElementById('toggle-banner').classList.contains('on')),
      rag_auto_save: String(document.getElementById('toggle-rag').classList.contains('on')),
    };
    const res = await api('POST', '/api/admin/settings', updates);
    if (res.ok) toast('Settings saved.');
    else toast('Failed to save settings.');
  } catch {
    toast('Failed to save settings.');
  }
}

async function generateAdminMagicLink() {
  const email = document.getElementById('magic-gen-email').value.trim();
  const tier = document.getElementById('magic-gen-tier').value;
  if (!email) { toast('Enter an email address.'); return; }
  try {
    const res = await api('POST', '/api/admin/magic-link', { email, tier, createIfMissing: true });
    if (res.magicLink) {
      document.getElementById('magic-gen-result').innerHTML = \`
        <div class="magic-link-box" onclick="copyToClipboard(this.textContent)">\${res.magicLink}</div>
        <div style="font-size:12px;color:var(--text3)">Click to copy. Valid for 72 hours. Single use.</div>
      \`;
    } else {
      toast(res.error || 'Failed to generate link.');
    }
  } catch {
    toast('Failed to generate link.');
  }
}

// ── TOGGLE HELPERS ────────────────────────────────────────
function toggleSetting(name) {
  const el = document.getElementById('toggle-' + name);
  el.classList.toggle('on');
}

function setToggle(name, val) {
  const el = document.getElementById('toggle-' + name);
  if (val) el.classList.add('on'); else el.classList.remove('on');
}

// ── MODAL HELPERS ─────────────────────────────────────────
function openModal(name) {
  document.getElementById('modal-' + name).classList.add('open');
}
function closeModal(name) {
  document.getElementById('modal-' + name).classList.remove('open');
}

// ── API HELPER ────────────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AUTH_TOKEN }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  if (res.status === 401) { logout(); return {}; }
  return res.json();
}

// ── UTILS ─────────────────────────────────────────────────
function toast(msg, ms = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).then(() => toast('Copied to clipboard.'));
}

// ═══════════════════════════════════════════
// MONITORING
// ═══════════════════════════════════════════

async function loadMonitoring() {
  try {
    const [monData, apiData] = await Promise.all([
      api('GET', '/api/admin/monitoring'),
      api('GET', '/api/admin/api-usage?hours=24'),
    ]);

    // Health grid
    const healthGrid = document.getElementById('health-grid');
    if (monData.health && monData.health.length) {
      healthGrid.innerHTML = monData.health.map(h => {
        const d = h.details ? JSON.parse(h.details) : {};
        const dot = h.status === 'healthy' ? '🟢' : h.status === 'warning' ? '🟡' : '🔴';
        return '<div class="stat-card"><div class="stat-value">' + dot + ' ' + h.check_type + '</div><div class="stat-label">' +
          h.status + (d.latencyMs ? ' · ' + d.latencyMs + 'ms' : '') + (d.error ? ' · ' + d.error : '') + '</div></div>';
      }).join('');
    } else {
      healthGrid.innerHTML = '<div class="stat-card"><div class="stat-value">No checks yet</div><div class="stat-label">Click "Run Health Check" below</div></div>';
    }

    // Funnel health
    const fh = document.getElementById('funnel-health');
    const f = monData.funnel;
    if (f) {
      let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">';
      html += statMini('Sessions', f.total || 0);
      html += statMini('Completion', (f.completionRate || 0) + '%');
      html += statMini('Avg Phase', f.avgPhase || 0);
      html += statMini('Drop-off', (f.dropOffRate || 0) + '%');
      html += '</div>';
      if (f.warnings && f.warnings.length) {
        html += f.warnings.map(w => '<div style="background:rgba(217,119,6,0.08);border-left:3px solid #D97706;padding:8px 12px;margin:6px 0;border-radius:0 6px 6px 0;font-size:13px;color:#92400E;">' + w + '</div>').join('');
      }
      if (f.lastFivePhases) html += '<p style="font-size:12px;color:#999;margin-top:8px;">Last 5 sessions: phases ' + f.lastFivePhases.join(', ') + '</p>';
      fh.innerHTML = html;
    }

    // API usage
    const au = document.getElementById('api-usage');
    if (apiData.byProvider && apiData.byProvider.length) {
      let html = '<div style="font-size:13px;">';
      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-weight:600;color:var(--text2);"><span>Provider</span><span>Calls</span><span>Avg ms</span></div>';
      apiData.byProvider.forEach(p => {
        const name = p.metric_name.replace('api.', '').replace('.call', '');
        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);">' +
          '<span>' + name + '</span><span style="font-weight:600;">' + p.calls + '</span><span>' + (p.avg_latency_ms || 0) + 'ms</span></div>';
      });
      if (apiData.rateLimitHits?.length) {
        html += '<p style="color:#D97706;margin-top:8px;font-size:12px;">⚠ ' + apiData.rateLimitHits.length + ' rate limit hit(s)</p>';
      }
      html += '<p style="color:#999;margin-top:8px;font-size:12px;">Total: ' + apiData.totalCalls + ' API calls in ' + apiData.period + '</p>';
      html += '</div>';
      au.innerHTML = html;
    } else {
      au.innerHTML = '<p style="color:#999;font-size:14px;">No API calls recorded yet.</p>';
    }

    // Alerts
    const al = document.getElementById('alerts-list');
    const alerts = (monData.alerts || []).filter(a => !a.resolved);
    if (alerts.length) {
      al.innerHTML = alerts.map(a => {
        const dot = a.severity === 'critical' ? '🔴' : '🟡';
        return '<div style="padding:10px 0;border-bottom:1px solid var(--border);">' +
          '<div style="display:flex;align-items:center;gap:8px;">' + dot +
          ' <strong style="font-size:13px;">' + a.title + '</strong>' +
          '<button class="btn btn-outline btn-sm" style="margin-left:auto;font-size:11px;padding:2px 10px;" onclick="resolveAlert(' + a.id + ')">Resolve</button></div>' +
          '<p style="font-size:12px;color:#888;margin-top:4px;">' + (a.message || '').slice(0, 120) + '</p>' +
          '<p style="font-size:11px;color:#bbb;">' + fmtDate(a.created_at) + '</p></div>';
      }).join('');
    } else {
      al.innerHTML = '<p style="color:#16A34A;font-size:14px;">✅ No active alerts</p>';
    }

    // Errors
    const el = document.getElementById('errors-list');
    const errors = monData.errors || [];
    if (errors.length) {
      el.innerHTML = errors.slice(0, 15).map(e =>
        '<div style="padding:8px 0;border-bottom:1px solid var(--border);">' +
        '<div style="font-size:12px;font-weight:600;color:var(--text);">' + (e.endpoint || '?') + ' <span style="color:#DC2626;">' + (e.status_code || 500) + '</span></div>' +
        '<div style="font-size:12px;color:#888;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (e.error_message || '').slice(0, 100) + '</div>' +
        '<div style="font-size:11px;color:#bbb;">' + fmtDate(e.created_at) + '</div></div>'
      ).join('');
    } else {
      el.innerHTML = '<p style="color:#16A34A;font-size:14px;">No errors in the log</p>';
    }
  } catch (err) {
    toast('Failed to load monitoring: ' + err.message);
  }
}

function statMini(label, value) {
  return '<div style="background:var(--bg);border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;">' + value + '</div><div style="font-size:11px;color:#888;text-transform:uppercase;">' + label + '</div></div>';
}

async function runHealthCheck() {
  toast('Running health checks...');
  try {
    const res = await api('GET', '/api/admin/health');
    toast('Health check complete: ' + res.status);
    loadMonitoring();
  } catch (err) {
    toast('Health check failed: ' + err.message);
  }
}

async function sendDigest() {
  toast('Generating digest...');
  try {
    const res = await api('POST', '/api/admin/digest');
    toast('Digest sent! Sessions: ' + (res.newSessions || 0) + ', Errors: ' + (res.errorsLogged || 0));
  } catch (err) {
    toast('Digest failed: ' + err.message);
  }
}

async function resolveAlert(id) {
  try {
    await api('POST', '/api/admin/resolve-alert', { alertId: id });
    toast('Alert resolved.');
    loadMonitoring();
  } catch (err) {
    toast('Failed to resolve alert.');
  }
}

// ── TESTING PAGE ───────────────────────────────────────────
const CHECKLIST = {
  purchase: [
    { id: 'p1', label: 'DWI Stripe payment link ($67) loads without errors' },
    { id: 'p2', label: 'Completing a test purchase redirects to /thank-you' },
    { id: 'p3', label: 'Stripe webhook fires and stripe-ghl-webhook receives it' },
    { id: 'p4', label: 'GHL contact is created or updated with dwi_purchased tag' },
    { id: 'p5', label: 'Magic login link is generated and delivered by email' },
  ],
  app: [
    { id: 'a1', label: 'App loads at app.jamesguldan.com without errors' },
    { id: 'a2', label: 'Intake form collects name, email, and optional phone' },
    { id: 'a3', label: 'Phase 1 question appears after intake is submitted' },
    { id: 'a4', label: 'Microphone input works on mobile (test in Safari)' },
    { id: 'a5', label: 'Phase banner shows on completion of each phase (1 through 7)' },
    { id: 'a6', label: 'Session saves and restores after closing and reopening browser' },
  ],
  blueprint: [
    { id: 'b1', label: 'Phase 8 generates a blueprint (no raw JSON visible in chat)' },
    { id: 'b2', label: 'Blueprint screen renders with all sections (not the raw code block)' },
    { id: 'b3', label: 'Download Blueprint button produces a valid PDF or file' },
    { id: 'b4', label: 'Upsell to Site in Sixty shows on blueprint screen' },
  ],
  email: [
    { id: 'e1', label: 'interview_started fires to drip worker on session start' },
    { id: 'e2', label: 'DWI email_1 (delivery) arrives within 5 minutes of trigger' },
    { id: 'e3', label: 'DWI email_2 (nudge) is queued for 24 hours after interview_started' },
    { id: 'e4', label: 'SMS_1 fires within 5 minutes of purchase (if phone provided)' },
    { id: 'e5', label: 'interview_completed fires when blueprint generates' },
    { id: 'e6', label: 'SIS pitch email_1 queues for 2 days after interview_completed' },
    { id: 'e7', label: 'Conditional logic: SIS emails stop when sis_purchased tag is added' },
    { id: 'e8', label: 'Strategy call pitch starts after SIS sequence ends' },
  ],
  abandon: [
    { id: 'ab1', label: 'Use manual trigger above to fire interview_abandoned event' },
    { id: 'ab2', label: 'Recovery email (email_20) arrives within 5 minutes' },
    { id: 'ab3', label: 'Email link returns to app and resumes correct phase' },
    { id: 'ab4', label: 'Cron abandonment check runs every 2 hours (check worker logs)' },
    { id: 'ab5', label: 'Sessions inactive 24h+ appear in D1 with abandonment_notified_at set' },
  ],
  ghl: [
    { id: 'g1', label: 'GHL Pipeline: DWI buyers land in dwi_purchased stage' },
    { id: 'g2', label: 'GHL Pipeline: SIS buyers move to sis_purchased stage' },
    { id: 'g3', label: 'GHL Pipeline: Call bookings land in call_booked stage' },
    { id: 'g4', label: 'Tags are applied correctly (dwi_purchased, interview_completed, etc.)' },
    { id: 'g5', label: 'Daily 9am health check fires and results log in Cloudflare (check /api/admin/system-health)' },
  ],
};

let checklistState = JSON.parse(localStorage.getItem('dw_checklist') || '{}');

function loadTesting() {
  for (const [group, items] of Object.entries(CHECKLIST)) {
    const el = document.getElementById('checklist-' + group);
    if (!el) continue;
    el.innerHTML = items.map(item => \`
      <div class="checklist-item \${checklistState[item.id] ? 'done' : ''}" onclick="toggleCheck('\${item.id}', this)">
        <div class="ci-box">\${checklistState[item.id] ? '✓' : ''}</div>
        <span class="ci-label">\${item.label}</span>
      </div>
    \`).join('');
  }
  updateChecklistScore();
}

function toggleCheck(id, el) {
  checklistState[id] = !checklistState[id];
  localStorage.setItem('dw_checklist', JSON.stringify(checklistState));
  el.classList.toggle('done', checklistState[id]);
  el.querySelector('.ci-box').textContent = checklistState[id] ? '✓' : '';
  updateChecklistScore();
}

function updateChecklistScore() {
  const total = Object.values(CHECKLIST).flat().length;
  const done = Object.values(checklistState).filter(Boolean).length;
  const el = document.getElementById('checklist-score');
  if (el) el.textContent = done + ' of ' + total + ' items verified';
}

function resetChecklist() {
  checklistState = {};
  localStorage.removeItem('dw_checklist');
  loadTesting();
}

async function runTestTrigger() {
  const email = document.getElementById('test-email').value.trim();
  const name = document.getElementById('test-name').value.trim();
  const phone = document.getElementById('test-phone').value.trim();
  const event_type = document.getElementById('test-event').value;
  const phase = document.getElementById('test-phase').value;
  const result = document.getElementById('test-trigger-result');

  if (!email) { result.innerHTML = '<span style="color:var(--red)">Enter an email address.</span>'; return; }

  result.innerHTML = '<span style="color:var(--text3)">Firing event...</span>';

  try {
    const res = await api('POST', '/api/admin/test-trigger', {
      email, name, phone, event_type, phase: phase ? parseInt(phase) : undefined
    });
    result.innerHTML = \`<span style="color:var(--green)">✓ Event fired successfully.</span>
      <pre style="margin-top:8px;font-size:11px;background:var(--bg3);padding:10px;border-radius:6px;overflow:auto">\${JSON.stringify(res, null, 2)}</pre>\`;
  } catch (err) {
    result.innerHTML = \`<span style="color:var(--red)">✗ Failed: \${err.message}</span>\`;
  }
}

async function runHealthCheck() {
  const el = document.getElementById('health-results');
  el.innerHTML = '<div style="color:var(--text3);font-size:13px">Checking all systems...</div>';

  try {
    const res = await api('GET', '/api/admin/system-health');
    const checks = res.checks || [];

    el.innerHTML = checks.map(c => \`
      <div class="health-row">
        <span class="health-label">\${c.name}</span>
        <span class="health-status \${c.ok ? 'health-ok' : 'health-fail'}">\${c.ok ? '✓ OK' : '✗ ' + (c.error || 'Failed')}</span>
      </div>
    \`).join('') || '<div style="color:var(--text3);font-size:13px">No results returned.</div>';

    const passed = checks.filter(c => c.ok).length;
    const total = checks.length;
    toast(passed + '/' + total + ' systems healthy');
  } catch (err) {
    el.innerHTML = \`<div style="color:var(--red);font-size:13px">Health check failed: \${err.message}</div>\`;
  }
}
</script>
</body>
</html>`;
