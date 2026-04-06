# Admin Session QA Page Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `/admin/session/{id}` into a QA-first review page with scorecard, depth highlights, tabbed content, and 4 download endpoints.

**Architecture:** All server-rendered HTML in `handleAdminSessionDetail` inside `src/index.js`. New download routes added to `src/routes/admin.js` and wired in `src/router.js`. Deploy via esbuild + Cloudflare API (wrangler has a known bug scanning ~/Downloads).

**Tech Stack:** Cloudflare Worker, vanilla JS, server-rendered HTML string concatenation, D1 + KV bindings.

---

## Context You Must Know

- `src/index.js` is a **pre-compiled bundle** (~20k lines). It is the file you edit AND deploy. The source files in `src/routes/`, `src/services/` etc. are the originals but the deployed file is `src/index.js`.
- The function to replace is `handleAdminSessionDetail` at line ~20574 in `src/index.js`.
- Helper functions `escA()`, `adminLayout()`, `phaseBar()` are defined at line ~20225 in `src/index.js` — use them freely.
- Deploy command (run from `~/deep-work-api/`):
  ```bash
  npx esbuild@latest src/index.js --bundle --format=esm --outfile=dist/index.js --platform=browser && \
  curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/bd13f1dff62d4ccbea47440e45b48ec2/workers/scripts/deep-work-api" \
    -H "Authorization: Bearer EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D" \
    -F "index.js=@dist/index.js;type=application/javascript+module" \
    -F 'metadata={"main_module":"index.js","bindings":[{"type":"kv_namespace","name":"SESSIONS","namespace_id":"ad823265a8944b9da7a561198f7f3782"},{"type":"r2_bucket","name":"UPLOADS","bucket_name":"deep-work-uploads"},{"type":"d1","name":"DB","id":"92121f3b-dcfb-4fa8-8482-b827224b611d"},{"type":"plain_text","name":"APP_ORIGIN","text":"https://love.jamesguldan.com"},{"type":"plain_text","name":"STRIPE_MODE","text":"live"}],"compatibility_date":"2024-12-01"};type=application/json' \
    | jq '{success: .success, errors: .errors}'
  ```
- Test session URL: `https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc`
- Admin auth requires `dw_session` cookie — test in browser while logged in as admin.

---

## Task 1: Add 4 Download Route Handlers to `src/routes/admin.js`

**Files:**
- Modify: `src/routes/admin.js` (append at end of file)

**Step 1: Read the current end of admin.js**
```bash
tail -30 /Users/jamesguldan/deep-work-api/src/routes/admin.js
```

**Step 2: Append the 4 download handlers**

Add after the last export in `src/routes/admin.js`:

```javascript
export async function handleAdminTranscriptTxt(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin) return new Response('Forbidden', { status: 403 });
  const sessionId = path.split('/')[3];
  if (!sessionId) return new Response('Missing session ID', { status: 400 });
  try {
    const sessionRow = await env.DB.prepare(
      'SELECT s.*, u.name, u.email FROM sessions s LEFT JOIN users u ON s.user_id=u.id WHERE s.id=?'
    ).bind(sessionId).first();
    if (!sessionRow) return new Response('Session not found', { status: 404 });

    let kvMessages = [];
    try {
      const sessRaw = await env.SESSIONS.get(sessionId);
      if (sessRaw) {
        const kv = JSON.parse(sessRaw);
        if (Array.isArray(kv.messages)) kvMessages = kv.messages;
      }
    } catch(_) {}

    const name = sessionRow.name || sessionRow.email || 'Anonymous';
    const date = (sessionRow.created_at || '').slice(0, 10);
    let txt = `Deep Work Interview — ${name}\nDate: ${date}\nSession: ${sessionId}\n\n${'='.repeat(60)}\n\n`;

    kvMessages.forEach((m, i) => {
      let content = m.content;
      if (Array.isArray(content)) content = content.map(c => typeof c === 'object' ? (c.text || '') : c).join(' ');
      content = String(content || '').replace(/\s*METADATA:\{[^}]*\}/g, '').trim();
      if (!content) return;
      const role = m.role === 'user' ? name : 'Claude';
      const ts = m.timestamp ? String(m.timestamp).slice(11, 16) : '';
      txt += `[${role}${ts ? ' · ' + ts : ''}]\n${content}\n\n`;
    });

    const filename = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-transcript.txt';
    return new Response(txt, {
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch(e) {
    return new Response('Export error: ' + e.message, { status: 500 });
  }
}

export async function handleAdminTranscriptFormatted(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin) return new Response('Forbidden', { status: 403 });
  const sessionId = path.split('/')[3];
  if (!sessionId) return new Response('Missing session ID', { status: 400 });
  try {
    const sessionRow = await env.DB.prepare(
      'SELECT s.*, u.name, u.email FROM sessions s LEFT JOIN users u ON s.user_id=u.id WHERE s.id=?'
    ).bind(sessionId).first();
    if (!sessionRow) return new Response('Session not found', { status: 404 });

    let kvMessages = [];
    try {
      const sessRaw = await env.SESSIONS.get(sessionId);
      if (sessRaw) {
        const kv = JSON.parse(sessRaw);
        if (Array.isArray(kv.messages)) kvMessages = kv.messages;
      }
    } catch(_) {}

    const name = sessionRow.name || sessionRow.email || 'Anonymous';
    const date = (sessionRow.created_at || '').slice(0, 10);

    const msgHTML = kvMessages.map(m => {
      let content = m.content;
      if (Array.isArray(content)) content = content.map(c => typeof c === 'object' ? (c.text || '') : c).join(' ');
      content = String(content || '').replace(/\s*METADATA:\{[^}]*\}/g, '').trim();
      if (!content) return '';
      const isUser = m.role === 'user';
      const role = isUser ? name : 'Claude';
      const ts = m.timestamp ? String(m.timestamp).slice(11, 16) : '';
      const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      return `<div class="msg ${isUser ? 'user' : 'ai'}">
        <div class="label">${esc(role)}${ts ? ' <span class="ts">· ' + ts + '</span>' : ''}</div>
        <div class="bubble">${esc(content).replace(/\n/g, '<br>')}</div>
      </div>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${name} — Deep Work Interview Transcript</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;font-size:13px;color:#1D1D1F;background:#fff;max-width:800px;margin:0 auto;padding:40px 24px}
