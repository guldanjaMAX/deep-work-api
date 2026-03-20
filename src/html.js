// ============================================================
// DEEP WORK APP — FRONTEND HTML
// ============================================================

export const getHTML = (config) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Deep Work Blueprint | James Guldan</title>
<link rel="icon" type="image/x-icon" href="https://jamesguldan.com/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="https://jamesguldan.com/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="https://jamesguldan.com/apple-touch-icon.png">
<meta name="description" content="A 90-minute AI-powered brand strategy session that produces a complete brand blueprint, offer structure, and website-ready copy.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #FDFCFA;
    --bg2:         #F5F2EF;
    --bg3:         #ECEAE6;
    --border:      #E8E5E1;
    --border2:     #D4D0CB;
    --gold:        #c4703f;
    --gold2:       #d4855a;
    --text:        #111111;
    --text2:       #555555;
    --text3:       #9A9A9A;
    --user-bubble: #ECEAE6;
    --ai-bubble:   #FFFFFF;
    --accent:      #c4703f;
    --success:     #2d7a4f;
    --radius:      12px;
    --radius-sm:   8px;
  }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* ── LANDING PAGE (welcome for authenticated users) ── */
  #landing {
    min-height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .landing-inner { max-width: 720px; width: 100%; text-align: center; }

  .eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 20px;
    border: 1px solid rgba(196,112,63,0.2);
  }

  .landing-inner h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 20px;
    color: var(--text);
  }

  .landing-inner h1 em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--gold);
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
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    width: 100%;
    letter-spacing: 0.01em;
  }

  .btn-gold {
    background: var(--text);
    color: #fff;
    border-radius: 50px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }

  .btn-gold:hover {
    background: #2d2d2d;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
  }

  .btn-gold:active { transform: translateY(0); box-shadow: 0 1px 4px rgba(0,0,0,0.18); }

  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border2);
    border-radius: 50px;
  }

  .btn-outline:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(196,112,63,0.04);
  }

  .btn-primary {
    background: var(--text);
    color: #fff;
    border-radius: 50px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  }

  .btn-primary:hover { background: #2d2d2d; transform: translateY(-1px); }

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

  .legal-footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .legal-footer p {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 6px;
    line-height: 1.6;
    max-width: 100%;
  }

  .legal-footer a {
    color: var(--text3);
    text-decoration: none;
    transition: color 0.2s;
  }

  .legal-footer a:hover { color: var(--text2); }

  .legal-disclaimer {
    font-size: 11px !important;
    color: var(--border2) !important;
    margin-top: 8px;
    font-style: italic;
  }

  /* ── INTAKE SCREEN ── */
  #intake {
    display: none;
    min-height: 100vh;
    padding: 0 0 80px 0;
    margin: 0 auto;
  }

  /* Intake hero */
  .intake-hero {
    text-align: center;
    padding: 52px 20px 40px;
    position: relative;
  }

  .intake-hero .eyebrow { margin-bottom: 20px; }

  .intake-hero h2 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 16px;
    color: var(--text);
  }

  .intake-hero h2 em {
    font-style: italic;
    font-family: 'Playfair Display', serif;
    color: var(--gold);
  }

  .intake-hero > p {
    font-size: 17px;
    color: var(--text2);
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 32px;
  }

  /* Promise strip */
  .promise-strip {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    padding: 0 20px;
  }

  .promise-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text2);
  }

  .promise-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(196,112,63,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Step cards */
  .intake-steps {
    max-width: 640px;
    margin: 0 auto;
    padding: 40px 20px 0;
  }

  .step-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 0;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03);
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .step-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }

  .step-card-header {
    padding: 28px 28px 0;
  }

  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg3);
    border: 1.5px solid var(--border2);
    color: var(--text2);
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    margin-bottom: 12px;
  }

  .step-card h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .step-card .step-why {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.65;
    margin-bottom: 4px;
  }

  .step-card .step-impact {
    font-size: 13px;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .step-card-body {
    padding: 20px 28px 28px;
  }

  .step-card label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--text2);
    margin-bottom: 6px;
  }

  .step-optional {
    display: inline-block;
    font-size: 11px;
    color: var(--text3);
    font-weight: 400;
    margin-left: 6px;
  }

  input[type="text"], input[type="email"], input[type="url"], textarea {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    color: var(--text);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 12px;
    resize: vertical;
  }

  input:focus, textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }

  input::placeholder, textarea::placeholder { color: var(--text3); }

  .upload-zone {
    border: 2px dashed var(--border2);
    border-radius: 12px;
    padding: 36px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    background: var(--bg);
  }

  .upload-zone:hover, .upload-zone.drag-over {
    border-color: var(--gold);
    background: rgba(196,112,63,0.03);
  }

  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  .upload-zone .upload-icon { font-size: 32px; margin-bottom: 10px; }

  .upload-zone p { font-size: 15px; color: var(--text2); margin: 0 0 4px; }

  .upload-zone span { font-size: 12px; color: var(--text3); }

  .uploaded-files { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

  .file-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 13px;
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

  /* CTA area */
  .intake-cta {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .intake-cta .btn-gold {
    font-size: 16px;
    padding: 18px 40px;
    width: auto;
    display: inline-flex;
    border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(26,26,26,0.2);
    position: relative;
    overflow: hidden;
  }

  .intake-cta .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(26,26,26,0.28);
  }

  .intake-cta .btn-gold:disabled {
    opacity: 1;
    cursor: not-allowed;
    background: var(--text);
  }

  .intake-reassurance {
    margin-top: 16px;
    font-size: 13px;
    color: var(--text3);
    line-height: 1.6;
  }

  .intake-reassurance strong {
    color: var(--text2);
  }

  /* Loading overlay */
  .session-loading {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #FDFCFA;
    z-index: 99999;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    text-align: center;
    animation: loadFadeIn 0.35s ease;
    overflow: hidden;
  }

  .session-loading.active { display: flex; }

  @keyframes loadFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 2.5px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: loadSpin 0.8s linear infinite;
    margin-bottom: 28px;
    flex-shrink: 0;
  }

  @keyframes loadSpin {
    to { transform: rotate(360deg); }
  }

  .loading-message {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 19px;
    color: var(--text);
    max-width: 360px;
    width: 100%;
    line-height: 1.55;
    min-height: 56px;
    transition: opacity 0.3s ease;
  }

  .loading-stage {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 20px;
  }

  .loading-progress {
    width: 180px;
    height: 2px;
    background: var(--border);
    border-radius: 2px;
    margin-top: 10px;
    overflow: hidden;
  }

  .loading-progress-bar {
    height: 100%;
    background: var(--gold);
    border-radius: 2px;
    width: 0%;
    transition: width 0.6s ease;
  }

  .loading-error {
    display: none;
    max-width: 380px;
    width: 100%;
    text-align: center;
  }

  .loading-error h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .loading-error p {
    font-size: 15px;
    color: var(--text2);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .loading-error .error-detail {
    font-size: 12px;
    color: var(--text3);
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-family: monospace;
    word-break: break-all;
    text-align: left;
  }

  @media (max-width: 600px) {
    /* ── INTAKE: strip the wall of text — show title + input only ── */
    .intake-hero { padding: 28px 16px 20px; }
    .intake-hero > p { font-size: 15px; margin-bottom: 20px; }
    .promise-strip { gap: 10px; }
    .promise-item { font-size: 12px; }
    .promise-item .promise-icon { width: 26px; height: 26px; font-size: 13px; }

    /* The big fix: hide long copy on mobile — inputs speak for themselves */
    .step-why { display: none; }
    .step-impact { display: none; }
    .step-card-header { padding: 18px 18px 0; }
    .step-card-body { padding: 10px 18px 18px; }
    .step-card h3 { font-size: 16px; margin-bottom: 0; }
    .step-card { margin-bottom: 10px; border-radius: 14px; }
    .step-number { width: 24px; height: 24px; font-size: 11px; margin-bottom: 8px; }
    .intake-steps { padding: 12px 14px 0; }

    /* Sticky begin button — always reachable without scrolling to the bottom */
    .intake-cta {
      position: sticky;
      bottom: 0;
      background: var(--bg);
      padding: 12px 16px 20px;
      border-top: 1px solid var(--border);
      margin: 0;
      z-index: 5;
      text-align: center;
    }
    .intake-cta .btn-gold { font-size: 15px; padding: 15px 28px; }
    .intake-reassurance { font-size: 11px; margin-top: 8px; }

    /* Chat: hide avatars on mobile so bubbles get full width */
    .msg.ai .avatar,
    .msg.user .avatar { display: none; }

    .msg.ai .bubble,
    .msg.user .bubble { max-width: calc(100% - 8px); }

    /* Thinking bubble expands on mobile */
    .thinking-bubble { min-width: 0; max-width: calc(100% - 8px); width: auto; }

    /* Smaller message gap on mobile */
    #messages { gap: 12px; padding: 16px 12px; }

    /* Tighter input */
    .input-area { padding: 10px 12px 12px; }

    /* Keep phase bar compact */
    .phase-bar { padding: 8px 12px; }
    .phase-dot { width: 24px; height: 24px; font-size: 10px; }
    .phase-label { display: none; }
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
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    overflow-x: auto;
    scrollbar-width: none;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .phase-bar::-webkit-scrollbar { display: none; }

  .phase-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .phases {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
  }

  .phase-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    border: 1.5px solid var(--border);
    color: var(--text3);
    transition: all 0.25s;
    flex-shrink: 0;
    background: var(--bg);
  }

  .phase-dot.active {
    background: var(--gold);
    border-color: var(--gold);
    color: #fff;
  }

  .phase-dot.complete {
    background: transparent;
    border-color: var(--gold);
    color: var(--gold);
  }

  .phase-name {
    font-size: 13px;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: auto;
  }

  .phase-name strong { color: var(--text); font-weight: 600; }

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
    background: var(--gold);
    color: #fff;
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
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03);
    border-radius: 4px 18px 18px 18px;
    color: var(--text);
    border: 1px solid var(--border);
  }

  .msg.user .bubble {
    background: var(--user-bubble);
    border-radius: 18px 4px 18px 18px;
    color: var(--text);
  }

  .bubble p { margin-bottom: 10px; }
  .bubble p:last-child { margin-bottom: 0; }
  .bubble ol { padding-left: 20px; margin: 8px 0; }
  .bubble ol li { margin-bottom: 6px; }
  .bubble strong { color: var(--text); font-weight: 600; }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 14px 18px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04);
    border-radius: 4px 18px 18px 18px;
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

  /* Thinking message (enhanced typing indicator) */
  .thinking-bubble {
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 4px 18px 18px 18px;
    padding: 0;
    overflow: hidden;
    min-width: 200px;
    max-width: 340px;
  }
  .thinking-dots {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 13px 16px 5px;
  }
  .thinking-dots span {
    width: 5px;
    height: 5px;
    background: var(--text3);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }
  .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  .thinking-msg {
    padding: 3px 16px 13px;
    font-size: 12px;
    color: var(--text3);
    font-style: italic;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.4s ease;
    min-height: 18px;
  }
  .thinking-progress {
    height: 2px;
    background: var(--border);
    overflow: hidden;
  }
  .thinking-progress-bar {
    height: 100%;
    background: var(--gold);
    width: 0%;
    transition: width 0.8s ease;
  }
  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* Blueprint generation overlay */
  .blueprint-generating {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #FDFCFA;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 32px 24px;
    text-align: center;
    overflow: hidden;
  }
  .blueprint-generating.active { display: flex; }
  .blueprint-gen-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), #e8935a);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    animation: pulse-glow 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .blueprint-gen-icon svg {
    width: 30px;
    height: 30px;
    fill: white;
    animation: spin-slow 4s linear infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(196,112,63,0.25); transform: scale(1); }
    50% { box-shadow: 0 0 36px rgba(196,112,63,0.4); transform: scale(1.04); }
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .blueprint-gen-title {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 26px;
    color: var(--text);
    margin-bottom: 8px;
  }
  .blueprint-gen-msg {
    font-size: 15px;
    color: var(--text2);
    font-family: 'Inter', sans-serif;
    transition: opacity 0.5s ease;
    max-width: 360px;
    width: 100%;
    line-height: 1.65;
    min-height: 52px;
  }
  .blueprint-gen-progress {
    width: 220px;
    height: 2px;
    background: rgba(196,112,63,0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 24px;
  }
  .blueprint-gen-progress-bar {
    height: 100%;
    background: var(--gold);
    border-radius: 2px;
    width: 0%;
    transition: width 1.2s ease;
  }

  /* Input area */
  .input-area {
    border-top: 1px solid var(--border);
    background: var(--bg);
    padding: 12px 16px 14px;
    flex-shrink: 0;
  }

  .input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    max-width: 760px;
    margin: 0 auto;
  }

  .input-row textarea {
    flex: 1;
    background: #ffffff;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 11px 14px;
    color: var(--text);
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    resize: none;
    outline: none;
    max-height: 140px;
    overflow-y: auto;
    line-height: 1.5;
    margin: 0;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }

  .input-row textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.08);
  }

  .input-row textarea::placeholder { color: var(--text3); }

  .send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--gold);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    color: #fff;
  }

  .send-btn:hover { background: var(--gold2); transform: scale(1.05); }
  .send-btn:active { transform: scale(0.97); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* Voice input button */
  .voice-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg2);
    border: 1.5px solid var(--border);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    color: var(--text3);
  }

  .voice-btn:hover { border-color: var(--border2); color: var(--text2); }

  .voice-btn.recording {
    background: rgba(196,112,63,0.1);
    border-color: var(--gold);
    color: var(--gold);
    animation: voicePulse 1.5s ease-in-out infinite;
  }

  .voice-btn.unsupported { display: none; }

  @keyframes voicePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,112,63,0.3); }
    50% { box-shadow: 0 0 0 8px rgba(196,112,63,0); }
  }

  .voice-status {
    font-size: 12px;
    color: var(--gold);
    text-align: center;
    max-width: 760px;
    margin: 6px auto 0;
    min-height: 16px;
    font-weight: 500;
  }

  /* Resume banner */
  .resume-banner {
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 28px;
    max-width: 640px;
    margin: 0 auto 24px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
  }

  .resume-banner h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .resume-banner p {
    font-size: 14px;
    color: var(--text2);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .resume-banner .resume-meta {
    font-size: 12px;
    color: var(--text3);
    margin-bottom: 16px;
  }

  .resume-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .resume-actions .btn { width: auto; padding: 14px 28px; }

  .input-tools {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 760px;
    margin: 8px auto 0;
  }

  .tool-btn {
    background: none;
    border: none;
    border-radius: 6px;
    padding: 4px 8px;
    color: var(--text3);
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .tool-btn:hover { color: var(--text2); }

  /* ── BLUEPRINT SCREEN ── */
  #blueprint-screen {
    display: none;
    flex-direction: column;
    min-height: 100vh;
  }

  .blueprint-header {
    background: linear-gradient(135deg, var(--bg2) 0%, rgba(196,112,63,0.05) 100%);
    border-bottom: 1px solid var(--border);
    padding: 32px 40px;
    text-align: center;
  }

  .blueprint-header h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
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
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
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
    background: rgba(196,112,63,0.12);
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
  .step-icon.active { background: rgba(196,112,63,0.12); border: 1px solid var(--gold); animation: pulse 1.5s infinite; }
  .step-icon.done { background: rgba(22,163,74,0.15); border: 1px solid var(--success); color: var(--success); }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,112,63,0.3); }
    50% { box-shadow: 0 0 0 6px rgba(196,112,63,0); }
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
    background: rgba(196,112,63,0.1);
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
    background: #fff;
    border-top: 2px solid var(--gold);
    padding: 20px;
    z-index: 100;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
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

  .order-bump-text h3 { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--text); }

  .order-bump-text p { font-size: 13px; color: var(--text2); }

  .bump-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }

  .bump-price {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
  }

  .bump-close {
    background: none;
    border: none;
    color: var(--text3);
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
    position: absolute;
    top: 12px;
    right: 16px;
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

  /* ── PHASE COMPLETION BANNER ── */
  .phase-complete-banner {
    max-width: 760px;
    width: 100%;
    margin: 8px auto;
    animation: fadeUp 0.4s ease;
  }

  .phase-complete-inner {
    background: rgba(196,112,63,0.06);
    border: 1px solid rgba(196,112,63,0.18);
    border-radius: 12px;
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .phase-complete-check {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--gold);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .phase-complete-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--gold);
    margin-bottom: 2px;
  }

  .phase-complete-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .phase-complete-progress {
    margin-left: auto;
    font-size: 12px;
    color: var(--text3);
    white-space: nowrap;
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

<!-- ══ LANDING SCREEN (fallback for unauthenticated) ══ -->
<div id="landing" class="screen active">
  <div class="landing-inner">
    <div class="eyebrow">Deep Work by James Guldan</div>
    <h1>This Experience Starts<br>at <em>jamesguldan.com/deep-work</em></h1>
    <p>You need an active session to access Deep Work. If you already purchased, check your email for a login link. Otherwise, visit the main page to get started.</p>
    <a href="https://jamesguldan.com/deep-work" class="btn btn-gold" style="width:auto;display:inline-flex;padding:16px 36px;text-decoration:none;">Go to Deep Work &rarr;</a>
    <div class="legal-footer">
      <p>&copy; 2025 James Guldan / Align Growth LLC. All rights reserved.</p>
      <p>
        <a href="/legal/terms" target="_blank">Terms of Service</a>
        &middot;
        <a href="/legal/privacy" target="_blank">Privacy Policy</a>
        &middot;
        <a href="mailto:james@jamesguldan.com">Support</a>
      </p>
    </div>
  </div>
</div>

<!-- ══ INTAKE SCREEN ══ -->
<div id="intake" class="screen">

  <!-- Hero section -->
  <div class="intake-hero">
    <div class="eyebrow">Your Session Is Ready</div>
    <h2>Let&rsquo;s Build Something<br><em>Only You</em> Could Build</h2>
    <p>Eight conversations. One complete brand blueprint. Built around who you actually are — not a template, not a formula. The real thing.</p>
    <div class="promise-strip">
      <div class="promise-item">
        <div class="promise-icon">✦</div>
        <span>8 short conversations</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">📄</div>
        <span>Complete brand blueprint</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">🎯</div>
        <span>Custom to your story</span>
      </div>
    </div>
  </div>

  <!-- Resume banner (shown when active session exists) -->
  <div class="resume-banner" id="resume-banner" style="display:none;">
    <h3>Welcome Back</h3>
    <p id="resume-text">You have an active session in progress. Pick up right where you left off, or start fresh.</p>
    <div class="resume-meta" id="resume-meta"></div>
    <div class="resume-actions">
      <button class="btn btn-gold" onclick="resumeSession()" id="resume-btn">Continue My Session</button>
      <button class="btn btn-outline" onclick="dismissResume()">Start Fresh</button>
    </div>
  </div>

  <!-- Step cards -->
  <div class="intake-steps">

    <!-- Step 1: Website -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">1</div>
        <h3>Where You Are Right Now</h3>
        <p class="step-why">If you have an existing website, paste it here. This is not about judging what you have built so far. This is about understanding your starting point so we can see the gap between where you are and where you are going. Most people who do this exercise are shocked at how much more clearly they can articulate their value afterward.</p>
        <p class="step-impact">This one input alone can save 20+ minutes of the interview.</p>
      </div>
      <div class="step-card-body">
        <label>Your current website URL <span class="step-optional">(if you have one)</span></label>
        <input type="url" id="intake-website" placeholder="https://yoursite.com">
      </div>
    </div>

    <!-- Step 2: LinkedIn -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">2</div>
        <h3>Your Professional Story</h3>
        <p class="step-why">Your LinkedIn profile holds a goldmine of positioning data you probably do not even realize. The way you describe your experience, the endorsements you have collected, the language you naturally use when you are not overthinking it. We will analyze all of it so the AI interviewer already understands your world before asking the first question.</p>
        <p class="step-impact">The AI reads your entire professional narrative before your session begins.</p>
      </div>
      <div class="step-card-body">
        <label>Your LinkedIn profile URL <span class="step-optional">(if you have one)</span></label>
        <input type="url" id="intake-linkedin" placeholder="https://linkedin.com/in/yourname">
      </div>
    </div>

    <!-- Step 3: Competitors -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">3</div>
        <h3>The Landscape Around You</h3>
        <p class="step-why">Here is why this matters more than you think: your brand does not exist in a vacuum. The people you admire, the competitors you respect (or resent), the businesses in your space that seem to have it figured out. When we see what they are doing, we can find the white space. The gap where only you can stand. This is how you stop competing and start leading.</p>
        <p class="step-impact">Competitor analysis reveals the positioning gap only your brand can fill.</p>
      </div>
      <div class="step-card-body">
        <label>Competitor or inspiration URLs <span class="step-optional">(up to 3)</span></label>
        <textarea id="intake-competitors" rows="3" placeholder="Paste one URL per line..."></textarea>
      </div>
    </div>

    <!-- Step 4: Testimonials -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">4</div>
        <h3>The Words That Already Work</h3>
        <p class="step-why">This might be the most powerful input of all. When your best clients describe what you did for them, they use language that is pure gold. They say things you would never say about yourself. They capture the transformation in ways that feel authentic because they ARE authentic. The AI will mine these words and weave them into your brand messaging so your copy sounds like real humans raving about you, not like a marketing robot.</p>
        <p class="step-impact">Client language becomes your most persuasive brand copy.</p>
      </div>
      <div class="step-card-body">
        <label>Testimonials, reviews, or client feedback <span class="step-optional">(the more the better)</span></label>
        <textarea id="intake-testimonials" rows="5" placeholder="Paste Google reviews, LinkedIn recommendations, client emails, DMs... anything where someone said something great about working with you."></textarea>
      </div>
    </div>

    <!-- Step 5: Photos -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-number">5</div>
        <h3>Put a Face to the Brand</h3>
        <p class="step-why">People buy from people. Your headshot, your team, your workspace, your product in action. These images tell a story that words alone cannot. Upload anything that represents you or your work. The AI will use these to understand your visual identity and, if you chose the website package, to build a site that actually looks and feels like you.</p>
        <p class="step-impact">Visuals make your blueprint and website uniquely, unmistakably yours.</p>
      </div>
      <div class="step-card-body">
        <div class="upload-zone" id="upload-zone">
          <input type="file" id="file-input" multiple accept="image/*">
          <div class="upload-icon">📷</div>
          <p>Drag photos here or click to browse</p>
          <span>JPG, PNG, WebP up to 10MB each (up to 10 files)</span>
        </div>
        <div class="uploaded-files" id="uploaded-files"></div>
      </div>
    </div>

  </div>

  <!-- Phone (for session nudges) -->
  <div class="step-card">
    <div class="step-card-header">
      <div class="step-number">✆</div>
      <h3>Get Nudged Back In</h3>
      <p class="step-impact">If life gets in the way, we will send you a quick text reminder so you do not lose momentum.</p>
    </div>
    <div class="step-card-body">
      <label>Your mobile number <span class="step-optional">(optional, US numbers only)</span></label>
      <input type="tel" id="intake-phone" placeholder="+1 (555) 000-0000" autocomplete="tel">
    </div>
  </div>

  <!-- CTA -->
  <div class="intake-cta">
    <button class="btn btn-gold" onclick="startSession()" id="start-btn">Begin My Deep Work Session</button>
    <p class="intake-reassurance"><strong>Everything above is optional.</strong> You can skip any step and jump right in. But every detail you share makes your blueprint sharper, more personal, and more powerful. This is the difference between generic advice and a strategy built on the truth of who you are.</p>
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
      <textarea id="msg-input" placeholder="Type or tap the mic to talk..." rows="1" onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
      <button class="voice-btn" id="voice-btn" onclick="toggleVoice()" title="Tap to speak">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      <button class="send-btn" id="send-btn" onclick="sendMessage()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
    <div class="voice-status" id="voice-status"></div>
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
  <div class="blueprint-actions" style="flex-direction:column;align-items:center;gap:16px;padding:28px 40px;">
    <button class="btn btn-gold" id="build-site-btn" onclick="handleBuildSite()" style="width:auto;padding:18px 40px;font-size:17px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);letter-spacing:0.02em;">Build My Website</button>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
      <button class="btn btn-outline" onclick="downloadPDF()" style="width:auto;padding:12px 22px;font-size:14px;">Download PDF</button>
      <button class="btn btn-outline" onclick="exportPackage()" style="width:auto;padding:12px 22px;font-size:14px;">Take It With You</button>
    </div>
  </div>
  <div class="blueprint-body" id="blueprint-body">
    <!-- populated by JS -->
  </div>
</div>

<!-- ══ ORDER BUMP (shown after blueprint, before blueprint screen renders) ══ -->
<div id="order-bump" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:2px solid var(--gold);padding:20px 24px;z-index:999;animation:slideUp 0.4s ease;">
  <div class="order-bump-inner">
    <div class="order-bump-text">
      <div class="bump-label">One-Time Upgrade</div>
      <h3>Turn your blueprint into a live website — right now.</h3>
      <p>Add Site In Sixty and we'll build a complete, branded website from your blueprint in about 60 seconds.</p>
    </div>
    <div class="bump-actions">
      <span class="bump-price">$297</span>
      <button class="btn btn-gold" onclick="addSiteUpgrade()" style="width:auto;padding:14px 24px;">Add Website Upgrade</button>
      <button class="btn btn-ghost" onclick="document.getElementById('order-bump').style.display='none'" style="width:auto;padding:14px 24px;font-size:13px;color:var(--text2);">No thanks</button>
    </div>
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

    <!-- Step 0: No account yet? -->
    <div id="deploy-no-account" style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:18px 22px;margin-bottom:28px;display:flex;align-items:center;gap:16px;">
      <div style="font-size:22px">☁️</div>
      <div>
        <div style="font-weight:600;font-size:14px;margin-bottom:3px">Don't have a Cloudflare account yet?</div>
        <div style="font-size:13px;color:var(--text2)">It's free and takes 2 minutes to sign up. Your website will be hosted on their global network at no cost.</div>
      </div>
      <a href="https://dash.cloudflare.com/sign-up" target="_blank" class="btn btn-outline" style="white-space:nowrap;flex-shrink:0;padding:10px 18px;font-size:13px;">Create Free Account →</a>
    </div>

    <h2>Connect Cloudflare &amp; Go Live</h2>
    <p style="color:var(--text2);margin-bottom:28px">Your site is built and ready. The last step is giving it a home on the internet. Follow these steps exactly — it takes about 3 minutes.</p>

    <div class="token-steps">
      <div class="token-step">
        <div class="token-step-num">1</div>
        <div class="token-step-text">
          <strong>Open the API Tokens page</strong><br>
          <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" style="color:var(--gold)">Click here to open Cloudflare API Tokens ↗</a>
          <span style="color:var(--text2);font-size:13px;display:block;margin-top:4px">It will open in a new tab. Sign in if prompted.</span>
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">2</div>
        <div class="token-step-text">
          <strong>Click "Create Token"</strong><br>
          <span style="color:var(--text2);font-size:13px">You'll see a blue button at the top right of that page.</span>
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">3</div>
        <div class="token-step-text">
          <strong>Choose "Edit Cloudflare Workers" template</strong><br>
          <span style="color:var(--text2);font-size:13px">Scroll down to the template list. Click "Use template" next to <em>Edit Cloudflare Workers</em>.</span>
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">4</div>
        <div class="token-step-text">
          <strong>Add one more permission: Cloudflare Pages</strong><br>
          <span style="color:var(--text2);font-size:13px">On the permissions screen, click <strong>+ Add more</strong> and add: <code style="background:var(--bg3);padding:2px 6px;border-radius:4px;font-size:12px">Cloudflare Pages — Edit</code>. This lets us publish your site.</span>
        </div>
      </div>
      <div class="token-step">
        <div class="token-step-num">5</div>
        <div class="token-step-text">
          <strong>Click "Continue to summary" → "Create Token"</strong><br>
          <span style="color:var(--text2);font-size:13px">Cloudflare will show you your token <strong>once</strong>. Copy it immediately and paste it below.</span>
        </div>
      </div>
    </div>

    <div style="background:var(--bg3);border-radius:var(--radius);padding:16px 20px;margin-bottom:20px;display:flex;gap:12px;align-items:flex-start;">
      <div style="font-size:18px;margin-top:1px">🔒</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6">
        Your token is used once to deploy your site and is never stored. Your Cloudflare account stays under your full control. You can revoke this token anytime from your Cloudflare dashboard.
      </div>
    </div>

    <label style="display:block;font-size:13px;color:var(--text2);margin-bottom:8px;font-weight:500;">Paste Your Cloudflare API Token</label>
    <div class="token-input-row">
      <input type="password" id="cf-token" placeholder="Paste your token here..." style="margin:0;font-family:monospace;font-size:13px;" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      <button class="btn btn-gold" onclick="deployToCloudflare()" id="deploy-btn-go" style="width:auto;padding:14px 20px;flex-shrink:0;">Deploy My Site →</button>
    </div>
    <div id="token-error" style="display:none;color:#e05252;font-size:13px;margin-top:8px;"></div>

    <div id="deploy-status" style="margin-top:24px;display:none;">
      <div style="margin-bottom:12px;font-size:14px;font-weight:600">Deploying your site...</div>
      <div class="progress-step" id="ds-step1">
        <div class="step-icon" id="deploy-step-icon-1">⏳</div>
        <div class="step-text" id="deploy-step-text-1">Verifying your Cloudflare token</div>
      </div>
      <div class="progress-step" id="ds-step2" style="opacity:0.4">
        <div class="step-icon" id="deploy-step-icon-2">⏳</div>
        <div class="step-text" id="deploy-step-text-2">Creating your Pages project</div>
      </div>
      <div class="progress-step" id="ds-step3" style="opacity:0.4">
        <div class="step-icon" id="deploy-step-icon-3">⏳</div>
        <div class="step-text" id="deploy-step-text-3">Publishing your website files</div>
      </div>
    </div>

    <div id="deploy-success" style="margin-top:32px;display:none;text-align:center;">
      <div style="font-size:52px;margin-bottom:16px;">🎉</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:30px;margin-bottom:8px;">Your site is live.</h3>
      <p style="color:var(--text2);margin-bottom:8px;font-size:15px">Hosted on Cloudflare's global network. Free forever.</p>
      <p style="color:var(--text2);font-size:13px;margin-bottom:24px">You can connect a custom domain from your Cloudflare Pages dashboard anytime.</p>
      <a id="live-url" href="#" target="_blank" class="btn btn-gold" style="width:auto;padding:16px 32px;text-decoration:none;font-size:15px;">View Your Live Site →</a>
      <div style="margin-top:20px">
        <a id="pages-dashboard-url" href="#" target="_blank" style="font-size:13px;color:var(--text2);text-decoration:underline">Open Cloudflare Pages Dashboard to connect a custom domain</a>
      </div>
    </div>

  </div>
</div>

<!-- order bump removed -->

<!-- ══ SESSION LOADING OVERLAY ══ -->
<div class="session-loading" id="session-loading">
  <div id="loading-content">
    <div class="loading-spinner"></div>
    <div class="loading-message" id="loading-message"></div>
    <div class="loading-stage" id="loading-stage">Warming up</div>
    <div class="loading-progress"><div class="loading-progress-bar" id="loading-bar"></div></div>
  </div>
  <div class="loading-error" id="loading-error">
    <h3>Something went sideways</h3>
    <p id="loading-error-text">We hit a snag starting your session. This is almost certainly temporary.</p>
    <div class="error-detail" id="loading-error-detail"></div>
    <button class="btn btn-gold" onclick="dismissLoadingError()" style="width:auto;padding:14px 28px;">Try Again</button>
    <button class="btn btn-outline" onclick="window.location.reload()" style="width:auto;padding:14px 28px;margin-top:8px;">Refresh Page</button>
  </div>
</div>

<!-- ══ BLUEPRINT GENERATION OVERLAY ══ -->
<div class="blueprint-generating" id="blueprint-generating">
  <div class="blueprint-gen-icon">
    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
  </div>
  <div class="blueprint-gen-title" id="blueprint-gen-title">Building Your Blueprint</div>
  <div class="blueprint-gen-msg" id="blueprint-gen-msg">Synthesizing everything you shared into something you have never seen before...</div>
  <div class="blueprint-gen-progress"><div class="blueprint-gen-progress-bar" id="blueprint-gen-bar"></div></div>
  <div id="blueprint-gen-timer" style="font-size:12px;color:rgba(0,0,0,0.35);margin-top:16px;font-weight:500;letter-spacing:0.04em;">This typically takes 4 to 6 minutes. Grab a coffee.</div>
  <div id="blueprint-gen-retry" style="display:none;margin-top:24px;">
    <p style="color:rgba(0,0,0,0.5);font-size:14px;margin-bottom:12px;">This is taking longer than expected. Your conversation is saved.</p>
    <button onclick="retryBlueprint()" style="background:var(--gold,#C4703F);color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Try Again</button>
    <button onclick="dismissBlueprintOverlay()" style="background:transparent;border:1.5px solid rgba(0,0,0,0.15);padding:14px 28px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;margin-left:8px;color:rgba(0,0,0,0.6);">Go Back to Chat</button>
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
  uploadedKeys: [],
  blueprintOverlayShown: false
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
window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');
  const tier = params.get('tier');

  // Legacy flow: ?session=X&tier=Y from Stripe redirect
  if (sessionId && tier) {
    STATE.sessionId = sessionId;
    STATE.tier = tier;
    showScreen('intake');
  } else {
    // New auth flow: check dw_session token
    const token = localStorage.getItem('dw_session');
    if (token) {
      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
        const user = await res.json();
        if (user && user.id) {
          STATE.tier = user.tier || (user.role === 'admin' ? 'site' : 'blueprint');
          showScreen('intake');

          // Check for active session to resume
          try {
            const activeRes = await fetch('/api/user/active-session', {
              headers: { 'Authorization': 'Bearer ' + token }
            });
            const activeData = await activeRes.json();
            if (activeData.hasActiveSession && activeData.session) {
              showResumeBanner(activeData.session);
            }
          } catch(_) {}
        }
      } catch(e) {
        // Auth failed silently, show landing
      }
    }
  }

  // File upload setup
  setupFileUpload();

  // Voice input setup
  initVoiceInput();

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

