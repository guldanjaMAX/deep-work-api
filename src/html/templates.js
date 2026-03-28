// ================================================================
// WARNING: TWO-LEVEL ESCAPING RULES — READ BEFORE EDITING
// ================================================================
// This file generates HTML pages with embedded <script> blocks.
// String content inside those <script> blocks follows TWO levels of escaping:
//
// TEMPLATE LEVEL (this file)   →   BROWSER JS LEVEL (what browser receives)
// \\n  (backslash + n)         →   \n   (valid JS newline escape)
// \n   (actual newline char)   →   newline char = SyntaxError in JS string!
// \\'  (backslash-apostrophe)  →   \'   (escaped apostrophe, string continues)
// \'   (bare apostrophe)       →   '    (string delimiter = string closes!)
//
// RULE: Inside any single/double-quoted JS string within a <script> block:
//   - Newlines: use \\n (not actual line breaks)
//   - Apostrophes in single-quoted strings: use \\'
//   - Double quotes in double-quoted strings: use \\"
//
// These rules caused a production SyntaxError that broke the entire app.
// ================================================================
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

  /* \u2500\u2500 LANDING PAGE (welcome for authenticated users) \u2500\u2500 */
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

  /* \u2500\u2500 INTAKE SCREEN \u2500\u2500 */
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

  .step-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #fff5ee, #ffe8d6);
    border: 1.5px solid rgba(196,112,63,.22);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    flex-shrink: 0;
  }
  .step-icon svg {
    width: 26px;
    height: 26px;
    color: #c4703f;
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

  /* Nudge card (phone input) */
  .nudge-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: linear-gradient(135deg, #faf7f4 0%, #f5f0eb 100%);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 20px 24px;
    margin: 8px auto 24px;
    max-width: 640px;
  }
  .nudge-icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .nudge-content {
    flex: 1;
    min-width: 0;
  }
  .nudge-text {
    margin-bottom: 12px;
  }
  .nudge-title {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }
  .nudge-desc {
    display: block;
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
  }
  .nudge-input-wrap {
    max-width: 280px;
  }
  .nudge-input {
    width: 100%;
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin: 0;
  }
  .nudge-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.1);
  }
  .nudge-input::placeholder {
    color: var(--text3);
  }
  @media (max-width: 600px) {
    .nudge-card {
      padding: 16px 18px;
    }
    .nudge-input-wrap {
      max-width: 100%;
    }
  }

  input[type="text"], input[type="email"], input[type="url"], input[type="tel"], input[type="password"], textarea {
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

  #loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 480px;
  }

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
    /* \u2500\u2500 INTAKE: strip the wall of text \u2014 show title + input only \u2500\u2500 */
    .intake-hero { padding: 28px 16px 20px; }
    .intake-hero > p { font-size: 15px; margin-bottom: 20px; }
    .promise-strip { gap: 10px; }
    .promise-item { font-size: 12px; }
    .promise-item .promise-icon { width: 26px; height: 26px; font-size: 13px; }

    /* The big fix: hide long copy on mobile \u2014 inputs speak for themselves */
    .step-why { display: none; }
    .step-impact { display: none; }
    .step-card-header { padding: 18px 18px 0; }
    .step-card-body { padding: 10px 18px 18px; }
    .step-card h3 { font-size: 16px; margin-bottom: 0; }
    .step-card { margin-bottom: 10px; border-radius: 14px; }
    .step-number { width: 24px; height: 24px; font-size: 11px; margin-bottom: 8px; }
    .intake-steps { padding: 12px 14px 0; }

    /* Sticky begin button \u2014 always reachable without scrolling to the bottom */
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

  /* \u2500\u2500 APP SCREEN \u2500\u2500 */
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

  /* \u2500\u2500 BLUEPRINT SCREEN \u2500\u2500 */
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

  /* \u2500\u2500 SITE GENERATION SCREEN \u2500\u2500 */
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

  /* \u2500\u2500 CF DEPLOY SCREEN \u2500\u2500 */
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

  /* \u2500\u2500 ORDER BUMP \u2500\u2500 */
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

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Reaction buttons */
  .reaction-btn {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 16px 28px; border-radius: var(--radius); border: 2px solid var(--border);
    background: #fff; cursor: pointer; transition: all 0.2s ease;
    min-width: 120px;
  }
  .reaction-btn:hover {
    border-color: var(--gold); background: rgba(196,112,63,0.04);
    transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .reaction-btn:active { transform: translateY(0); }
  .reaction-btn.selected {
    border-color: var(--gold); background: rgba(196,112,63,0.08);
    box-shadow: 0 0 0 3px rgba(196,112,63,0.15);
  }
  .reaction-icon { font-size: 28px; }
  .reaction-label { font-size: 13px; font-weight: 600; color: var(--text); }

  /* Refinement cards */
  .refine-grid {
    display: flex; flex-direction: column; gap: 10px;
  }
  .refine-card {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; border-radius: var(--radius); border: 1px solid var(--border);
    background: #fff; cursor: pointer; transition: all 0.2s ease;
  }
  .refine-card:hover {
    border-color: var(--gold); background: rgba(196,112,63,0.03);
    box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px);
  }
  .refine-card-icon { font-size: 24px; flex-shrink: 0; }
  .refine-card-body { flex: 1; text-align: left; }
  .refine-card-title { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
  .refine-card-desc { font-size: 13px; color: var(--text2); line-height: 1.4; }
  .refine-card-arrow { font-size: 18px; color: var(--text2); flex-shrink: 0; }

  /* Refine option pills */
  .refine-option {
    display: inline-block; padding: 10px 18px; border-radius: 24px;
    border: 1.5px solid var(--border); background: #fff; cursor: pointer;
    font-size: 14px; transition: all 0.2s ease; margin: 4px;
  }
  .refine-option:hover { border-color: var(--gold); background: rgba(196,112,63,0.04); }
  .refine-option.selected { border-color: var(--gold); background: rgba(196,112,63,0.1); font-weight: 600; }

  /* Celebration confetti */
  @keyframes confettiFall {
    0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .confetti-piece {
    position: fixed; width: 10px; height: 10px; top: -10px; z-index: 9999;
    animation: confettiFall 3s ease-in forwards;
  }

  /* Refine spinner */
  @keyframes refine-spin { to { transform: rotate(360deg); } }
  .refine-spinner {
    display: inline-block; width: 18px; height: 18px;
    border: 2px solid var(--border); border-top-color: var(--gold);
    border-radius: 50%; animation: refine-spin 0.8s linear infinite;
    vertical-align: middle; margin-right: 8px;
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

  /* \u2500\u2500 IMAGE GALLERY \u2500\u2500 */
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

  /* \u2500\u2500 PHASE COMPLETION BANNER \u2500\u2500 */
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

  /* \u2500\u2500 TOAST \u2500\u2500 */
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

  /* \u2500\u2500 UTILS \u2500\u2500 */
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

  /* \u2500\u2500 HELP WIDGET \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  #help-btn {
    position: fixed; bottom: 90px; right: 20px;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg); border: 1.5px solid var(--border2);
    color: var(--text2); font-size: 15px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 14px rgba(0,0,0,0.14); z-index: 998;
    transition: all 0.22s; font-family: 'Inter', sans-serif;
  }
  #help-btn:hover { background: var(--text); color: #fff; border-color: var(--text); transform: scale(1.08); }
  #help-panel {
    position: fixed; top: 0; right: 0; width: 340px; height: 100vh;
    background: var(--bg); border-left: 1px solid var(--border);
    box-shadow: -4px 0 40px rgba(0,0,0,0.12); z-index: 1000;
    display: flex; flex-direction: column;
    transform: translateX(360px);
    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden;
  }
  #help-panel.open { transform: translateX(0); }
  #help-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.28); z-index: 999; cursor: pointer; }
  #help-overlay.open { display: block; }
  .help-hdr { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 20px 18px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .help-hdr-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
  .help-hdr-sub { font-size: 12px; color: var(--text3); }
  .help-close-btn {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--bg2); color: var(--text3);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 13px; transition: all 0.2s; flex-shrink: 0;
  }
  .help-close-btn:hover { background: var(--text); color: #fff; border-color: var(--text); }
  .help-body { flex: 1; overflow-y: auto; padding-bottom: 8px; scrollbar-width: thin; scrollbar-color: var(--border2) transparent; }
  .help-sec { padding: 16px 20px 8px; }
  .help-sec-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text3); margin-bottom: 10px; }
  .help-faq { margin-bottom: 2px; }
  .help-faq-q {
    width: 100%; text-align: left; background: none;
    border: none; border-bottom: 1px solid var(--border);
    padding: 11px 0; font-size: 13px; font-weight: 500; color: var(--text);
    cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    gap: 8px; font-family: 'Inter', sans-serif; line-height: 1.4; transition: color 0.15s;
  }
  .help-faq-q:hover { color: var(--gold); }
  .help-faq-arrow { font-size: 9px; color: var(--text3); transition: transform 0.2s; flex-shrink: 0; }
  .help-faq.open .help-faq-arrow { transform: rotate(180deg); }
  .help-faq-a { display: none; font-size: 13px; color: var(--text2); line-height: 1.75; padding: 10px 0 14px; border-bottom: 1px solid var(--border); }
  .help-faq.open .help-faq-a { display: block; }
  .help-divider { height: 1px; background: var(--border); margin: 8px 20px 4px; }
  .help-restart { margin: 10px 16px 4px; padding: 16px; background: var(--bg2); border-radius: 12px; border: 1px solid var(--border); }
  .help-restart-title { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .help-restart-desc { font-size: 12px; color: var(--text3); line-height: 1.65; margin-bottom: 12px; }
  .help-restart-btn {
    width: 100%; padding: 10px 16px; border-radius: 50px;
    border: 1.5px solid var(--border2); background: transparent; color: var(--text2);
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;
  }
  .help-restart-btn:hover { border-color: #e05252; color: #e05252; background: rgba(224,82,82,0.04); }
  .help-confirm-box { display: none; }
  .help-confirm-box.show { display: block; }
  .help-confirm-txt { font-size: 13px; color: var(--text); line-height: 1.65; margin-bottom: 12px; }
  .help-confirm-row { display: flex; gap: 8px; }
  .help-confirm-yes { flex: 1; padding: 9px 14px; border-radius: 50px; border: none; background: #e05252; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity 0.2s; }
  .help-confirm-yes:disabled { opacity: 0.6; cursor: default; }
  .help-confirm-no { flex: 1; padding: 9px 14px; border-radius: 50px; border: 1.5px solid var(--border2); background: transparent; color: var(--text2); font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; }
  .help-ftr { padding: 16px 20px; border-top: 1px solid var(--border); flex-shrink: 0; }
  .help-ftr-lbl { font-size: 11px; color: var(--text3); margin-bottom: 8px; }
  .help-email-cta { display: block; width: 100%; padding: 10px 16px; border-radius: 50px; border: 1.5px solid var(--border2); background: transparent; color: var(--text); font-size: 13px; font-weight: 500; text-align: center; text-decoration: none; transition: all 0.2s; margin-bottom: 6px; }
  .help-email-cta:hover { border-color: var(--gold); color: var(--gold); }
  .help-ftr-note { font-size: 11px; color: var(--text3); text-align: center; }
  @media (max-width: 600px) {
    #help-panel { width: 100%; transform: translateX(100%); }
    #help-btn { bottom: 90px; right: 16px; }
  }
  /* Mobile: hide doc upload, keep only photo button */
  @media (max-width: 600px) {
    #doc-upload-btn { display: none !important; }
    .tool-btn { padding: 6px 10px; font-size: 13px; }
    .input-tools { gap: 4px; }
    #doc-upload-status { font-size: 12px; padding: 6px 12px; }
  }
</style>
</head>
<body>

<!-- \u2550\u2550 LANDING SCREEN (fallback for unauthenticated) \u2550\u2550 -->
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

<!-- \u2550\u2550 INTAKE SCREEN \u2550\u2550 -->
<div id="intake" class="screen">

  <!-- Hero section -->
  <div class="intake-hero">
    <div class="eyebrow">Your Session Is Ready</div>
    <h2>Let&rsquo;s Build Something<br><em>Only You</em> Could Build</h2>
    <p>Eight conversations. One complete brand blueprint. Built around who you actually are \u2014 not a template, not a formula. The real thing.</p>
    <div class="promise-strip">
      <div class="promise-item">
        <div class="promise-icon">\u2726</div>
        <span>8 short conversations</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">\u{1F4C4}</div>
        <span>Complete brand blueprint</span>
      </div>
      <div class="promise-item">
        <div class="promise-icon">\u{1F3AF}</div>
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
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-2.5 3-4 5.8-4 9s1.5 6 4 9M12 3c2.5 3 4 5.8 4 9s-1.5 6-4 9"/></svg></div>
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
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12v5M8 8.5v.1M12 17v-5c0-1.5 1-2.5 2.5-2.5S17 10 17 12v5"/></svg></div>
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
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/></svg></div>
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
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r=".5" fill="currentColor"/><circle cx="12" cy="10" r=".5" fill="currentColor"/><circle cx="15" cy="10" r=".5" fill="currentColor"/></svg></div>
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
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <h3>Put a Face to the Brand</h3>
        <p class="step-why">People buy from people. Your headshot, your team, your workspace, your product in action. These images tell a story that words alone cannot. Upload anything that represents you or your work. The AI will use these to understand your visual identity and, if you chose the website package, to build a site that actually looks and feels like you.</p>
        <p class="step-impact">Visuals make your blueprint and website uniquely, unmistakably yours.</p>
      </div>
      <div class="step-card-body">
        <div class="upload-zone" id="upload-zone">
          <input type="file" id="file-input" multiple accept="image/*">
          <div class="upload-icon">\u{1F4F7}</div>
          <p>Drag photos here or click to browse</p>
          <span>JPG, PNG, WebP up to 10MB each (up to 10 files)</span>
        </div>
        <div class="uploaded-files" id="uploaded-files"></div>
      </div>
    </div>

    <!-- Step 6: Documents -->
    <div class="step-card">
      <div class="step-card-header">
        <div class="step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
        <h3>Your Story So Far</h3>
        <p class="step-why">Maybe you have been journaling about this for months. Maybe you wrote a business plan, a manifesto, notes on your phone at 2am, a Google Doc you keep coming back to. Whatever it is, upload it here. The AI will read every word before your session begins, so it already understands your journey and where your thinking has been heading. Nothing is too rough or too raw.</p>
        <p class="step-impact">Your past thinking becomes the foundation for deeper, more personal strategy.</p>
      </div>
      <div class="step-card-body">
        <div class="upload-zone" id="doc-upload-zone">
          <input type="file" id="doc-file-input" multiple accept=".pdf,.txt,.md,.doc,.docx">
          <div class="upload-icon">\u{1F4DD}</div>
          <p>Drag documents here or click to browse</p>
          <span>PDF, Word, TXT up to 5MB each (up to 5 files)</span>
        </div>
        <div class="uploaded-files" id="uploaded-docs"></div>
      </div>
    </div>

  </div>


  <!-- Consent -->
  <div class="consent-block" style="margin:24px auto 0;max-width:580px;text-align:left;">
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;color:#555;line-height:1.6;">
      <input type="checkbox" id="consent-check" style="margin-top:4px;min-width:18px;min-height:18px;accent-color:#C4703F;">
      <span>I understand that this session is conducted by an AI and that my responses will be processed to generate my brand blueprint. I agree to the <a href="/privacy" target="_blank" style="color:#C4703F;">Privacy Policy</a> and <a href="/terms" target="_blank" style="color:#C4703F;">Terms of Service</a>.</span>
    </label>
    <p id="consent-error" style="display:none;color:#c0392b;font-size:12px;margin-top:6px;margin-left:28px;">Please check the box above to continue.</p>
  </div>

  <!-- CTA -->
  <div class="intake-cta">
    <button class="btn btn-gold" onclick="startSession()" id="start-btn">Begin My Deep Work Session</button>
    <p class="intake-reassurance"><strong>Everything above is optional.</strong> You can skip any step and jump right in. But every detail you share makes your blueprint sharper, more personal, and more powerful. This is the difference between generic advice and a strategy built on the truth of who you are.</p>
  </div>

</div>

<!-- \u2550\u2550 APP SCREEN \u2550\u2550 -->
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
      <button class="tool-btn" onclick="openUploadModal()">\u{1F4CE} Add photos</button>
      <button class="tool-btn" id="doc-upload-btn" onclick="openDocUpload()">\u{1F4C4} Upload document</button>
      <button class="tool-btn" id="images-btn" onclick="generateBrandImages()" style="display:none">\u2728 Generate brand images</button>
      <input type="file" id="doc-upload-input" accept=".pdf,.txt,.md" style="display:none" onchange="handleDocUpload(this)">
    </div>
    <div id="doc-upload-status" style="display:none;padding:8px 16px;font-size:13px;color:var(--text2);background:var(--bg2);border-radius:8px;margin-top:6px;"></div>
  </div>
</div>

<!-- \u2550\u2550 BLUEPRINT SCREEN \u2550\u2550 -->
<div id="blueprint-screen" class="screen">
  <div class="blueprint-header">
    <div class="eyebrow">Session Complete</div>
    <h2 id="bp-name">Your Brand Blueprint</h2>
    <p>Your complete brand foundation, ready to build on.</p>
  </div>
  <div id="strategist-debrief" style="display:none;max-width:720px;margin:0 auto;padding:32px 40px 8px;"></div>
  <div class="blueprint-actions" style="flex-direction:column;align-items:center;gap:16px;padding:28px 40px;">
    <button class="btn btn-gold" id="build-site-btn" onclick="handleBuildSite()" style="width:auto;padding:18px 40px;font-size:17px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);letter-spacing:0.02em;">Make This Real</button>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
      <button class="btn btn-outline" onclick="downloadPDF()" style="width:auto;padding:12px 22px;font-size:14px;">Download PDF</button>
      <button class="btn btn-outline" onclick="exportPackage()" style="width:auto;padding:12px 22px;font-size:14px;">Take It With You</button>
    </div>
  </div>
  <div class="blueprint-body" id="blueprint-body">
    <!-- populated by JS -->
  </div>
</div>

<!-- \u2550\u2550 BUILD SITE POPUP \u2550\u2550 -->
<div id="build-site-popup" style="display:none;position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);animation:fadeIn 0.3s ease;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:20px;max-width:520px;width:92%;padding:36px 32px;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;">
    <div style="font-size:42px;margin-bottom:12px;">\u2728</div>
    <h3 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:8px;color:var(--text);">Get Your Vision Live</h3>
    <p style="font-size:15px;color:var(--text2);line-height:1.65;margin-bottom:8px;">You just did the hard part. Your strategy, messaging, and visual identity are locked in. In the next 60 seconds, all of it becomes a real website you can share with the world.</p>
    <div style="background:var(--bg);border-radius:12px;padding:16px 20px;margin:16px 0 24px;text-align:left;">
      <div style="font-size:13px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Here is what happens next</div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u26A1</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">Your brand strategy, colors, and voice get structured into a page</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F3A8}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">Your photos are placed on the site, or custom images are generated to match your visual identity</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F4BB}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">A complete branded website is written from everything you shared</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <span style="font-size:16px;">\u{1F50D}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">SEO meta tags, Open Graph previews, favicon, and AI schema are injected automatically</span>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span style="font-size:16px;">\u{1F680}</span>
        <span style="font-size:14px;color:var(--text2);line-height:1.5;">It goes live at a shareable URL, fully optimized for search and social sharing</span>
      </div>
    </div>
    <div id="site-photo-upload" style="background:var(--bg);border-radius:12px;padding:16px 20px;margin:0 0 20px;text-align:left;">
      <div style="font-size:13px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Have professional photos?</div>
      <p style="font-size:13px;color:var(--text2);line-height:1.5;margin-bottom:10px;">Upload your headshots, team photos, or brand imagery. We will use your real photos on the site instead of generating AI images. Real photos convert dramatically better.</p>
      <div style="position:relative;border:2px dashed var(--border2);border-radius:10px;padding:14px;text-align:center;cursor:pointer;transition:border-color 0.2s;" onclick="document.getElementById('site-photo-input').click()">
        <input type="file" id="site-photo-input" multiple accept="image/*" style="display:none" onchange="handleSitePhotoUpload(this)">
        <span style="font-size:13px;color:var(--text3);">\u{1F4F7} Click to add photos (JPG, PNG, WebP)</span>
      </div>
      <div id="site-photo-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;"></div>
    </div>
    <button class="btn btn-gold" onclick="closeBuildPopup();proceedToSite();" style="width:100%;padding:16px 24px;font-size:16px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);margin-bottom:10px;">Let's Go</button>
    <button class="btn btn-ghost" onclick="saveForLater()" style="width:auto;padding:10px 20px;font-size:13px;color:var(--text3);">Save for later</button>
  </div>
</div>

<!-- \u2550\u2550 SITE GENERATION SCREEN \u2550\u2550 -->
<div id="site-screen" class="screen">
  <div class="site-progress">
    <h2>Building Your Website</h2>
    <p>Your brand blueprint is being turned into a real, branded website. This takes about 60 seconds.</p>
    <div class="progress-steps" id="gen-steps">
      <div class="progress-step">
        <div class="step-icon active" id="step-1-icon">\u26A1</div>
        <div class="step-text"><strong>Preparing your brand context</strong>Structuring blueprint data for generation</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-2-icon">\u{1F3A8}</div>
        <div class="step-text"><strong>Generating brand images</strong>Creating custom hero imagery via Imagen 4</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-3-icon">\u{1F4BB}</div>
        <div class="step-text"><strong>Writing your website</strong>Building pages from your blueprint</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-4-icon">\u{1F50D}</div>
        <div class="step-text"><strong>SEO &amp; launch optimization</strong>Meta tags, Open Graph, favicon, schema markup, and search indexing</div>
      </div>
      <div class="progress-step">
        <div class="step-icon pending" id="step-5-icon">\u{1F680}</div>
        <div class="step-text"><strong>Deploying to a live URL</strong>Publishing your optimized site to the web</div>
      </div>
    </div>
  </div>
</div>

<!-- \u2550\u2550 DEPLOY SCREEN \u2550\u2550 -->
<div id="deploy-screen" class="screen" style="display:none;">
  <!-- Legacy deploy screen kept hidden; Mission Control replaces it -->
</div>

<!-- \u2550\u2550 SITE REVEAL + GUIDED SECTION REVIEW \u2550\u2550 -->
<div id="site-reveal" class="screen">
 <div style="max-width:760px;margin:0 auto;padding:32px 20px;">
  <div id="review-progress" style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
   <div style="flex:1;height:4px;background:var(--bg3);border-radius:4px;overflow:hidden;">
    <div id="review-progress-bar" style="height:100%;width:0%;background:var(--gold);border-radius:4px;transition:width 0.4s ease;"></div>
   </div>
   <span id="review-progress-label" style="font-size:12px;color:var(--text2);white-space:nowrap;">Section 1</span>
  </div>
  <div id="review-header" style="text-align:center;margin-bottom:20px;">
   <div id="review-badge" style="display:inline-block;padding:4px 14px;background:rgba(196,112,63,0.1);color:var(--gold);font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Above the fold</div>
   <h2 id="review-title" style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:6px;">First Impressions</h2>
   <p id="review-desc" style="color:var(--text2);font-size:14px;margin:0;max-width:480px;margin-left:auto;margin-right:auto;">This is what visitors see the moment they land. Does it grab attention and represent your brand?</p>
  </div>
  <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:20px;background:var(--bg1);box-shadow:0 8px 32px rgba(0,0,0,0.08);">
   <div style="background:var(--bg3);padding:8px 14px;font-size:12px;color:var(--text2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e05252;"></span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e8a838;"></span>
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3cc43c;"></span>
    <span style="flex:1;text-align:center;font-family:monospace;font-size:11px;color:var(--text2);" id="reveal-domain"></span>
   </div>
   <iframe id="reveal-preview" src="" style="width:100%;height:480px;border:none;display:none;" sandbox="allow-scripts allow-same-origin"></iframe>
   <div id="reveal-loading" style="height:480px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;">Loading your site...</div>
  </div>
  <div id="review-actions" style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;">
   <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;" id="review-btns">
    <button class="reaction-btn" onclick="sectionReaction('approve')"><span class="reaction-icon">\u{1F44D}</span><span class="reaction-label">Looks good</span></button>
    <button class="reaction-btn" onclick="sectionReaction('refine')"><span class="reaction-icon">\u270F\uFE0F</span><span class="reaction-label">Refine this</span></button>
   </div>
   <div id="section-refine-input" style="display:none;margin-top:12px;">
    <textarea id="section-refine-text" rows="3" placeholder="What would you change about this section?" style="width:100%;padding:12px;font-size:14px;border:1px solid var(--border);border-radius:var(--radius-sm);resize:vertical;font-family:inherit;line-height:1.5;box-sizing:border-box;margin-bottom:10px;"></textarea>
    <div style="display:flex;gap:10px;">
     <button class="btn btn-gold" onclick="submitSectionRefine()" id="section-refine-btn" style="flex:1;padding:12px;font-size:14px;">Apply Change</button>
     <button class="btn btn-outline" onclick="sectionReaction('approve')" style="padding:12px 18px;font-size:14px;">Skip</button>
    </div>
    <div id="section-refine-status" style="display:none;text-align:center;margin-top:10px;font-size:13px;color:var(--text2);"></div>
   </div>
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
   <button id="review-prev-btn" class="btn btn-outline" onclick="prevReviewSection()" style="padding:10px 20px;font-size:13px;visibility:hidden;">\u2190 Previous</button>
   <button onclick="skipReview()" style="background:none;border:none;color:var(--text2);font-size:13px;cursor:pointer;text-decoration:underline;">Skip review</button>
   <div style="width:100px;"></div>
  </div>
 </div>
</div>

<div id="mission-control" class="screen">
  <div style="max-width:720px;margin:0 auto;padding:40px 20px;">

    <!-- Back to Blueprint -->
    <div style="margin-bottom:24px;">
      <button onclick="showScreen('blueprint')" style="background:none;border:none;color:var(--text2);font-size:13px;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px;opacity:0.7;transition:opacity 0.15s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
        \u2190 View Blueprint
      </button>
    </div>

    <!-- Header -->
    <div style="text-align:center;margin-bottom:36px;">
      <div style="font-size:48px;margin-bottom:12px;">\u{1F680}</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:32px;margin-bottom:6px;">
        <span id="mc-brand-name">Your Brand</span> is Live
      </h2>
      <p style="color:var(--text2);font-size:15px;margin:0;">Your website is published and ready to share with the world.</p>
    </div>

    <!-- Live URL bar -->
    <div id="mc-live-url" style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
      <div style="font-size:18px;">\u{1F310}</div>
      <a id="mc-url-link" href="#" target="_blank" style="color:var(--gold);font-size:15px;font-weight:500;text-decoration:none;flex:1;word-break:break-all;"></a>
      <button id="mc-copy-btn" onclick="copyMcUrl()" style="background:var(--bg2);border:1px solid var(--border);color:var(--text1);padding:8px 14px;border-radius:6px;font-size:13px;cursor:pointer;white-space:nowrap;">Copy Link</button>
      <a id="mc-visit-btn" href="#" target="_blank" class="btn btn-gold" style="padding:8px 18px;font-size:13px;text-decoration:none;white-space:nowrap;">Visit Site</a>
    </div>

    <!-- Fallback if no URL -->
    <div id="mc-no-url" style="display:none;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:18px 22px;margin-bottom:24px;text-align:center;">
      <div style="font-size:14px;color:var(--text2);">Your site was generated but deployment is still processing. Refresh in a moment to see your live URL.</div>
    </div>

    <!-- Site Preview -->
    <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:32px;background:var(--bg1);">
      <div style="background:var(--bg3);padding:8px 14px;font-size:12px;color:var(--text2);display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e05252;"></span>
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e8a838;"></span>
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3cc43c;"></span>
        <span style="flex:1;text-align:center;font-family:monospace;font-size:11px;color:var(--text2);" id="mc-preview-domain"></span>
      </div>
      <iframe id="mc-preview" src="" style="width:100%;height:420px;border:none;display:none;" sandbox="allow-scripts allow-same-origin"></iframe>
      <div id="mc-preview-placeholder" style="height:420px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:14px;">Loading preview...</div>
    </div>

    <!-- Share & Actions -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      <button onclick="emailMySite()" class="btn btn-outline" style="padding:14px;font-size:14px;">
        \u2709\uFE0F &nbsp;Email My Site Link
      </button>
      <button onclick="copyMcUrl()" class="btn btn-outline" style="padding:14px;font-size:14px;">
        \u{1F4CB} &nbsp;Copy Link to Share
      </button>
    </div>

    <!-- Strategy Call CTA (moved up: highest conversion moment is right after seeing the live site) -->
    <div style="text-align:center;background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.03));border:1.5px solid rgba(212,175,55,0.35);border-radius:var(--radius);padding:28px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">Next Step</div>
      <h3 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:8px;">Want It Done For You?</h3>
      <p style="color:var(--text2);font-size:14px;margin-bottom:20px;max-width:480px;margin-left:auto;margin-right:auto;">Book a strategy call. We will connect your domain, refine your content together, and build your traffic plan.</p>
      <button class="btn btn-gold" onclick="handleBookCall()" style="padding:16px 36px;font-size:15px;box-shadow:0 4px 20px rgba(196,112,63,0.3);">Book Your Strategy Call</button>
    </div>

    <!-- 30-Day Preview Notice -->
    <div style="background:linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.02));border:1px solid rgba(212,175,55,0.3);border-radius:var(--radius);padding:20px 24px;margin-bottom:16px;display:flex;gap:14px;align-items:flex-start;">
      <div style="font-size:22px;margin-top:2px;">\u{1F4C5}</div>
      <div>
        <div style="font-weight:600;font-size:14px;margin-bottom:6px;">Your Site is Live for 30 Days</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.6;">Your preview is hosted here for 30 days at no extra cost. Download your site file or self-deploy to Cloudflare Pages (free) to keep it live permanently.</div>
      </div>
    </div>

    <!-- Download Site -->
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:16px;">
      <div style="font-weight:600;font-size:15px;margin-bottom:6px;">\u{1F4E5} Download Your Site File</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px;">A single HTML file with everything built in \u2014 your copy, styles, and layout. Works anywhere. No dependencies.</div>
      <button id="download-site-btn" class="btn btn-gold" onclick="downloadSite()" style="width:auto;padding:12px 28px;font-size:14px;">Download Site</button>
    </div>

    <!-- Self-Deploy Guide -->
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:24px;">
      <div style="font-weight:600;font-size:15px;margin-bottom:6px;">\u{1F310} Self-Deploy to Cloudflare Pages \u2014 Free Forever</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:14px;">Cloudflare Pages hosts your site permanently on their free tier. Takes about 5 minutes.</div>
      <div style="display:flex;flex-direction:column;gap:0;">
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">1</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Download your site file above, then go to <a href="https://dash.cloudflare.com/sign-up/pages" target="_blank" style="color:var(--gold);font-weight:500;">dash.cloudflare.com</a> and create a free account.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">2</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Click <strong>Workers &amp; Pages</strong> in the left menu, then <strong>Create</strong> and choose <strong>Pages</strong>.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">3</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Select <strong>Direct Upload</strong>, name your project (your brand name works great), then upload your HTML file.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border);">
          <div style="min-width:24px;height:24px;background:var(--gold);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">4</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Click <strong>Deploy</strong>. Your site goes live at <code style="background:var(--bg2);padding:1px 6px;border-radius:4px;font-family:monospace;font-size:12px;">your-project.pages.dev</code> within seconds.</div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;">
          <div style="min-width:24px;height:24px;background:var(--bg3);border:1px solid var(--border2);color:var(--text2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px;">5</div>
          <div style="font-size:13px;color:var(--text2);line-height:1.6;">Optional: Go to <strong>Custom Domains</strong> in the dashboard to connect your own domain (like yourbrand.com).</div>
        </div>
      </div>
    </div>

    <!-- Secondary CTA at bottom for scrollers -->
    <div style="text-align:center;padding:20px 0 8px;">
      <p style="color:var(--text2);font-size:13px;margin-bottom:12px;">Questions? Something feel off about your site?</p>
      <a href="mailto:james@jamesguldan.com?subject=Deep Work Site Question" style="color:var(--gold);font-size:14px;font-weight:500;text-decoration:none;">Email James directly &rarr;</a>
    </div>

  </div>
</div>

<!-- order bump removed -->

<!-- \u2550\u2550 SESSION LOADING OVERLAY \u2550\u2550 -->
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

<!-- \u2550\u2550 BLUEPRINT GENERATION OVERLAY \u2550\u2550 -->
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

<!-- \u2550\u2550 TOAST \u2550\u2550 -->
<div id="toast"></div>

<script>
// \u2500\u2500 STATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const STATE = {
  sessionId: null,
  tier: null,
  phase: 1,
  isStreaming: false,
  blueprint: null,
  generatedSiteHtml: null,
  uploadedFiles: [],
  uploadedKeys: [],
  blueprintOverlayShown: false,
  sessionJwt: null,
  uploadedDocs: []
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

// \u2500\u2500 SCREEN MANAGEMENT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function delay(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._toastTimer);
  el._toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// \u2500\u2500 TIER SELECTION & CHECKOUT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
  const accessToken = params.get('access');

  // Stripe redirect: ?session=X&tier=Y&access=TOKEN from checkout
  const upgraded = params.get('upgraded');
  if (sessionId && tier) {
    STATE.sessionId = sessionId;
    STATE.tier = tier;
    localStorage.setItem('dw_active_session', sessionId);
    window.history.replaceState({}, '', '/app');

    // Exchange one-time access token for a session JWT
    if (accessToken) {
      try {
        const claimRes = await fetch('/api/session/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken, sessionId })
        });
        const claimData = await claimRes.json();
        if (claimData.token) {
          localStorage.setItem('dw_session_jwt', claimData.token);
          STATE.sessionJwt = claimData.token;
        }
      } catch (_) {}
    } else {
      // No access token \u2014 restore JWT if we have one stored for this session
      const stored = localStorage.getItem('dw_session_jwt');
      if (stored) STATE.sessionJwt = stored;
    }

    if (upgraded === 'true') {
      // Returning from site upgrade purchase \u2014 go straight to site builder
      showScreen('site-screen');
      runSiteGeneration();
      return;
    }
    showScreen('intake');
  } else {
    // Restore session JWT if present (for users who reload without URL params)
    const storedJwt = localStorage.getItem('dw_session_jwt');
    if (storedJwt) STATE.sessionJwt = storedJwt;

    // New auth flow: fast-resume handles auth + session detection in one call
    const token = localStorage.getItem('dw_session');
    if (token) {
      try {
        const frRes = await fetch('/api/auth/fast-resume', { headers: { 'Authorization': 'Bearer ' + token } });
        const frData = await frRes.json();
        if (frData.ok && frData.user) {
          STATE.tier = frData.user.tier || frData.tier || (frData.user.role === 'admin' ? 'site' : 'blueprint');
          STATE.email = frData.user.email || '';

          if (frData.blueprintComplete && frData.blueprint) {
            // Blueprint is done =======drop user right into their results
            STATE.sessionId = frData.sessionId;
            STATE.blueprint = frData.blueprint;
            STATE.strategistDebrief = frData.strategistDebrief || null;
            STATE.phase = frData.phase || 8;
            localStorage.setItem('dw_active_session', frData.sessionId);
            updateLoadingStage('Your blueprint is ready.', 100);
            await new Promise(r => setTimeout(r, 600));
            hideLoadingOverlay();
            const hasDebrief = showDebrief(frData.blueprint, true);
            if (!hasDebrief) {
              renderBlueprint(frData.blueprint, frData.strategistDebrief || null, true);
              personalizeBlueprintHeader();
              showScreen('blueprint-screen');
            }
          } else if (frData.hasActiveSession && frData.sessionId) {
            // Active session in progress =======resume through normal flow
            pendingResumeSessionId = frData.sessionId;
            localStorage.setItem('dw_active_session', frData.sessionId);
            await resumeSession();
          } else {
            // No session yet =======start fresh
            await startSessionAuto();
          }
        } else {
          // Not authenticated
          hideLoadingOverlay();
        }
      } catch(e) {
        // Auth failed silently, show landing
        hideLoadingOverlay();
      }
    }
  }

  // File upload setup
  setupFileUpload();
  setupDocUpload();

  // Voice input setup
  initVoiceInput();

  // Auto-resize textarea
  const ta = document.getElementById('msg-input');
  if (ta) ta.addEventListener('input', () => autoResize(ta));
});