h1{font-family:'Outfit',sans-serif;font-size:22px;margin-bottom:4px}
.meta{color:#86868B;font-size:12px;margin-bottom:32px}
.msg{margin-bottom:20px}
.msg.user .bubble{background:#F5F5F7;border-radius:12px 12px 4px 12px}
.msg.ai .bubble{background:#FDF0E8;border-radius:12px 12px 12px 4px}
.label{font-size:11px;font-weight:600;color:#86868B;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.ts{font-weight:400;text-transform:none;letter-spacing:0}
.bubble{padding:12px 16px;line-height:1.6}
@media print{body{padding:20px}h1{font-size:18px}}
</style>
</head><body>
<h1>${name}</h1>
<div class="meta">Deep Work Interview · ${date} · ${kvMessages.length} messages</div>
${msgHTML}
</body></html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  } catch(e) {
    return new Response('Export error: ' + e.message, { status: 500 });
  }
}

export async function handleAdminBlueprintJson(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin) return new Response('Forbidden', { status: 403 });
  const sessionId = path.split('/')[3];
  if (!sessionId) return new Response('Missing session ID', { status: 400 });
  try {
    const sessionRow = await env.DB.prepare(
      'SELECT s.*, u.name, u.email FROM sessions s LEFT JOIN users u ON s.user_id=u.id WHERE s.id=?'
    ).bind(sessionId).first();
    if (!sessionRow) return new Response('Session not found', { status: 404 });

    let bp = null;
    try {
      const sessRaw = await env.SESSIONS.get(sessionId);
      if (sessRaw) { const kv = JSON.parse(sessRaw); bp = kv.blueprint?.blueprint || kv.blueprint || null; }
    } catch(_) {}
    if (!bp) {
      try { const r = await env.SESSIONS.get('blueprint:' + sessionId); if (r) bp = JSON.parse(r); } catch(_) {}
    }
    if (!bp) return new Response(JSON.stringify({ error: 'No blueprint found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    const name = (sessionRow.name || sessionRow.email || 'session').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return new Response(JSON.stringify(bp, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${name}-blueprint.json"`
      }
    });
  } catch(e) {
    return new Response('Export error: ' + e.message, { status: 500 });
  }
}

export async function handleAdminBlueprintFormatted(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin) return new Response('Forbidden', { status: 403 });
  const sessionId = path.split('/')[3];
  if (!sessionId) return new Response('Missing session ID', { status: 400 });
  try {
    const sessionRow = await env.DB.prepare(
      'SELECT s.*, u.name, u.email FROM sessions s LEFT JOIN users u ON s.user_id=u.id WHERE s.id=?'
    ).bind(sessionId).first();
    if (!sessionRow) return new Response('Session not found', { status: 404 });

    let bp = null;
    try {
      const sessRaw = await env.SESSIONS.get(sessionId);
      if (sessRaw) { const kv = JSON.parse(sessRaw); bp = kv.blueprint?.blueprint || kv.blueprint || null; }
    } catch(_) {}
    if (!bp) {
      try { const r = await env.SESSIONS.get('blueprint:' + sessionId); if (r) bp = JSON.parse(r); } catch(_) {}
    }
    if (!bp) return new Response('<h1>No blueprint found</h1>', { status: 404, headers: { 'Content-Type': 'text/html' } });

    const name = sessionRow.name || sessionRow.email || 'Anonymous';
    const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    function renderValue(val) {
      if (typeof val === 'string') return `<p>${esc(val)}</p>`;
      if (Array.isArray(val)) return val.map(v => typeof v === 'object'
        ? `<div class="item">${Object.entries(v).map(([k,vv]) => `<div><strong>${esc(k)}:</strong> ${esc(String(vv||''))}</div>`).join('')}</div>`
        : `<div class="item">${esc(String(v))}</div>`
      ).join('');
      if (typeof val === 'object' && val !== null) return Object.entries(val).map(([k,v]) =>
        `<div class="subfield"><div class="subkey">${esc(k)}</div><div class="subval">${esc(String(v||''))}</div></div>`
      ).join('');
      return `<p>${esc(String(val||''))}</p>`;
    }

    const sections = Object.entries(bp).map(([key, val]) => `
      <div class="section">
        <div class="section-key">${esc(key)}</div>
        <div class="section-val">${renderValue(val)}</div>
      </div>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${esc(name)} — Brand Blueprint</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;font-size:13px;color:#1D1D1F;background:#fff;max-width:900px;margin:0 auto;padding:40px 24px}
h1{font-family:'Outfit',sans-serif;font-size:24px;margin-bottom:4px}
.meta{color:#86868B;font-size:12px;margin-bottom:36px}
.section{margin-bottom:24px;border:1px solid #F0F0F0;border-radius:10px;overflow:hidden}
.section-key{background:#F5F5F7;padding:8px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#C4703F}
.section-val{padding:14px 16px;line-height:1.6}
.section-val p{margin-bottom:8px}.section-val p:last-child{margin-bottom:0}
.item{padding:8px 0;border-bottom:1px solid #F5F5F7}.item:last-child{border-bottom:none}
.subfield{display:flex;gap:12px;padding:4px 0}.subkey{font-weight:600;min-width:160px;color:#86868B;font-size:12px}.subval{flex:1}
@media print{body{padding:20px}.section{break-inside:avoid}}
</style>
</head><body>
<h1>${esc(name)}</h1>
<div class="meta">Brand Blueprint · ${(sessionRow.created_at||'').slice(0,10)}</div>
${sections}
</body></html>`;

    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  } catch(e) {
    return new Response('Export error: ' + e.message, { status: 500 });
  }
}
```

**Step 3: Verify the file is valid JS (no syntax errors)**
```bash
node --check /Users/jamesguldan/deep-work-api/src/routes/admin.js && echo "OK"
```
Expected: `OK`

**Step 4: Commit**
```bash
cd /Users/jamesguldan/deep-work-api
git add src/routes/admin.js
git commit -m "feat: add 4 download route handlers for transcript and blueprint"
```

---

## Task 2: Wire the 4 New Routes in `src/router.js`

**Files:**
- Modify: `src/router.js`

**Step 1: Add imports at top of router.js**

Find the line that imports from `./routes/admin.js` (around line 40-62). Add these 4 to the existing import:
```javascript
  handleAdminTranscriptTxt,
  handleAdminTranscriptFormatted,
  handleAdminBlueprintJson,
  handleAdminBlueprintFormatted,
```

**Step 2: Add route handlers**

Find the block near `handleAdminGetSession` (around line 176-177). Add BEFORE the existing `/api/admin/session/` route:
```javascript
    // Download routes (must come before the generic session GET)
    if (path.match(/^\/admin\/session\/[^/]+\/transcript\.txt$/) && request.method === 'GET')
      return handleAdminTranscriptTxt(request, env, path);
    if (path.match(/^\/admin\/session\/[^/]+\/transcript-formatted$/) && request.method === 'GET')
      return handleAdminTranscriptFormatted(request, env, path);
    if (path.match(/^\/admin\/session\/[^/]+\/blueprint\.json$/) && request.method === 'GET')
      return handleAdminBlueprintJson(request, env, path);
    if (path.match(/^\/admin\/session\/[^/]+\/blueprint-formatted$/) && request.method === 'GET')
      return handleAdminBlueprintFormatted(request, env, path);
```

**Step 3: Verify no syntax errors**
```bash
node --check /Users/jamesguldan/deep-work-api/src/router.js && echo "OK"
```
Expected: `OK`

**Step 4: Commit**
```bash
cd /Users/jamesguldan/deep-work-api
git add src/router.js
git commit -m "feat: wire 4 download routes in router"
```

---

## Task 3: Rewrite `handleAdminSessionDetail` in `src/index.js`

This is the main task. Replace the entire function (lines ~20574–20736) with the new QA-first layout.

**Files:**
- Modify: `src/index.js` lines 20574–20736

**Step 1: Locate exact start/end lines**
```bash
grep -n "^async function handleAdminSessionDetail\|^async function handleAdminExportSession" \
  /Users/jamesguldan/deep-work-api/src/index.js
```
Note the two line numbers. You'll replace everything from the first to one line before the second.

**Step 2: Replace the function**

The new function body to use — replace the entire `handleAdminSessionDetail` function with this:

```javascript
async function handleAdminSessionDetail(request, env, path) {
  var admin = await requireAdmin(request, env);
  if (!admin) return Response.redirect(new URL('/app', request.url).href, 302);
  var sessionId = path.split('/')[3];
  if (!sessionId) return new Response('Missing session ID', { status: 400 });
  try {
    var [sessionRow, eventsRes, costsRow, insRes] = await Promise.all([
      env.DB.prepare(`
        SELECT s.*, u.name, u.email, u.apollo_data, u.phone as user_phone, u.tier, u.role, u.created_at as user_created_at
        FROM sessions s LEFT JOIN users u ON s.user_id=u.id WHERE s.id=?
      `).bind(sessionId).first(),
      env.DB.prepare('SELECT * FROM session_events WHERE session_id=? ORDER BY created_at ASC LIMIT 500').bind(sessionId).all(),
      env.DB.prepare('SELECT SUM(cost_usd) as total, COUNT(*) as calls FROM api_costs WHERE session_id=?').bind(sessionId).first().catch(()=>({total:0,calls:0})),
      env.DB.prepare('SELECT insight_type, insight_value, confidence FROM session_insights WHERE session_id=? ORDER BY confidence DESC').bind(sessionId).all().catch(()=>({results:[]}))
    ]);
    if (!sessionRow) return new Response('Session not found', {status:404, headers:{'Content-Type':'text/plain'}});

    var events = eventsRes?.results || [];
    var insightRows = insRes?.results || [];

    // Load KV data
    var bp = null, kvMessages = [], kvSession = null;
    try {
      var sessRaw = await env.SESSIONS.get(sessionId);
      if (sessRaw) {
        kvSession = JSON.parse(sessRaw);
        bp = kvSession.blueprint?.blueprint || kvSession.blueprint || null;
        if (Array.isArray(kvSession.messages)) kvMessages = kvSession.messages;
      }
    } catch(_){}
    if (!bp) { try { var bpRaw = await env.SESSIONS.get('blueprint:'+sessionId); if(bpRaw) bp=JSON.parse(bpRaw); }catch(_){} }

    // v3 check
    var hasV3 = bp && bp.v3 && bp.v3.positioningStatement;
    var v3Fields = hasV3 ? Object.keys(bp.v3) : [];
    var v3NewFields = ['mirror_observation','arrogant_truth','futureSelfLetter'];
    var missingV3New = v3NewFields.filter(function(f){ return !bp?.v3?.[f]; });

    // Depth breakdown
    var depthBreakdown = null;
    try { if(sessionRow.depth_breakdown) depthBreakdown=JSON.parse(sessionRow.depth_breakdown); }catch(_){}

    // Session duration
    var duration = '';
    if (events.length >= 2) {
      var first = new Date(events[0].created_at).getTime();
      var last = new Date(events[events.length-1].created_at).getTime();
      var mins = Math.round((last - first) / 60000);
      if (mins > 0) duration = mins + ' min';
    }

    // --- HEALTH FLAGS ---
    var flags = [];
    // Count messages per phase
    var phaseMessageCounts = {};
    events.forEach(function(e) {
      var ph = null; try { ph = JSON.parse(e.data||'{}').phase; }catch(_){}
      if (ph) { phaseMessageCounts[ph] = (phaseMessageCounts[ph]||0)+1; }
    });
    Object.entries(phaseMessageCounts).forEach(function(entry) {
      if (entry[1] > 20) flags.push({ type:'red', msg:'Phase ' + entry[0] + ' had ' + entry[1] + ' messages (possible loop)' });
    });
    if (depthBreakdown) {
      Object.entries(depthBreakdown).forEach(function(entry) {
        if (entry[1] < 2) flags.push({ type:'red', msg: entry[0].replace(/_/g,' ') + ' depth low (' + entry[1] + '/5)' });
      });
    }
    if (bp && !hasV3) flags.push({ type:'yellow', msg:'Blueprint generated but V3 fields missing' });
    if (hasV3 && missingV3New.length) flags.push({ type:'yellow', msg:'V3 missing: ' + missingV3New.join(', ') });
    if (sessionRow.status === 'completed' && hasV3 && !flags.length) flags.push({ type:'green', msg:'Completed — all fields present' });
    if (!flags.length && sessionRow.status !== 'completed') flags.push({ type:'gray', msg:'In progress' });

    // --- DEPTH HIGHLIGHTS ---
    var highlights = [];
    var EMOTIONAL_KEYWORDS = ['afraid','fear','never','always','truth','real','wound','core','pain','hurt','shame','guilt','alone','abandon','trust','worth','enough','belong','lost','broken'];
    // Phase transition map from events
    var phaseByMsgIndex = {};
    var currentPhase = 1;
    var msgEventIdx = 0;
    events.forEach(function(e) {
      var d = null; try { d=JSON.parse(e.data||'{}'); }catch(_){}
      if (d && d.phase && d.phase !== currentPhase) { phaseByMsgIndex[msgEventIdx] = d.phase; currentPhase = d.phase; }
      if (e.event_type==='message_sent'||e.event_type==='message_received') msgEventIdx++;
    });
    kvMessages.forEach(function(m, i) {
      var content = m.content;
      if (Array.isArray(content)) content = content.map(function(c){ return typeof c==='object'?(c.text||''):c; }).join(' ');
      content = String(content||'').replace(/\s*METADATA:\{[^}]*\}/g,'').trim();
      // Phase transition
      if (phaseByMsgIndex[i]) {
        highlights.push({ type:'transition', label:'Phase '+phaseByMsgIndex[i]+' began', excerpt:content.slice(0,120), idx:i });
      }
      // Breakthrough: long user message with emotional keywords
      if (m.role==='user' && content.length>200) {
        var lower = content.toLowerCase();
        var found = EMOTIONAL_KEYWORDS.filter(function(k){ return lower.indexOf(k)>-1; });
        if (found.length>=2) highlights.push({ type:'breakthrough', label:'Breakthrough moment', excerpt:content.slice(0,120), idx:i });
      }
      // Deep probe: Claude asks follow-up (question mark, same or adjacent phase)
      if (m.role==='assistant' && content.indexOf('?')>-1) {
        var prev = kvMessages[i-1];
        if (prev && prev.role==='user') {
          var prevContent = String(Array.isArray(prev.content)?prev.content.map(function(c){return typeof c==='object'?(c.text||''):c;}).join(' '):prev.content||'').trim();
          if (prevContent.length>80) highlights.push({ type:'probe', label:'Deep probe', excerpt:content.slice(0,120), idx:i });
        }
      }
      // Skipped surface: Claude moved on after short user response
      if (m.role==='assistant' && phaseByMsgIndex[i]) {
        var prevUser = kvMessages[i-1];
        if (prevUser && prevUser.role==='user') {
          var prevC = String(Array.isArray(prevUser.content)?prevUser.content.map(function(c){return typeof c==='object'?(c.text||''):c;}).join(' '):prevUser.content||'').trim();
          if (prevC.length<30) highlights.push({ type:'skipped', label:'Possible skipped surface', excerpt:prevC.slice(0,80)+' → moved to next phase', idx:i });
        }
      }
    });
    // Cap at 12 highlights, no dupes by idx
    var seenIdx = {};
    highlights = highlights.filter(function(h){ if(seenIdx[h.idx]) return false; seenIdx[h.idx]=true; return true; }).slice(0,12);

    // --- DISPLAY MESSAGES for transcript tab ---
    var displayMessages = kvMessages.map(function(m, i) {
      var content = m.content;
      if (Array.isArray(content)) content = content.map(function(c){ return typeof c==='object'?(c.text||''):c; }).join(' ');
      content = String(content||'').replace(/\s*METADATA:\{[^}]*\}/g,'').trim();
      var highlightType = null;
      highlights.forEach(function(h){ if(h.idx===i) highlightType=h.type; });
      return { role:m.role, content:content, timestamp:m.timestamp||null, highlightType:highlightType, phaseChange:phaseByMsgIndex[i]||null, idx:i };
    });

    // ── HTML SECTIONS ──

    // SCORECARD
    var flagColors = { red:'#FEE2E2', yellow:'#FFF3CD', green:'#E8F8ED', gray:'#F0F0F0' };
    var flagTextColors = { red:'#991B1B', yellow:'#856404', green:'#1A7F3C', gray:'#86868B' };
    var flagEmoji = { red:'🔴', yellow:'🟡', green:'🟢', gray:'⚪' };
    var flagsHTML = flags.map(function(f){
      return '<div style="display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:6px;background:'+flagColors[f.type]+';margin-bottom:4px">' +
        '<span>'+flagEmoji[f.type]+'</span><span style="font-size:12px;color:'+flagTextColors[f.type]+'">'+escA(f.msg)+'</span></div>';
    }).join('');

    var dimBarHTML = '';
    if (depthBreakdown) {
      dimBarHTML = '<div style="margin-top:10px">' + Object.entries(depthBreakdown).map(function(entry) {
        var pct = Math.round((entry[1]/5)*100);
        var color = entry[1]<2?'#e74c3c':entry[1]<4?'#e67e22':'#27ae60';
        return '<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:11px;color:#86868B;margin-bottom:2px"><span>'+escA(entry[0].replace(/_/g,' '))+'</span><span style="font-weight:600;color:'+color+'">'+entry[1]+'/5</span></div>' +
          '<div style="background:#F0F0F0;height:4px;border-radius:2px"><div style="width:'+pct+'%;height:100%;background:'+color+';border-radius:2px"></div></div></div>';
      }).join('') + '</div>';
    }

    var gradeColor = sessionRow.depth_grade ? (sessionRow.depth_grade[0]==='A'?'#27ae60':sessionRow.depth_grade[0]==='B'?'#2980b9':sessionRow.depth_grade[0]==='C'?'#e67e22':'#e74c3c') : '#86868B';

    var scorecard = '<div style="background:#fff;border:1px solid #F0F0F0;border-radius:14px;padding:24px;margin-bottom:20px;display:grid;grid-template-columns:1fr 2fr 1fr;gap:24px">' +
      // Left: identity
      '<div>' +
        '<div style="font-family:Outfit,sans-serif;font-weight:700;font-size:18px;margin-bottom:4px">'+escA(sessionRow.name||'Anonymous')+'</div>' +
        '<div style="color:#86868B;font-size:13px;margin-bottom:8px">'+escA(sessionRow.email||'—')+'</div>' +
        '<span class="badge bg-copper" style="margin-right:6px">'+escA(sessionRow.tier||'free')+'</span>' +
        (sessionRow.status==='completed'?'<span class="badge bg-green">completed</span>':'<span class="badge bg-yellow">'+escA(sessionRow.status||'active')+'</span>') +
        '<div style="margin-top:12px;font-size:11px;color:#86868B">Member since '+escA((sessionRow.user_created_at||'').slice(0,10))+'</div>' +
        (duration?'<div style="font-size:11px;color:#86868B">Duration: '+escA(duration)+'</div>':'') +
        '<div style="margin-top:12px"><a class="adm-btn adm-btn-sm" href="/admin/export/'+sessionId+'">Export JSON</a></div>' +
      '</div>' +
      // Center: metrics
      '<div>' +
        '<div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">' +
          '<div style="text-align:center">' +
            '<div style="font-family:Outfit,sans-serif;font-size:42px;font-weight:700;color:'+gradeColor+';line-height:1">'+escA(sessionRow.depth_grade||'—')+'</div>' +
            '<div style="font-size:11px;color:#86868B">'+(sessionRow.emotional_depth_score?sessionRow.emotional_depth_score+'/25 = '+Math.round((sessionRow.emotional_depth_score/25)*100)+'%':'depth')+'</div>' +
          '</div>' +
          '<div style="flex:1">' +
            '<div style="font-size:12px;color:#86868B;margin-bottom:4px">Phase '+escA(String(sessionRow.phase||1))+' of 8</div>' +
            phaseBar(sessionRow.phase) +
            '<div style="font-size:11px;color:#86868B;margin-top:6px">'+kvMessages.length+' messages · $'+parseFloat(costsRow?.total||0).toFixed(4)+' API cost</div>' +
          '</div>' +
        '</div>' +
        dimBarHTML +
        '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">' +
          (sessionRow.blueprint_generated?'<a class="adm-btn adm-btn-sm" href="https://love.jamesguldan.com/app?session='+sessionId+'" target="_blank">🔍 Preview Blueprint</a>':'') +
          (!hasV3&&bp?'<button class="adm-btn adm-btn-sm" style="background:#C4703F;color:#fff" onclick="generateV3(\''+sessionId+'\')">Generate V3</button>':'') +
          (sessionRow.email&&sessionRow.blueprint_generated?'<button class="adm-btn adm-btn-sm adm-btn-outline" onclick="resendBlueprint(\''+sessionId+'\',\''+escA(sessionRow.email)+'\')">✉ Resend Email</button>':'') +
        '</div>' +
      '</div>' +
      // Right: flags
      '<div>' +
        '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#86868B;margin-bottom:8px">Health Signals</div>' +
        flagsHTML +
      '</div>' +
    '</div>';

    // DEPTH HIGHLIGHTS
    var hlTypeStyle = {
      transition: { bg:'#EEF2FF', border:'#818CF8', label:'Phase Transition', color:'#3730A3' },
      breakthrough: { bg:'#FDF0E8', border:'#C4703F', label:'Breakthrough', color:'#C4703F' },
      probe: { bg:'#E8F8ED', border:'#27ae60', label:'Deep Probe', color:'#27ae60' },
      skipped: { bg:'#FEE2E2', border:'#e74c3c', label:'Skipped Surface', color:'#e74c3c' }
    };
    var highlightsHTML = '';
    if (highlights.length) {
      var cards = highlights.map(function(h) {
        var s = hlTypeStyle[h.type] || hlTypeStyle.probe;
        return '<div style="flex-shrink:0;width:260px;background:'+s.bg+';border:1px solid '+s.border+';border-radius:10px;padding:12px 14px">' +
          '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:'+s.color+';margin-bottom:6px">'+escA(s.label)+'</div>' +
          '<div style="font-size:12px;color:#1D1D1F;line-height:1.5;margin-bottom:8px">'+escA(h.excerpt)+(h.excerpt.length===120?'…':'')+'</div>' +
          '<a href="#msg-'+h.idx+'" style="font-size:11px;color:'+s.color+';font-weight:500">Jump to ↓</a>' +
        '</div>';
      }).join('');
      highlightsHTML = '<div style="background:#fff;border:1px solid #F0F0F0;border-radius:14px;padding:20px;margin-bottom:20px">' +
        '<div style="font-family:Outfit,sans-serif;font-weight:700;font-size:13px;margin-bottom:12px">Depth Highlights ('+highlights.length+')</div>' +
        '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px">'+cards+'</div>' +
      '</div>';
    } else {
      highlightsHTML = '<div style="background:#fff;border:1px solid #F0F0F0;border-radius:14px;padding:16px 20px;margin-bottom:20px;color:#86868B;font-size:13px">No significant depth moments detected.</div>';
    }

    // DOWNLOAD BAR
    var downloadBar = '<div style="background:#fff;border:1px solid #F0F0F0;border-radius:10px;padding:12px 16px;margin-bottom:0;display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
      '<span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#86868B;margin-right:4px">Download:</span>' +
      '<a class="adm-btn adm-btn-sm adm-btn-outline" href="/admin/session/'+sessionId+'/transcript.txt">↓ Transcript .txt</a>' +
      '<a class="adm-btn adm-btn-sm adm-btn-outline" href="/admin/session/'+sessionId+'/transcript-formatted" target="_blank">↓ Transcript PDF</a>' +
      (bp?'<a class="adm-btn adm-btn-sm adm-btn-outline" href="/admin/session/'+sessionId+'/blueprint.json">↓ Blueprint .json</a>':'') +
      (bp?'<a class="adm-btn adm-btn-sm adm-btn-outline" href="/admin/session/'+sessionId+'/blueprint-formatted" target="_blank">↓ Blueprint Formatted</a>':'') +
    '</div>';

    // TRANSCRIPT TAB
    var hlColorMap = { transition:'#818CF8', breakthrough:'#C4703F', probe:'#27ae60', skipped:'#e74c3c' };
    var transcriptHTML = displayMessages.map(function(m) {
      if (!m.content) return '';
      var isUser = m.role==='user';
      var ts = m.timestamp ? String(m.timestamp).slice(11,16) : '';
      var borderStyle = m.highlightType ? 'border-left:3px solid '+hlColorMap[m.highlightType]+';' : '';
      var phaseMarker = m.phaseChange ? '<div style="text-align:center;font-size:11px;color:#86868B;padding:8px 0;border-top:1px dashed #F0F0F0;border-bottom:1px dashed #F0F0F0;margin:8px 0">── Phase '+m.phaseChange+' began ──</div>' : '';
      return phaseMarker +
        '<div id="msg-'+m.idx+'" style="margin-bottom:14px;'+borderStyle+'">' +
          '<div style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#86868B;margin-bottom:4px">'+(isUser?escA(sessionRow.name||'User'):'Claude')+(ts?' · '+ts:'')+'</div>' +
          '<div style="background:'+(isUser?'#F5F5F7':'#FDF0E8')+';padding:10px 14px;border-radius:'+(isUser?'12px 12px 4px 12px':'12px 12px 12px 4px')+';font-size:13px;line-height:1.6;white-space:pre-wrap">'+escA(m.content)+'</div>' +
        '</div>';
    }).join('');

    // BLUEPRINT TAB
    var blueprintHTML = '';
    if (bp) {
      function renderBPValue(val) {
        if (typeof val==='string') return '<p style="line-height:1.6">'+escA(val)+'</p>';
        if (Array.isArray(val)) return val.map(function(v){
          if (typeof v==='object'&&v!==null) return '<div style="padding:8px 0;border-bottom:1px solid #F5F5F7">'+Object.entries(v).map(function(e){return '<div style="display:flex;gap:8px"><span style="color:#86868B;min-width:120px;font-size:11px">'+escA(e[0])+'</span><span>'+escA(String(e[1]||''))+'</span></div>';}).join('')+'</div>';
          return '<div style="padding:4px 0;border-bottom:1px solid #F5F5F7">'+escA(String(v))+'</div>';
        }).join('');
        if (typeof val==='object'&&val!==null) return Object.entries(val).map(function(e){return '<div style="padding:4px 0"><span style="color:#86868B;font-size:11px;display:inline-block;min-width:140px">'+escA(e[0])+'</span> '+escA(String(e[1]||''))+'</div>';}).join('');
        return '<p>'+escA(String(val||''))+'</p>';
      }
      blueprintHTML = Object.entries(bp).map(function(entry){
        return '<div style="margin-bottom:16px;border:1px solid #F0F0F0;border-radius:10px;overflow:hidden">' +
          '<div style="background:#F5F5F7;padding:8px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#C4703F">'+escA(entry[0])+'</div>' +
          '<div style="padding:12px 14px;font-size:13px">'+renderBPValue(entry[1])+'</div></div>';
      }).join('') +
      '<details style="margin-top:16px"><summary style="cursor:pointer;font-size:12px;color:#86868B;padding:8px">Show raw JSON</summary>' +
      '<pre style="font-size:11px;overflow:auto;background:#F5F5F7;padding:12px;border-radius:8px;white-space:pre-wrap;margin-top:8px">'+escA(JSON.stringify(bp,null,2).slice(0,12000))+(JSON.stringify(bp).length>12000?'\n...(truncated)':'')+'</pre></details>';
    } else {
      blueprintHTML = '<div style="color:#86868B;padding:24px;text-align:center">No blueprint generated yet.</div>';
    }

    // INSIGHTS TAB
    var insightsTabHTML = insightRows.length
      ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px">'+insightRows.map(function(r){
          return '<div style="background:#F5F5F7;padding:10px 14px;border-radius:8px;font-size:12px;border-left:3px solid #C4703F">' +
            '<div style="font-weight:700;color:#C4703F;font-size:10px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">'+escA(r.insight_type)+' <span style="color:#86868B;font-weight:400">('+Math.round(r.confidence*100)+'%)</span></div>' +
            '<div style="color:#1D1D1F;line-height:1.5">'+escA(String(r.insight_value||'').slice(0,200))+'</div></div>';
        }).join('')+'</div>'
      : '<div style="color:#86868B;padding:24px;text-align:center">No insights extracted yet.</div>';

    // TIMELINE TAB
    var timelineTabHTML = '<details><summary style="cursor:pointer;font-size:12px;color:#86868B;padding:4px 0">Show full event log ('+events.length+' events)</summary>' +
      '<ul style="list-style:none;margin-top:8px">' +
      events.slice(0,200).map(function(e){
        var dataStr=''; try{if(e.data){var d=JSON.parse(e.data);dataStr=d.phase?'phase '+d.phase:d.event_type||'';}}catch(_){}
        return '<li style="display:flex;gap:12px;padding:3px 0;font-size:12px;border-bottom:1px solid #F5F5F7"><span style="color:#86868B;min-width:180px">'+escA(e.event_type||'?')+'</span><span style="color:#86868B;min-width:60px">'+escA(dataStr)+'</span><span style="color:#86868B;font-family:monospace">'+escA(e.created_at?e.created_at.slice(11,19):'')+'</span></li>';
      }).join('')+
      (events.length>200?'<li style="color:#86868B;font-size:11px;padding:8px 0">+ '+(events.length-200)+' more...</li>':'') +
      '</ul></details>';

    // TABBED AREA
    var tabbedArea = '<div style="background:#fff;border:1px solid #F0F0F0;border-radius:14px;overflow:hidden">' +
      downloadBar +
      '<div style="border-top:1px solid #F0F0F0">' +
        '<div style="display:flex;border-bottom:1px solid #F0F0F0;background:#FAFAFA" id="qa-tabs">' +
          '<button class="qa-tab qa-tab-active" onclick="switchTab(\'transcript\')">Transcript ('+displayMessages.filter(function(m){return m.content;}).length+')</button>' +
          '<button class="qa-tab" onclick="switchTab(\'blueprint\')">Blueprint'+(bp?' ('+Object.keys(bp).length+'p)':'')+'</button>' +
          '<button class="qa-tab" onclick="switchTab(\'insights\')">Insights ('+insightRows.length+')</button>' +
          '<button class="qa-tab" onclick="switchTab(\'timeline\')">Timeline</button>' +
        '</div>' +
        '<div id="tab-transcript" class="qa-tab-panel" style="padding:20px;max-height:700px;overflow-y:auto">'+transcriptHTML+'</div>' +
        '<div id="tab-blueprint" class="qa-tab-panel" style="display:none;padding:20px;max-height:700px;overflow-y:auto">'+blueprintHTML+'</div>' +
        '<div id="tab-insights" class="qa-tab-panel" style="display:none;padding:20px;max-height:700px;overflow-y:auto">'+insightsTabHTML+'</div>' +
        '<div id="tab-timeline" class="qa-tab-panel" style="display:none;padding:20px;max-height:700px;overflow-y:auto">'+timelineTabHTML+'</div>' +
      '</div>' +
    '</div>';

    var html = '<style>' +
      '.qa-tab{background:none;border:none;padding:10px 18px;font-size:13px;font-family:Inter,sans-serif;cursor:pointer;color:#86868B;border-bottom:2px solid transparent;margin-bottom:-1px}' +
      '.qa-tab:hover{color:#1D1D1F}' +
      '.qa-tab-active{color:#C4703F;border-bottom-color:#C4703F;font-weight:500}' +
    '</style>' +
    '<a class="adm-back" href="/admin">&larr; Dashboard</a>' +
    '<h1 class="adm-page-title">'+escA(sessionRow.name||sessionRow.email||'Anonymous')+'</h1>' +
    scorecard +
    highlightsHTML +
    tabbedArea +
    '<script>' +
      'function switchTab(name){' +
        'document.querySelectorAll(".qa-tab-panel").forEach(function(p){p.style.display="none"});' +
        'document.getElementById("tab-"+name).style.display="block";' +
        'document.querySelectorAll(".qa-tab").forEach(function(t){t.classList.remove("qa-tab-active")});' +
        'event.target.classList.add("qa-tab-active");' +
      '}' +
      'function generateV3(sid){' +
        'if(!confirm("Generate V3 fields? This calls Claude Opus (~$0.50).")) return;' +
        'var btn=event.target;btn.textContent="Generating...";btn.disabled=true;' +
        'fetch("/api/admin/generate-v3-fields",{method:"POST",headers:{"Content-Type":"application/json","X-Admin-Key":"dw-v3-generate-2026"},body:JSON.stringify({sessionId:sid})})' +
        '.then(function(r){return r.json()}).then(function(d){if(d.ok){alert("V3 generated! Refreshing...");location.reload();}else{alert("Error: "+(d.error||"Unknown"));btn.textContent="Retry";btn.disabled=false;}})' +
        '.catch(function(e){alert("Failed: "+e.message);btn.textContent="Retry";btn.disabled=false;});' +
      '}' +
      'function resendBlueprint(sid,email){' +
        'if(!confirm("Resend blueprint link to "+email+"?")) return;' +
        'var btn=event.target;btn.textContent="Sending...";btn.disabled=true;' +
        'fetch("/api/admin/resend-blueprint",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+(document.cookie.match(/dw_session=([^;]+)/)||[])[1]},body:JSON.stringify({sessionId:sid,email:email})})' +
        '.then(function(r){return r.json()}).then(function(d){if(d.ok){alert("Blueprint email sent to "+email);btn.textContent="Sent ✔";btn.disabled=true;}else{alert("Error: "+(d.error||"Unknown"));btn.textContent="Retry";btn.disabled=false;}})' +
        '.catch(function(e){alert("Failed: "+e.message);btn.textContent="Retry";btn.disabled=false;});' +
      '}' +
    '<\/script>';

    return new Response(adminLayout('Session: '+(sessionRow.name||sessionRow.email||sessionId), html), { headers:{'Content-Type':'text/html;charset=UTF-8'} });
  } catch(e) {
    return new Response('Error: '+e.message, {status:500, headers:{'Content-Type':'text/plain'}});
  }
}
```

**Step 3: Verify file is valid (check syntax)**
```bash
node --check /Users/jamesguldan/deep-work-api/src/index.js && echo "OK"
```
Expected: `OK`

**Step 4: Commit**
```bash
cd /Users/jamesguldan/deep-work-api
git add src/index.js
git commit -m "feat: redesign admin session page with QA scorecard, depth highlights, tabs, downloads"
```

---

## Task 4: Build and Deploy

**Step 1: Build the bundle**
```bash
cd /Users/jamesguldan/deep-work-api
npx esbuild@latest src/index.js --bundle --format=esm --outfile=dist/index.js --platform=browser 2>&1 | tail -3
```
Expected: `dist/index.js  ~1.0mb` and `Done in Xms`

**Step 2: Deploy to Cloudflare**
```bash
curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/bd13f1dff62d4ccbea47440e45b48ec2/workers/scripts/deep-work-api" \
  -H "Authorization: Bearer EUnZ2dUo8vA3KljdV6tI_l_LcSsXpGdJuhAKJ00D" \
  -F "index.js=@/Users/jamesguldan/deep-work-api/dist/index.js;type=application/javascript+module" \
  -F 'metadata={"main_module":"index.js","bindings":[{"type":"kv_namespace","name":"SESSIONS","namespace_id":"ad823265a8944b9da7a561198f7f3782"},{"type":"r2_bucket","name":"UPLOADS","bucket_name":"deep-work-uploads"},{"type":"d1","name":"DB","id":"92121f3b-dcfb-4fa8-8482-b827224b611d"},{"type":"plain_text","name":"APP_ORIGIN","text":"https://love.jamesguldan.com"},{"type":"plain_text","name":"STRIPE_MODE","text":"live"}],"compatibility_date":"2024-12-01"};type=application/json' \
  | jq '{success: .success, errors: .errors}'
