// src/html/admin.js
// Admin dashboard HTML

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
    --bg: #FFFFFF;
    --bg2: #FAFAFA;
    --bg3: #F0F0F0;
    --border: #F0F0F0;
    --border2: #E8E8E8;
    --gold: #C4703F;
    --text: #1D1D1F;
    --text2: #86868B;
    --text3: #C0C0C0;
    --green: #2d7a4f;
    --red: #c0392b;
  }
  html, body { height: 100%; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); font-size: 14px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

  /* LAYOUT */
  #shell { display: flex; height: 100vh; }
  .sidebar {
    width: 200px; background: var(--bg); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto;
  }
  .sidebar-logo {
    padding: 24px 16px 20px; border-bottom: 1px solid var(--border);
    font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 16px;
    letter-spacing: -0.02em; color: var(--text);
  }
  .sidebar-logo-admin {
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gold); margin-top: 6px;
  }
  .nav { padding: 16px 8px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; color: var(--text2);
    font-size: 13px; font-weight: 400; transition: all 0.15s; margin-bottom: 4px;
  }
  .nav-item:hover { background: var(--bg2); color: var(--text); }
  .nav-item.active { border-left: 3px solid var(--gold); color: var(--gold); padding-left: 10px; font-weight: 500; background: transparent; }
  .nav-item svg { width: 18px; height: 18px; stroke-width: 1.5; }
  .sidebar-footer {
    padding: 12px 8px; border-top: 1px solid var(--border);
    font-size: 12px; color: var(--text2);
  }
  .sidebar-footer .admin-email { color: var(--text); font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 12px; }
  .logout-btn { display: block; width: 100%; text-align: left; background: none; border: none; cursor: pointer; font-size: 12px; color: var(--text2); padding: 8px 12px; border-radius: 6px; font-family: 'Inter', sans-serif; transition: all 0.15s; margin-top: 4px; }
  .logout-btn:hover { background: var(--bg2); color: var(--red); }

  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .topbar {
    background: var(--bg); border-bottom: 1px solid var(--border);
    padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }
  .topbar h1 { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
  .topbar-actions { display: flex; gap: 12px; }
  .content { padding: 32px; flex: 1; }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px;
  }
  .stat-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text2); margin-bottom: 8px; }
  .stat-value { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 4px; }
  .stat-sub { font-size: 12px; color: var(--text2); }

  /* CARDS */
  .card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 20px; }
  .card-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-header h2 { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: -0.02em; }
  .card-body { padding: 0; }

  /* TABLES */
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text2); padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); background: var(--bg2); }
  td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text); font-size: 13px; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg2); }

  .badge {
    display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    background: var(--bg2); color: var(--text2); border: 1px solid var(--border);
  }
  .badge-gold { background: rgba(196, 112, 63, 0.1); color: var(--gold); border: 1px solid rgba(196, 112, 63, 0.2); }
  .badge-green { background: rgba(45, 122, 79, 0.1); color: var(--green); border: 1px solid rgba(45, 122, 79, 0.2); }
  .badge-blue { background: rgba(37, 99, 235, 0.1); color: #3b82f6; border: 1px solid rgba(37, 99, 235, 0.2); }
  .badge-gray { background: var(--bg2); color: var(--text2); border: 1px solid var(--border); }
  .badge-red { background: rgba(192, 57, 43, 0.1); color: var(--red); border: 1px solid rgba(192, 57, 43, 0.2); }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px;
    border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; border: none;
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-primary { background: var(--text); color: white; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-outline:hover { background: var(--bg2); border-color: var(--border2); }
  .btn-sm { padding: 8px 14px; font-size: 12px; }

  /* FORMS */
  .form-group { margin-bottom: 18px; }
  label { display: block; font-size: 12px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
  input, textarea, select {
    width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px;
    padding: 10px 12px; color: var(--text); font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--gold); }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  textarea { resize: vertical; min-height: 100px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* FUNNEL */
  .funnel-stat { background: var(--bg2); border-radius: 8px; padding: 16px; text-align: center; }
  .funnel-num { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
  .funnel-label { font-size: 12px; color: var(--text2); margin-top: 4px; }

  /* TESTING GRID */
  .testing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

  /* USER DROPDOWN */
  .user-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 50;
    background: var(--bg); border: 1px solid var(--border2); border-radius: 8px;
    max-height: 200px; overflow-y: auto; margin-top: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
  .user-dropdown-item {
    padding: 10px 12px; cursor: pointer; font-size: 13px; display: flex;
    align-items: center; justify-content: space-between; transition: background 0.1s;
  }
  .user-dropdown-item:hover { background: var(--bg2); }
  .user-dropdown-item .ud-email { color: var(--text); font-weight: 500; }
  .user-dropdown-item .ud-meta { font-size: 11px; color: var(--text2); }
  .user-dropdown-item.ud-create { border-top: 1px solid var(--border); color: var(--gold); font-weight: 600; }
  .user-dropdown-item.ud-create:hover { background: rgba(196,112,63,0.06); }
  .user-dropdown-empty { padding: 12px; text-align: center; font-size: 12px; color: var(--text3); }

  /* CHECKLIST */
  .checklist-group { margin-bottom: 4px; }
  .checklist-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 0;
    border-bottom: 1px solid var(--border); cursor: pointer;
    font-size: 13px; line-height: 1.5; color: var(--text);
  }
  .checklist-item:last-child { border-bottom: none; }
  .checklist-item.done { color: var(--text2); }
  .checklist-item.done .ci-label { text-decoration: line-through; }
  .ci-box {
    width: 16px; height: 16px; border: 1.5px solid var(--border2); border-radius: 4px;
    flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: all 0.15s;
  }
  .checklist-item.done .ci-box { background: var(--green); border-color: var(--green); color: white; }

  /* HEALTH INDICATORS */
  .health-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .health-dot.green { background: var(--green); }
  .health-dot.yellow { background: #D97706; }
  .health-dot.red { background: var(--red); }
  .health-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px;
  }
  .health-row:last-child { border-bottom: none; }
  .health-label { color: var(--text2); }
  .health-status { font-weight: 600; font-size: 12px; padding: 4px 8px; border-radius: 4px; }
  .health-ok { background: rgba(45, 122, 79, 0.1); color: var(--green); }
  .health-fail { background: rgba(192, 57, 43, 0.1); color: var(--red); }
  .health-pending { background: var(--bg2); color: var(--text2); }

  /* LOGIN SCREEN */
  #login-screen {
    display: flex; align-items: center; justify-content: center; min-height: 100vh;
    background: var(--bg);
  }
  .login-box { width: 400px; }
  .login-box h1 { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 6px; }
  .login-box-eyebrow { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 24px; }
  .login-panel {
    background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 32px;
  }
  .login-status { display: none; margin-top: 16px; padding: 12px 14px; border-radius: 8px; font-size: 13px; line-height: 1.5; }
  .login-status.error { display: block; background: rgba(192, 57, 43, 0.1); border: 1px solid rgba(192, 57, 43, 0.2); color: var(--red); }
  .login-status.success { display: block; background: rgba(45, 122, 79, 0.1); border: 1px solid rgba(45, 122, 79, 0.2); color: var(--green); }

  /* MODAL */
  .modal-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(15, 15, 15, 0.55);
    backdrop-filter: blur(6px);
    z-index: 100;
    align-items: center; justify-content: center;
  }
  .modal-overlay.open { display: flex; }
  .modal {
    background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 32px;
    width: 100%; max-width: 480px;
    animation: modalIn 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .modal h3 { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .modal p { color: var(--text2); font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* MAGIC LINK BOX */
  .magic-link-box {
    background: var(--bg2); border: 1px solid var(--border2); border-radius: 8px;
    padding: 12px; font-family: monospace; font-size: 12px; word-break: break-all;
    color: var(--gold); margin: 12px 0; cursor: pointer;
  }

  /* TOGGLE */
  .toggle { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .toggle-track {
    width: 40px; height: 22px; background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 100px; position: relative; transition: background 0.2s;
  }
  .toggle-track.on { background: var(--gold); border-color: var(--gold); }
  .toggle-thumb {
    width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute;
    top: 2px; left: 3px; transition: left 0.2s;
  }
  .toggle-track.on .toggle-thumb { left: 19px; }

  .page { display: none; }
  .page.active { display: block; }

  #toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--bg2); border: 1px solid var(--border2); color: var(--text);
    padding: 12px 18px; border-radius: 8px; font-size: 13px; z-index: 200; transition: transform 0.3s;
    white-space: nowrap;
  }
  #toast.show { transform: translateX(-50%) translateY(0); }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ENDPOINT TEST RESULTS */
  .endpoint-test { padding: 12px; background: var(--bg2); border-radius: 8px; margin-bottom: 8px; font-size: 12px; }
  .endpoint-test.pass { border-left: 3px solid var(--green); }
  .endpoint-test.fail { border-left: 3px solid var(--red); }
  .endpoint-name { font-weight: 600; color: var(--text); }
  .endpoint-status { color: var(--text2); margin-top: 2px; }

  /* STRIPE MODE */
  .stripe-mode-indicator { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; }
  .stripe-mode-indicator.test { background: rgba(45, 122, 79, 0.1); color: var(--green); }
  .stripe-mode-indicator.live { background: rgba(217, 119, 6, 0.1); color: #D97706; }
  .stripe-mode-dot { width: 8px; height: 8px; border-radius: 50%; }
</style>
</head>
<body>

<!-- LOGIN SCREEN -->
<div id="login-screen">
  <div class="login-box">
    <div class="login-box-eyebrow">Deep Work</div>
    <h1>Command Center.</h1>

    <div class="login-panel" style="margin-top:24px">
      <div class="form-group">
        <label>Email address</label>
        <input type="email" id="login-email" placeholder="james@jamesguldan.com" autocomplete="email">
      </div>
      <button class="btn btn-primary" style="width:100%;padding:12px;font-size:14px;margin-bottom:16px" onclick="requestMagicLink()" id="magic-btn">Send Magic Link</button>
      <div class="login-status" id="magic-status"></div>
    </div>

    <p style="text-align:center;margin-top:20px;font-size:12px;color:var(--text2);">Copyright 2026 Align Consulting LLC</p>
  </div>
</div>

<!-- MAIN SHELL -->
<div id="shell" style="display:none">
  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sidebar-logo">
      Deep Work
      <div class="sidebar-logo-admin">Admin</div>
    </div>
    <nav class="nav">
      <div class="nav-item active" onclick="showPage('dashboard')" id="nav-dashboard">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </div>
      <div class="nav-item" onclick="showPage('sessions')" id="nav-sessions">
        <svg viewBox="0 0 24 24" fill="none"><path d="M3 9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M15 9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9z"/></svg>
        Sessions
      </div>
      <div class="nav-item" onclick="showPage('testing')" id="nav-testing">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 3L3 9v6a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V9l-6-6H9z"/></svg>
        Testing Lab
      </div>
      <div class="nav-item" onclick="showPage('prompt-lab')" id="nav-prompt-lab">
        <svg viewBox="0 0 24 24" fill="none"><path d="M11 4a7 7 0 1 0 0 14H15M7 13h6M7 9h8"/></svg>
        Prompt Lab
      </div>
      <div class="nav-item" onclick="showPage('api-costs')" id="nav-api-costs">
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        API Costs
      </div>
      <div class="nav-item" onclick="showPage('monitoring')" id="nav-monitoring">
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 3v1m0 16v1M5 12H4m16 0h1M7 7l-1-1M18 18l1 1M17 7l1-1M6 18l-1 1"/><path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/><circle cx="12" cy="12" r="2"/></svg>
        Monitoring
      </div>
      <div class="nav-item" onclick="showPage('users')" id="nav-users">
        <svg viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Users
      </div>
      <div class="nav-item" onclick="showPage('settings')" id="nav-settings">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/></svg>
        Settings
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="admin-email" id="sidebar-email">Loading...</div>
      <button class="logout-btn" onclick="logout()">Sign out</button>
    </div>
  </div>

  <!-- MAIN CONTENT -->
  <div class="main">
    <div class="topbar">
      <h1 id="page-title">Dashboard</h1>
      <div class="topbar-actions">
        <button class="btn btn-outline btn-sm" onclick="refreshPage()">Refresh</button>
        <button class="btn btn-primary btn-sm" onclick="openModal('create-user')">+ New User</button>
      </div>
    </div>

    <div class="content">

      <!-- DASHBOARD -->
      <div class="page active" id="page-dashboard">
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-label">Total Sessions</div>
            <div class="stat-value" id="stat-sessions">\u2014</div>
            <div class="stat-sub" id="stat-sessions-sub">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Blueprints Generated</div>
            <div class="stat-value" id="stat-blueprints">\u2014</div>
            <div class="stat-sub" id="stat-blueprints-sub">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Completion Rate</div>
            <div class="stat-value" id="stat-rate">\u2014</div>
            <div class="stat-sub" id="stat-rate-sub">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Users</div>
            <div class="stat-value" id="stat-users">\u2014</div>
            <div class="stat-sub" id="stat-users-sub">loading...</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="card">
            <div class="card-header"><h2>Session Funnel</h2></div>
            <div style="padding:20px" id="funnel-chart">
              <div style="color:var(--text2);font-size:13px">Loading...</div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Sessions</h2></div>
            <table>
              <thead><tr><th>User</th><th>Tier</th><th>Phase</th><th>Status</th></tr></thead>
              <tbody id="recent-sessions-tbody"><tr><td colspan="4" style="text-align:center;color:var(--text2)">Loading...</td></tr></tbody>
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
              <tbody id="sessions-tbody"><tr><td colspan="8" style="text-align:center;color:var(--text2)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TESTING LAB -->
      <div class="page" id="page-testing">
        <div class="testing-grid">
          <!-- Quick Session Creator -->
          <div class="card">
            <div class="card-header"><h2>Quick Session Creator</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Create a new test session. Picks an existing user or creates one automatically.</p>
              <div class="form-group">
                <label>User</label>
                <div style="position:relative">
                  <input type="text" id="quick-test-email" placeholder="Search users or type new email..." autocomplete="off" oninput="showUserDropdown(this,'quick-test-dropdown')" onfocus="showUserDropdown(this,'quick-test-dropdown')">
                  <div id="quick-test-dropdown" class="user-dropdown" style="display:none"></div>
                </div>
                <div id="quick-test-user-status" style="font-size:11px;margin-top:4px;min-height:16px"></div>
              </div>
              <div class="form-group">
                <label>Tier</label>
                <select id="quick-test-tier" style="margin:0">
                  <option value="blueprint">Blueprint only</option>
                  <option value="site" selected>Site + Deploy</option>
                </select>
              </div>
              <button class="btn btn-primary" style="width:100%" onclick="quickTestSession()" id="quick-test-btn">Create Test Session</button>
              <div id="quick-test-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>

          <!-- Blueprint Generator -->
          <div class="card">
            <div class="card-header"><h2>Blueprint Generator</h2></div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Generate a complete test blueprint with strategist debrief. Picks an existing user or creates one automatically.</p>
              <div class="form-group">
                <label>User</label>
                <div style="position:relative">
                  <input type="text" id="test-bp-email" placeholder="Search users or type new email..." autocomplete="off" oninput="showUserDropdown(this,'test-bp-dropdown')" onfocus="showUserDropdown(this,'test-bp-dropdown')">
                  <div id="test-bp-dropdown" class="user-dropdown" style="display:none"></div>
                </div>
                <div id="test-bp-user-status" style="font-size:11px;margin-top:4px;min-height:16px"></div>
              </div>
              <div class="form-group">
                <label>Brand name</label>
                <input type="text" id="test-bp-brand" placeholder="e.g. Mitchell Performance Group">
              </div>
              <div class="form-group">
                <label>Niche</label>
                <input type="text" id="test-bp-niche" placeholder="e.g. Executive coaching for new leaders">
              </div>
              <button class="btn btn-primary" style="width:100%" onclick="generateTestBlueprint()" id="test-bp-btn">Generate Blueprint + Debrief</button>
              <div id="test-bp-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>
        </div>

        <div class="testing-grid">
          <!-- Endpoint Health Runner -->
          <div class="card">
            <div class="card-header">
              <h2>Endpoint Health Runner</h2>
              <button class="btn btn-outline btn-sm" onclick="testAllEndpoints()">Test All</button>
            </div>
            <div style="padding:20px" id="endpoint-health-results">
              <div style="color:var(--text2);font-size:13px">Click "Test All" to check all endpoints.</div>
            </div>
          </div>

          <!-- Email and Lifecycle Tester -->
          <div class="card">
            <div class="card-header"><h2>Lifecycle Event Tester</h2></div>
            <div style="padding:20px">
              <div class="form-group">
                <label>Email address</label>
                <input type="email" id="test-email" placeholder="test@example.com">
              </div>
              <div class="form-group">
                <label>Name (optional)</label>
                <input type="text" id="test-name" placeholder="First name">
              </div>
              <div class="form-group">
                <label>Phone (optional)</label>
                <input type="tel" id="test-phone" placeholder="+15550001234">
              </div>
              <div class="form-group">
                <label>Event type</label>
                <select id="test-event" style="margin:0">
                  <option value="interview_started">interview_started</option>
                  <option value="interview_completed">interview_completed</option>
                  <option value="interview_abandoned">interview_abandoned</option>
                  <option value="sis_purchased">sis_purchased</option>
                  <option value="call_booked">call_booked</option>
                </select>
              </div>
              <div class="form-group">
                <label>Phase (optional)</label>
                <input type="number" id="test-phase" placeholder="3" min="0" max="8">
              </div>
              <button class="btn btn-primary" style="width:100%" onclick="runTestTrigger()">Fire Event</button>
              <div id="test-trigger-result" style="margin-top:14px;font-size:13px"></div>
            </div>
          </div>
        </div>

        <div class="testing-grid">
          <!-- Stripe Mode Indicator -->
          <div class="card">
            <div class="card-header"><h2>Stripe Mode</h2></div>
            <div style="padding:20px">
              <div class="stripe-mode-indicator test">
                <div class="stripe-mode-dot"></div>
                Test Mode
              </div>
              <p style="color:var(--text2);font-size:12px;margin-top:12px">Update Stripe mode in Cloudflare Worker environment variables.</p>
            </div>
          </div>

          <!-- System Health Check -->
          <div class="card">
            <div class="card-header">
              <h2>System Health Check</h2>
              <button class="btn btn-outline btn-sm" onclick="runHealthCheck()">Run Now</button>
            </div>
            <div style="padding:20px">
              <p style="color:var(--text2);font-size:13px;margin-bottom:16px">Pings all workers and databases.</p>
              <div id="health-results">
                <div style="color:var(--text2);font-size:13px;text-align:center;padding:20px 0">Click "Run Now" to check systems.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- QC Checklist -->
        <div class="card">
          <div class="card-header"><h2>QC Checklist</h2></div>
          <div style="padding:20px">
            <p style="color:var(--text2);font-size:13px;margin-bottom:20px">Full end to end verification steps for the Deep Work funnel.</p>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
              <div>
                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">Purchase Flow</h3>
                <div id="checklist-purchase" class="checklist-group"></div>

                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;margin-top:20px">App Experience</h3>
                <div id="checklist-app" class="checklist-group"></div>

                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;margin-top:20px">Blueprint Output</h3>
                <div id="checklist-blueprint" class="checklist-group"></div>
              </div>

              <div>
                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">Email and SMS</h3>
                <div id="checklist-email" class="checklist-group"></div>

                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;margin-top:20px">Abandonment Recovery</h3>
                <div id="checklist-abandon" class="checklist-group"></div>

                <h3 style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;margin-top:20px">GHL Pipeline</h3>
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

      <!-- PROMPT LAB -->
      <div class="page" id="page-prompt-lab">
        <div class="card" style="margin-bottom:20px">
          <div class="card-header">
            <h2>Active System Prompt</h2>
            <div style="display:flex;gap:8px">
              <button class="btn btn-outline btn-sm" onclick="loadPrompt()">Reload</button>
              <button class="btn btn-primary btn-sm" onclick="savePrompt()">Save & Deploy</button>
            </div>
          </div>
          <div style="padding:20px">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;background:var(--bg2);padding:12px;border-radius:8px">
              <div>
                <div style="font-size:11px;color:var(--text2);text-transform:uppercase;font-weight:600;margin-bottom:4px">Version</div>
                <div style="font-size:16px;font-weight:700;color:var(--text)" id="ps-version">v1</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text2);text-transform:uppercase;font-weight:600;margin-bottom:4px">Avg Satisfaction</div>
                <div style="font-size:16px;font-weight:700;color:var(--text)" id="ps-satisfaction">\u2014</div>
              </div>
              <div>
                <div style="font-size:11px;color:var(--text2);text-transform:uppercase;font-weight:600;margin-bottom:4px">Sessions on Version</div>
                <div style="font-size:16px;font-weight:700;color:var(--text)" id="ps-count">\u2014</div>
              </div>
            </div>
            <div class="form-group" style="margin:0">
              <label>System Prompt</label>
              <textarea id="prompt-editor-ta" style="min-height:400px;font-family:monospace;font-size:12px;line-height:1.5"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- MONITORING -->
      <!-- API COSTS -->
      <div class="page" id="page-api-costs">
        <div class="stat-grid" id="cost-stat-grid">
          <div class="stat-card">
            <div class="stat-label">This Month</div>
            <div class="stat-value" id="cost-this-month">...</div>
            <div class="stat-sub" id="cost-month-calls">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">All Time</div>
            <div class="stat-value" id="cost-all-time">...</div>
            <div class="stat-sub" id="cost-all-calls">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Avg Per User</div>
            <div class="stat-value" id="cost-per-user">...</div>
            <div class="stat-sub" id="cost-per-user-calls">loading...</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Active Users</div>
            <div class="stat-value" id="cost-users">...</div>
            <div class="stat-sub" id="cost-sessions">loading...</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header"><h2>Cost by Model</h2></div>
            <div style="padding:20px" id="cost-by-model">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Estimated Monthly Projections</h2></div>
            <div style="padding:20px" id="cost-projections">Loading...</div>
          </div>
        </div>

        <div class="card" style="margin-bottom:24px">
          <div class="card-header">
            <h2>Daily Cost Trend</h2>
            <select id="cost-days-filter" style="width:120px;margin:0" onchange="loadApiCosts()">
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30" selected>Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div style="padding:20px;overflow-x:auto" id="cost-daily-chart">Loading...</div>
        </div>

        <div class="card">
          <div class="card-header"><h2>Top Users by Cost</h2></div>
          <div class="card-body">
            <table>
              <thead><tr><th>Email</th><th>Name</th><th>Sessions</th><th>API Calls</th><th>Tokens</th><th>Cost</th><th>Last Active</th></tr></thead>
              <tbody id="cost-users-tbody"><tr><td colspan="7" style="text-align:center;color:var(--text2)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="page" id="page-monitoring">
        <div class="stat-grid" id="health-grid" style="margin-bottom:24px;"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header"><h2>Funnel Health</h2></div>
            <div style="padding:20px" id="funnel-health">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header"><h2>API Usage (24h)</h2></div>
            <div style="padding:20px" id="api-usage">Loading...</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div class="card">
            <div class="card-header"><h2>Active Alerts</h2></div>
            <div style="padding:20px" id="alerts-list">Loading...</div>
          </div>
          <div class="card">
            <div class="card-header"><h2>Recent Errors</h2></div>
            <div style="padding:20px;max-height:400px;overflow-y:auto" id="errors-list">Loading...</div>
          </div>
        </div>

        <div style="display:flex;gap:12px;">
          <button class="btn btn-primary btn-sm" onclick="runHealthCheck()">Run Health Check</button>
          <button class="btn btn-outline btn-sm" onclick="sendDigest()">Send Daily Digest</button>
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
              <tbody id="users-tbody"><tr><td colspan="7" style="text-align:center;color:var(--text2)">Loading...</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="page" id="page-settings">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div>
            <div class="card">
              <div class="card-header"><h2>App Settings</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Calendar Link</label>
                  <input type="url" id="s-calendar-link" placeholder="https://calendly.com/...">
                </div>
                <div class="form-group">
                  <label>Welcome Message</label>
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
                <button class="btn btn-primary" style="width:100%" onclick="saveSettings()">Save Settings</button>
              </div>
            </div>
          </div>

          <div>
            <div class="card" style="margin-bottom:20px">
              <div class="card-header"><h2>Pricing Display</h2></div>
              <div style="padding:20px">
                <div class="form-group">
                  <label>Blueprint price</label>
                  <input type="text" id="s-blueprint-price" placeholder="$67">
                </div>
                <div class="form-group">
                  <label>Site package price</label>
                  <input type="text" id="s-site-price" placeholder="$197">
                </div>
                <div class="form-group">
                  <label>Strategy call price</label>
                  <input type="text" id="s-call-price" placeholder="$197">
                </div>
                <button class="btn btn-primary" style="width:100%" onclick="saveSettings()">Save Pricing</button>
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
                  <label>Tier access</label>
                  <select id="magic-gen-tier" style="margin:0">
                    <option value="blueprint">Blueprint</option>
                    <option value="site">Site + Deploy</option>
                    <option value="admin">Admin access</option>
                  </select>
                </div>
                <button class="btn btn-primary" style="width:100%" onclick="generateAdminMagicLink()">Generate Link</button>
                <div id="magic-gen-result" style="margin-top:12px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /shell -->

<!-- MODALS -->
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
      <button class="btn btn-primary" onclick="createUser()">Create + Send Magic Link</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal-view-session">
  <div class="modal" style="max-width:700px;width:95vw">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <h3 id="session-modal-title">Session</h3>
      <button class="btn btn-outline btn-sm" onclick="closeModal('view-session')" style="padding:6px 12px">Close</button>
    </div>
    <div style="max-height:500px;overflow-y:auto;padding:20px;background:var(--bg2);border-radius:8px" id="session-modal-messages"></div>
  </div>
</div>

<div id="toast"></div>

<script>
// STATE
let AUTH_TOKEN = localStorage.getItem('dw_admin_token') || localStorage.getItem('dw_session') || '';
let CURRENT_USER = null;
let ALL_USERS = [];
let SETTINGS = {};

const API = '';  // same origin

// XSS prevention helper
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');\\n}\\n\\n// BOOT\\nwindow.addEventListener('DOMContentLoaded', async () => {\\n  const params = new URLSearchParams(location.search);\\n  // Handle server-side magic link redirect \u2014 JWT passed directly in _s param\\n  const _sJwt = params.get('_s');\\n  if (_sJwt) {\\n    AUTH_TOKEN = _sJwt;\\n    localStorage.setItem('dw_admin_token', _sJwt);\\n    history.replaceState(null, '', '/admin');\\n    await tryAutoLogin();\\n    return;\\n  }\\n  const magic = params.get('magic');\\n  if (magic) {\\n    await handleMagicLogin(magic);\\n    return;\\n  }\\n  if (AUTH_TOKEN) {\\n    await tryAutoLogin();\\n  }\\n});\\n\\nasync function tryAutoLogin() {\\n  try {\\n    const res = await api('GET', '/api/auth/me');\\n    const user = res.user || res;\\n    if (user && user.role === 'admin') {\\n      CURRENT_USER = user;\\n      localStorage.setItem('dw_admin_token', AUTH_TOKEN);\\n      showApp();\\n    } else {\\n      AUTH_TOKEN = '';\\n      localStorage.removeItem('dw_admin_token');\\n    }\\n  } catch {\\n    AUTH_TOKEN = '';\\n    localStorage.removeItem('dw_admin_token');\\n  }\\n}\\n\\nasync function handleMagicLogin(token) {\\n  try {\\n    const res = await api('POST', '/api/auth/magic', { token });\\n    if ((res.token || res.sessionToken) && res.user?.role === 'admin') {\\n      AUTH_TOKEN = res.token || res.sessionToken;\\n      localStorage.setItem('dw_admin_token', AUTH_TOKEN);\\n      CURRENT_USER = res.user;\\n      history.replaceState({}, '', '/admin');\\n      showApp();\\n    } else {\\n      toast('Magic link invalid or expired.');\\n    }\\n  } catch {\\n    toast('Magic link failed.');\\n  }\\n}\\n\\n// AUTH\\nfunction showLoginStatus(id, type, msg) {\\n  const el = document.getElementById(id);\\n  el.className = 'login-status ' + type;\\n  el.textContent = msg;\\n}\\nfunction clearLoginStatus(id) {\\n  const el = document.getElementById(id);\\n  el.className = 'login-status';\\n  el.textContent = '';\\n}\\n\\nasync function requestMagicLink() {\\n  const email = document.getElementById('login-email').value.trim();\\n  if (!email) { showLoginStatus('magic-status', 'error', 'Enter your email.'); return; }\\n  clearLoginStatus('magic-status');\\n\\n  const btn = document.getElementById('magic-btn');\\n  btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(196,112,63,0.4);border-top-color:var(--gold);border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px;"></span>Sending...';\\n  btn.disabled = true;\\n\\n  try {\\n    const res = await api('POST', '/api/auth/request-magic', { email });\\n    showLoginStatus('magic-status', 'success', 'Check your inbox. A login link is on its way.');\\n  } catch {\\n    showLoginStatus('magic-status', 'error', 'Failed to send magic link.');\\n  } finally {\\n    btn.innerHTML = 'Send Magic Link';\\n    btn.disabled = false;\\n  }\\n}\\n\\nfunction logout() {\\n  localStorage.removeItem('dw_admin_token');\\n  localStorage.removeItem('dw_session');\\n  document.cookie = 'dw_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';\\n  window.location.href = '/logout';\\n}\\n\\n// SHOW APP\\nfunction showApp() {\\n  document.getElementById('login-screen').style.display = 'none';\\n  document.getElementById('shell').style.display = 'flex';\\n  document.getElementById('sidebar-email').textContent = CURRENT_USER?.email || '';\\n  loadDashboard();\\n}\\n\\n// NAVIGATION\\nfunction showPage(name) {\\n  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));\\n  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));\\n  document.getElementById('page-' + name).classList.add('active');\\n  document.getElementById('nav-' + name).classList.add('active');\\n\\n  const titles = { dashboard: 'Dashboard', users: 'Users', sessions: 'Sessions', 'prompt-lab': 'Prompt Lab', monitoring: 'Monitoring', settings: 'Settings', testing: 'Testing Lab', 'api-costs': 'API Costs' };\\n  document.getElementById('page-title').textContent = titles[name] || name;\\n\\n  if (name === 'users') loadUsers();\\n  else if (name === 'sessions') loadSessions();\\n  else if (name === 'settings') loadSettings();\\n  else if (name === 'prompt-lab') loadPrompt();\\n  else if (name === 'monitoring') loadMonitoring();\\n  else if (name === 'testing') loadTesting();\\n  else if (name === 'api-costs') loadApiCosts();\\n}\\n\\nfunction refreshPage() {\\n  const active = document.querySelector('.page.active')?.id?.replace('page-', '');\\n  if (active === 'dashboard') loadDashboard();\\n  else if (active === 'api-costs') loadApiCosts();\\n  else if (active) showPage(active);\\n}\\n\\n// DASHBOARD\\nasync function loadDashboard() {\\n  try {\\n    const stats = await api('GET', '/api/admin/stats');\\n\\n    document.getElementById('stat-sessions').textContent = stats.sessions ?? '\u2014';\\n    document.getElementById('stat-sessions-sub').textContent = (stats.sessionsToday ?? 0) + ' today';\\n    document.getElementById('stat-blueprints').textContent = stats.completed ?? '\u2014';\\n    document.getElementById('stat-blueprints-sub').textContent = 'of total sessions';\\n    document.getElementById('stat-rate').textContent = stats.sessions > 0 ? Math.round((stats.completed / stats.sessions) * 100) + '%' : '0%';\\n    document.getElementById('stat-rate-sub').textContent = 'completion rate';\\n    document.getElementById('stat-users').textContent = stats.users ?? '\u2014';\\n    document.getElementById('stat-users-sub').textContent = 'total users';\\n\\n    renderFunnel(stats.funnel || {});\\n    renderRecentSessions(stats.recentSessions || []);\\n  } catch (e) {\\n    console.error(e);\\n  }\\n}\\n\\nfunction renderFunnel(funnel) {\\n  const el = document.getElementById('funnel-chart');\\n  if (!el) return;\\n  if (typeof funnel === 'object' && !Array.isArray(funnel)) {\\n    el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' +\\n      '<div class="funnel-stat"><div class="funnel-num">' + (funnel.today || 0) + '</div><div class="funnel-label">Today</div></div>' +\\n      '<div class="funnel-stat"><div class="funnel-num">' + (funnel.week || 0) + '</div><div class="funnel-label">This Week</div></div>' +\\n      '<div class="funnel-stat"><div class="funnel-num">' + (funnel.month || 0) + '</div><div class="funnel-label">This Month</div></div>' +\\n      '</div>';\\n    return;\\n  }\\n  if (Array.isArray(funnel) && funnel.length) {\\n    const max = funnel[0]?.count || 1;\\n    el.innerHTML = funnel.map(f => \`\\n      <div style="margin-bottom:12px">\\n        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">\\n          <span>Phase \${f.phase}: \${f.label}</span>\\n          <span style="font-weight:600">\${f.count}</span>\\n        </div>\\n        <div style="background:var(--bg2);border-radius:4px;height:8px;overflow:hidden">\\n          <div style="background:var(--gold);height:100%;width:\${Math.round((f.count/max)*100)}%"></div>\\n        </div>\\n      </div>\\n    \`).join('');\\n  } else {\\n    el.innerHTML = '<div style="color:var(--text2);font-size:13px">No funnel data available.</div>';\\n  }\\n}\\n\\nfunction renderRecentSessions(sessions) {\\n  document.getElementById('recent-sessions-tbody').innerHTML = sessions.map(s => \`\\n    <tr>\\n      <td>\${esc(s.user_email || s.id?.slice(0,14) || 'anon')}</td>\\n      <td><span class="badge \${s.tier === 'site' ? 'badge-gold' : 'badge-gray'}">\${esc(s.tier)}</span></td>\\n      <td>\${s.phase}/8</td>\\n      <td>\${s.blueprint_generated ? '<span class="badge badge-green">Done</span>' : '<span class="badge badge-gray">In progress</span>'}</td>\\n    </tr>\\n  \`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text2)">No sessions yet.</td></tr>';\\n}\\n\\n// USERS\\nasync function loadUsers() {\\n  const tbody = document.getElementById('users-tbody');\\n  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text2)">Loading...</td></tr>';\\n  try {\\n    const res = await api('GET', '/api/admin/users');\\n    ALL_USERS = res.users || [];\\n    renderUsersTable(ALL_USERS);\\n  } catch {\\n    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text2)">Failed to load.</td></tr>';\\n  }\\n}\\n\\nfunction renderUsersTable(users) {\\n  document.getElementById('users-tbody').innerHTML = users.map(u => \`\\n    <tr>\\n      <td style="color:var(--text)">\${esc(u.email)}</td>\\n      <td>\${esc(u.name) || '\u2014'}</td>\\n      <td><span class="badge \${u.role === 'admin' ? 'badge-gold' : 'badge-gray'}">\${esc(u.role)}</span></td>\\n      <td>\${u.tier ? '<span class="badge badge-blue">'+esc(u.tier)+'</span>' : '\u2014'}</td>\\n      <td>\${u.sessions_count || 0}</td>\\n      <td>\${fmtDate(u.created_at)}</td>\\n      <td>\\n        <button class="btn btn-outline btn-sm" onclick="sendMagicLink('\${esc(u.id)}','\${esc(u.email)}')">Magic Link</button>\\n      </td>\\n    </tr>\\n  \`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--text2)">No users yet.</td></tr>';\\n}\\n\\nfunction filterUsers(q) {\\n  const filtered = q ? ALL_USERS.filter(u => u.email.includes(q) || (u.name||'').toLowerCase().includes(q.toLowerCase())) : ALL_USERS;\\n  renderUsersTable(filtered);\\n}\\n\\nasync function createUser() {\\n  const email = document.getElementById('new-user-email').value.trim();\\n  const name = document.getElementById('new-user-name').value.trim();\\n  const role = document.getElementById('new-user-role').value;\\n  const tier = document.getElementById('new-user-tier').value;\\n  if (!email) { toast('Enter an email.'); return; }\\n\\n  try {\\n    const res = await api('POST', '/api/admin/users', { email, name, role, tier });\\n    if (res.user) {\\n      closeModal('create-user');\\n      toast('User created. Magic link copied to clipboard.');\\n      if (res.magicLink) navigator.clipboard?.writeText(res.magicLink).catch(()=>{});\\n      loadUsers();\\n    } else {\\n      toast(res.error || 'Failed to create user.');\\n    }\\n  } catch {\\n    toast('Failed to create user.');\\n  }\\n}\\n\\nasync function sendMagicLink(userId, email) {\\n  try {\\n    const res = await api('POST', '/api/admin/magic-link', { userId, email });\\n    if (res.magicLink) {\\n      await navigator.clipboard?.writeText(res.magicLink).catch(()=>{});\\n      toast('Magic link copied to clipboard.');\\n    }\\n  } catch {\\n    toast('Failed to generate magic link.');\\n  }\\n}\\n\\n// SESSIONS\\nasync function loadSessions() {\\n  const tier = document.getElementById('session-filter-tier')?.value || '';\\n  const status = document.getElementById('session-filter-status')?.value || '';\\n  const tbody = document.getElementById('sessions-tbody');\\n  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text2)">Loading...</td></tr>';\\n\\n  try {\\n    const res = await api('GET', \`/api/admin/sessions?tier=\${tier}&status=\${status}&limit=50\`);\\n    const sessions = res.sessions || [];\\n    tbody.innerHTML = sessions.map(s => \`\\n      <tr>\\n        <td style="font-family:monospace;font-size:11px">\${esc(s.id?.slice(0,20))}...</td>\\n        <td><span class="badge \${s.tier==='site'?'badge-gold':'badge-gray'}">\${esc(s.tier)}</span></td>\\n        <td>\${s.phase}/8</td>\\n        <td>\${s.message_count || 0}</td>\\n        <td>\${s.blueprint_generated ? '\u2713' : '\u2014'}</td>\\n        <td>\${s.site_generated ? '\u2713' : '\u2014'}</td>\\n        <td>\${fmtDate(s.created_at)}</td>\\n        <td><button class="btn btn-outline btn-sm" onclick="viewSession('\${esc(s.id)}')">View</button></td>\\n      </tr>\\n    \`).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text2)">No sessions yet.</td></tr>';\\n  } catch {\\n    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text2)">Failed to load sessions.</td></tr>';\\n  }\\n}\\n\\nasync function viewSession(sessionId) {\\n  document.getElementById('session-modal-title').textContent = sessionId.slice(0, 20) + '...';\\n  document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text2);text-align:center;padding:20px">Loading...</div>';\\n  openModal('view-session');\\n\\n  try {\\n    const res = await api('GET', \`/api/admin/session/\${sessionId}\`);\\n    const messages = res.messages || [];\\n    document.getElementById('session-modal-messages').innerHTML = messages\\n      .filter(m => !m.content?.includes('METADATA:'))\\n      .map(m => \`\\n        <div style="margin-bottom:12px;display:flex;gap:10px;\${m.role === 'user' ? 'flex-direction:row-reverse' : ''}">\\n          <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:\${m.role === 'assistant' ? 'var(--gold)' : 'var(--bg2)'};color:\${m.role === 'assistant' ? 'white' : 'var(--text)'}">\\n            \${m.role === 'assistant' ? 'AI' : 'U'}\\n          </div>\\n          <div style="background:var(--bg2);padding:10px 12px;border-radius:8px;font-size:13px;line-height:1.5;max-width:75%">\\n            \${(m.content || '').replace(/METADATA:\\{[^\\n]*\\}/g,'').replace(/\\\`\\\`\\\`json[\\s\\S]*?\\\`\\\`\\\`/g,'[Blueprint JSON]').slice(0,600)}\\n          </div>\\n        </div>\\n      \`).join('') || '<div style="color:var(--text2);text-align:center;padding:20px">No messages.</div>';\\n  } catch {\\n    document.getElementById('session-modal-messages').innerHTML = '<div style="color:var(--text2);text-align:center;padding:20px">Failed to load session.</div>';\\n  }\\n}\\n\\n// PROMPT LAB\\nasync function loadPrompt() {\\n  try {\\n    const res = await api('GET', '/api/admin/prompt');\\n    document.getElementById('prompt-editor-ta').value = res.prompt || '';\\n    document.getElementById('ps-version').textContent = 'v' + (res.version || 1);\\n    document.getElementById('ps-satisfaction').textContent = res.avgSatisfaction ? res.avgSatisfaction.toFixed(1) + '/10' : '\u2014';\\n    document.getElementById('ps-count').textContent = res.sessionsCount || 0;\\n  } catch {\\n    toast('Failed to load prompt.');\\n  }\\n}\\n\\nasync function savePrompt() {\\n  const prompt = document.getElementById('prompt-editor-ta').value.trim();\\n  if (!prompt) { toast('Prompt cannot be empty.'); return; }\\n  try {\\n    const res = await api('POST', '/api/admin/prompt', { prompt });\\n    if (res.ok) { toast('Prompt saved. New version is active.'); loadPrompt(); }\\n    else toast(res.error || 'Failed to save.');\\n  } catch {\\n    toast('Failed to save prompt.');\\n  }\\n}\\n\\n// SETTINGS\\nasync function loadSettings() {\\n  try {\\n    const res = await api('GET', '/api/admin/settings');\\n    SETTINGS = res.settings || {};\\n    document.getElementById('s-calendar-link').value = SETTINGS.calendar_link || '';\\n    document.getElementById('s-welcome-message').value = SETTINGS.welcome_message || '';\\n    document.getElementById('s-banner-text').value = SETTINGS.app_banner_text || '';\\n    document.getElementById('s-report-email').value = SETTINGS.weekly_report_email || '';\\n    document.getElementById('s-blueprint-price').value = SETTINGS.blueprint_price_display || '';\\n    document.getElementById('s-site-price').value = SETTINGS.site_price_display || '';\\n    document.getElementById('s-call-price').value = SETTINGS.call_price_display || '';\\n    setToggle('banner', SETTINGS.app_banner_enabled === 'true');\\n    setToggle('rag', SETTINGS.rag_auto_save !== 'false');\\n  } catch {\\n    toast('Failed to load settings.');\\n  }\\n}\\n\\nasync function saveSettings() {\\n  try {\\n    const updates = {\\n      calendar_link: document.getElementById('s-calendar-link').value.trim(),\\n      welcome_message: document.getElementById('s-welcome-message').value.trim(),\\n      app_banner_text: document.getElementById('s-banner-text').value.trim(),\\n      weekly_report_email: document.getElementById('s-report-email').value.trim(),\\n      blueprint_price_display: document.getElementById('s-blueprint-price').value.trim(),\\n      site_price_display: document.getElementById('s-site-price').value.trim(),\\n      call_price_display: document.getElementById('s-call-price').value.trim(),\\n      app_banner_enabled: String(document.getElementById('toggle-banner').classList.contains('on')),\\n      rag_auto_save: String(document.getElementById('toggle-rag').classList.contains('on')),\\n    };\\n    const res = await api('POST', '/api/admin/settings', updates);\\n    if (res.ok) toast('Settings saved.');\\n    else toast('Failed to save settings.');\\n  } catch {\\n    toast('Failed to save settings.');\\n  }\\n}\\n\\nasync function generateAdminMagicLink() {\\n  const email = document.getElementById('magic-gen-email').value.trim();\\n  const tier = document.getElementById('magic-gen-tier').value;\\n  if (!email) { toast('Enter an email address.'); return; }\\n  try {\\n    const res = await api('POST', '/api/admin/magic-link', { email, tier, createIfMissing: true });\\n    if (res.magicLink) {\\n      document.getElementById('magic-gen-result').innerHTML = \`\\n        <div class="magic-link-box" onclick="copyToClipboard(this.textContent)">\${res.magicLink}</div>\\n        <div style="font-size:12px;color:var(--text2)">Click to copy. Valid for 72 hours. Single use.</div>\\n      \`;\\n    } else {\\n      toast(res.error || 'Failed to generate link.');\\n    }\\n  } catch {\\n    toast('Failed to generate link.');\\n  }\\n}\\n\\n// USER DROPDOWN HELPERS\\nlet dropdownTimeout = null;\\nfunction showUserDropdown(input, dropdownId) {\\n  clearTimeout(dropdownTimeout);\\n  const dd = document.getElementById(dropdownId);\\n  const q = input.value.trim().toLowerCase();\\n  const statusEl = input.closest('.form-group').querySelector('[id$="-user-status"]');\\n\\n  if (!q) { dd.style.display = 'none'; if (statusEl) statusEl.innerHTML = ''; return; }\\n\\n  const matches = (ALL_USERS || []).filter(u =>\\n    u.email.toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q)\\n  ).slice(0, 6);\\n\\n  const isValidEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(q);\\n  const exactMatch = matches.find(u => u.email.toLowerCase() === q);\\n\\n  let html = '';\\n  if (matches.length > 0) {\\n    html = matches.map(u => \`\\n      <div class="user-dropdown-item" onmousedown="selectUser('\${u.email}','\${input.id}','\${dropdownId}')">\\n        <span class="ud-email">\${u.email}</span>\\n        <span class="ud-meta">\${u.name || ''} \${u.role === 'admin' ? '(admin)' : ''}</span>\\n      </div>\\n    \`).join('');\\n  }\\n\\n  if (isValidEmail && !exactMatch) {\\n    html += \`\\n      <div class="user-dropdown-item ud-create" onmousedown="selectUser('\${q}','\${input.id}','\${dropdownId}',true)">\\n        + Create new user: \${q}\\n      </div>\\n    \`;\\n  } else if (!isValidEmail && matches.length === 0) {\\n    html = '<div class="user-dropdown-empty">Type a valid email to create a new user</div>';\\n  }\\n\\n  dd.innerHTML = html;\\n  dd.style.display = html ? 'block' : 'none';\\n\\n  if (statusEl) {\\n    if (exactMatch) {\\n      statusEl.innerHTML = '<span style="color:var(--green)">Existing user found</span>';\\n    } else if (isValidEmail) {\\n      statusEl.innerHTML = '<span style="color:var(--gold)">New user will be created automatically</span>';\\n    } else {\\n      statusEl.innerHTML = '';\\n    }\\n  }\\n}\\n\\nfunction selectUser(email, inputId, dropdownId, isNew) {\\n  document.getElementById(inputId).value = email;\\n  document.getElementById(dropdownId).style.display = 'none';\\n  const statusEl = document.getElementById(inputId).closest('.form-group').querySelector('[id$="-user-status"]');\\n  if (statusEl) {\\n    statusEl.innerHTML = isNew\\n      ? '<span style="color:var(--gold)">New user will be created automatically</span>'\\n      : '<span style="color:var(--green)">Existing user selected</span>';\\n  }\\n}\\n\\ndocument.addEventListener('click', function(e) {\\n  document.querySelectorAll('.user-dropdown').forEach(dd => {\\n    if (!dd.parentElement.contains(e.target)) dd.style.display = 'none';\\n  });\\n});\\n\\n// TEST BLUEPRINT GENERATOR\\nasync function generateTestBlueprint() {\\n  const email = document.getElementById('test-bp-email').value.trim();\\n  if (!email) { toast('Select a user or enter an email address.'); return; }\\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { toast('Please enter a valid email address.'); return; }\\n  const brandName = document.getElementById('test-bp-brand').value.trim() || 'Test Brand';\\n  const niche = document.getElementById('test-bp-niche').value.trim() || 'Business coaching';\\n  const resultEl = document.getElementById('test-bp-result');\\n  const btn = document.getElementById('test-bp-btn');\\n\\n  btn.disabled = true;\\n  btn.textContent = 'Generating blueprint + debrief...';\\n  resultEl.innerHTML = '<div style="color:var(--text2)">This usually takes 15 to 30 seconds. Generating blueprint with AI, then creating strategist debrief...</div>';\\n\\n  try {\\n    const res = await api('POST', '/api/admin/generate-test-blueprint', { email, brandName, niche });\\n    btn.disabled = false;\\n    btn.textContent = 'Generate Blueprint + Debrief';\\n    if (res.ok) {\\n      resultEl.innerHTML = \`\\n        <div style="color:var(--green);font-weight:600;margin-bottom:8px">Blueprint created successfully</div>\\n        \${res.userCreated ? '<div style="font-size:12px;color:var(--gold);margin-bottom:4px">New user created automatically</div>' : ''}\\n        <div style="font-size:12px;color:var(--text2)">Session: \${res.sessionId}</div>\\n        <div style="font-size:12px;color:var(--text2);margin-top:4px">Strategist Debrief: \${res.hasDebrief ? '<span style="color:var(--green)">Included</span>' : '<span style="color:var(--orange,#e67e22)">Not generated</span>'}</div>\\n        \${!res.hasDebrief ? \`<button onclick="generateDebrief('\${res.sessionId}')" style="margin-top:8px;padding:6px 14px;background:var(--gold);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px">Generate Debrief (Opus)</button>\` : ''}\\n        \${res.magicLink ? \`<div class="magic-link-box" onclick="copyToClipboard(this.textContent)" style="margin-top:8px">\${res.magicLink}</div>\\n        <div style="font-size:11px;color:var(--text2)">Click to copy magic link. Opens directly to blueprint view.</div>\` : ''}\\n      \`;\\n      loadUsers();\\n    } else {\\n      resultEl.innerHTML = \`<div style="color:var(--red)">\${res.error || 'Failed to generate blueprint.'}</div>\`;\\n    }\\n  } catch (e) {\\n    btn.disabled = false;\\n    btn.textContent = 'Generate Blueprint + Debrief';\\n    resultEl.innerHTML = '<div style="color:var(--red)">Request failed. Check console.</div>';\\n  }\\n}\\n\\nasync function quickTestSession() {\\n  const email = document.getElementById('quick-test-email').value.trim();\\n  if (!email) { toast('Select a user or enter an email address.'); return; }\\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { toast('Please enter a valid email address.'); return; }\\n  const tier = document.getElementById('quick-test-tier').value;\\n  const resultEl = document.getElementById('quick-test-result');\\n  const btn = document.getElementById('quick-test-btn');\\n\\n  btn.disabled = true;\\n  btn.textContent = tier === 'site' ? 'Creating session + blueprint + debrief...' : 'Creating session...';\\n  resultEl.innerHTML = '<div style="color:var(--text2)">Setting up test session...</div>';\\n\\n  try {\\n    const res = await api('POST', '/api/admin/quick-test-session', { email, tier });\\n    btn.disabled = false;\\n    btn.textContent = 'Create Test Session';\\n    if (res.ok) {\\n      resultEl.innerHTML = \`\\n        <div style="color:var(--green);font-weight:600;margin-bottom:8px">Test session created</div>\\n        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">User: \${res.userId}</div>\\n        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Session: \${res.sessionId}</div>\\n        <div style="font-size:12px;color:var(--text2);margin-bottom:4px">Tier: \${res.tier} | Blueprint: \${res.hasBlueprint ? 'Yes' : 'No'}</div>\\n        <div style="font-size:12px;color:var(--text2);margin-bottom:8px">Strategist Debrief: \${res.hasDebrief ? '<span style="color:var(--green)">Included</span>' : '<span style="color:var(--orange,#e67e22)">Not generated</span>'}</div>\\n        \${!res.hasDebrief && res.hasBlueprint ? \`<button onclick="generateDebrief('\${res.sessionId}')" style="margin-top:4px;margin-bottom:8px;padding:6px 14px;background:var(--gold);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:12px">Generate Debrief (Opus)</button>\` : ''}\\n        \${res.magicLink ? \`<div class="magic-link-box" onclick="copyToClipboard(this.textContent)">\${res.magicLink}</div>\\n        <div style="font-size:11px;color:var(--text2)">Click to copy. Opens to \${res.hasBlueprint ? 'blueprint' : 'interview'}.</div>\` : ''}\\n      \`;\\n      loadUsers();\\n    } else {\\n      resultEl.innerHTML = \`<div style="color:var(--red)">\${res.error || 'Failed to create test session.'}</div>\`;\\n    }\\n  } catch (e) {\\n    btn.disabled = false;\\n    btn.textContent = 'Create Test Session';\\n    resultEl.innerHTML = '<div style="color:var(--red)">Request failed. Check console.</div>';\\n  }\\n}\\n\\n// GENERATE DEBRIEF for existing session\\nasync function generateDebrief(sessionId) {\\n  const btn = event.target;\\n  btn.disabled = true;\\n  btn.textContent = 'Generating debrief (Opus)...';\\n  try {\\n    const res = await api('POST', '/api/admin/generate-debrief', { sessionId });\\n    if (res.ok) {\\n      btn.textContent = 'Debrief generated!';\\n      btn.style.background = 'var(--green)';\\n      toast('Strategist debrief generated successfully. Reload the blueprint to see it.');\\n    } else {\\n      btn.textContent = 'Failed';\\n      btn.style.background = 'var(--red)';\\n      toast(res.error || 'Failed to generate debrief');\\n    }\\n  } catch (e) {\\n    btn.textContent = 'Error';\\n    btn.style.background = 'var(--red)';\\n    toast('Request failed. Check console.');\\n  }\\n}\\n\\n// ENDPOINT HEALTH TEST\\nasync function testAllEndpoints() {\\n  const el = document.getElementById('endpoint-health-results');\\n  el.innerHTML = '<div style="color:var(--text2)">Testing all endpoints...</div>';\\n\\n  const endpoints = [\\n    '/api/admin/stats',\\n    '/api/admin/users',\\n    '/api/admin/sessions',\\n    '/api/admin/settings',\\n    '/api/admin/prompt',\\n    '/api/admin/health',\\n    '/api/admin/monitoring',\\n    '/api/admin/api-usage',\\n    '/api/admin/errors'\\n  ];\\n\\n  const results = [];\\n  let passed = 0;\\n\\n  for (const endpoint of endpoints) {\\n    const startTime = performance.now();\\n    try {\\n      const res = await api('GET', endpoint);\\n      const endTime = performance.now();\\n      const time = Math.round(endTime - startTime);\\n      results.push({ endpoint, status: 'pass', time, code: 200 });\\n      passed++;\\n    } catch (e) {\\n      const endTime = performance.now();\\n      const time = Math.round(endTime - startTime);\\n      results.push({ endpoint, status: 'fail', time, code: 500 });\\n    }\\n  }\\n\\n  el.innerHTML = results.map(r => \`\\n    <div class="endpoint-test \${r.status}">\\n      <div class="endpoint-name">\${r.endpoint}</div>\\n      <div class="endpoint-status">\${r.status === 'pass' ? '\u2713 OK' : '\u2717 Failed'} \u2022 \${r.time}ms</div>\\n    </div>\\n  \`).join('') + \`<div style="margin-top:12px;font-weight:600;color:var(--text)">\${passed}/\${endpoints.length} endpoints healthy</div>\`;\\n}\\n\\n// TOGGLE HELPERS\\nfunction toggleSetting(name) {\\n  const el = document.getElementById('toggle-' + name);\\n  el.classList.toggle('on');\\n}\\n\\nfunction setToggle(name, val) {\\n  const el = document.getElementById('toggle-' + name);\\n  if (val) el.classList.add('on'); else el.classList.remove('on');\\n}\\n\\n// MODAL HELPERS\\nfunction openModal(name) {\\n  document.getElementById('modal-' + name).classList.add('open');\\n}\\nfunction closeModal(name) {\\n  document.getElementById('modal-' + name).classList.remove('open');\\n}\\n\\n// API HELPER\\nasync function api(method, path, body) {\\n  const opts = {\\n    method,\\n    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + AUTH_TOKEN }\\n  };\\n  if (body) opts.body = JSON.stringify(body);\\n  const res = await fetch(API + path, opts);\\n  if (res.status === 401) { logout(); return {}; }\\n  return res.json();\\n}\\n\\n// UTILS\\nfunction toast(msg, ms = 3500) {\\n  const t = document.getElementById('toast');\\n  t.textContent = msg; t.classList.add('show');\\n  setTimeout(() => t.classList.remove('show'), ms);\\n}\\n\\nfunction fmtDate(d) {\\n  if (!d) return '\u2014';\\n  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });\\n}\\n\\nfunction copyToClipboard(text) {\\n  navigator.clipboard?.writeText(text).then(() => toast('Copied to clipboard.'));\\n}\\n\\n// MONITORING\\nasync function loadMonitoring() {\\n  try {\\n    const [monData, apiData] = await Promise.all([\\n      api('GET', '/api/admin/monitoring'),\\n      api('GET', '/api/admin/api-usage?hours=24'),\\n    ]);\\n\\n    // Health grid\\n    const healthGrid = document.getElementById('health-grid');\\n    if (monData.health && monData.health.length) {\\n      healthGrid.innerHTML = monData.health.map(h => {\\n        const d = h.details ? JSON.parse(h.details) : {};\\n        const statusClass = h.status === 'healthy' ? 'green' : h.status === 'warning' ? 'yellow' : 'red';\\n        return '<div class="stat-card"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div class="health-dot ' + statusClass + '"></div><div style="font-size:12px;font-weight:600">' + h.check_type + '</div></div><div class="stat-label">' +\\n          h.status + (d.latencyMs ? ' \xB7 ' + d.latencyMs + 'ms' : '') + (d.error ? ' \xB7 ' + d.error : '') + '</div></div>';\\n      }).join('');\\n    } else {\\n      healthGrid.innerHTML = '<div class="stat-card"><div class="stat-value">\u2014</div><div class="stat-label">No checks yet</div></div>';\\n    }\\n\\n    // Funnel health\\n    const fh = document.getElementById('funnel-health');\\n    const f = monData.funnel;\\n    if (f) {\\n      let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">';\\n      html += '<div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700">' + (f.total || 0) + '</div><div style="font-size:11px;color:var(--text2);text-transform:uppercase">Sessions</div></div>';\\n      html += '<div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700">' + (f.completionRate || 0) + '%</div><div style="font-size:11px;color:var(--text2);text-transform:uppercase">Completion</div></div>';\\n      html += '<div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700">' + (f.avgPhase || 0) + '</div><div style="font-size:11px;color:var(--text2);text-transform:uppercase">Avg Phase</div></div>';\\n      html += '<div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:700">' + (f.dropOffRate || 0) + '%</div><div style="font-size:11px;color:var(--text2);text-transform:uppercase">Drop-off</div></div>';\\n      html += '</div>';\\n      if (f.warnings && f.warnings.length) {\\n        html += f.warnings.map(w => '<div style="background:rgba(217,119,6,0.08);border-left:3px solid #D97706;padding:8px 12px;margin:6px 0;border-radius:0 6px 6px 0;font-size:13px;color:#92400E">' + w + '</div>').join('');\\n      }\\n      if (f.lastFivePhases) html += '<p style="font-size:12px;color:var(--text2);margin-top:8px">Last 5: phases ' + f.lastFivePhases.join(', ') + '</p>';\\n      fh.innerHTML = html;\\n    }\\n\\n    // API usage\\n    const au = document.getElementById('api-usage');\\n    if (apiData.byProvider && apiData.byProvider.length) {\\n      let html = '<div style="font-size:13px;">';\\n      html += '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-weight:600;color:var(--text2)"><span>Provider</span><span>Calls</span><span>Avg ms</span></div>';\\n      apiData.byProvider.forEach(p => {\\n        const name = p.metric_name.replace('api.', '').replace('.call', '');\\n        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>' + name + '</span><span style="font-weight:600">' + p.calls + '</span><span>' + (p.avg_latency_ms || 0) + 'ms</span></div>';\\n      });\\n      if (apiData.rateLimitHits?.length) {\\n        html += '<p style="color:#D97706;margin-top:8px;font-size:12px">\u26A0 ' + apiData.rateLimitHits.length + ' rate limit hit(s)</p>';\\n      }\\n      html += '<p style="color:var(--text2);margin-top:8px;font-size:12px">Total: ' + apiData.totalCalls + ' calls in ' + apiData.period + '</p>';\\n      html += '</div>';\\n      au.innerHTML = html;\\n    } else {\\n      au.innerHTML = '<p style="color:var(--text2);font-size:14px">No API calls recorded yet.</p>';\\n    }\\n\\n    // Alerts\\n    const al = document.getElementById('alerts-list');\\n    const alerts = (monData.alerts || []).filter(a => !a.resolved);\\n    if (alerts.length) {\\n      al.innerHTML = alerts.map(a => {\\n        const dot = a.severity === 'critical' ? '\u{1F534}' : '\u{1F7E1}';\\n        return '<div style="padding:10px 0;border-bottom:1px solid var(--border)"><div style="display:flex;align-items:center;gap:8px">' + dot +\\n          ' <strong style="font-size:13px">' + a.title + '</strong>' +\\n          '<button class="btn btn-outline btn-sm" style="margin-left:auto;font-size:11px;padding:4px 10px" onclick="resolveAlert(' + a.id + ')">Resolve</button></div>' +\\n          '<p style="font-size:12px;color:var(--text2);margin-top:4px">' + (a.message || '').slice(0, 120) + '</p>' +\\n          '<p style="font-size:11px;color:var(--text3)">' + fmtDate(a.created_at) + '</p></div>';\\n      }).join('');\\n    } else {\\n      al.innerHTML = '<p style="color:var(--green);font-size:14px">\u2713 No active alerts</p>';\\n    }\\n\\n    // Errors\\n    const el = document.getElementById('errors-list');\\n    const errors = monData.errors || [];\\n    if (errors.length) {\\n      el.innerHTML = errors.slice(0, 15).map(e =>\\n        '<div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="font-size:12px;font-weight:600;color:var(--text)">' + (e.endpoint || '?') + ' <span style="color:var(--red)">' + (e.status_code || 500) + '</span></div>' +\\n        '<div style="font-size:12px;color:var(--text2);font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + (e.error_message || '').slice(0, 100) + '</div>' +\\n        '<div style="font-size:11px;color:var(--text3)">' + fmtDate(e.created_at) + '</div></div>'\\n      ).join('');\\n    } else {\\n      el.innerHTML = '<p style="color:var(--green);font-size:14px">\u2713 No errors in log</p>';\\n    }\\n  } catch (err) {\\n    toast('Failed to load monitoring: ' + err.message);\\n  }\\n}\\n\\nasync function runHealthCheck() {\\n  const el = document.getElementById('health-results');\\n  el.innerHTML = '<div style="color:var(--text2);font-size:13px">Checking all systems...</div>';\\n\\n  try {\\n    const res = await api('GET', '/api/admin/system-health');\\n    const checks = res.checks || [];\\n\\n    el.innerHTML = checks.map(c => \`\\n      <div class="health-row">\\n        <span class="health-label">\${c.name}</span>\\n        <span class="health-status \${c.ok ? 'health-ok' : 'health-fail'}">\${c.ok ? '\u2713 OK' : '\u2717 ' + (c.error || 'Failed')}</span>\\n      </div>\\n    \`).join('') || '<div style="color:var(--text2);font-size:13px">No results returned.</div>';\\n\\n    const passed = checks.filter(c => c.ok).length;\\n    const total = checks.length;\\n    toast(passed + '/' + total + ' systems healthy');\\n  } catch (err) {\\n    el.innerHTML = \`<div style="color:var(--red);font-size:13px">Health check failed: \${err.message}</div>\`;\\n  }\\n}\\n\\nasync function sendDigest() {\\n  toast('Generating digest...');\\n  try {\\n    const res = await api('POST', '/api/admin/digest');\\n    toast('Digest sent. Sessions: ' + (res.newSessions || 0) + ', Errors: ' + (res.errorsLogged || 0));\\n  } catch (err) {\\n    toast('Digest failed: ' + err.message);\\n  }\\n}\\n\\nasync function resolveAlert(id) {\\n  try {\\n    await api('POST', '/api/admin/resolve-alert', { alertId: id });\\n    toast('Alert resolved.');\\n    loadMonitoring();\\n  } catch (err) {\\n    toast('Failed to resolve alert.');\\n  }\\n}\\n\\n// TESTING PAGE\\nconst CHECKLIST = {\\n  purchase: [\\n    { id: 'p1', label: 'DWI Stripe payment link loads without errors' },\\n    { id: 'p2', label: 'Completing test purchase redirects to thank you page' },\\n    { id: 'p3', label: 'Stripe webhook fires and is received' },\\n    { id: 'p4', label: 'GHL contact created or updated with purchase tag' },\\n    { id: 'p5', label: 'Magic login link generated and delivered by email' },\\n  ],\\n  app: [\\n    { id: 'a1', label: 'App loads at love.jamesguldan.com without errors' },\\n    { id: 'a2', label: 'Intake form collects name, email, and phone' },\\n    { id: 'a3', label: 'Phase 1 question appears after intake submission' },\\n    { id: 'a4', label: 'Microphone input works on mobile' },\\n    { id: 'a5', label: 'Phase banner shows on completion of each phase' },\\n    { id: 'a6', label: 'Session saves and restores after closing browser' },\\n  ],\\n  blueprint: [\\n    { id: 'b1', label: 'Phase 8 generates a blueprint with no raw JSON visible' },\\n    { id: 'b2', label: 'Blueprint screen renders with all sections' },\\n    { id: 'b3', label: 'Download Blueprint button produces valid file' },\\n    { id: 'b4', label: 'Upsell to Site in Sixty shows on blueprint screen' },\\n  ],\\n  email: [\\n    { id: 'e1', label: 'interview_started fires to drip worker on session start' },\\n    { id: 'e2', label: 'DWI email arrives within 5 minutes of trigger' },\\n    { id: 'e3', label: 'Nudge email queued for 24 hours after interview start' },\\n    { id: 'e4', label: 'SMS fires within 5 minutes of purchase' },\\n    { id: 'e5', label: 'interview_completed fires when blueprint generates' },\\n    { id: 'e6', label: 'SIS pitch email queued for 2 days after interview' },\\n    { id: 'e7', label: 'SIS emails stop when purchase tag is added' },\\n    { id: 'e8', label: 'Strategy call pitch starts after SIS sequence ends' },\\n  ],\\n  abandon: [\\n    { id: 'ab1', label: 'Use manual trigger to fire interview_abandoned event' },\\n    { id: 'ab2', label: 'Recovery email arrives within 5 minutes' },\\n    { id: 'ab3', label: 'Email link returns to app and resumes correct phase' },\\n    { id: 'ab4', label: 'Cron abandonment check runs every 2 hours' },\\n    { id: 'ab5', label: 'Inactive sessions appear in D1 with abandonment flag' },\\n  ],\\n  ghl: [\\n    { id: 'g1', label: 'GHL Pipeline: DWI buyers land in correct stage' },\\n    { id: 'g2', label: 'GHL Pipeline: SIS buyers move to correct stage' },\\n    { id: 'g3', label: 'GHL Pipeline: Call bookings land in correct stage' },\\n    { id: 'g4', label: 'Tags applied correctly to all contacts' },\\n    { id: 'g5', label: 'Daily 9am health check fires and logs results' },\\n  ],\\n};\\n\\n// API COSTS\\nasync function loadApiCosts() {\\n  const days = document.getElementById('cost-days-filter')?.value || '30';\\n  try {\\n    const data = await api('GET', '/api/admin/usage?days=' + days);\\n\\n    // Summary cards\\n    document.getElementById('cost-this-month').textContent = data.thisMonth?.costDollars || '$0.00';\\n    document.getElementById('cost-month-calls').textContent = (data.thisMonth?.calls || 0) + ' API calls this month';\\n    document.getElementById('cost-all-time').textContent = data.allTime?.costDollars || '$0.00';\\n    document.getElementById('cost-all-calls').textContent = (data.allTime?.calls || 0) + ' total API calls';\\n    document.getElementById('cost-per-user').textContent = '$' + ((data.avgPerUser?.avgCostCents || 0) / 100).toFixed(2);\\n    document.getElementById('cost-per-user-calls').textContent = (data.avgPerUser?.avgCalls || 0) + ' avg calls per user';\\n    document.getElementById('cost-users').textContent = data.allTime?.users || 0;\\n    document.getElementById('cost-sessions').textContent = (data.allTime?.sessions || 0) + ' total sessions';\\n\\n    // Cost by model\\n    const modelEl = document.getElementById('cost-by-model');\\n    if (data.byModel && data.byModel.length) {\\n      const totalCost = data.byModel.reduce((s,m) => s + (m.cost_cents || 0), 0);\\n      modelEl.innerHTML = data.byModel.map(m => {\\n        const pct = totalCost > 0 ? Math.round((m.cost_cents / totalCost) * 100) : 0;\\n        const cost = '$' + ((m.cost_cents || 0) / 100).toFixed(2);\\n        const tokens = ((m.input || 0) + (m.output || 0)).toLocaleString();\\n        return '<div style="margin-bottom:16px">' +\\n          '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">' +\\n            '<span style="font-weight:600">' + esc(m.model) + '</span>' +\\n            '<span>' + cost + ' (' + pct + '%)</span>' +\\n          '</div>' +\\n          '<div style="background:var(--bg2);border-radius:4px;height:8px;overflow:hidden">' +\\n            '<div style="background:var(--gold);height:100%;width:' + pct + '%;border-radius:4px"></div>' +\\n          '</div>' +\\n          '<div style="font-size:11px;color:var(--text2);margin-top:4px">' + (m.calls || 0) + ' calls, ' + tokens + ' tokens</div>' +\\n        '</div>';\\n      }).join('');\\n    } else {\\n      modelEl.innerHTML = '<div style="color:var(--text2);font-size:13px">No usage data yet.</div>';\\n    }\\n\\n    // Projections\\n    const projEl = document.getElementById('cost-projections');\\n    const monthCost = (data.thisMonth?.costCents || 0) / 100;\\n    const dayOfMonth = new Date().getDate();\\n    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();\\n    const projected = dayOfMonth > 0 ? (monthCost / dayOfMonth) * daysInMonth : 0;\\n    const dailyAvg = dayOfMonth > 0 ? monthCost / dayOfMonth : 0;\\n    const usersPerDay = data.thisMonth?.sessions > 0 ? (data.thisMonth.sessions / dayOfMonth).toFixed(1) : '0';\\n    const costPerSession = data.thisMonth?.sessions > 0 ? (monthCost / data.thisMonth.sessions).toFixed(2) : '0.00';\\n\\n    projEl.innerHTML =\\n      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">' +\\n        '<div style="background:var(--bg2);padding:16px;border-radius:8px">' +\\n          '<div style="font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Projected This Month</div>' +\\n          '<div style="font-size:24px;font-weight:700;color:var(--text)">$' + projected.toFixed(2) + '</div>' +\\n        '</div>' +\\n        '<div style="background:var(--bg2);padding:16px;border-radius:8px">' +\\n          '<div style="font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Daily Average</div>' +\\n          '<div style="font-size:24px;font-weight:700;color:var(--text)">$' + dailyAvg.toFixed(2) + '</div>' +\\n        '</div>' +\\n        '<div style="background:var(--bg2);padding:16px;border-radius:8px">' +\\n          '<div style="font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Avg Sessions/Day</div>' +\\n          '<div style="font-size:24px;font-weight:700;color:var(--text)">' + usersPerDay + '</div>' +\\n        '</div>' +\\n        '<div style="background:var(--bg2);padding:16px;border-radius:8px">' +\\n          '<div style="font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Cost Per Session</div>' +\\n          '<div style="font-size:24px;font-weight:700;color:var(--text)">$' + costPerSession + '</div>' +\\n        '</div>' +\\n      '</div>' +\\n      '<div style="margin-top:16px;padding:12px;background:rgba(196,112,63,0.08);border-radius:8px;font-size:12px;line-height:1.6;color:var(--text)">' +\\n        '<strong style="color:var(--gold)">Cost Breakdown by Service (estimated):</strong><br>' +\\n        'Anthropic API (Claude Opus/Sonnet): ~85% of total<br>' +\\n        'Gemini/Imagen (image generation): ~5% of total<br>' +\\n        'Resend (transactional emails): ~1% of total<br>' +\\n        'Cloudflare (D1, KV, R2, Workers): ~1% of total<br>' +\\n        'Stripe processing: 2.9% + $0.30 per transaction' +\\n      '</div>';\\n\\n    // Daily trend chart (simple bar chart)\\n    const chartEl = document.getElementById('cost-daily-chart');\\n    if (data.daily && data.daily.length) {\\n      const maxCost = Math.max(...data.daily.map(d => d.cost_cents || 0), 1);\\n      chartEl.innerHTML =\\n        '<div style="display:flex;align-items:flex-end;gap:3px;height:160px;padding-bottom:24px;position:relative">' +\\n        data.daily.slice().reverse().map(d => {\\n          const h = Math.max(((d.cost_cents || 0) / maxCost) * 130, 2);\\n          const cost = '$' + ((d.cost_cents || 0) / 100).toFixed(2);\\n          const label = d.day?.slice(5) || '';\\n          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;min-width:0">' +\\n            '<div title="' + label + ': ' + cost + ' (' + (d.calls||0) + ' calls)" style="width:100%;max-width:32px;height:' + h + 'px;background:var(--gold);border-radius:3px 3px 0 0;cursor:pointer;opacity:0.85;transition:opacity 0.2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85"></div>' +\\n            '<div style="font-size:9px;color:var(--text2);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%">' + label + '</div>' +\\n          '</div>';\\n        }).join('') +\\n        '</div>';\\n    } else {\\n      chartEl.innerHTML = '<div style="color:var(--text2);font-size:13px">No daily data yet.</div>';\\n    }\\n\\n    // Top users table\\n    const tbody = document.getElementById('cost-users-tbody');\\n    if (data.topUsers && data.topUsers.length) {\\n      tbody.innerHTML = data.topUsers.map(u => {\\n        const tokens = ((u.input || 0) + (u.output || 0)).toLocaleString();\\n        const cost = '$' + ((u.cost_cents || 0) / 100).toFixed(2);\\n        return '<tr>' +\\n          '<td>' + esc(u.email || 'unknown') + '</td>' +\\n          '<td>' + esc(u.name || '') + '</td>' +\\n          '<td>' + (u.sessions || 0) + '</td>' +\\n          '<td>' + (u.calls || 0) + '</td>' +\\n          '<td>' + tokens + '</td>' +\\n          '<td style="font-weight:600">' + cost + '</td>' +\\n          '<td>' + fmtDate(u.last_active) + '</td>' +\\n        '</tr>';\\n      }).join('');\\n    } else {\\n      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text2)">No usage data yet.</td></tr>';\\n    }\\n\\n  } catch(e) {\\n    console.error('Failed to load API costs:', e);\\n    document.getElementById('cost-by-model').innerHTML = '<div style="color:var(--red)">Failed to load cost data.</div>';\\n  }\\n}\\n\\nlet checklistState = JSON.parse(localStorage.getItem('dw_checklist') || '{}');\\n\\nfunction loadTesting() {\\n  for (const [group, items] of Object.entries(CHECKLIST)) {\\n    const el = document.getElementById('checklist-' + group);\\n    if (!el) continue;\\n    el.innerHTML = items.map(item => \`\\n      <div class="checklist-item \${checklistState[item.id] ? 'done' : ''}" onclick="toggleCheck('\${item.id}', this)">\\n        <div class="ci-box">\${checklistState[item.id] ? '\u2713' : ''}</div>\\n        <span class="ci-label">\${item.label}</span>\\n      </div>\\n    \`).join('');\\n  }\\n  updateChecklistScore();\\n}\\n\\nfunction toggleCheck(id, el) {\\n  checklistState[id] = !checklistState[id];\\n  localStorage.setItem('dw_checklist', JSON.stringify(checklistState));\\n  el.classList.toggle('done', checklistState[id]);\\n  el.querySelector('.ci-box').textContent = checklistState[id] ? '\u2713' : '';\\n  updateChecklistScore();\\n}\\n\\nfunction updateChecklistScore() {\\n  const total = Object.values(CHECKLIST).flat().length;\\n  const done = Object.values(checklistState).filter(Boolean).length;\\n  const el = document.getElementById('checklist-score');\\n  if (el) el.textContent = done + ' of ' + total + ' items verified';\\n}\\n\\nfunction resetChecklist() {\\n  checklistState = {};\\n  localStorage.removeItem('dw_checklist');\\n  loadTesting();\\n}\\n\\nasync function runTestTrigger() {\\n  const email = document.getElementById('test-email').value.trim();\\n  const name = document.getElementById('test-name').value.trim();\\n  const phone = document.getElementById('test-phone').value.trim();\\n  const event_type = document.getElementById('test-event').value;\\n  const phase = document.getElementById('test-phase').value;\\n  const result = document.getElementById('test-trigger-result');\\n\\n  if (!email) { result.innerHTML = '<span style="color:var(--red)">Enter an email address.</span>'; return; }\\n\\n  result.innerHTML = '<span style="color:var(--text2)">Firing event...</span>';\\n\\n  try {\\n    const res = await api('POST', '/api/admin/test-trigger', {\\n      email, name, phone, event_type, phase: phase ? parseInt(phase) : undefined\\n    });\\n    result.innerHTML = \`<span style="color:var(--green)">\u2713 Event fired successfully.</span>\\n      <pre style="margin-top:8px;font-size:11px;background:var(--bg2);padding:10px;border-radius:6px;overflow:auto">\${JSON.stringify(res, null, 2)}</pre>\`;\\n  } catch (err) {\\n    result.innerHTML = \`<span style="color:var(--red)">\u2717 Failed: \${err.message}</span>\`;\\n  }\\n}\\n<\/script>\\n</body>\\n</html>\\n`

