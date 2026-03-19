// ============================================================
// DEEP WORK APP — FRONTEND HTML
// ============================================================

export const getHTML = (config) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work Blueprint | James Guldan</title>
<meta name="description" content="A 90-minute AI-powered brand strategy session that produces a complete brand blueprint, offer structure, and website-ready copy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0b;
    --bg2: #111113;
    --bg3: #1a1a1e;
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --gold: #c9a84c;
    --gold2: #e8c46a;
    --text: #f0ede8;
    --text2: #9a9490;
    --text3: #6b6560;
    --user-bubble: #1e2a3a;
    --ai-bubble: #1a1a1e;
    --accent: #2563eb;
    --success: #16a34a;
    --radius: 12px;
    --radius-sm: 8px;
  }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── LANDING PAGE ── */
  #landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%);
  }

  .landing-inner { max-width: 720px; width: 100%; text-align: center; }

  .eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.2);
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 28px;
  }

  .landing-inner h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #f0ede8 0%, var(--gold2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .landing-inner p {
    font-size: 18px;
    color: var(--text2);
    line-height: 1.7;
    margin-bottom: 48px;
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 48px;
  }

  @media (max-width: 600px) {
    .pricing-cards { grid-template-columns: 1fr; }
  }

  .pricing-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px 24px;
    text-align: left;
    transition: border-color 0.2s;
    cursor: pointer;
    position: relative;
  }

  .pricing-card:hover { border-color: var(--border2); }

  .pricing-card.featured {
    border-color: var(--gold);
    background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, var(--bg2) 100%);
  }

  .pricing-card .badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gold);
    color: #000;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 14px;
    border-radius: 100px;
    white-space: nowrap;
  }

  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text2);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .card-price {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
  }

  .card-price sup { font-size: 20px; vertical-align: super; }

  .card-desc {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .card-features { list-style: none; margin-bottom: 24px; }

  .card-features li {
    font-size: 13px;
    color: var(--text2);
    padding: 5px 0;
    padding-left: 20px;
    position: relative;
  }

  .card-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--gold);
    font-weight: 700;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    text-decoration: none;
    width: 100%;
  }

  .btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: #000;
  }

  .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border2);
  }

  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-primary:hover { opacity: 0.9; }

  .trust-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text3);
  }

  .trust-item .icon { color: var(--gold); font-size: 16px; }

  /* ── INTAKE SCREEN ── */
  #intake {
    display: none;
    min-height: 100vh;
    padding: 40px 20px;
    max-width: 680px;
    margin: 0 auto;
  }

  .intake-header { text-align: center; margin-bottom: 40px; }

  .intake-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 10px;
  }

  .intake-header p { color: var(--text2); font-size: 15px; }

  .intake-section {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 16px;
  }

  .intake-section h3 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--gold);
    margin-bottom: 6px;
  }

  .intake-section p {
    font-size: 13px;
    color: var(--text2);
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .intake-section label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    margin-bottom: 6px;
  }

  input[type="text"], input[type="email"], input[type="url"], textarea {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 12px;
    resize: vertical;
  }

  input:focus, textarea:focus { border-color: var(--gold); }

  input::placeholder, textarea::placeholder { color: var(--text3); }

  .upload-zone {
    border: 2px dashed var(--border2);
    border-radius: var(--radius-sm);
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--gold);
    background: rgba(201,168,76,0.04);
  }

  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  .upload-zone .upload-icon { font-size: 28px; margin-bottom: 8px; }

  .upload-zone p { font-size: 14px; color: var(--text2); margin: 0; }

  .upload-zone span { font-size: 12px; color: var(--text3); }

  .uploaded-files { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

  .file-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 12px;
    color: var(--text2);
  }

  .file-chip button {
    background: none;
    border: none;
    color: var(--text3);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0;
  }

  /* ── APP SCREEN ── */
  #app {
    display: none;
    height: 100vh;
    display: none;
    flex-direction: column;
  }

  /* Phase bar */
  .phase-bar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .phase-bar::-webkit-scrollbar { display: none; }

  .phase-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .phases {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .phase-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    border: 1.5px solid var(--border2);
    color: var(--text3);
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .phase-dot.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #000;
  }

  .phase-dot.complete {
    background: rgba(201,168,76,0.15);
    border-color: var(--gold);
    color: var(--gold);
  }

  .phase-name {
    font-size: 13px;
    color: var(--text2);
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: auto;
  }

  .phase-name strong { color: var(--gold); }

  /* Chat area */
  .chat-wrap {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  #messages {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
  }

  #messages::-webkit-scrollbar { width: 4px; }
  #messages::-webkit-scrollbar-track { background: transparent; }
  #messages::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .msg {
    display: flex;
    gap: 12px;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg.user { flex-direction: row-reverse; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }

  .avatar.ai {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
    color: #000;
  }

  .avatar.user-av {
    background: var(--user-bubble);
    color: var(--text);
    border: 1px solid var(--border2);
  }

  .bubble {
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 15px;
    line-height: 1.65;
    max-width: calc(100% - 44px);
  }

  .msg.ai .bubble {
    background: var(--ai-bubble);
    border: 1px solid var(--border);
    border-radius: 4px 16px 16px 16px;
    color: var(--text);
  }

  .msg.user .bubble {
    background: var(--user-bubble);
    border: 1px solid var(--border2);
    border-radius: 16px 4px 16px 16px;
    color: var(--text);
  }

  .bubble p { margin-bottom: 10px; }
  .bubble p:last-child { margin-bottom: 0; }
  .bubble ol { padding-left: 20px; margin: 8px 0; }
  .bubble ol li { margin-bottom: 6px; }
  .bubble strong { color: var(--gold2); font-weight: 600; }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 14px 18px;
    background: var(--ai-bubble);
    border: 1px solid var(--border);
    border-radius: 4px 16px 16px 16px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background: var(--text3);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  /* Input area */
  .input-area {
    border-top: 1px solid var(--border);
    background: var(--bg2);
    padding: 16px 20px;
    flex-shrink: 0;
  }

  .input-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    max-width: 760px;
    margin: 0 auto;
  }

  .input-row textarea {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    color: var(--text);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    resize: none;
    outline: none;
    max-height: 160px;
    overflow-y: auto;
    line-height: 1.5;
    margin: 0;
    transition: border-color 0.2s;
  }

  .input-row textarea:focus { border-color: var(--gold); }

  .send-btn {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm);
    background: var(--gold);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    color: #000;
  }

  .send-btn:hover { opacity: 0.85; transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .input-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 760px;
    margin: 10px auto 0;
  }

  .tool-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 5px 10px;
    color: var(--text3);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .tool-btn:hover { border-color: var(--border2); color: var(--text2); }

  /* ── BLUEPRINT SCREEN ── */
  #blueprint-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
  }

  .blueprint-header {
    background: linear-gradient(135deg, var(--bg2) 0%, rgba(201,168,76,0.05) 100%);
    border-bottom: 1px solid var(--border);
    padding: 32px 40px;
    text-align: center;
  }

  .blueprint-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--text) 0%, var(--gold2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .blueprint-header p { color: var(--text2); font-size: 15px; }

  .blueprint-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 20px 40px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .blueprint-actions .btn { width: auto; }

  .blueprint-body { padding: 40px; max-width: 900px; margin: 0 auto; width: 100%; }

  .bp-part {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    margin-bottom: 20px;
  }

  .bp-part-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .bp-part-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(201,168,76,0.15);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bp-part h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
  }

  .bp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  @media (max-width: 600px) { .bp-grid { grid-template-columns: 1fr; } }

  .bp-item { background: var(--bg3); border-radius: var(--radius-sm); padding: 16px; }

  .bp-item-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 6px;
  }

  .bp-item-value { font-size: 14px; color: var(--text); line-height: 1.6; }

  .color-swatch {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid var(--border2);
    vertical-align: middle;
    margin-right: 8px;
  }

  /* ── SITE GENERATION SCREEN ── */
  #site-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 20px;
    align-items: center;
  }

  .site-progress {
    max-width: 560px;
    width: 100%;
    text-align: center;
  }

  .site-progress h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 12px;
  }

  .site-progress p { color: var(--text2); font-size: 15px; margin-bottom: 40px; }

  .progress-steps { text-align: left; margin-bottom: 40px; }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .progress-step:last-child { border-bottom: none; }

  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .step-icon.pending { background: var(--bg3); border: 1px solid var(--border2); }
  .step-icon.active { background: rgba(201,168,76,0.15); border: 1px solid var(--gold); animation: pulse 1.5s infinite; }
  .step-icon.done { background: rgba(22,163,74,0.15); border: 1px solid var(--success); color: var(--success); }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
  }

  .step-text { font-size: 14px; color: var(--text2); }

  .step-text strong { color: var(--text); display: block; margin-bottom: 2px; }

  /* ── CF DEPLOY SCREEN ── */
  #deploy-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 20px;
    align-items: center;
  }

  .deploy-inner { max-width: 560px; width: 100%; }

  .deploy-inner h2 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 12px;
    text-align: center;
  }

  .deploy-inner > p { color: var(--text2); font-size: 15px; margin-bottom: 32px; text-align: center; }

  .token-steps { margin-bottom: 32px; }

  .token-step {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    align-items: flex-start;
  }

  .token-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(201,168,76,0.1);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .token-step-text { font-size: 14px; color: var(--text2); line-height: 1.6; }

  .token-step-text a { color: var(--gold); text-decoration: underline; }

  .token-input-row { display: flex; gap: 10px; }

  .token-input-row input { margin: 0; flex: 1; }

  /* ── ORDER BUMP ── */
  #order-bump {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #1a1408 0%, #1a1a1e 100%);
    border-top: 1px solid var(--gold);
    padding: 20px;
    z-index: 100;
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .order-bump-inner {
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .order-bump-text { flex: 1; min-width: 200px; }

  .order-bump-text .bump-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .order-bump-text h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; }

  .order-bump-text p { font-size: 13px; color: var(--text2); }

  .bump-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

  .bump-price {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--gold2);
  }

  .bump-close {
    background: none;
    border: none;
    color: var(--text3);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
  }

  /* ── IMAGE GALLERY ── */
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 16px 0;
  }

  .image-gallery img {
    width: 100%;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    aspect-ratio: 16/9;
    object-fit: cover;
  }

  /* ── TOAST ── */
  #toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--bg3);
    border: 1px solid var(--border2);
    color: var(--text);
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    transition: transform 0.3s ease;
    z-index: 1000;
    white-space: nowrap;
  }

  #toast.show { transform: translateX(-50%) translateY(0); }

  /* ── UTILS ── */
  .hidden { display: none !important; }

  .screen { display: none; }
  .screen.active { display: flex; }

  #landing.active { display: flex; }
  #intake.active { display: flex; flex-direction: column; }
  #app.active { display: flex; }
  #blueprint-screen.active { display: flex; }
  #site-screen.active { display: flex; }
  #deploy-screen.active { display: flex; }

  @media (max-width: 600px) {
    .blueprint-body { padding: 20px; }
    .blueprint-header { padding: 24px 20px; }
    .blueprint-actions { padding: 16px 20px; }
  }