// \u2500\u2500 INTAKE & SESSION START \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
      \u{1F4F7} \${f.name}
      <button onclick="removeFile(\${i})">\xD7</button>
    </div>
  \`).join('');
}

function removeFile(i) {
  STATE.uploadedFiles.splice(i, 1);
  renderUploadedFiles();
}

// ── DOCUMENT UPLOAD (Onboarding) ──────────────────────────────────────
function setupDocUpload() {
  const zone = document.getElementById('doc-upload-zone');
  const input = document.getElementById('doc-file-input');
  if (!zone || !input) return;

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleDocFiles(Array.from(e.dataTransfer.files));
  });
  input.addEventListener('change', () => handleDocFiles(Array.from(input.files)));
}

function handleDocFiles(files) {
  const DOC_EXTS = ['pdf','txt','md','doc','docx'];
  const existing = STATE.uploadedDocs.map(f => f.name);
  files.forEach(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (DOC_EXTS.includes(ext) && !existing.includes(f.name) && STATE.uploadedDocs.length < 5) {
      if (f.size <= 5 * 1024 * 1024) {
        STATE.uploadedDocs.push(f);
      }
    }
  });
  renderUploadedDocs();
}

function renderUploadedDocs() {
  const container = document.getElementById('uploaded-docs');
  if (!container) return;
  container.innerHTML = STATE.uploadedDocs.map((f, i) => \`
    <div class="file-chip">
      \u{1F4C4} \${f.name}
      <button onclick="removeDoc(\${i})">\xD7</button>
    </div>
  \`).join('');
}

function removeDoc(i) {
  STATE.uploadedDocs.splice(i, 1);
  renderUploadedDocs();
}

// \u2500\u2500 LOADING MESSAGES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  // \u2500\u2500 Consent check \u2500\u2500
  const consentBox = document.getElementById('consent-check');
  const consentErr = document.getElementById('consent-error');
  if (consentBox && !consentBox.checked) {
    if (consentErr) consentErr.style.display = '';
    consentBox.focus();
    return;
  }
  if (consentErr) consentErr.style.display = 'none';

  // \u2500\u2500 Validate inputs before starting \u2500\u2500
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

  // \u2500\u2500 Start loading \u2500\u2500
  btn.textContent = 'Preparing...';
  btn.disabled = true;
  showLoadingOverlay();

  try {
    // \u2500\u2500 Step 1: Upload files \u2500\u2500
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

    // ── Step 1b: Upload documents ──
    if (STATE.uploadedDocs.length > 0) {
      updateLoadingStage('Reading your documents', 30);

      if (!STATE.sessionId) {
        STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      for (let i = 0; i < STATE.uploadedDocs.length; i++) {
        const file = STATE.uploadedDocs[i];
        updateLoadingStage('Reading ' + file.name, 30 + Math.round((i / STATE.uploadedDocs.length) * 10));

        if (file.size > 5 * 1024 * 1024) continue;

        try {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('sessionId', STATE.sessionId);
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 30000);
          const r = await fetch('/api/upload', { method: 'POST', body: fd, signal: controller.signal });
          clearTimeout(timeout);
          if (r.ok) {
            const d = await r.json();
            if (d.key) STATE.uploadedKeys.push(d.key);
          }
        } catch (_) {}
      }
    }

    // \u2500\u2500 Step 2: Generate session ID \u2500\u2500
    updateLoadingStage('Setting up your session', 35);
    if (!STATE.sessionId) {
      STATE.sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }

    // \u2500\u2500 Step 3: Gather and validate intake data \u2500\u2500
    updateLoadingStage('Gathering your context', 45);
    const intakeData = {
      sessionId: STATE.sessionId,
      tier: STATE.tier || 'blueprint',
      existingWebsiteUrl: websiteVal,
      linkedinUrl: linkedinVal,
      competitorUrls: competitorsVal ? competitorsVal.split('\\n').map(s => s.trim()).filter(Boolean) : [],
      testimonials: (document.getElementById('intake-testimonials')?.value || '').trim(),
      uploadedKeys: STATE.uploadedKeys,
    };

    // \u2500\u2500 Step 4: Start the session (the big one) \u2500\u2500
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
          showToast('Tip: tap the mic and just speak \u2014 most people find it easier than typing');
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

// \u2500\u2500 SESSION RESUME \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  meta.textContent = 'Phase ' + phase + ' of 8: ' + phaseName + '  \xB7  ' + msgCount + ' messages so far';
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
  if (btn) { btn.textContent = 'Loading...'; btn.disabled = true; }
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
      if (btn) { btn.textContent = 'Continue My Session'; btn.disabled = false; }
      return;
    }

    const data = await res.json();

    if (!data.ok) {
      showLoadingError('Empty session', 'This session has no conversation history. Starting fresh might be the way to go.', null);
      if (btn) { btn.textContent = 'Continue My Session'; btn.disabled = false; }
      return;
    }
    // Allow empty messages when blueprint is already generated (session is complete)
    if (!data.blueprintGenerated && (!data.messages || data.messages.length === 0)) {
      showLoadingError('Empty session', 'This session has no conversation history. Starting fresh might be the way to go.', null);
      if (btn) { btn.textContent = 'Continue My Session'; btn.disabled = false; }
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
      renderBlueprint(data.blueprint, data.strategistDebrief || null, true);
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

// \u2500\u2500 VOICE INPUT (Web Speech API) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

async function startVoice() {
  if (!window._voiceRecognition) {
    showToast('Voice input is not supported in this browser. Try Chrome or Safari.');
    return;
  }

  const btn = document.getElementById('voice-btn');

  // Explicitly request microphone permission first (Chrome requirement)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately \u2014 we just needed the permission grant
    stream.getTracks().forEach(t => t.stop());
  } catch (permErr) {
    console.log('Mic permission error:', permErr);
    setVoiceStatus('Microphone access denied. Please allow microphone in your browser settings and try again.');
    return;
  }

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

// \u2500\u2500 CHAT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
                .replace(/\`\`\`json[sS]*?\`\`\`/g, '')
                .trim();
              updateBubble(aiMsg, displayText);
              scrollToBottom();
            } else if (ev.type === 'error') {
              streamError = ev.message || 'Something went wrong';
            } else if (ev.type === 'debrief_status') {
              // Show a status message while debrief generates
              const bpOverlay = document.getElementById('blueprint-generating');
              if (bpOverlay) {
                const statusEl = bpOverlay.querySelector('.bp-gen-status');
                if (statusEl) statusEl.textContent = ev.message || 'Personalizing your experience...';
              }
            } else if (ev.type === 'debrief') {
              // Store debrief for rendering
              STATE.strategistDebrief = ev.debrief;
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
      appendMessage('ai', 'The response took too long. This can happen with complex questions. Please try sending your message again \u2014 your conversation is saved.');
    } else {
      appendMessage('ai', 'Something went wrong (' + (e.message || 'unknown error').substring(0, 100) + '). Please try again.');
    }
  } finally {
    STATE.isStreaming = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('msg-input').focus();
  }
}

// ── Photo & document upload ──────────────────────────────────────────────────
function openUploadModal() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*';
  input.style.display = 'none';
  document.body.appendChild(input);
  input.onchange = async function() {
    if (this.files && this.files.length > 0) {
      await handlePhotoFiles(Array.from(this.files));
    }
    document.body.removeChild(input);
  };
  input.click();
}

async function handlePhotoFiles(files) {
  if (!files.length || !STATE.sessionId) return;
  const toUpload = files.slice(0, 5);
  const statusEl = document.getElementById('doc-upload-status');
  if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = 'Uploading ' + toUpload.length + ' photo' + (toUpload.length > 1 ? 's' : '') + '...'; }
  let succeeded = 0;
  for (const file of toUpload) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('sessionId', STATE.sessionId);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok) succeeded++;
    } catch (e) {}
  }
  if (statusEl) {
    statusEl.textContent = succeeded > 0 ? '✓ ' + succeeded + ' photo' + (succeeded > 1 ? 's' : '') + ' added to your session.' : 'Upload failed. Please try again.';
    setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
  }
  if (succeeded > 0) {
    const msg = 'I just uploaded ' + succeeded + ' photo' + (succeeded > 1 ? 's' : '') + ' to my session.';
    const input = document.getElementById('msg-input');
    if (input) {
      input.value = msg;
      sendMessage();
    }
  }
}

function openDocUpload() {
  const input = document.getElementById('doc-upload-input');
  if (input) input.click();
}

async function handleDocUpload(inputEl) {
  if (!inputEl.files || !inputEl.files.length || !STATE.sessionId) return;
  const file = inputEl.files[0];
  const statusEl = document.getElementById('doc-upload-status');
  if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = 'Reading ' + file.name + '...'; }
  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('sessionId', STATE.sessionId);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (statusEl) {
      statusEl.textContent = '✓ ' + file.name + ' added. The AI will reference it in your session.';
      setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
    }
  } catch (e) {
    if (statusEl) {
      statusEl.textContent = 'Could not upload: ' + e.message;
      setTimeout(() => { statusEl.style.display = 'none'; }, 5000);
    }
  }
  inputEl.value = '';
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

// \u2500\u2500 THINKING MESSAGES (shown while waiting for Claude) \u2500\u2500
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

// \u2500\u2500 BLUEPRINT GENERATION OVERLAY \u2500\u2500
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
      timerEl.textContent = timeStr + ' elapsed \u2014 your blueprint is being crafted with care';
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

// \u2500\u2500 PHASE TRACKING \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function showPhaseComplete(completedPhase) {
  if (completedPhase < 1 || completedPhase > 7) return;
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'phase-complete-banner';
  div.innerHTML = \`
    <div class="phase-complete-inner">
      <div class="phase-complete-check">\u2713</div>
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
    if (dot) { dot.classList.remove('active'); dot.classList.add('complete'); dot.textContent = '\u2713'; }
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

// \u2500\u2500 BLUEPRINT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function handleBlueprintReady(blueprint) {
  if (!blueprint) return;
  STATE.blueprint = blueprint;

  // Order bump (removed from HTML, guard against null reference)
  const _bump = document.getElementById('order-bump');
  if (_bump && STATE.tier !== 'site') {
    setTimeout(() => { _bump.style.display = 'flex'; }, 2000);
  }

  // After a moment, transition to blueprint screen
  setTimeout(() => {
    renderBlueprint(blueprint, STATE.strategistDebrief || null);
    showScreen('blueprint-screen');
  }, 3000);
}

function renderBlueprint(bp, strategistDebrief, isReturning) {
  const b = bp.blueprint;
  document.getElementById('bp-name').textContent = b.name + "'s Brand Blueprint";

  // \u2500\u2500 Strategist Debrief \u2500\u2500
  const debriefEl = document.getElementById('strategist-debrief');
  if (debriefEl) {
    const d = strategistDebrief;
    const p8 = b.part8 || {};

    if (d && d.reflection) {
      // Opus-generated debrief exists \u2014 render the real thing
      const returningNote = isReturning
        ? \`<div style="font-size:13px;color:#C4703F;font-style:italic;margin-bottom:16px;">You came back. That tells me this matters to you. Everything below is exactly where you left it.</div>\`
        : '';

      debriefEl.innerHTML = \`
        <div style="background:#fff;border:1px solid #e8e4df;border-radius:16px;padding:32px 36px;box-shadow:0 2px 16px rgba(0,0,0,0.05);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C4703F,#d4945f);display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;">\u2726</div>
            <div>
              <div style="font-size:20px;font-weight:700;font-family:'Outfit',sans-serif;">A Note From Your Strategist</div>
              <div style="font-size:12px;color:#999;margin-top:2px;">Written after getting to know you</div>
            </div>
          </div>

          \${returningNote}

          \${d.quotedMoment ? \`<div style="font-size:16px;font-style:italic;color:#555;line-height:1.7;padding:16px 20px;border-left:3px solid #C4703F;background:rgba(196,112,63,0.04);border-radius:0 8px 8px 0;margin-bottom:20px;">"\${d.quotedMoment}"</div>\` : ''}

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:16px;">
            \${d.reflection}
          </div>

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:16px;">
            \${d.insight}
          </div>

          <div style="font-size:15px;line-height:1.85;color:#333;margin-bottom:20px;">
            \${d.bridge}
          </div>

          <div style="padding:20px 24px;background:linear-gradient(135deg, rgba(196,112,63,0.08), rgba(196,112,63,0.02));border:1.5px solid rgba(196,112,63,0.25);border-radius:12px;margin-bottom:20px;">
            <div style="font-size:15px;line-height:1.85;color:#333;font-weight:500;">
              \${d.motivation}
            </div>
          </div>

          <div style="text-align:center;">
            <button class="btn btn-gold" onclick="handleBuildSite()" style="width:auto;padding:16px 36px;font-size:16px;font-weight:700;box-shadow:0 4px 20px rgba(196,112,63,0.35);">Get Your Vision Live</button>
            <div style="font-size:12px;color:#999;margin-top:8px;">Everything you need is already in this blueprint. Let's bring it to life.</div>
          </div>
        </div>
      \`;
      debriefEl.style.display = '';
    } else {
      // No Opus debrief yet \u2014 use smart fallback from blueprint data
      const promise = b.part1 ? b.part1.coreBrandPromise : '';
      const avatarName = b.part2 ? b.part2.name : '';
      const niche = b.part3 ? b.part3.nicheStatement : '';
      const firstMove = b.part6 ? b.part6.firstMove : '';

      let bridgeText = '';
      if (p8.personalizedMessage) {
        bridgeText = p8.personalizedMessage;
      } else if (firstMove) {
        bridgeText = firstMove;
      } else if (promise) {
        bridgeText = 'Your brand promise is clear: ' + promise + '. The next step is turning that clarity into something your audience can experience.';
      }

      const contextParts = [];
      if (niche) contextParts.push(niche);
      else if (promise) contextParts.push(promise);
      if (avatarName) contextParts.push('Your ideal client, ' + avatarName + ', is out there looking for exactly what you offer.');

      debriefEl.innerHTML = \`
        <div style="background:#fff;border:1px solid #e8e4df;border-radius:16px;padding:28px 32px;box-shadow:0 2px 12px rgba(0,0,0,0.04);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C4703F,#d4945f);display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;">\u2726</div>
            <div style="font-size:18px;font-weight:700;font-family:'Outfit',sans-serif;">Your Strategist's Take</div>
          </div>
          <div style="font-size:15px;line-height:1.8;color:#333;">
            After getting to know you, here is what stands out. \${contextParts.join(' ')} Below is your complete brand blueprint with everything we uncovered together. Scroll through each section, and when you are ready to bring this to life, the button below will get you there.
          </div>
          \${bridgeText ? \`
            <div style="margin-top:20px;padding:20px 24px;background:linear-gradient(135deg, rgba(196,112,63,0.08), rgba(196,112,63,0.02));border:1.5px solid rgba(196,112,63,0.25);border-radius:12px;">
              <div style="font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#C4703F;font-weight:600;margin-bottom:8px;">Your Next Move</div>
              <div style="font-size:14px;line-height:1.7;color:#444;">\${bridgeText}</div>
            </div>
          \` : ''}
        </div>
      \`;
      debriefEl.style.display = '';
    }
  }

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
    \${b.part8 && b.part8.personalizedMessage ? renderPart(8, 'Your Recommended Next Step', \`
      <div class="bp-item" style="background:linear-gradient(135deg, rgba(196,112,63,0.08), transparent);border:1.5px solid var(--gold);border-radius:12px;padding:24px;">
        <div style="font-size:20px;font-weight:700;font-family:'Outfit',sans-serif;color:var(--text);margin-bottom:12px;">\${b.part8.headline || 'Your Next Move'}</div>
        <div style="font-size:15px;line-height:1.8;color:var(--text);margin-bottom:16px;">\${b.part8.personalizedMessage}</div>
        \${b.part8.whyNow ? \`<div style="font-size:13px;line-height:1.7;color:var(--text2);margin-bottom:16px;padding:12px 16px;background:rgba(0,0,0,0.03);border-radius:8px;"><strong style="color:var(--gold);">Why now:</strong> \${b.part8.whyNow}</div>\` : ''}
        \${b.part8.specificBenefit ? \`<div style="font-size:13px;line-height:1.7;color:var(--text2);padding:12px 16px;background:rgba(0,0,0,0.03);border-radius:8px;"><strong style="color:var(--gold);">What you get:</strong> \${b.part8.specificBenefit}</div>\` : ''}
        <div style="margin-top:20px;text-align:center;">
          \${b.part8.recommendation === 'site_in_sixty' ? \`<button class="btn btn-gold" onclick="handleBuildSite()" style="width:auto;padding:14px 32px;font-size:15px;">Get Your Vision Live</button>\` : b.part8.recommendation === 'coaching' ? \`<a href="https://jamesguldan.com" target="_blank" class="btn btn-gold" style="width:auto;padding:14px 32px;font-size:15px;text-decoration:none;">Book a Strategy Call</a>\` : ''}
        </div>
      </div>
    \`) : ''}
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

// \u2500\u2500 ORDER BUMP UPGRADE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function handleSitePhotoUpload(inputEl) {
  if (!inputEl.files || !inputEl.files.length || !STATE.sessionId) return;
  const listEl = document.getElementById('site-photo-list');
  const toUpload = Array.from(inputEl.files).slice(0, 10);
  if (listEl) listEl.innerHTML = '<span style="font-size:12px;color:var(--text3);">Uploading ' + toUpload.length + ' photo' + (toUpload.length > 1 ? 's' : '') + '...</span>';

  let succeeded = 0;
  for (const file of toUpload) {
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) continue;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('sessionId', STATE.sessionId);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.ok) { succeeded++; STATE.uploadedKeys.push(d.key); }
    } catch (_) {}
  }

  if (listEl) {
    if (succeeded > 0) {
      listEl.innerHTML = '<span style="font-size:12px;color:var(--green);">\u2713 ' + succeeded + ' photo' + (succeeded > 1 ? 's' : '') + ' uploaded. These will be used on your site.</span>';
    } else {
      listEl.innerHTML = '<span style="font-size:12px;color:var(--red);">Upload failed. You can continue without photos.</span>';
    }
  }
  inputEl.value = '';
}

function openBuildPopup() {
  document.getElementById('build-site-popup').style.display = 'block';
}

function closeBuildPopup() {
  document.getElementById('build-site-popup').style.display = 'none';
}

async function saveForLater() {
  closeBuildPopup();
  const email = STATE.email || '';
  if (email) {
    try {
      await fetch('/api/auth/request-magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      showToast('We sent you a link \u2014 come back anytime to build your site.');
    } catch(_) {
      showToast('Your blueprint is saved. Log back in anytime to build your site.');
    }
  } else {
    showToast('Your blueprint is saved. Log back in anytime to build your site.');
  }
}

function handleBuildSite() {
  openBuildPopup();
}

// \u2500\u2500 SITE GENERATION \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
async function proceedToSite() {
  showScreen('site-screen');
  await runSiteGeneration();
}

async function runSiteGeneration() {
  try {
    // Step 1: Preparing context
    await delay(800);
    setStep(1, 'done');
    setStep(2, 'active');

    // Generate images (non-blocking \u2014 site can work without images)
    let imgOk = false;
    try {
      const imgRes = await fetch('/api/generate/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: STATE.sessionId })
      });
      const imgData = await imgRes.json();
      imgOk = imgData.ok;
    } catch (_) {
      // Images failed \u2014 continue without them
    }

    setStep(2, imgOk ? 'done' : 'done');
    setStep(3, 'active');

    // Generate site HTML
    const siteRes = await fetch('/api/generate/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });

    if (!siteRes.ok) {
      const errData = await siteRes.json().catch(() => ({}));
      throw new Error(errData.error || 'Site generation failed (status ' + siteRes.status + ')');
    }

    const siteData = await siteRes.json();

    if (siteData.html) {
      STATE.generatedSiteHtml = siteData.html;
    }

    setStep(3, 'done');

    // Step 4: SEO + Launch Optimization (happens during deploy)
    setStep(4, 'active');
    await delay(600);

    // Step 5: Deploy (SEO injection happens server side in handleDeploy)
    setStep(4, 'done');
    setStep(5, 'active');

    let deployUrl = null;
    let deployProject = null;
    try {
      const deployRes = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: STATE.sessionId })
      });
      const deployData = await deployRes.json();
      if (deployData.url) {
        deployUrl = deployData.url;
        deployProject = deployData.slug || deployData.projectName;
      } else if (deployData.error) {
        console.error('Deploy error:', deployData.error);
      }
    } catch (deployErr) {
      console.error('Deploy network error:', deployErr);
    }

    setStep(5, 'done');

    if (deployUrl) {
      STATE.liveUrl = deployUrl;
      STATE.projectName = deployProject;
      await delay(1200);
    }

    showSiteReveal(deployUrl);

  } catch (e) {
    console.error('Site generation error:', e);
    // Show error in the generation screen instead of just a toast
    const stepsEl = document.getElementById('gen-steps');
    if (stepsEl) {
      stepsEl.innerHTML += '<div style="margin-top:24px;padding:16px 20px;background:#fdf2f2;border:1.5px solid #e74c3c;border-radius:10px;color:#c0392b;font-size:14px;line-height:1.6;"><strong>Something went wrong</strong><br>' + (e.message || 'An unexpected error occurred.') + '<br><br><button class="btn btn-gold" onclick="location.reload()" style="padding:10px 20px;font-size:14px;">Try Again</button></div>';
    }
  }
}

function showMissionControl(liveUrl, projectName) {
  showScreen('mission-control');
  const bp = STATE.blueprint?.blueprint || STATE.blueprint || {};
  const brandName = bp.part1?.brandNames?.[0] || 'Your Brand';
  const mcBrand = document.getElementById('mc-brand-name');
  if (mcBrand) mcBrand.textContent = brandName;

  const urlSection = document.getElementById('mc-live-url');
  const urlLink = document.getElementById('mc-url-link');
  const visitBtn = document.getElementById('mc-visit-btn');
  const previewFrame = document.getElementById('mc-preview');
  const previewPlaceholder = document.getElementById('mc-preview-placeholder');
  const previewDomain = document.getElementById('mc-preview-domain');
  const noUrl = document.getElementById('mc-no-url');

  if (liveUrl) {
    if (urlSection) urlSection.style.display = '';
    if (noUrl) noUrl.style.display = 'none';
    if (urlLink) { urlLink.href = liveUrl; urlLink.textContent = liveUrl.replace('https://',''); }
    if (visitBtn) visitBtn.href = liveUrl;
    if (previewDomain) previewDomain.textContent = liveUrl.replace('https://','');
    if (previewFrame) {
      previewFrame.src = liveUrl;
      previewFrame.style.display = '';
      previewFrame.onload = function() {
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
      };
    }
  } else {
    if (urlSection) urlSection.style.display = 'none';
    if (noUrl) noUrl.style.display = '';
    if (previewFrame) previewFrame.style.display = 'none';
    if (previewPlaceholder) previewPlaceholder.textContent = 'Deploy is processing...';
  }
}

async function downloadSite() {
  const btn = document.getElementById('download-site-btn');
  const originalText = btn ? btn.textContent : 'Download Site';
  try {
    if (btn) { btn.textContent = 'Preparing...'; btn.disabled = true; }
    const exportHeaders = {};
    if (STATE.sessionJwt) exportHeaders['Authorization'] = 'Bearer ' + STATE.sessionJwt;
    const res = await fetch('/api/export-site?sessionId=' + STATE.sessionId, { headers: exportHeaders });
    if (!res.ok) throw new Error('status ' + res.status);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const bp = STATE.blueprint?.blueprint || {};
    const brandName = bp.part1?.brandNames?.[0] || 'my-site';
    const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-site';
    a.download = safeName + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Download started!');
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  } catch (e) {
    showToast('Download failed \u2014 please try again.');
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  }
}

function copyMcUrl() {
  const url = document.getElementById('mc-url-link')?.href;
  if (url) {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('mc-copy-btn');
      if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy Link', 2000); }
    });
  }
}

function emailMySite() {
  const url = document.getElementById('mc-url-link')?.href || '';
  const brand = document.getElementById('mc-brand-name')?.textContent || 'My Website';
  window.open('mailto:?subject=' + encodeURIComponent(brand + ' is Live') + '&body=' + encodeURIComponent('Check out my new website: ' + url), '_blank');
}

function handleBookCall() {
  // Redirect to strategy call checkout
  handleCheckoutRedirect('call');
}

async function handleCheckoutRedirect(tier) {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId, tier })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else showToast('Could not start checkout. Please try again.');
  } catch (e) {
    showToast('Something went wrong. Please try again.');
  }
}

function setStep(num, state) {
  const el = document.getElementById(\`step-\${num}-icon\`);
  if (!el) return;
  el.className = \`step-icon \${state}\`;
  if (state === 'done') el.textContent = '\u2713';
}

// \u2500\u2500 SECTION-BY-SECTION GUIDED REVIEW \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
let REVIEW_STATE = {
  sections: [],
  currentIndex: 0,
  refinementCount: 0,
  approved: [],
  refined: []
};

function showSiteReveal(liveUrl) {
  showScreen('site-reveal');
  STATE.liveUrl = liveUrl;
  const domain = document.getElementById('reveal-domain');
  const preview = document.getElementById('reveal-preview');
  const loading = document.getElementById('reveal-loading');

  if (liveUrl && domain) domain.textContent = liveUrl.replace('https://','');
  if (liveUrl && preview) {
    preview.src = liveUrl;
    preview.onload = function() {
      preview.style.display = '';
      if (loading) loading.style.display = 'none';
      // Detect sections once iframe loads
      setTimeout(() => detectSections(), 800);
    };
  }
}

function detectSections() {
  // Define the sections we expect based on the site generation template
  // These match the structure from prompts.js: nav, hero, problem, solution, offers, about, testimonials, CTA, footer
  const bp = STATE.blueprint?.blueprint || STATE.blueprint || {};
  const bpSections = bp.part5?.sections || [];

  REVIEW_STATE.sections = [
    { id: 'hero', badge: 'Above the fold', title: 'First Impressions', desc: 'This is what visitors see the moment they land. Does it grab attention and represent your brand?', selector: '.hero, [class*="hero"], section:first-of-type, header + section' }
  ];

  // Add each blueprint section
  bpSections.forEach(function(s, i) {
    const name = (s.name || 'Section ' + (i + 2));
    REVIEW_STATE.sections.push({
      id: 'section-' + i,
      badge: 'Section ' + (i + 2),
      title: name,
      desc: s.purpose || 'Review this section and decide if it works for your brand.',
      selector: 'section:nth-of-type(' + (i + 2) + ')'
    });
  });

  // If no blueprint sections, detect generically from the iframe
  if (bpSections.length === 0) {
    try {
      const iframeDoc = document.getElementById('reveal-preview').contentDocument || document.getElementById('reveal-preview').contentWindow.document;
      const allSections = iframeDoc.querySelectorAll('section');
      // Skip first (hero already covered), add the rest
      for (let i = 1; i < allSections.length && i < 10; i++) {
        const heading = allSections[i].querySelector('h1, h2, h3');
        const headText = heading ? heading.textContent.trim().substring(0, 40) : 'Section ' + (i + 1);
        REVIEW_STATE.sections.push({
          id: 'section-' + i,
          badge: 'Section ' + (i + 1),
          title: headText,
          desc: 'Review this section and make sure it represents your brand well.',
          selector: 'section:nth-of-type(' + (i + 1) + ')'
        });
      }
    } catch(e) {
      // Cross-origin iframe, fall back to generic sections
      for (let i = 1; i <= 5; i++) {
        REVIEW_STATE.sections.push({
          id: 'section-' + i,
          badge: 'Section ' + (i + 1),
          title: 'Section ' + (i + 1),
          desc: 'Review this section of your site.',
          selector: 'section:nth-of-type(' + (i + 1) + ')'
        });
      }
    }
  }

  // Always add footer as last
  REVIEW_STATE.sections.push({
    id: 'footer',
    badge: 'Footer',
    title: 'Footer & Contact',
    desc: 'The bottom of your site with contact info, links, and final impressions.',
    selector: 'footer'
  });

  REVIEW_STATE.currentIndex = 0;
  REVIEW_STATE.approved = [];
  REVIEW_STATE.refined = [];
  showReviewSection(0);
}

function showReviewSection(index) {
  if (index < 0 || index >= REVIEW_STATE.sections.length) return;
  REVIEW_STATE.currentIndex = index;
  const section = REVIEW_STATE.sections[index];
  const total = REVIEW_STATE.sections.length;

  // Update progress bar
  const pct = Math.round(((index) / total) * 100);
  const bar = document.getElementById('review-progress-bar');
  const label = document.getElementById('review-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = (index + 1) + ' of ' + total;

  // Update section info
  const badge = document.getElementById('review-badge');
  const title = document.getElementById('review-title');
  const desc = document.getElementById('review-desc');
  if (badge) badge.textContent = section.badge;
  if (title) title.textContent = section.title;
  if (desc) desc.textContent = section.desc;

  // Reset UI state
  const refineInput = document.getElementById('section-refine-input');
  const refineText = document.getElementById('section-refine-text');
  const refineStatus = document.getElementById('section-refine-status');
  const refineBtn = document.getElementById('section-refine-btn');
  const btns = document.getElementById('review-btns');
  if (refineInput) refineInput.style.display = 'none';
  if (refineText) refineText.value = '';
  if (refineStatus) refineStatus.style.display = 'none';
  if (refineBtn) { refineBtn.disabled = false; refineBtn.textContent = 'Apply Change'; }
  if (btns) btns.style.display = '';

  // Show/hide previous button
  const prevBtn = document.getElementById('review-prev-btn');
  if (prevBtn) prevBtn.style.visibility = index > 0 ? 'visible' : 'hidden';

  // Scroll iframe to this section
  scrollIframeToSection(section.selector);
}

function scrollIframeToSection(selector) {
  try {
    const iframe = document.getElementById('reveal-preview');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const el = iframeDoc.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add a subtle highlight pulse
      el.style.outline = '3px solid rgba(196,112,63,0.4)';
      el.style.outlineOffset = '4px';
      el.style.transition = 'outline-color 0.6s ease';
      setTimeout(function() {
        el.style.outlineColor = 'transparent';
        setTimeout(function() { el.style.outline = 'none'; }, 600);
      }, 1500);
    }
  } catch(e) {
    // Cross-origin: can't scroll, that's OK, user sees full site
  }
}

function sectionReaction(reaction) {
  const section = REVIEW_STATE.sections[REVIEW_STATE.currentIndex];

  if (reaction === 'approve') {
    REVIEW_STATE.approved.push(section.id);
    // Hide refine input if open
    const refineInput = document.getElementById('section-refine-input');
    if (refineInput) refineInput.style.display = 'none';
    advanceToNextSection();
  } else if (reaction === 'refine') {
    // Show the refine textarea
    const refineInput = document.getElementById('section-refine-input');
    if (refineInput) {
      refineInput.style.display = '';
      document.getElementById('section-refine-text').focus();
    }
  }
}

async function submitSectionRefine() {
  const section = REVIEW_STATE.sections[REVIEW_STATE.currentIndex];
  const text = document.getElementById('section-refine-text')?.value?.trim();
  if (!text) {
    showToast('Please describe what you would like changed');
    return;
  }

  const btn = document.getElementById('section-refine-btn');
  const status = document.getElementById('section-refine-status');
  btn.disabled = true;
  btn.innerHTML = '<span class="refine-spinner"></span> Rebuilding...';
  if (status) { status.style.display = ''; status.textContent = 'Updating this section (30 to 60 seconds)...'; }

  try {
    // Build a section-specific refinement instruction
    const instruction = 'Focus ONLY on the ' + section.title + ' section (' + section.badge + '). User feedback: ' + text;

    const res = await fetch('/api/refine-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: STATE.sessionId,
        category: 'custom',
        option: null,
        customText: instruction
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(function() { return {}; });
      throw new Error(err.error || 'Refinement failed');
    }

    await res.json();
    REVIEW_STATE.refinementCount++;

    // Redeploy
    if (status) status.textContent = 'Deploying updated site...';
    const deployRes = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: STATE.sessionId })
    });
    const deployData = await deployRes.json();
    if (deployData.url) STATE.liveUrl = deployData.url;

    // Refresh preview
    refreshSitePreview();
    REVIEW_STATE.refined.push(section.id);

    // Wait for iframe to reload before scrolling
    const preview = document.getElementById('reveal-preview');
    preview.onload = function() {
      setTimeout(function() { scrollIframeToSection(section.selector); }, 500);
    };

    // Reset the refine UI and show approve/refine buttons again
    btn.disabled = false;
    btn.textContent = 'Apply Change';
    document.getElementById('section-refine-text').value = '';
    if (status) { status.style.display = ''; status.textContent = 'Updated! Review the change above, then approve or refine again.'; }

  } catch (e) {
    if (status) { status.style.display = ''; status.textContent = 'Something went wrong: ' + e.message; }
    btn.textContent = 'Try Again';
    btn.disabled = false;
  }
}

function advanceToNextSection() {
  const next = REVIEW_STATE.currentIndex + 1;
  if (next >= REVIEW_STATE.sections.length) {
    // All sections reviewed! Show completion
    finishReview();
  } else {
    showReviewSection(next);
  }
}

function prevReviewSection() {
  if (REVIEW_STATE.currentIndex > 0) {
    showReviewSection(REVIEW_STATE.currentIndex - 1);
  }
}

function skipReview() {
  finishReview();
}

function finishReview() {
  // Update progress to 100%
  const bar = document.getElementById('review-progress-bar');
  const label = document.getElementById('review-progress-label');
  if (bar) bar.style.width = '100%';
  if (label) label.textContent = 'Complete!';

  // Show completion message in the review area
  const badge = document.getElementById('review-badge');
  const title = document.getElementById('review-title');
  const desc = document.getElementById('review-desc');
  const btns = document.getElementById('review-btns');
  const refineInput = document.getElementById('section-refine-input');
  const prevBtn = document.getElementById('review-prev-btn');

  if (badge) badge.textContent = 'All done';
  if (title) title.textContent = 'Your site is ready!';

  const approvedCount = REVIEW_STATE.approved.length;
  const refinedCount = REVIEW_STATE.refined.length;
  let summary = 'You reviewed every section';
  if (refinedCount > 0) summary += ' and refined ' + refinedCount + ' of them';
  summary += '. Your site is looking great.';
  if (desc) desc.textContent = summary;

  if (btns) btns.innerHTML = '<button class="btn btn-gold" onclick="launchAndGoLive()" style="padding:14px 32px;font-size:16px;">\u{1F680} Go Live!</button>';
  if (refineInput) refineInput.style.display = 'none';
  if (prevBtn) prevBtn.style.visibility = 'hidden';

  // Scroll iframe back to top
  try {
    const iframe = document.getElementById('reveal-preview');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.documentElement.scrollTop = 0;
  } catch(e) {}
}

function launchAndGoLive() {
  launchConfetti();
  setTimeout(function() {
    showMissionControl(STATE.liveUrl, STATE.projectName);
  }, 1800);
}

function refreshSitePreview() {
  const preview = document.getElementById('reveal-preview');
  if (preview && STATE.liveUrl) {
    preview.src = STATE.liveUrl + '?v=' + Date.now();
  }
}

function launchConfetti() {
  const colors = ['#c4703f','#d4855a','#FFD700','#e05252','#3cc43c','#4a90d9','#9b59b6'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = (Math.random() * 1.5) + 's';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

// \u2500\u2500 CLOUDFLARE DEPLOY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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
      const liveUrlEl = document.getElementById('live-url');
      if (liveUrlEl) { liveUrlEl.href = data.url; liveUrlEl.textContent = data.url; }
    } else {
      throw new Error(data.error || 'Deployment failed');
    }
  } catch (e) {
    document.getElementById('deploy-btn-go').disabled = false;
    document.getElementById('deploy-btn-go').textContent = 'Try Again';
    showToast('Deploy error: ' + e.message);
  }
}

function setDeployStep(n, s) {
  const el = document.getElementById('deploy-step-' + n + '-icon');
  if (el) { el.className = 'step-icon ' + s; if (s==='done') el.textContent='\u2713'; }
}

// \u2500\u2500 CUSTOM HELP PANEL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
(function() {
  var HW_CONTENT = {
    landing: {
      title: 'Getting Started',
      faqs: [
        { q: "How do I get access?", a: 'Visit <a href="https://jamesguldan.com/deep-work" style="color:var(--gold)">jamesguldan.com/deep-work</a> to purchase your session. You will receive a magic login link by email immediately after checkout.' },
        { q: "I purchased but cannot log in", a: "Check your email including spam for a message from james@jamesguldan.com. Your login link is in that email. If you cannot find it, use the email support button below." }
      ]
    },
    intake: {
      title: 'About Your Session',
      faqs: [
        { q: "Do I need an existing website?", a: "Not at all. The website field is optional. If you have one, it helps the AI understand your starting point. If not, we build from scratch using what you share in the interview." },
        { q: "What goes in the optional fields?", a: "The more context you give upfront, the less you explain in the interview. Even one good testimonial or a LinkedIn profile meaningfully improves your blueprint quality." },
        { q: "How long does the full session take?", a: "Most people complete all 8 phases in 60 to 90 minutes. You can type your answers or use the microphone, and you can pause and come back any time." },
        { q: "Can I pause and come back later?", a: "Yes. Close the tab whenever you need to. When you return and log in, you will pick up exactly where you left off. Your session is saved automatically for 30 days." }
      ]
    },
    app: {
      title: 'Interview Help',
      faqs: [
        { q: "I am not sure how to answer this question", a: "There are no wrong answers. Just say whatever comes to mind, even if it feels incomplete or messy. The AI draws out the good stuff through follow-up questions. Authentic always beats polished." },
        { q: "Can I skip a question?", a: "Yes. Just type 'skip' or 'I would rather move on' and the interview continues." },
        { q: "How many phases are there?", a: "Eight phases: your story, expertise, beliefs, audience, voice, market position, offers, and your recommended next step. Each one is a focused conversation." },
        { q: "Is my progress saved if I close the tab?", a: "Yes. Your session is saved automatically. Come back any time, log in, and you will pick up exactly where you left off." },
        { q: "The response seems stuck", a: "If nothing appears after 30 seconds, scroll down first. If you are genuinely stuck, refresh the page. Your conversation will still be there." }
      ],
      showRestart: true
    },
    'blueprint-screen': {
      title: 'Your Blueprint',
      faqs: [
        { q: "Can I save or download my blueprint?", a: "Yes. Use the Download PDF button at the top of this page. Your blueprint is also permanently saved to your account." },
        { q: "What do the 8 sections mean?", a: "Each section covers a different element: your story, what you are best at, what you stand for, who you serve, how you communicate, your market position, your offer structure, and your recommended next move." },
        { q: "I want to build my website now", a: "Click the Build My Site button at the top of the blueprint screen to add the Site In Sixty build onto your purchase." }
      ],
      showRestart: true
    },
    'site-screen': {
      title: 'Site Generation',
      faqs: [
        { q: "How long does this take?", a: "Usually 2 to 4 minutes. Your site is being built from scratch based on your brand strategy. Each step updates as it completes." },
        { q: "What if something goes wrong?", a: "A Try Again button will appear if generation fails. Your blueprint is not affected, only the site step needs to restart." }
      ]
    },
    'site-reveal': {
      title: 'Your Site is Ready',
      faqs: [
        { q: "Can I add a custom domain?", a: "Yes. Your site is hosted on Cloudflare Pages. You can connect a custom domain from your Cloudflare dashboard, or email james@jamesguldan.com for help setting it up." },
        { q: "How do I make changes?", a: "Use the section review tools on this screen to refine individual sections. For bigger changes email james@jamesguldan.com." }
      ]
    },
    'mission-control': {
      title: 'Mission Control',
      faqs: [
        { q: "Can I add a custom domain?", a: "Yes. Your site lives on Cloudflare Pages. Connect a custom domain from your Cloudflare dashboard, or email us and we will help." },
        { q: "How do I update my site later?", a: "For content updates email james@jamesguldan.com. For a full rebuild with your evolved brand, consider the Site In Sixty upgrade." },
        { q: "I want to share my site", a: "Use the Copy Link button to grab your live URL, or Email It to Myself to send it straight to your inbox." }
      ]
    }
  };

  var HW = {
    getScreen: function() {
      var el = document.querySelector('.screen.active');
      return el ? el.id : 'landing';
    },
    getContent: function() {
      return HW_CONTENT[HW.getScreen()] || HW_CONTENT.intake;
    },
    buildBody: function() {
      var c = HW.getContent();
      var html = '<div class="help-sec"><div class="help-sec-lbl">' + c.title + '</div>';
      (c.faqs || []).forEach(function(faq, i) {
        html += '<div class="help-faq" id="hf' + i + '">';
        html += '<button class="help-faq-q" onclick="HW.toggle(' + i + ')">';
        html += '<span>' + faq.q + '</span><span class="help-faq-arrow">&#9660;</span></button>';
        html += '<div class="help-faq-a">' + faq.a + '</div></div>';
      });
      html += '</div>';
      if (c.showRestart) {
        html += '<div class="help-divider"></div>';
        html += '<div class="help-restart">';
        html += '<div class="help-restart-title">Fresh Start</div>';
        html += '<div class="help-restart-desc">Need to redo your interview from scratch? You get one complimentary fresh start included with your purchase.</div>';
        html += '<div id="hr-default"><button class="help-restart-btn" onclick="HW.showConfirm()">Start Over (fresh session)</button></div>';
        html += '<div id="hr-confirm" class="help-confirm-box">';
        html += '<div class="help-confirm-txt">Your current session will be cleared and cannot be recovered. You only get one fresh start included. Are you sure?</div>';
        html += '<div class="help-confirm-row">';
        html += '<button class="help-confirm-yes" id="hr-yes-btn" onclick="HW.doRestart()">Yes, start over</button>';
        html += '<button class="help-confirm-no" onclick="HW.cancelConfirm()">Cancel</button></div></div>';
        html += '<div id="hr-done" class="help-confirm-box"><div class="help-confirm-txt" style="color:var(--success)">&#10003; Done. Reloading your session\u2026</div></div>';
        html += '<div id="hr-used" class="help-confirm-box"><div class="help-confirm-txt">You have already used your one fresh start. Email James directly and he will sort it out for you.</div></div>';
        html += '</div>';
      }
      return html;
    },
    open: function() {
      var panel = document.getElementById('help-panel');
      var overlay = document.getElementById('help-overlay');
      var body = document.getElementById('help-body');
      if (!panel) return;
      if (body) body.innerHTML = HW.buildBody();
      panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
    },
    close: function() {
      var panel = document.getElementById('help-panel');
      var overlay = document.getElementById('help-overlay');
      if (panel) panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    },
    toggle: function(i) {
      var el = document.getElementById('hf' + i);
      if (!el) return;
      var wasOpen = el.classList.contains('open');
      document.querySelectorAll('.help-faq.open').forEach(function(x) { x.classList.remove('open'); });
      if (!wasOpen) el.classList.add('open');
    },
    showConfirm: function() {
      var d = document.getElementById('hr-default');
      var c2 = document.getElementById('hr-confirm');
      if (d) d.style.display = 'none';
      if (c2) c2.classList.add('show');
    },
    cancelConfirm: function() {
      var d = document.getElementById('hr-default');
      var c2 = document.getElementById('hr-confirm');
      if (d) d.style.display = '';
      if (c2) c2.classList.remove('show');
    },
    doRestart: async function() {
      var btn = document.getElementById('hr-yes-btn');
      var confirmEl = document.getElementById('hr-confirm');
      var doneEl = document.getElementById('hr-done');
      var usedEl = document.getElementById('hr-used');
      if (btn) { btn.textContent = 'Restarting\u2026'; btn.disabled = true; }
      try {
        var token = localStorage.getItem('dw_session');
        var res = await fetch('/api/session/restart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token ? 'Bearer ' + token : '' }
        });
        var data = await res.json();
        if (data.ok) {
          localStorage.removeItem('dw_active_session');
          if (confirmEl) confirmEl.classList.remove('show');
          if (doneEl) doneEl.classList.add('show');
          setTimeout(function() { window.location.href = '/app'; }, 1800);
        } else if (data.error === 'restart_limit_reached') {
          if (confirmEl) confirmEl.classList.remove('show');
          if (usedEl) usedEl.classList.add('show');
          var emailLink = document.getElementById('help-email-cta');
          if (emailLink) {
            var em = (typeof STATE !== 'undefined' && STATE.email) ? STATE.email : '';
            emailLink.href = 'mailto:james@jamesguldan.com?subject=Deep%20Work%20%E2%80%93%20Need%20Another%20Fresh%20Start&body=Hi%20James%2C%20I%20already%20used%20my%20one%20fresh%20start%20and%20need%20help.%20My%20account%20email%20is%3A%20' + encodeURIComponent(em);
          }
        } else {
          if (btn) { btn.textContent = 'Yes, start over'; btn.disabled = false; }
          if (typeof showToast === 'function') showToast('Could not restart right now. Please try again or email james@jamesguldan.com');
        }
      } catch (e) {
        if (btn) { btn.textContent = 'Yes, start over'; btn.disabled = false; }
        if (typeof showToast === 'function') showToast('Connection error. Please try again.');
      }
    }
  };
  window.HW = HW;
})();

// \u2500\u2500 HELP BOT (GHL Chat Widget with Rate Limiting + Oversight) \u2500\u2500
(function initHelpBot() {
  var HELP_BOT = {
    maxOpensPerHour: 8,
    maxOpensPerDay: 25,
    storageKey: 'dw_help_bot_usage',
    loaded: false
  };

  function getUsage() {
    try {
      var raw = sessionStorage.getItem(HELP_BOT.storageKey);
      if (!raw) return { opens: [], dailyOpens: 0, dayKey: '' };
      return JSON.parse(raw);
    } catch(e) { return { opens: [], dailyOpens: 0, dayKey: '' }; }
  }

  function saveUsage(usage) {
    try { sessionStorage.setItem(HELP_BOT.storageKey, JSON.stringify(usage)); } catch(e) {}
  }

  function checkRateLimit() {
    var usage = getUsage();
    var now = Date.now();
    var oneHourAgo = now - (60 * 60 * 1000);
    var today = new Date().toISOString().slice(0, 10);

    // Clean old opens (older than 1 hour)
    usage.opens = (usage.opens || []).filter(function(t) { return t > oneHourAgo; });

    // Reset daily counter if new day
    if (usage.dayKey !== today) {
      usage.dayKey = today;
      usage.dailyOpens = 0;
    }

    if (usage.opens.length >= HELP_BOT.maxOpensPerHour) {
      return { allowed: false, reason: 'You have reached the hourly limit for help requests. Please try again in a bit, or email james@jamesguldan.com for immediate assistance.' };
    }
    if (usage.dailyOpens >= HELP_BOT.maxOpensPerDay) {
      return { allowed: false, reason: 'You have reached the daily limit for help requests. Please email james@jamesguldan.com for further assistance.' };
    }

    return { allowed: true };
  }

  function recordOpen() {
    var usage = getUsage();
    var now = Date.now();
    var today = new Date().toISOString().slice(0, 10);
    usage.opens = (usage.opens || []);
    usage.opens.push(now);
    if (usage.dayKey !== today) { usage.dayKey = today; usage.dailyOpens = 0; }
    usage.dailyOpens = (usage.dailyOpens || 0) + 1;
    saveUsage(usage);
  }

  function logToAdmin(action, detail) {
    try {
      var token = localStorage.getItem('dw_token');
      fetch('/api/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? 'Bearer ' + token : '' },
        body: JSON.stringify({
          type: 'help_bot',
          action: action,
          detail: detail || '',
          sessionId: STATE.sessionId || '',
          email: STATE.email || '',
          timestamp: new Date().toISOString()
        })
      }).catch(function() {});
    } catch(e) {}
  }

  // Inject the GHL widget script
  function loadWidget() {
    if (HELP_BOT.loaded) return;
    HELP_BOT.loaded = true;
    var s = document.createElement('script');
    s.src = 'https://widgets.leadconnectorhq.com/loader.js';
    s.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    s.setAttribute('data-widget-id', '69b8c7cec0c16f06497b8408');
    document.body.appendChild(s);
  }

  // Monitor widget open/close via DOM observation
  function monitorWidget() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // GHL widget adds an iframe; detect it opening
            var frames = node.querySelectorAll ? node.querySelectorAll('iframe[src*="leadconnectorhq"], iframe[src*="msgsndr"]') : [];
            if (node.tagName === 'IFRAME' && (node.src || '').indexOf('leadconnector') > -1) {
              frames = [node];
            }
            if (frames.length > 0) {
              var check = checkRateLimit();
              if (!check.allowed) {
                // Rate limited: hide the widget and show a toast
                showToast(check.reason);
                logToAdmin('rate_limited', check.reason);
                // Try to close/hide the widget
                try { frames[0].parentElement.style.display = 'none'; } catch(e) {}
                return;
              }
              recordOpen();
              logToAdmin('opened', 'User opened help chat');
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Only load widget after user is authenticated and on the app screen
  function waitForApp() {
    var checkInterval = setInterval(function() {
      if (STATE.sessionId || document.querySelector('.screen.active')) {
        clearInterval(checkInterval);
        loadWidget();
        monitorWidget();
        logToAdmin('widget_loaded', 'Help bot widget initialized');
      }
    }, 3000);
    // Timeout: load after 15s regardless
    setTimeout(function() { clearInterval(checkInterval); loadWidget(); monitorWidget(); }, 15000);
  }

  waitForApp();
})();

<\/script>

<!-- \u2550\u2550 HELP WIDGET \u2550\u2550 -->
<button id="help-btn" onclick="HW.open()" aria-label="Help and support" title="Need help?">?</button>
<div id="help-overlay" onclick="HW.close()"></div>
<div id="help-panel" role="dialog" aria-label="Help center">
  <div class="help-hdr">
    <div>
      <div class="help-hdr-title">Need help?</div>
      <div class="help-hdr-sub">Quick answers for wherever you are</div>
    </div>
    <button class="help-close-btn" onclick="HW.close()" aria-label="Close">&#10005;</button>
  </div>
  <div class="help-body" id="help-body"></div>
  <div class="help-ftr">
    <div class="help-ftr-lbl">Still stuck? Reach out directly.</div>
    <a href="mailto:james@jamesguldan.com?subject=Deep Work Help" class="help-email-cta" id="help-email-cta">Email James directly</a>
    <div class="help-ftr-note">Usually replies within a few hours</div>
  </div>
</div>

</body>
</html>

`;