// ── LOADING MESSAGES ──────────────────────────────────────
const LOADING_MESSAGES = [
  "Brewing something strong for your brand...",
  "Reading between your lines...",
  "Convincing the AI you are interesting (easy sell)...",
  "Sharpening the questions that matter...",
  "Preparing to ask things your therapist would charge double for...",
  "Loading 10,000 hours of brand strategy into 90 minutes...",
  "Finding the words you did not know you needed...",
  "Tuning the frequency to your specific flavor of genius...",
  "Almost there. The good stuff takes a second...",
  "Assembling the interview that will change how you see your business...",
  "Your brand is already forming. We just need to pull it out...",
  "Setting up a conversation you will actually enjoy having...",
  "Calibrating for depth. Shallow is for swimming pools...",
];

let loadingInterval = null;
let loadingMsgIndex = 0;

function showLoadingOverlay() {
  const overlay = document.getElementById('session-loading');
  const content = document.getElementById('loading-content');
  const error = document.getElementById('loading-error');
  const msgEl = document.getElementById('loading-message');
  const bar = document.getElementById('loading-bar');
  const stage = document.getElementById('loading-stage');

  content.style.display = '';
  error.style.display = 'none';
  overlay.classList.add('active');

  // Shuffle messages
  const shuffled = [...LOADING_MESSAGES].sort(() => Math.random() - 0.5);
  loadingMsgIndex = 0;
  msgEl.textContent = shuffled[0];
  bar.style.width = '5%';
  stage.textContent = 'Warming up';

  // Rotate messages every 3.5s
  loadingInterval = setInterval(() => {
    loadingMsgIndex = (loadingMsgIndex + 1) % shuffled.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = shuffled[loadingMsgIndex];
      msgEl.style.opacity = '1';
    }, 300);
  }, 3500);
}