</style>
</head>
<body>

<!-- ══ LANDING SCREEN ══ -->
<div id="landing" class="screen active">
  <div class="landing-inner">
    <div class="eyebrow">By James Guldan</div>
    <h1>Your Brand, Fully Defined in 90 Minutes</h1>
    <p>A structured AI-powered brand strategy session that extracts your story, sharpens your positioning, and produces a complete 7-part blueprint you can build a business on.</p>

    <div class="pricing-cards">
      <div class="pricing-card" onclick="selectTier('blueprint')">
        <div class="card-title">Deep Work Blueprint</div>
        <div class="card-price"><sup>$</sup>67</div>
        <div class="card-desc">The full 8-phase brand strategy interview. Walk in with a vague idea, walk out with a complete brand foundation.</div>
        <ul class="card-features">
          <li>8-phase brand strategy interview</li>
          <li>7-part brand blueprint PDF</li>
          <li>Ideal customer avatar</li>
          <li>Offer suite design</li>
          <li>10 headline options</li>
        </ul>
        <button class="btn btn-outline">Get My Blueprint &rarr;</button>
      </div>

      <div class="pricing-card featured" onclick="selectTier('site')">
        <div class="badge">Most Popular</div>
        <div class="card-title">Blueprint + Website Build</div>
        <div class="card-price"><sup>$</sup>197</div>
        <div class="card-desc">Everything in the blueprint, plus your brand turned into a real deployed website. No code. No Cloudflare knowledge required.</div>
        <ul class="card-features">
          <li>Everything in the Blueprint</li>
          <li>AI-generated website from your blueprint</li>
          <li>Brand images via Imagen 4</li>
          <li>Auto-deploy to Cloudflare Pages</li>
          <li>Live site in under 10 minutes</li>
        </ul>
        <button class="btn btn-gold">Get My Site &rarr;</button>
      </div>
    </div>

    <div class="trust-bar">
      <div class="trust-item"><span class="icon">🔒</span> Secure checkout via Stripe</div>
      <div class="trust-item"><span class="icon">⚡</span> Instant access after payment</div>
      <div class="trust-item"><span class="icon">✦</span> Built by James Guldan</div>
    </div>
  </div>