```
Expected: `{ "success": true, "errors": [] }`

**Step 3: Wait 2 seconds and smoke test**
```bash
sleep 2 && curl -s -o /dev/null -w "%{http_code}" https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc
```
Expected: `200` or `302` (redirect to login if not authenticated — that's fine, means the route works)

**Step 4: Test download routes**
```bash
# These should return 302 (redirect to login) — confirms routes are wired
curl -s -o /dev/null -w "transcript.txt: %{http_code}\n" https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc/transcript.txt
curl -s -o /dev/null -w "transcript-formatted: %{http_code}\n" https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc/transcript-formatted
curl -s -o /dev/null -w "blueprint.json: %{http_code}\n" https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc/blueprint.json
curl -s -o /dev/null -w "blueprint-formatted: %{http_code}\n" https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc/blueprint-formatted
```
Expected: all `302` (redirects to login, confirming routes are registered)

**Step 5: Final commit**
```bash
cd /Users/jamesguldan/deep-work-api
git add dist/index.js
git commit -m "build: deploy admin session QA redesign"
```

---

## Verification Checklist (do in browser while logged in as admin)

- [ ] Visit `https://love.jamesguldan.com/admin/session/sess-1774752330544-d6voyc`
- [ ] Scorecard visible above fold — grade, phase bar, dimension mini-bars, health flags
- [ ] Depth highlights row visible with colored cards
- [ ] Transcript tab is default, shows full messages with phase markers
- [ ] Blueprint tab shows formatted sections (not raw JSON)
- [ ] Insights tab shows insight cards
- [ ] Timeline tab collapsed by default, expands on click
- [ ] "↓ Transcript .txt" downloads a .txt file
- [ ] "↓ Transcript PDF" opens styled HTML (Cmd+P to print to PDF)
- [ ] "↓ Blueprint .json" downloads JSON file
- [ ] "↓ Blueprint Formatted" opens readable HTML page