function updateLoadingStage(stageName, progress) {
  const stage = document.getElementById('loading-stage');
  const bar = document.getElementById('loading-bar');
  if (stage) stage.textContent = stageName;
  if (bar) bar.style.width = progress + '%';
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('session-loading');
  overlay.classList.remove('active');
  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
}

function showLoadingError(title, message, detail) {
  const content = document.getElementById('loading-content');
  const error = document.getElementById('loading-error');
  const errorText = document.getElementById('loading-error-text');
  const errorDetail = document.getElementById('loading-error-detail');

  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
  content.style.display = 'none';
  error.style.display = '';
  if (title) error.querySelector('h3').textContent = title;
  if (message) errorText.textContent = message;
  if (detail) {
    errorDetail.textContent = detail;
    errorDetail.style.display = '';
  } else {
    errorDetail.style.display = 'none';
  }
}

function dismissLoadingError() {
  hideLoadingOverlay();
  const btn = document.getElementById('start-btn');
  btn.textContent = 'Begin My Deep Work Session';
  btn.disabled = false;
}

async function startSession() {
  const btn = document.getElementById('start-btn');

  // ── Validate inputs before starting ──
  const websiteVal = (document.getElementById('intake-website')?.value || '').trim();
  const linkedinVal = (document.getElementById('intake-linkedin')?.value || '').trim();
  const competitorsVal = (document.getElementById('intake-competitors')?.value || '').trim();

  // URL validation helper
  function isValidUrl(str) {
    if (!str) return true; // empty is fine (optional)
    try {
      const u = new URL(str.startsWith('http') ? str : 'https://' + str);
      return u.hostname.includes('.');
    } catch { return false; }
  }

  if (websiteVal && !isValidUrl(websiteVal)) {
    showToast('That website URL does not look right. Double check the format (e.g. https://yoursite.com).');
    document.getElementById('intake-website').focus();
    return;
  }

  if (linkedinVal && !isValidUrl(linkedinVal)) {
    showToast('That LinkedIn URL does not look right. It should look like https://linkedin.com/in/yourname.');
    document.getElementById('intake-linkedin').focus();
    return;
  }

  if (competitorsVal) {
    const urls = competitorsVal.split('\\n').filter(Boolean);
    if (urls.length > 3) {
      showToast('Please keep it to 3 competitor URLs or fewer.');
      document.getElementById('intake-competitors').focus();
      return;
    }
    for (const u of urls) {
      if (!isValidUrl(u.trim())) {
        showToast('One of your competitor URLs does not look right: ' + u.trim().slice(0, 40));
        document.getElementById('intake-competitors').focus();
        return;
      }
    }
  }

  // ── Start loading ──
  btn.textContent = 'Preparing...';
  btn.disabled = true;
  showLoadingOverlay();

  try {
    // ── Step 1: Upload files ──
    if (STATE.uploadedFiles.length > 0) {
      updateLoadingStage('Uploading your files', 10);

      // Generate session ID early if needed for uploads
      if (!STATE.sessionId) {
        STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      let uploadErrors = [];
      for (let i = 0; i < STATE.uploadedFiles.length; i++) {
        const file = STATE.uploadedFiles[i];
        updateLoadingStage('Uploading ' + file.name, 10 + Math.round((i / STATE.uploadedFiles.length) * 20));

        // File size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
          uploadErrors.push(file.name + ' is too large (max 10MB)');
          continue;
        }

        // File type check
        if (!file.type.startsWith('image/')) {
          uploadErrors.push(file.name + ' is not an image file');
          continue;
        }

        try {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('sessionId', STATE.sessionId);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);
          const r = await fetch('/api/upload', { method: 'POST', body: fd, signal: controller.signal });
          clearTimeout(timeout);

          if (!r.ok) {
            uploadErrors.push(file.name + ' failed to upload (server returned ' + r.status + ')');
            continue;
          }
          const d = await r.json();
          if (d.key) STATE.uploadedKeys.push(d.key);
          else uploadErrors.push(file.name + ' uploaded but got no key back');
        } catch (uploadErr) {
          if (uploadErr.name === 'AbortError') {
            uploadErrors.push(file.name + ' timed out after 30 seconds');
          } else {
            uploadErrors.push(file.name + ': ' + (uploadErr.message || 'upload failed'));
          }
        }
      }

      if (uploadErrors.length > 0 && uploadErrors.length === STATE.uploadedFiles.length) {
        showLoadingError(
          'File uploads failed',
          'None of your files could be uploaded. You can try again or skip the photos and continue without them.',
          uploadErrors.join('; ')
        );
        return;
      }

      if (uploadErrors.length > 0) {
        // Some succeeded, some failed. Continue but warn.
        showToast(uploadErrors.length + ' file(s) could not be uploaded. Continuing with the rest.');
      }
    }

    // ── Step 2: Generate session ID ──
    updateLoadingStage('Setting up your session', 35);
    if (!STATE.sessionId) {
      STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }

    // ── Step 3: Gather and validate intake data ──
    updateLoadingStage('Gathering your context', 45);
    const intakeData = {
      sessionId: STATE.sessionId,
      tier: STATE.tier || 'blueprint',
      existingWebsiteUrl: websiteVal,
      linkedinUrl: linkedinVal,
      competitorUrls: competitorsVal ? competitorsVal.split('\\n').map(s => s.trim()).filter(Boolean) : [],
      testimonials: (document.getElementById('intake-testimonials')?.value || '').trim(),
      uploadedKeys: STATE.uploadedKeys,
      phone: (document.getElementById('intake-phone')?.value || '').trim()
    };

    // ── Step 4: Start the session (the big one) ──
    updateLoadingStage('Starting your Deep Work session', 55);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

    const startHeaders = { 'Content-Type': 'application/json' };
    const authToken = localStorage.getItem('dw_session');
    if (authToken) startHeaders['Authorization'] = 'Bearer ' + authToken;

    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: startHeaders,
      body: JSON.stringify(intakeData),
      signal: controller.signal
    });

    clearTimeout(timeout);

    updateLoadingStage('Processing response', 80);

    if (!res.ok) {
      let errMsg = 'Server returned status ' + res.status;
      try {
        const errData = await res.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch (_) {
        try { errMsg = await res.text(); } catch (_) {}
      }

      if (res.status === 429) {
        showLoadingError(
          'Whoa, slow down',
          'Too many requests. Give it 30 seconds and try again. Your data is safe.',
          errMsg
        );
      } else if (res.status >= 500) {
        showLoadingError(
          'Server hiccup',
          'Something went wrong on our end. This is usually temporary. Your information has been saved.',
          errMsg
        );
      } else if (res.status === 401 || res.status === 403) {
        showLoadingError(
          'Session expired',
          'Your login session may have timed out. Try refreshing the page and logging in again.',
          errMsg
        );
      } else {
        showLoadingError(
          'Something went sideways',
          'We could not start your session right now. Here is what we know:',
          errMsg
        );
      }
      return;
    }

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      showLoadingError(
        'Unexpected response',
        'The server responded but we could not understand the response. Try again in a moment.',
        parseErr.message
      );
      return;
    }

    if (data.ok) {
      updateLoadingStage('Ready. Let us do this.', 100);
      STATE.sessionId = data.sessionId;

      // Persist session ID for resume
      localStorage.setItem('dw_active_session', data.sessionId);

      // Brief pause so user sees 100% before transition
      await new Promise(r => setTimeout(r, 600));
      hideLoadingOverlay();
      showScreen('app');
      appendMessage('ai', data.firstMessage);
      document.getElementById('msg-input')?.focus();

      // One-time voice hint on mobile
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
      if (isMobile && !localStorage.getItem('dw_voice_hint_seen')) {
        setTimeout(() => {
          showToast('Tip: tap the mic and just speak — most people find it easier than typing');
          localStorage.setItem('dw_voice_hint_seen', '1');
        }, 4000);
      }
    } else {
      showLoadingError(
        'Could not start session',
        data.error || 'Something unexpected happened. Your information is saved. Try again.',
        data.details || null
      );
    }

  } catch (e) {
    if (e.name === 'AbortError') {
      showLoadingError(
        'This is taking longer than expected',
        'The session start timed out after 60 seconds. This usually means the AI is under heavy load. Your data is safe. Try again in a minute.',
        null
      );
    } else if (!navigator.onLine) {
      showLoadingError(
        'You appear to be offline',
        'Check your internet connection and try again. Nothing has been lost.',
        null
      );
    } else {
      showLoadingError(
        'Connection issue',
        'We could not reach the server. This might be a temporary network issue. Try again.',
        e.message || null
      );
    }
  }
}