</div>

<!-- ══ INTAKE SCREEN ══ -->
<div id="intake" class="screen">
  <div class="intake-header">
    <h2>Before We Begin</h2>
    <p>The more context you give upfront, the sharper your blueprint will be. Everything here is optional but valuable.</p>
  </div>

  <div class="intake-section">
    <h3>Your Existing Presence</h3>
    <p>If you already have a website or LinkedIn profile, paste the URLs here. The AI will analyze them before the interview starts.</p>
    <label>Your current website URL</label>
    <input type="url" id="intake-website" placeholder="https://yoursite.com">
    <label>Your LinkedIn profile URL</label>
    <input type="url" id="intake-linkedin" placeholder="https://linkedin.com/in/yourname">
    <label>Competitor URLs (paste up to 3, one per line)</label>
    <textarea id="intake-competitors" rows="4" placeholder="https://competitor1.com&#10;https://competitor2.com"></textarea>
  </div>

  <div class="intake-section">
    <h3>Testimonials &amp; Social Proof</h3>
    <p>Paste any client testimonials, Google reviews, or LinkedIn recommendations. The AI will mine the exact language your best clients use.</p>
    <textarea id="intake-testimonials" rows="5" placeholder="Paste testimonials, reviews, or feedback here..."></textarea>
  </div>

  <div class="intake-section">
    <h3>Photos &amp; Brand Assets</h3>
    <p>Upload headshots, product photos, or any images you want considered for your brand. Up to 10 files.</p>
    <div class="upload-zone" id="upload-zone">
      <input type="file" id="file-input" multiple accept="image/*">
      <div class="upload-icon">📷</div>
      <p>Drag photos here or click to browse</p>
      <span>JPG, PNG, WebP up to 10MB each</span>
    </div>
    <div class="uploaded-files" id="uploaded-files"></div>
  </div>

  <div style="display:flex;gap:12px;margin-bottom:60px;">
    <button class="btn btn-outline" onclick="showScreen('landing')" style="width:auto;padding:14px 24px;">← Back</button>
    <button class="btn btn-gold" onclick="startSession()" id="start-btn">Start My Deep Work Session →</button>
  </div>