// ── SESSION RESUME ────────────────────────────────────────
let pendingResumeSessionId = null;

function showResumeBanner(sessionInfo) {
  const banner = document.getElementById('resume-banner');
  const meta = document.getElementById('resume-meta');
  if (!banner) return;

  pendingResumeSessionId = sessionInfo.id;

  const phase = sessionInfo.phase || 1;
  const msgCount = sessionInfo.messageCount || 0;
  const PHASE_LABELS = ['', 'Your Story', 'Your Expertise', 'Your Beliefs', 'Your People', 'Your Voice & Identity', 'Your Market', 'Your Offers', 'Synthesis'];
  const phaseName = PHASE_LABELS[phase] || 'Phase ' + phase;

  meta.textContent = 'Phase ' + phase + ' of 8: ' + phaseName + '  ·  ' + msgCount + ' messages so far';
  banner.style.display = '';

  // Store in localStorage for persistence
  localStorage.setItem('dw_active_session', sessionInfo.id);
}

function dismissResume() {
  const banner = document.getElementById('resume-banner');
  if (banner) banner.style.display = 'none';
  pendingResumeSessionId = null;
  localStorage.removeItem('dw_active_session');
}

async function resumeSession() {
  if (!pendingResumeSessionId) return;

  const btn = document.getElementById('resume-btn');
  btn.textContent = 'Loading...';
  btn.disabled = true;
  showLoadingOverlay();
  updateLoadingStage('Restoring your session', 30);

  const token = localStorage.getItem('dw_session');
  if (!token) {
    showLoadingError('Session expired', 'Please log in again to resume your session.', null);
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch('/api/session/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ sessionId: pendingResumeSessionId }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    updateLoadingStage('Rebuilding your conversation', 60);

    if (!res.ok) {
      let errMsg = 'Server returned ' + res.status;
      try { const d = await res.json(); errMsg = d.error || errMsg; } catch(_) {}

      if (res.status === 410) {
        showLoadingError('Session expired', 'Your session data has expired (sessions last 30 days). No worries, you can start a fresh session and the new one will be even better.', null);
        localStorage.removeItem('dw_active_session');
      } else {
        showLoadingError('Could not restore session', errMsg, null);
      }
      btn.textContent = 'Continue My Session';
      btn.disabled = false;
      return;
    }

    const data = await res.json();

    if (!data.ok || !data.messages || data.messages.length === 0) {
      showLoadingError('Empty session', 'This session has no conversation history. Starting fresh might be the way to go.', null);
      btn.textContent = 'Continue My Session';
      btn.disabled = false;
      return;
    }

    updateLoadingStage('Almost there', 85);

    // Restore state
    STATE.sessionId = data.sessionId;
    STATE.tier = data.tier || STATE.tier;
    STATE.phase = data.phase || 1;
    localStorage.setItem('dw_active_session', data.sessionId);

    // Switch to app screen
    showScreen('app');

    // Replay messages into the chat
    for (const msg of data.messages) {
      appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.content);
    }

    // Update phase dots
    updatePhase(data.phase);

    // If blueprint was generated, navigate directly to blueprint screen
    if (data.blueprintGenerated && data.blueprint) {
      STATE.blueprint = data.blueprint;
      updateLoadingStage('Your blueprint is ready.', 100);
      await new Promise(r => setTimeout(r, 800));
      hideLoadingOverlay();
      renderBlueprint(data.blueprint);
      showScreen('blueprint-screen');
      return;
    }

    updateLoadingStage('Welcome back.', 100);
    await new Promise(r => setTimeout(r, 600));
    hideLoadingOverlay();

    document.getElementById('msg-input')?.focus();
    scrollToBottom();

  } catch (e) {
    if (e.name === 'AbortError') {
      showLoadingError('Resume timed out', 'The server took too long. Try again in a moment.', null);
    } else {
      showLoadingError('Connection issue', 'Could not reach the server. Check your connection and try again.', e.message);
    }
    btn.textContent = 'Continue My Session';
    btn.disabled = false;
  }
}

// ── VOICE INPUT (Web Speech API) ─────────────────────────
window._voiceRecognition = null;
window._voiceIsRecording = false;
window._voiceFinalTranscript = '';

function initVoiceInput() {
  const btn = document.getElementById('voice-btn');
  if (!btn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    btn.classList.add('unsupported');
    btn.title = 'Voice not supported in this browser';
    return;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-US';
  rec.maxAlternatives = 1;

  rec.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        window._voiceFinalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    const input = document.getElementById('msg-input');
    if (input) {
      input.value = window._voiceFinalTranscript + interimTranscript;
      autoResize(input);
    }

    setVoiceStatus('Listening... (tap mic again to stop)');
  };

  rec.onend = () => {
    if (window._voiceIsRecording) {
      // Browser auto-stopped (timeout), restart
      try { rec.start(); } catch(_) { stopVoice(); }
    }
  };

  rec.onerror = (event) => {
    console.log('Voice error:', event.error);
    if (event.error === 'not-allowed') {
      setVoiceStatus('Microphone access denied. Check your browser permissions.');
      stopVoice();
    } else if (event.error === 'no-speech') {
      setVoiceStatus('No speech detected. Tap the mic and try again.');
      stopVoice();
    } else if (event.error === 'network') {
      setVoiceStatus('Network error. Voice needs an internet connection.');
      stopVoice();
    } else if (event.error !== 'aborted') {
      setVoiceStatus('Voice error: ' + event.error);
      stopVoice();
    }
  };

  window._voiceRecognition = rec;
  console.log('Voice input initialized successfully');
}