</div>

<!-- ══ APP SCREEN ══ -->
<div id="app" class="screen">
  <div class="phase-bar">
    <div class="phase-label">Phase</div>
    <div class="phases">
      <div class="phase-dot active" id="pd1">1</div>
      <div class="phase-dot" id="pd2">2</div>
      <div class="phase-dot" id="pd3">3</div>
      <div class="phase-dot" id="pd4">4</div>
      <div class="phase-dot" id="pd5">5</div>
      <div class="phase-dot" id="pd6">6</div>
      <div class="phase-dot" id="pd7">7</div>
      <div class="phase-dot" id="pd8">8</div>
    </div>
    <div class="phase-name" id="phase-name">Phase 1: <strong>Your Story</strong></div>
  </div>

  <div class="chat-wrap">
    <div id="messages"></div>
  </div>

  <div class="input-area">
    <div class="input-row">
      <textarea id="msg-input" placeholder="Type your answer..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
      <button class="send-btn" id="send-btn" onclick="sendMessage()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
    <div class="input-tools">
      <button class="tool-btn" onclick="openUploadModal()">📎 Add photos</button>
      <button class="tool-btn" id="images-btn" onclick="generateBrandImages()" style="display:none">✨ Generate brand images</button>
    </div>
  </div>
</div>

<!-- ══ BLUEPRINT SCREEN ══ -->
<div id="blueprint-screen" class="screen">
  <div class="blueprint-header">
    <div class="eyebrow">Session Complete</div>
    <h2 id="bp-name">Your Brand Blueprint</h2>
    <p>Your complete brand foundation, ready to build on.</p>
  </div>
  <div class="blueprint-actions">
    <button class="btn btn-gold" onclick="downloadPDF()" style="width:auto;padding:14px 24px;">⬇ Download PDF</button>
    <button class="btn btn-outline" id="build-site-btn" onclick="proceedToSite()" style="width:auto;padding:14px 24px;display:none">🚀 Build My Website</button>
    <button class="btn btn-outline" onclick="exportPackage()" style="width:auto;padding:14px 24px;">📦 Take It With You</button>
  </div>
  <div class="blueprint-body" id="blueprint-body">
    <!-- populated by JS -->
  </div>
</div>

<!-- ══ SITE GENERATION SCREEN ══ -->
<div id="site-screen" class="screen">
  <div class="site-progress">
    <h2>Building Your Website</h2>
    <p>Your brand blueprint is being turned into a real website. This takes about 60 seconds.</p>
    <div class="progress-steps" id="gen-steps">
      <div class="progress-step">
        <div class="step-icon active" id="step-1-icon">⚡</div>
        <div class="step-text"><strong>Preparing your brand context</strong>Structuring blueprint data for generation</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-2-icon">🎨</div>
        <div class="step-text"><strong>Generating brand images</strong>Creating hero and mood board images via Imagen 4</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-3-icon">💻</div>
        <div class="step-text"><strong>Writing your website</strong>Building HTML from your blueprint</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-4-icon">🚀</div>
        <div class="step-text"><strong>Ready to deploy</strong>Your site is built and ready</div>
      </div>
    </div>
    <button class="btn btn-gold" id="deploy-btn" style="display:none" onclick="showScreen('deploy-screen')">Connect Cloudflare &amp; Go Live →</button>
  </div>