function toggleVoice() {
  // Lazy init if recognition was not set up
  if (!window._voiceRecognition) {
    initVoiceInput();
  }
  if (window._voiceIsRecording) {
    stopVoice();
  } else {
    startVoice();
  }
}

function startVoice() {
  if (!window._voiceRecognition) {
    showToast('Voice input is not supported in this browser. Try Chrome or Safari.');
    return;
  }

  const btn = document.getElementById('voice-btn');
  window._voiceIsRecording = true;
  window._voiceFinalTranscript = '';
  btn.classList.add('recording');
  setVoiceStatus('Listening... speak naturally');

  try {
    window._voiceRecognition.start();
  } catch (e) {
    if (e.message && e.message.includes('already started')) {
      // Already running, just update UI
    } else {
      console.log('Voice start error:', e.message);
      setVoiceStatus('Could not start microphone: ' + e.message);
      stopVoice();
    }
  }
}

function stopVoice() {
  const btn = document.getElementById('voice-btn');
  window._voiceIsRecording = false;
  if (btn) btn.classList.remove('recording');

  try { window._voiceRecognition?.stop(); } catch(_) {}

  const input = document.getElementById('msg-input');
  if (input && input.value.trim()) {
    setVoiceStatus('Got it. Review your answer and tap send, or keep talking.');
  } else {
    setVoiceStatus('');
  }

  // Clear status after 4 seconds
  setTimeout(() => {
    if (!window._voiceIsRecording) setVoiceStatus('');
  }, 4000);
}

function setVoiceStatus(text) {
  const el = document.getElementById('voice-status');
  if (el) el.textContent = text;
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
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 120000); // 2 min client timeout
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, message: text }),
      signal: controller.signal
    });
    clearTimeout(fetchTimeout);

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error('API error ' + res.status + ': ' + errBody.substring(0, 200));
    }

    removeTyping();
    const aiMsg = appendMessage('ai', '');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';
    let lastChunkTime = Date.now();
    let streamError = null;

    // Stall detector: if no data for 60s during streaming, abort
    const stallCheck = setInterval(() => {
      if (Date.now() - lastChunkTime > 60000) {
        clearInterval(stallCheck);
        reader.cancel();
      }
    }, 5000);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      lastChunkTime = Date.now();
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
              const displayText = fullText
                .replace(/METADATA:\\{.*\\}$/m, '')
                .replace(/\u0060\u0060\u0060json[\s\S]*?\u0060\u0060\u0060/g, '')
                .trim();
              updateBubble(aiMsg, displayText);
              scrollToBottom();
            } else if (ev.type === 'error') {
              streamError = ev.message || 'Something went wrong';
            } else if (ev.type === 'metadata') {
              updatePhase(ev.phase);
              if (ev.phase === 8 && !STATE.blueprintOverlayShown) {
                STATE.blueprintOverlayShown = true;
                showBlueprintGenerating();
              }
              if (ev.sessionComplete) {
                hideBlueprintGenerating();
                handleBlueprintReady(ev.blueprint);
              }
            }
          } catch (_) {}
        }
      }
    }
    clearInterval(stallCheck);

    // If the server sent an error event and no content was generated, show it
    if (streamError && !fullText.trim()) {
      updateBubble(aiMsg, streamError + ' Please try sending your message again.');
    } else if (!fullText.trim()) {
      updateBubble(aiMsg, 'No response received. Please try again.');
    }
  } catch (e) {
    removeTyping();
    const isTimeout = e.name === 'AbortError';
    const isStall = e.message && e.message.includes('cancel');
    if (STATE.blueprintOverlayShown) {
      hideBlueprintGenerating();
    }
    if (isTimeout || isStall) {
      appendMessage('ai', 'The response took too long. This can happen with complex questions. Please try sending your message again — your conversation is saved.');
    } else {
      appendMessage('ai', 'Something went wrong (' + (e.message || 'unknown error').substring(0, 100) + '). Please try again.');
    }
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

// ── THINKING MESSAGES (shown while waiting for Claude) ──
const THINKING_MESSAGES = {
  early: [
    "Thinking about what you just said...",
    "That was a good answer. Processing...",
    "Sitting with that for a second...",
    "Interesting. Let me dig into this...",
    "Connecting a few dots here...",
    "That tells me more than you think...",
  ],
  mid: [
    "Going deeper on this one...",
    "This is getting good. Hold on...",
    "Building on what you shared earlier...",
    "Pulling a thread you probably have not noticed yet...",
    "Your brand is starting to take shape...",
    "I am seeing a pattern forming...",
    "This is the part most people rush through. Not us...",
  ],
  late: [
    "We are in the home stretch now...",
    "Almost ready to show you something amazing...",
    "Putting the finishing touches on this thought...",
    "The best insights always take an extra beat...",
    "What you have shared so far is really strong...",
    "One more second. This one is worth the wait...",
  ],
  blueprint_early: [
    "Reading back through everything you shared...",
    "This is the part where everything comes together...",
    "Reviewing your story, your people, and your positioning...",
    "The AI is re-reading your entire conversation from the start...",
    "Every answer you gave is being analyzed for patterns...",
    "Identifying the through-line in your brand story...",
  ],
  blueprint_mid: [
    "Building your brand foundation, offer suite, and positioning...",
    "Turning your conversation into a comprehensive strategy document...",
    "Designing your complete brand identity and offer structure...",
    "Creating something you have genuinely never seen before...",
    "Packaging your genius into a format that actually works...",
    "Crafting your positioning statements and key messaging...",
    "Structuring your offer ladder: entry, core, and premium...",
    "Writing headlines that will stop your ideal client mid scroll...",
  ],
  blueprint_late: [
    "Every insight you shared is being woven into this...",
    "Polishing the final details of your blueprint...",
    "Running quality checks on your brand strategy...",
    "Making sure nothing you said was left on the table...",
    "Your blueprint is going to be worth every minute you invested...",
    "Finalizing your 7 part brand strategy document...",
  ]
};

let thinkingInterval = null;
let thinkingProgressInterval = null;
let thinkingStartTime = null;

function getThinkingPool() {
  const phase = STATE.phase || 1;
  if (phase >= 7) return THINKING_MESSAGES.late;
  if (phase >= 4) return THINKING_MESSAGES.mid;
  return THINKING_MESSAGES.early;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing';

  const pool = getThinkingPool();
  const firstMsg = pool[Math.floor(Math.random() * pool.length)];

  div.innerHTML = \`
    <div class="avatar ai">JG</div>
    <div class="thinking-bubble">
      <div class="thinking-progress"><div class="thinking-progress-bar" id="thinking-bar"></div></div>
      <div class="thinking-dots"><span></span><span></span><span></span></div>
      <div class="thinking-msg" id="thinking-msg">\${firstMsg}</div>
    </div>
  \`;
  msgs.appendChild(div);
  scrollToBottom();

  thinkingStartTime = Date.now();

  // Animate progress bar
  setTimeout(() => {
    const bar = document.getElementById('thinking-bar');
    if (bar) bar.style.width = '70%';
  }, 200);

  // Rotate messages every 4s
  thinkingInterval = setInterval(() => {
    const msgEl = document.getElementById('thinking-msg');
    if (!msgEl) return;
    const currentPool = getThinkingPool();
    const msg = currentPool[Math.floor(Math.random() * currentPool.length)];
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = msg;
      msgEl.style.opacity = '1';
    }, 350);
  }, 4000);
}

function removeTyping() {
  if (thinkingInterval) { clearInterval(thinkingInterval); thinkingInterval = null; }
  const el = document.getElementById('typing');
  if (el) {
    const bar = el.querySelector('.thinking-progress-bar');
    if (bar) bar.style.width = '100%';
    setTimeout(() => el.remove(), 200);
  }
}

// ── BLUEPRINT GENERATION OVERLAY ──
let blueprintGenInterval = null;

function showBlueprintGenerating() {
  const overlay = document.getElementById('blueprint-generating');
  const msgEl = document.getElementById('blueprint-gen-msg');
  const bar = document.getElementById('blueprint-gen-bar');
  const title = document.getElementById('blueprint-gen-title');
  const timerEl = document.getElementById('blueprint-gen-timer');

  overlay.classList.add('active');
  const startTime = Date.now();

  // 3 phases of messages mapped to the actual timeline
  const earlyMsgs = [...THINKING_MESSAGES.blueprint_early].sort(() => Math.random() - 0.5);
  const midMsgs = [...THINKING_MESSAGES.blueprint_mid].sort(() => Math.random() - 0.5);
  const lateMsgs = [...THINKING_MESSAGES.blueprint_late].sort(() => Math.random() - 0.5);
  let msgIdx = 0;
  let currentPool = earlyMsgs;
  msgEl.textContent = earlyMsgs[0];

  // Progress: paced for ~6 min total
  // 0-2 min: 0% to 30% (reading/analyzing)
  // 2-4 min: 30% to 65% (building)
  // 4-6 min: 65% to 90% (polishing)
  // 6+ min: 90% to 95% (slow crawl)
  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    let progress;
    if (elapsed < 120) {
      progress = (elapsed / 120) * 30;
      if (currentPool !== earlyMsgs) { currentPool = earlyMsgs; msgIdx = 0; }
      title.textContent = 'Reading Your Conversation';
    } else if (elapsed < 240) {
      progress = 30 + ((elapsed - 120) / 120) * 35;
      if (currentPool !== midMsgs) { currentPool = midMsgs; msgIdx = 0; }
      title.textContent = 'Crafting Your Strategy';
    } else if (elapsed < 360) {
      progress = 65 + ((elapsed - 240) / 120) * 25;
      if (currentPool !== lateMsgs) { currentPool = lateMsgs; msgIdx = 0; }
      title.textContent = 'Polishing the Details';
    } else {
      progress = Math.min(90 + (elapsed - 360) / 60, 97);
      title.textContent = 'Finishing Up';
    }
    bar.style.width = progress + '%';

    // Update timer
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    const timeStr = mins > 0 ? mins + 'm ' + secs + 's' : secs + 's';
    if (elapsed < 30) {
      timerEl.textContent = 'This typically takes 4 to 6 minutes. Grab a coffee.';
    } else {
      timerEl.textContent = timeStr + ' elapsed — your blueprint is being crafted with care';
    }
  }, 1000);

  // Rotate messages every 6s (slower for longer wait)
  blueprintGenInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % currentPool.length;
    msgEl.style.opacity = '0';
    setTimeout(() => {
      msgEl.textContent = currentPool[msgIdx];
      msgEl.style.opacity = '1';
    }, 400);
  }, 6000);

  overlay._progressInterval = progressInterval;

  // Show retry button after 8 minutes
  overlay._retryTimeout = setTimeout(() => {
    const retryEl = document.getElementById('blueprint-gen-retry');
    if (retryEl) retryEl.style.display = '';
    title.textContent = 'Taking Longer Than Expected';
    msgEl.textContent = 'Your conversation is saved. You can try again or go back.';
  }, 480000);
}

function retryBlueprint() {
  hideBlueprintGenerating();
  STATE.blueprintOverlayShown = false;
  // Re-send the last user message to trigger blueprint generation again
  const lastUserMsg = (STATE.messages || []).filter(m => m.role === 'user').pop();
  if (lastUserMsg) {
    document.getElementById('msg-input').value = lastUserMsg.content || 'Please generate my blueprint now.';
  } else {
    document.getElementById('msg-input').value = 'Please generate my blueprint now.';
  }
  sendMessage();
}

function dismissBlueprintOverlay() {
  hideBlueprintGenerating();
  STATE.blueprintOverlayShown = false;
  showToast('Back to chat. Your conversation is saved.');
}

function hideBlueprintGenerating() {
  const overlay = document.getElementById('blueprint-generating');
  const bar = document.getElementById('blueprint-gen-bar');
  const title = document.getElementById('blueprint-gen-title');
  const retryEl = document.getElementById('blueprint-gen-retry');

  if (blueprintGenInterval) { clearInterval(blueprintGenInterval); blueprintGenInterval = null; }
  if (overlay._progressInterval) { clearInterval(overlay._progressInterval); }
  if (overlay._retryTimeout) { clearTimeout(overlay._retryTimeout); }
  if (retryEl) retryEl.style.display = 'none';

  // Finish the bar
  if (bar) bar.style.width = '100%';
  if (title) title.textContent = 'Your Blueprint is Ready';

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 1200);
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
function showPhaseComplete(completedPhase) {
  if (completedPhase < 1 || completedPhase > 7) return;
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'phase-complete-banner';
  div.innerHTML = \`
    <div class="phase-complete-inner">
      <div class="phase-complete-check">✓</div>
      <div>
        <div class="phase-complete-label">Phase \${completedPhase} Complete</div>
        <div class="phase-complete-name">\${PHASE_NAMES[completedPhase]}</div>
      </div>
      <div class="phase-complete-progress">\${completedPhase} of 7</div>
    </div>
  \`;
  msgs.appendChild(div);
  scrollToBottom();
}

function updatePhase(phase) {
  if (!phase || phase === STATE.phase) return;

  const oldPhase = STATE.phase;

  // Show phase completion banner when transitioning forward
  if (phase > oldPhase && oldPhase > 0) {
    showPhaseComplete(oldPhase);
  }

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

  // Show order bump only for blueprint-tier users (not for site-tier who already have SIS)
  if (STATE.tier !== 'site') {
    setTimeout(() => {
      document.getElementById('order-bump').style.display = 'flex';
    }, 2000);
  }

  // After a moment, transition to blueprint screen
  setTimeout(() => {
    renderBlueprint(blueprint);
    showScreen('blueprint-screen');
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
    \${b.part5 ? renderPart(5, b.part5.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Hero Headlines</div>
        <div class="bp-item-value">\${b.part5.heroHeadlines.map((h,i) => \`\${i+1}. \${h}\`).join('<br><br>')}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Hero Subheadline</div>
        <div class="bp-item-value">\${b.part5.heroSubheadline}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Primary CTA</div>
        <div class="bp-item-value" style="font-weight:600;color:var(--gold)">\${b.part5.heroCTA}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Page Sections (in order)</div>
        <div class="bp-item-value">
          \${b.part5.sections.map((s,i) => \`
            <div style="margin-bottom:14px">
              <strong>\${i+1}. \${s.name}</strong><br>
              <span style="color:var(--text2);font-size:13px">\${s.purpose}</span><br>
              <span style="font-size:13px">\${s.content || ''}</span>
            </div>
          \`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Testimonial Framing</div>
        <div class="bp-item-value">\${b.part5.testimonialFraming}</div>
      </div>
    \`) : ''}
    \${b.part6 ? renderPart(6, b.part6.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Credibility Gaps to Close</div>
        <div class="bp-item-value">
          \${b.part6.credibilityGaps.map((g,i) => \`<div style="margin-bottom:12px"><strong>\${i+1}.</strong> \${g}</div>\`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Marketing Opportunities</div>
        <div class="bp-item-value">
          \${b.part6.marketingOpportunities.map((m,i) => \`<div style="margin-bottom:12px"><strong>\${i+1}.</strong> \${m}</div>\`).join('')}
        </div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Your First Move</div>
        <div class="bp-item-value" style="font-style:italic;font-size:15px;line-height:1.7">\${b.part6.firstMove}</div>
      </div>
    \`) : ''}
    \${renderPart(7, b.part7.title, \`
      <div class="bp-item">
        <div class="bp-item-label">Top 10 Headlines</div>
        <div class="bp-item-value">\${b.part7.heroHeadlineOptions.map((h,i) => \`\${i+1}. \${h}\`).join('<br><br>')}</div>
      </div>
      <div class="bp-item">
        <div class="bp-item-label">Positioning Statements</div>
        <div class="bp-item-value">
          \${b.part7.positioningStatements ? \`
            <strong>Website:</strong> \${b.part7.positioningStatements.website || ''}<br><br>
            <strong>Social / Bio:</strong> \${b.part7.positioningStatements.social || ''}<br><br>
            <strong>In Person:</strong> \${b.part7.positioningStatements.inPerson || ''}
          \` : ''}
        </div>
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

// ── ORDER BUMP UPGRADE ─────────────────────────────────────
async function addSiteUpgrade() {
  document.getElementById('order-bump').style.display = 'none';
  // Initiate Stripe checkout for site upgrade
  const token = localStorage.getItem('dw_session');
  const resp = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ tier: 'site', sessionId: STATE.sessionId })
  });
  const data = await resp.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Could not start checkout. Please try again.');
  }
}

function handleBuildSite() {
  if (STATE.tier === 'site') {
    proceedToSite();
  } else {
    addSiteUpgrade();
  }
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
  const errEl = document.getElementById('token-error');
  errEl.style.display = 'none';

  if (!token) {
    errEl.textContent = 'Please paste your Cloudflare API token before clicking Deploy.';
    errEl.style.display = 'block';
    return;
  }
  if (token.length < 20) {
    errEl.textContent = 'That doesn\u2019t look like a valid token. Cloudflare tokens are usually 40+ characters.';
    errEl.style.display = 'block';
    return;
  }

  document.getElementById('deploy-btn-go').disabled = true;
  document.getElementById('deploy-btn-go').textContent = 'Deploying...';
  document.getElementById('deploy-status').style.display = 'block';
  setDeployStep(1, 'active');

  try {
    setDeployStep(2, 'active');
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, cfToken: token })
    });
    const data = await res.json();

    if (data.url) {
      setDeployStep(1, 'done'); setDeployStep(2, 'done'); setDeployStep(3, 'done');
      document.getElementById('deploy-status').style.display = 'none';
      document.getElementById('deploy-success').style.display = 'block';
      document.getElementById('live-url').href = data.url;
      document.getElementById('live-url').textContent = data.url;
      // Link to pages dashboard
      const accountIdMatch = data.url.match(/pages\.dev/);
      document.getElementById('pages-dashboard-url').href = 'https://dash.cloudflare.com/pages';
    } else {
      // Specific error guidance
      document.getElementById('deploy-btn-go').disabled = false;
      document.getElementById('deploy-btn-go').textContent = 'Try Again →';
      document.getElementById('deploy-status').style.display = 'none';
      let errMsg = data.error || 'Deployment failed.';
      if (errMsg.toLowerCase().includes('auth') || errMsg.toLowerCase().includes('token') || errMsg.toLowerCase().includes('10000')) {
        errMsg = 'Token was rejected by Cloudflare. Double-check that you copied the full token and that it includes Cloudflare Pages: Edit permission.';
      } else if (errMsg.toLowerCase().includes('already exists') || errMsg.toLowerCase().includes('8000000')) {
        errMsg = 'A site with that name already exists in your Cloudflare account. Your site was still deployed \u2014 check your Cloudflare Pages dashboard.';
      }
      errEl.textContent = errMsg;
      errEl.style.display = 'block';
    }
  } catch (e) {
    document.getElementById('deploy-btn-go').disabled = false;
    document.getElementById('deploy-btn-go').textContent = 'Try Again →';
    document.getElementById('deploy-status').style.display = 'none';
    errEl.textContent = 'Network error. Please check your internet connection and try again.';
    errEl.style.display = 'block';
  }
}

function setDeployStep(num, state) {
  const icon = document.getElementById('deploy-step-icon-' + num);
  const row = document.getElementById('ds-step' + num);
  if (!icon || !row) return;
  if (state === 'active') {
    row.style.opacity = '1';
    icon.textContent = '\u23F3';
    icon.className = 'step-icon active';
  } else if (state === 'done') {
    icon.textContent = '\u2713';
    icon.className = 'step-icon done';
  }
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
  showToast('Building your brand guide...');
  try {
    const res = await fetch('/api/blueprint/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    if (!res.ok) throw new Error('Server error');
    const html = await res.text();
    // Open in a new tab — the HTML auto-triggers window.print() for Save as PDF
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const tab = window.open(url, '_blank');
    if (!tab) {
      // If popup blocked, fall back to download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'brand-guide.html';
      a.click();
      showToast('Brand guide downloaded. Open it to print as PDF.');
    } else {
      showToast('Brand guide opening — use Print → Save as PDF');
    }
  } catch (e) {
    showToast('Brand guide generation failed. Please try again.');
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