</div>

<!-- ══ DEPLOY SCREEN ══ -->
<div id="deploy-screen" class="screen">
  <div class="deploy-inner">
    <h2>Deploy to Cloudflare</h2>
    <p>Create a free API token and your site goes live automatically. Takes about 90 seconds.</p>

    <div class="token-steps">
      <div class="token-step">
        <div class="token-step-num">1</div>
        <div class="token-step-text">
          Go to <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank">dash.cloudflare.com/profile/api-tokens</a> and click <strong>Create Token</strong>.
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">2</div>
        <div class="token-step-text">
          Choose the <strong>Edit Cloudflare Workers</strong> template. Under Permissions, make sure <strong>Cloudflare Pages: Edit</strong> is included.
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">3</div>
        <div class="token-step-text">
          Click Continue to Summary, then Create Token. Copy it and paste it below.
        </div>
      </div>
    </div>

    <label style="display:block;font-size:13px;color:var(--text2);margin-bottom:8px;font-weight:500;">Your Cloudflare API Token</label>
    <div class="token-input-row">
      <input type="text" id="cf-token" placeholder="Paste your token here..." style="margin:0;font-family:monospace;font-size:13px;">
      <button class="btn btn-gold" onclick="deployToCloudflare()" style="width:auto;padding:14px 20px;flex-shrink:0;">Deploy →</button>
    </div>

    <div id="deploy-status" style="margin-top:20px;display:none;">
      <div class="progress-step">
        <div class="step-icon active" id="deploy-step-icon">⚡</div>
        <div class="step-text"><strong id="deploy-step-text">Creating your Pages project...</strong></div>
      </div>
    </div>

    <div id="deploy-success" style="margin-top:24px;display:none;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">🎉</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:28px;margin-bottom:8px;">Your site is live.</h3>
      <p style="color:var(--text2);margin-bottom:20px;">Your website has been deployed to Cloudflare Pages.</p>
      <a id="live-url" href="#" target="_blank" class="btn btn-gold" style="width:auto;padding:14px 28px;text-decoration:none;">View Live Site →</a>
    </div>
  </div>
</div>

<!-- ══ ORDER BUMP ══ -->
<div id="order-bump">
  <div class="order-bump-inner">
    <button class="bump-close" onclick="document.getElementById('order-bump').style.display='none'">×</button>
    <div class="order-bump-text">
      <div class="bump-label">Add to your order</div>
      <h3>60-Minute Strategy Call with James</h3>
      <p>Review your blueprint together and map out your exact next steps. Limited availability.</p>
    </div>
    <div class="bump-actions">
      <div class="bump-price">$197</div>
      <button class="btn btn-gold" onclick="addStrategyCall()" style="width:auto;padding:12px 20px;">Add &rarr;</button>
    </div>
  </div>
</div>

<!-- ══ TOAST ══ -->
<div id="toast"></div>

<script>
// ── STATE ──────────────────────────────────────────────────
const STATE = {
  sessionId: null,
  tier: null,
  phase: 1,
  isStreaming: false,
  blueprint: null,
  generatedSiteHtml: null,
  uploadedFiles: [],
  uploadedKeys: []
};

const PHASE_NAMES = [
  '', 'Your Story', 'Your Expertise', 'Your Beliefs', 'Your People',
  'Your Voice & Identity', 'Your Market', 'Your Offers', 'Synthesis'
];

// Stripe price IDs
const PRICES = {
  blueprint: '${config.STRIPE_PRICE_BLUEPRINT}',
  site: '${config.STRIPE_PRICE_SITE}',
  call: '${config.STRIPE_PRICE_CALL}'
};

// ── SCREEN MANAGEMENT ────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── TIER SELECTION & CHECKOUT ────────────────────────────
function selectTier(tier) {
  STATE.tier = tier;
  // Check for existing paid session in URL
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  if (sessionId) {
    STATE.sessionId = sessionId;
    showScreen('intake');
    return;
  }
  initiateCheckout(tier);
}

async function initiateCheckout(tier) {
  try {
    showToast('Redirecting to checkout...');
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      showToast('Something went wrong. Please try again.');
    }
  } catch (e) {
    showToast('Connection error. Please try again.');
  }
}

// Check URL for session token on load
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  const tier = params.get('tier');
  if (sessionId && tier) {
    STATE.sessionId = sessionId;
    STATE.tier = tier;
    showScreen('intake');
  }

  // File upload setup
  setupFileUpload();

  // Auto-resize textarea
  const ta = document.getElementById('msg-input');
  if (ta) ta.addEventListener('input', () => autoResize(ta));
});

// ── INTAKE & SESSION START ────────────────────────────────
function setupFileUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('file-input');
  if (!zone || !input) return;

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });
  input.addEventListener('change', () => handleFiles(Array.from(input.files)));
}

function handleFiles(files) {
  const existing = STATE.uploadedFiles.map(f => f.name);
  files.forEach(f => {
    if (!existing.includes(f.name) && STATE.uploadedFiles.length < 10) {
      STATE.uploadedFiles.push(f);
    }
  });
  renderUploadedFiles();
}

function renderUploadedFiles() {
  const container = document.getElementById('uploaded-files');
  if (!container) return;
  container.innerHTML = STATE.uploadedFiles.map((f, i) => \`
    <div class="file-chip">
      📷 \${f.name}
      <button onclick="removeFile(\${i})">×</button>
    </div>
  \`).join('');
}

function removeFile(i) {
  STATE.uploadedFiles.splice(i, 1);
  renderUploadedFiles();
}

async function startSession() {
  const btn = document.getElementById('start-btn');
  btn.textContent = 'Preparing your session...';
  btn.disabled = true;

  try {
    // Upload files first if any
    if (STATE.uploadedFiles.length > 0 && STATE.sessionId) {
      for (const file of STATE.uploadedFiles) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('sessionId', STATE.sessionId);
        const r = await fetch('/api/upload', { method: 'POST', body: fd });
        const d = await r.json();
        if (d.key) STATE.uploadedKeys.push(d.key);
      }
    }

    // Gather intake data
    const intakeData = {
      sessionId: STATE.sessionId,
      tier: STATE.tier,
      existingWebsiteUrl: document.getElementById('intake-website')?.value || '',
      linkedinUrl: document.getElementById('intake-linkedin')?.value || '',
      competitorUrls: (document.getElementById('intake-competitors')?.value || '').split('\\n').filter(Boolean),
      testimonials: document.getElementById('intake-testimonials')?.value || '',
      uploadedKeys: STATE.uploadedKeys
    };

    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intakeData)
    });

    const data = await res.json();

    if (data.ok) {
      STATE.sessionId = data.sessionId;
      showScreen('app');
      appendMessage('ai', data.firstMessage);
      document.getElementById('msg-input').focus();
    } else {
      showToast(data.error || 'Could not start session.');
      btn.textContent = 'Start My Deep Work Session →';
      btn.disabled = false;
    }
  } catch (e) {
    showToast('Connection error. Please try again.');
    btn.textContent = 'Start My Deep Work Session →';
    btn.disabled = false;
  }
}

// ── CHAT ─────────────────────────────────────────────────
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

async function sendMessage() {
  const input = document.getElementById('msg-input');
  const text = input.value.trim();
  if (!text || STATE.isStreaming) return;

  input.value = '';
  input.style.height = 'auto';
  appendMessage('user', text);
  STATE.isStreaming = true;
  document.getElementById('send-btn').disabled = true;
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, message: text })
    });

    if (!res.ok) throw new Error('API error');

    removeTyping();
    const aiMsg = appendMessage('ai', '');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const ev = JSON.parse(raw);
            if (ev.type === 'delta') {
              fullText += ev.content;
              // Strip METADATA line before displaying
              const displayText = fullText.replace(/METADATA:\\{.*\\}$/m, '').trim();
              updateBubble(aiMsg, displayText);
              scrollToBottom();
            } else if (ev.type === 'metadata') {
              updatePhase(ev.phase);
              if (ev.sessionComplete) {
                handleBlueprintReady(ev.blueprint);
              }
            }
          } catch (_) {}
        }
      }
    }
  } catch (e) {
    removeTyping();
    appendMessage('ai', 'Something went wrong. Please try again.');
  } finally {
    STATE.isStreaming = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('msg-input').focus();
  }
}

function appendMessage(role, text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = \`msg \${role}\`;

  const initial = role === 'ai' ? 'JG' : 'You';
  div.innerHTML = \`
    <div class="avatar \${role === 'ai' ? 'ai' : 'user-av'}">\${initial}</div>
    <div class="bubble">\${formatText(text)}</div>
  \`;

  msgs.appendChild(div);
  scrollToBottom();
  return div.querySelector('.bubble');
}

function updateBubble(bubble, text) {
  bubble.innerHTML = formatText(text);
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing';
  div.innerHTML = \`
    <div class="avatar ai">JG</div>
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
  \`;
  msgs.appendChild(div);
  scrollToBottom();
}

function removeTyping() {
  document.getElementById('typing')?.remove();
}

function scrollToBottom() {
  const msgs = document.getElementById('messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function formatText(text) {
  if (!text) return '';
  // Convert markdown-ish to HTML
  return text
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/^(\\d+\\. .+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\\/li>\\n?)+/g, s => '<ol>' + s + '</ol>')
    .split('\\n\\n')
    .map(p => p.startsWith('<ol>') ? p : '<p>' + p.replace(/\\n/g, '<br>') + '</p>')
    .join('');
}

// ── PHASE TRACKING ────────────────────────────────────────
function updatePhase(phase) {
  if (!phase || phase === STATE.phase) return;

  // Mark previous phases complete
  for (let i = 1; i < phase; i++) {
    const dot = document.getElementById(\`pd\${i}\`);
    if (dot) { dot.classList.remove('active'); dot.classList.add('complete'); dot.textContent = '✓'; }
  }

  // Set current phase active
  const current = document.getElementById(\`pd\${phase}\`);
  if (current) { current.classList.add('active'); }

  // Update name
  const nameEl = document.getElementById('phase-name');
  if (nameEl && PHASE_NAMES[phase]) {
    nameEl.innerHTML = \`Phase \${phase}: <strong>\${PHASE_NAMES[phase]}</strong>\`;
  }

  STATE.phase = phase;

  // Show image generation button at phase 5
  if (phase >= 5) {
    document.getElementById('images-btn').style.display = 'flex';
  }
}

// ── BLUEPRINT ─────────────────────────────────────────────
function handleBlueprintReady(blueprint) {
  if (!blueprint) return;
  STATE.blueprint = blueprint;

  // Show order bump
  setTimeout(() => {
    document.getElementById('order-bump').style.display = 'flex';
  }, 2000);

  // After a moment, transition to blueprint screen
  setTimeout(() => {
    renderBlueprint(blueprint);
    showScreen('blueprint-screen');
    if (STATE.tier === 'site') {
      document.getElementById('build-site-btn').style.display = 'inline-flex';
    }
  }, 3000);
}

function renderBlueprint(bp) {
  const b = bp.blueprint;
  document.getElementById('bp-name').textContent = b.name + "'s Brand Blueprint";

  const body = document.getElementById('blueprint-body');
  body.innerHTML = \`
    \${renderPart(1, b.part1.title, \`
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Brand Names</div>
          <div class="bp-item-value">\${b.part1.brandNames.map((n,i) => \`\${i+1}. \${n}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Taglines</div>
          <div class="bp-item-value">\${b.part1.taglines.map((t,i) => \`\${i+1}. \${t}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Color Palette</div>
          <div class="bp-item-value">\${b.part1.visualDirection.colors.map(c => \`<span class="color-swatch" style="background:\${c.hex}"></span>\${c.name} \${c.hex}\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Core Brand Promise</div>
          <div class="bp-item-value">\${b.part1.coreBrandPromise}</div>
        </div>
      </div>
    \`)}
    \${renderPart(2, b.part2.title, \`
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Avatar</div>
          <div class="bp-item-value"><strong>\${b.part2.name}</strong>, \${b.part2.ageRange}<br>\${b.part2.lifeSituation}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">What Stops Them</div>
          <div class="bp-item-value">\${b.part2.whatIsStoppingThem}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Their Exact Words</div>
          <div class="bp-item-value">\${b.part2.exactWords.map((w,i) => \`\${i+1}. "\${w}"\`).join('<br>')}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Why Past Solutions Failed</div>
          <div class="bp-item-value">\${b.part2.whyItDidNotWork}</div>
        </div>
      </div>
    \`)}
    \${renderPart(3, b.part3.title, \`
      <div class="bp-item" style="margin-bottom:12px">
        <div class="bp-item-label">Niche Statement</div>
        <div class="bp-item-value" style="font-size:16px;font-weight:500">\${b.part3.nicheStatement}</div>
      </div>
      <div class="bp-grid">
        <div class="bp-item">
          <div class="bp-item-label">Unique Mechanism</div>
          <div class="bp-item-value">\${b.part3.uniqueMechanism}</div>
        </div>
        <div class="bp-item">
          <div class="bp-item-label">Competitive Edge</div>
          <div class="bp-item-value">\${b.part3.competitorGap}</div>
        </div>
      </div>
    \`)}
    \${renderPart(4, b.part4.title, \`
      <div class="bp-grid">
        \${renderOffer('Entry Offer', b.part4.entryOffer)}
        \${renderOffer('Core Offer', b.part4.coreOffer)}
        \${renderOffer('Premium Offer', b.part4.premiumOffer)}
        <div class="bp-item">
          <div class="bp-item-label">Ascension Logic</div>
          <div class="bp-item-value">\${b.part4.ascensionLogic}</div>
        </div>
      </div>
    \`)}
    \${renderPart(7, b.part7.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Top 10 Headlines</div>
        <div class="bp-item-value">\${b.part7.heroHeadlineOptions.map((h,i) => \`\${i+1}. \${h}\`).join('<br><br>')}</div>
      </div>
    \`)}
  \`;
}

function renderPart(num, title, content) {
  return \`
    <div class="bp-part">
      <div class="bp-part-header">
        <div class="bp-part-num">\${num}</div>
        <h3>\${title}</h3>
      </div>
      \${content}
    </div>
  \`;
}

function renderOffer(label, offer) {
  return \`
    <div class="bp-item">
      <div class="bp-item-label">\${label}</div>
      <div class="bp-item-value">
        <strong>\${offer.name}</strong><br>
        \${offer.description}<br>
        <span style="color:var(--gold)">\${offer.price}</span>
      </div>
    </div>
  \`;
}

// ── SITE GENERATION ───────────────────────────────────────
async function proceedToSite() {
  showScreen('site-screen');
  await runSiteGeneration();
}

async function runSiteGeneration() {
  try {
    // Step 1 active by default, step 2 next
    await delay(800);
    setStep(1, 'done');
    setStep(2, 'active');

    // Generate images
    const imgRes = await fetch('/api/generate/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    await imgRes.json();

    setStep(2, 'done');
    setStep(3, 'active');

    // Generate site HTML
    const siteRes = await fetch('/api/generate/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const siteData = await siteRes.json();

    if (siteData.html) {
      STATE.generatedSiteHtml = siteData.html;
    }

    setStep(3, 'done');
    setStep(4, 'done');

    document.getElementById('deploy-btn').style.display = 'block';
  } catch (e) {
    showToast('Site generation encountered an error. Please try again.');
  }
}

function setStep(num, state) {
  const el = document.getElementById(\`step-\${num}-icon\`);
  if (!el) return;
  el.className = \`step-icon \${state}\`;
  if (state === 'done') el.textContent = '✓';
}

// ── CLOUDFLARE DEPLOY ─────────────────────────────────────
async function deployToCloudflare() {
  const token = document.getElementById('cf-token').value.trim();
  if (!token) { showToast('Please enter your API token.'); return; }

  document.getElementById('deploy-status').style.display = 'block';

  try {
    updateDeployStep('Creating your Pages project...');
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, cfToken: token })
    });
    const data = await res.json();

    if (data.url) {
      updateDeployStep('Deployment complete!');
      document.getElementById('deploy-step-icon').className = 'step-icon done';
      document.getElementById('deploy-step-icon').textContent = '✓';
      document.getElementById('deploy-status').style.display = 'none';
      document.getElementById('deploy-success').style.display = 'block';
      document.getElementById('live-url').href = data.url;
      document.getElementById('live-url').textContent = data.url;
    } else {
      showToast(data.error || 'Deployment failed. Check your token and try again.');
    }
  } catch (e) {
    showToast('Deployment error. Please try again.');
  }
}

function updateDeployStep(text) {
  document.getElementById('deploy-step-text').textContent = text;
}

// ── IMAGEN 4 ──────────────────────────────────────────────
async function generateBrandImages() {
  showToast('Generating brand images...');
  try {
    const res = await fetch('/api/generate/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const data = await res.json();

    if (data.images && data.images.length > 0) {
      const gallery = \`<div class="image-gallery">\${data.images.map(img => \`<img src="\${img}" alt="Brand image">\`).join('')}</div>\`;
      appendMessage('ai', 'Here are your brand images generated from your blueprint. These are ready to use on your website.\\n\\n' + gallery);
    }
  } catch (e) {
    showToast('Image generation failed. Please try again.');
  }
}

// ── EXPORT ────────────────────────────────────────────────
async function exportPackage() {
  showToast('Preparing your export package...');
  try {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deep-work-blueprint.zip';
    a.click();
    showToast('Export downloaded.');
  } catch (e) {
    showToast('Export failed. Please try again.');
  }
}

async function downloadPDF() {
  showToast('Generating PDF...');
  try {
    const res = await fetch('/api/blueprint/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-blueprint.pdf';
    a.click();
  } catch (e) {
    showToast('PDF generation failed.');
  }
}

// ── ORDER BUMP ────────────────────────────────────────────
function addStrategyCall() {
  initiateCheckout('call');
}

// ── UTILS ─────────────────────────────────────────────────
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function openUploadModal() {
  document.getElementById('file-input')?.click();
}
</script>
</body>
</html>`;
