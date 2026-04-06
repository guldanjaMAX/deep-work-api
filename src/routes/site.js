// src/routes/site.js
// Site generation, deployment, and serving route handlers

import { json } from '../utils/helpers.js';
import {
  CORS, logEvent, validateBlueprint, autoRepairBlueprint,
  callClaudeSiteGen, getJWTSecret, injectSEO
} from '../utils/internal.js';
import { SITE_GENERATION_PROMPT, buildImagenPrompt } from '../prompts.js';
import { logError } from '../monitor.js';
import { verifySessionToken } from '../auth.js';

export async function handleSaveSectionChoices(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ ok: true }), { headers: { ...CORS, "Content-Type": "application/json" } });
  }
  const { sessionId, chosen } = body;
  if (sessionId && chosen) {
    try {
      const raw = await env.SESSIONS.get(sessionId);
      if (raw) {
        const s = JSON.parse(raw);
        s.sectionChoices = chosen;
        await env.SESSIONS.put(sessionId, JSON.stringify(s), { expirationTtl: 60 * 60 * 24 * 30 });
      }
    } catch (_) {
    }
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { ...CORS, "Content-Type": "application/json" } });
}

export async function handleDeployPickerSite(request, env) {
  const body = await request.json();
  const { sessionId, html, chosen, segment } = body;
  if (!sessionId || !html)
    return json({ error: "sessionId and html required" }, 400);
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  try {
    await env.UPLOADS.put(`sessions/${sessionId}/site.html`, html, {
      httpMetadata: { contentType: "text/html; charset=utf-8" }
    });
  } catch (e) {
    return json({ error: "Failed to store site: " + e.message }, 500);
  }
  const rawBrand = (bp.part1?.brandNames?.[0] || "site").toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 28);
  const slug = rawBrand + "-" + Math.random().toString(36).slice(2, 6);
  const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
  const liveUrl = `${origin}/s/${slug}`;
  try {
    const optimizedHtml = injectSEO(html, bp, liveUrl, slug);
    await env.UPLOADS.put(`sites/${slug}/index.html`, optimizedHtml, {
      httpMetadata: { contentType: "text/html; charset=utf-8" }
    });
  } catch (e) {
    return json({ error: "Deploy failed: " + e.message }, 500);
  }
  session.siteGenerated = true;
  session.cfDeployed = true;
  session.siteUrl = liveUrl;
  session.siteSlug = slug;
  session.seoOptimized = true;
  if (chosen)
    session.sectionChoices = chosen;
  try {
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  } catch (_) {
  }
  try {
    await env.DB.prepare("UPDATE sessions SET cf_deployed = 1, pages_url = ? WHERE id = ?").bind(liveUrl, sessionId).run();
  } catch (_) {
  }
  try {
    await logEvent(env, sessionId, "site_deployed_picker", { url: liveUrl, slug, fast: true });
  } catch (_) {
  }
  if (session.email && env.RESEND_API_KEY) {
    const brandName = bp.part1?.brandNames?.[0] || "Your Brand";
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
        to: [session.email],
        subject: "Your website is live",
        html: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px 20px;background:#fff;"><h2>Your site is live.</h2><p>Visit it here: <a href="${liveUrl}">${liveUrl}</a></p></body></html>`
      })
    }).catch(() => {
    });
  }
  return json({ ok: true, url: liveUrl, slug });
}

export async function handleGenerateSite(request, env) {
  const body = await request.json();
  const { sessionId, testimonialPref, customTestimonials, segmentIntake, segment, userPhotoUrl } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (!session.blueprint)
    return json({ error: "Blueprint not ready" }, 400);
  const preGenValidation = validateBlueprint(session.blueprint);
  if (!preGenValidation.passed) {
    console.log("[SiteGen Blueprint QA] Pre-gen validation failed, repairing. score=" + preGenValidation.score);
    const preGenRepair = autoRepairBlueprint(session.blueprint);
    session.blueprint = preGenRepair.blueprint;
    if (preGenRepair.repairCount > 0) {
      console.log("[SiteGen Blueprint QA] Repaired " + preGenRepair.repairCount + ": " + preGenRepair.repairs.join("; "));
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    }
  }
  const bp_for_theme = session.blueprint?.blueprint || session.blueprint || {};
  const themeAesthetic = bp_for_theme?.part1?.visualDirection?.aesthetic || "";
  const theme = selectTheme(segment, themeAesthetic);
  console.log("[SiteGen] theme=" + theme + " segment=" + segment + " aesthetic=" + themeAesthetic.substring(0, 60));
  let prompt, head;
  try {
    const result = SITE_GENERATION_PROMPT(session.blueprint.blueprint || session.blueprint, theme);
    prompt = result.prompt;
    head = result.head;
  } catch (e) {
    return json({ error: "Prompt build failed: " + e.message }, 500);
  }
  if (testimonialPref === "skip") {
    prompt = prompt.replace(/TESTIMONIAL STYLE:.*/, "TESTIMONIALS: Do NOT include any testimonials section. Skip it entirely.");
    prompt = prompt.replace(/- Write 2 testimonials max.*\n?/, "- Do NOT include any testimonials.\n");
  } else if (testimonialPref === "custom" && customTestimonials) {
    prompt = prompt.replace(/TESTIMONIAL STYLE:.*/, "TESTIMONIALS: Use these REAL testimonials from the client (use them verbatim, do not invent new ones):\n" + customTestimonials);
    prompt = prompt.replace(/- Write 2 testimonials max.*\n?/, "- Use the provided real testimonials exactly as given. Do not make up new ones.\n");
  }
  if (segmentIntake && !segmentIntake.skipped) {
    const intake = segmentIntake;
    const intakeLines = [];
    if (intake.bookingUrl)
      intakeLines.push("BOOKING LINK: " + intake.bookingUrl + ' (use this as the href for ALL "Book a Call", "Book Now", "Schedule", and "Book for Your Event" buttons)');
    if (intake.methodologyName)
      intakeLines.push('METHODOLOGY NAME: "' + intake.methodologyName + '" \u2014 use this exact name when referencing their process or framework');
    if (intake.startingPrice)
      intakeLines.push("STARTING PRICE: " + intake.startingPrice + " \u2014 anchor offers section with this number");
    if (intake.topCredential)
      intakeLines.push("TOP CREDENTIAL: " + intake.topCredential + " \u2014 weave into Hero subheadline and About section");
    if (intake.platformUrl)
      intakeLines.push("COURSE/COMMUNITY LINK: " + intake.platformUrl + ' (use this as href for ALL "Enroll", "Join Now", "Get Access" buttons)');
    if (intake.leadMagnet)
      intakeLines.push("FREE RESOURCE/LEAD MAGNET: " + intake.leadMagnet + " \u2014 use as the Hero CTA offer");
    if (intake.studentCount)
      intakeLines.push("STUDENT/MEMBER COUNT: " + intake.studentCount + " \u2014 use in proof/stats section as the real number");
    if (intake.bestResult)
      intakeLines.push("BEST CLIENT RESULT: " + intake.bestResult + " \u2014 use verbatim as the testimonial quote");
    if (intake.portfolioUrl)
      intakeLines.push("PORTFOLIO LINK: " + intake.portfolioUrl + ' (use as href for "See My Work" and "View Portfolio" buttons)');
    if (intake.inquiryUrl)
      intakeLines.push("PROJECT INQUIRY LINK: " + intake.inquiryUrl + ' (use as href for "Start a Project", "Get a Quote", "Work With Me" buttons)');
    if (intake.coreServices)
      intakeLines.push("CORE SERVICES: " + intake.coreServices + " \u2014 use these exact service names in the Services section");
    if (intake.projectTimeline)
      intakeLines.push("PROJECT TIMELINE: " + intake.projectTimeline + " \u2014 mention in the Process section step 3");
    if (intake.speakerReelUrl)
      intakeLines.push("SPEAKER REEL: " + intake.speakerReelUrl + " \u2014 embed as a video below the Hero section");
    if (intake.bookUrl)
      intakeLines.push("BOOK LINK: " + intake.bookUrl + ' (use as href for "Buy the Book" and "Order Now" buttons)');
    if (intake.keynoteTopics)
      intakeLines.push("KEYNOTE TOPICS: " + intake.keynoteTopics + " \u2014 use these exact topic names in the Speaking Topics section");
    if (intake.bookingContact)
      intakeLines.push("SPEAKING BOOKING: " + intake.bookingContact + ' (use as href for "Book for Your Event" and "Inquire" buttons)');
    if (intake.address)
      intakeLines.push("OFFICE ADDRESS: " + intake.address + " \u2014 display in footer with map embed if possible");
    if (intake.hours)
      intakeLines.push("HOURS: " + intake.hours + " \u2014 display in Contact/Footer section");
    if (intake.insurancePayment)
      intakeLines.push("INSURANCE/PAYMENT: " + intake.insurancePayment + " \u2014 display in Contact or Services section");
    if (intakeLines.length > 0) {
      prompt += "\n\nSEGMENT INTAKE DATA \u2014 USE THIS REAL INFORMATION:\n" + intakeLines.join("\n") + "\nIMPORTANT: Use this data verbatim wherever relevant. Real links must appear as real href values. Real numbers must appear as real text. Do NOT replace with placeholders.";
    }
  }
  const segmentGuidanceMap = {
    speaker: 'SEGMENT: SPEAKER \u2014 This person speaks on stages. Prioritize: bold dramatic hero (full-height, .hero with large h1), a prominent pull-quote (.quote-block) from a keynote or talk, a speaking topics card grid, social proof from event organizers. The booking CTA should say "Book [Name] to Speak". Emphasize presence, authority, stage credibility.',
    creator: "SEGMENT: CREATOR \u2014 This person builds an audience and sells digital products or courses. Prioritize: energetic hero, subscriber or community count in hero stats, course/product offer cards, creator story in about. The primary CTA should drive to the lead magnet or course enrollment.",
    local: 'SEGMENT: LOCAL/SERVICE \u2014 This person serves local clients or runs a service business. Prioritize: clear value prop hero, trust signals (years in business, clients served, reviews), services section with clear pricing or "get a quote" CTAs, easy contact section with address and hours. Keep it simple and conversion-focused.',
    service: "SEGMENT: SERVICE \u2014 This person offers a professional service. Prioritize: clear value prop hero, trust signals, services section with clear pricing, easy contact section. Keep it conversion-focused.",
    expert: "SEGMENT: EXPERT/COACH \u2014 This person has a methodology and coaches individuals or companies. Prioritize: authority-building hero, unique mechanism section explaining their signature system, transformation proof (before/after results), offer ladder from entry to premium. The hero should feel like the start of a journey."
  };
  const segmentKey = segment || "expert";
  const segmentGuidance = segmentGuidanceMap[segmentKey] || segmentGuidanceMap["expert"];
  prompt += "\n\n\u2501\u2501\u2501 SEGMENT \u2501\u2501\u2501\n" + segmentGuidance;
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const imagenPromptText = buildImagenPrompt(bp.part1 || {}, bp.part3 || {}, bp.part5?.heroImageTheme);
  const GEMINI_PROXY = "https://gemini-proxy.james-d13.workers.dev";
  const PROXY_AUTH = env.GEMINI_PROXY_TOKEN || "";
  const geminiCall = env.GEMINI_PROXY ? env.GEMINI_PROXY.fetch.bind(env.GEMINI_PROXY) : fetch;
  const _ctxSeg = (segment || bp?.part1?.segment || "expert").toLowerCase();
  const _ctxAes = (bp?.part1?.visualDirection?.aesthetic || "clean modern professional").toLowerCase();
  const _ctxDelivery = (bp?.part1?.deliveryMode || "").toLowerCase();
  let _contextPhotoPrompt;
  if (/speak|catalyst|stage|keynote/.test(_ctxSeg) || /speak|stage|keynote/.test(_ctxDelivery)) {
    _contextPhotoPrompt = `Dramatic empty stage with warm amber spotlights, professional auditorium from backstage angle, lectern visible, ${_ctxAes} aesthetic, editorial photography, cinematic depth of field, no people`;
  } else if (/somatic|wellness|coach|luminary|mind|body|heal/.test(_ctxSeg) || /somatic|heal|wellness/.test(_ctxDelivery)) {
    _contextPhotoPrompt = `Serene coaching studio, warm natural light through sheer curtains, two comfortable chairs facing each other, small wooden table with a candle and journal, plants, ${_ctxAes} color palette, editorial photography, no people`;
  } else if (/consult|architect|strategy|b2b|corporate|analyst/.test(_ctxSeg) || /consult|strategy/.test(_ctxDelivery)) {
    _contextPhotoPrompt = `Clean modern boardroom, dark navy walls, whiteboard with minimal geometric diagrams, copper desk lamp accent, architectural lines, ${_ctxAes} aesthetic, editorial photography, shallow depth of field, no people`;
  } else if (/local|neighbor|service|trade|landscap/.test(_ctxSeg)) {
    _contextPhotoPrompt = `Professional service workspace, organized tools and materials, natural light, clean environment, ${_ctxAes} aesthetic, editorial photography, no people`;
  } else {
    _contextPhotoPrompt = `Sophisticated home office or studio workspace, clean minimal desk with open notebook and coffee, warm afternoon light through window, bookshelf in background, ${_ctxAes} color palette, editorial photography, no people`;
  }
  const [bodyContent, imagenResult, _contextPhotoResult] = await Promise.allSettled([
    callClaudeSiteGen(env, prompt, 8e3),
    geminiCall(`${GEMINI_PROXY}/v1beta/models/imagen-4.0-generate-001:predict`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROXY_AUTH}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [{ prompt: imagenPromptText }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
      })
    }).then((r) => r.json()).catch(() => null),
    userPhotoUrl ? Promise.resolve(null) : geminiCall(`${GEMINI_PROXY}/v1beta/models/imagen-4.0-generate-001:predict`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${PROXY_AUTH}`, "Content-Type": "application/json" },
      body: JSON.stringify({ instances: [{ prompt: _contextPhotoPrompt }], parameters: { sampleCount: 1, aspectRatio: "1:1" } })
    }).then((r) => r.json()).catch(() => null)
  ]);
  let claudeBody = bodyContent.status === "fulfilled" ? bodyContent.value : "";
  let firstValidation = validateSiteHTML(claudeBody);
  if (firstValidation.summary === "FAIL_CRITICAL" && claudeBody.length < 3e3) {
    try {
      const retryBody = await callClaudeSiteGen(env, prompt, 8e3);
      const retryValidation = validateSiteHTML(retryBody);
      if (retryValidation.score > firstValidation.score) {
        claudeBody = retryBody;
        firstValidation = retryValidation;
      }
    } catch (_retryErr) {
    }
  }
  const repairResult = autoRepairSiteHTML(claudeBody, session.blueprint);
  let bodyHtml = repairResult.html;
  const navIdx = bodyHtml.search(/<nav[\s>]/i);
  if (navIdx > 0)
    bodyHtml = bodyHtml.slice(navIdx);
  const finalValidation = validateSiteHTML(bodyHtml);
  let heroImageDataUrl = null;
  if (imagenResult.status === "fulfilled" && imagenResult.value?.predictions?.[0]?.bytesBase64Encoded) {
    const b64 = imagenResult.value.predictions[0].bytesBase64Encoded;
    const mimeType = imagenResult.value.predictions[0].mimeType || "image/jpeg";
    heroImageDataUrl = `data:${mimeType};base64,${b64}`;
  }
  if (!heroImageDataUrl) {
    const aes = (bp.part1?.visualDirection?.aesthetic || "").toLowerCase();
    const HERO_FALLBACKS = {
      executive: "photo-1497366216548-37526070297c",
      corporate: "photo-1486406146926-c627a92ad1ab",
      bold: "photo-1519834785169-98be25ec3f84",
      energetic: "photo-1517836357463-d25dfeac3438",
      warm: "photo-1506126613408-eca07ce68773",
      wellness: "photo-1545205597-3d9d02c29597",
      coach: "photo-1571019613454-1cb2f99b2d8b",
      modern: "photo-1488590528505-98d2b5aba04b",
      minimal: "photo-1618005182384-a83a8bd57fbe",
      creative: "photo-1558618666-fcd25c85f82e"
    };
    let fallbackId = "photo-1522202176988-66273c2fd55f";
    for (const [key, id] of Object.entries(HERO_FALLBACKS)) {
      if (aes.includes(key)) {
        fallbackId = id;
        break;
      }
    }
    heroImageDataUrl = `https://images.unsplash.com/${fallbackId}?w=1600&q=80&auto=format`;
  }
  const segmentCSSMap = {
    speaker: `
  /* \u2500\u2500 SPEAKER segment \u2500\u2500 */
  .hero { min-height: 92vh; }
  .hero h1 { font-size: clamp(2rem, 3.6vw, 3.2rem); }
  .hero-sub { font-size: clamp(1.1rem, 2.2vw, 1.35rem); max-width: 640px; margin: 0 auto 36px; }
  .section-header h2 { font-size: clamp(2rem, 4vw, 3.2rem); }
  /* Stage presence: large quote pull */
  .quote-block { font-size: clamp(1.4rem, 2.8vw, 2rem); font-style: italic; text-align: center; max-width: 760px; margin: 0 auto; line-height: 1.4; color: var(--primary); }`,
    creator: `
  /* \u2500\u2500 CREATOR segment \u2500\u2500 */
  .hero { min-height: 80vh; }
  .hero h1 { font-size: clamp(2rem, 3.4vw, 3rem); }
  .card-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
  .card { padding: 28px 24px; }
  .offer-card { border-radius: 18px; }
  /* Creator energy: warm tint alternating sections */
  section:nth-of-type(even) { background: var(--bg); }`,
    local: `
  /* \u2500\u2500 LOCAL/SERVICE segment \u2500\u2500 */
  .hero { min-height: 70vh; }
  .hero h1 { font-size: clamp(2rem, 3.4vw, 3rem); }
  /* Trust signals prominent */
  .hero-stats { justify-content: center; gap: 40px; margin-top: 40px; }
  .hero-stat-num { font-size: clamp(2rem, 4vw, 3rem); }
  /* Contact CTA more visible */
  .cta-section { padding: 80px 0; }`,
    service: `
  /* \u2500\u2500 SERVICE segment \u2500\u2500 */
  .hero { min-height: 70vh; }
  .hero h1 { font-size: clamp(2rem, 3.4vw, 3rem); }
  .hero-stats { justify-content: center; gap: 40px; margin-top: 40px; }
  .hero-stat-num { font-size: clamp(2rem, 4vw, 3rem); }
  .cta-section { padding: 80px 0; }`,
    expert: `
  /* \u2500\u2500 EXPERT/COACH segment \u2500\u2500 */
  .hero { min-height: 84vh; }
  .hero h1 { font-size: clamp(2rem, 3.6vw, 3.2rem); }
  .about-inner { gap: 80px; }
  .section-header h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); }`
  };
  const segmentCSS = segmentCSSMap[segment] || segmentCSSMap["expert"];
  const segmentStyle = `<style>${segmentCSS}</style>`;
  const heroStyle = `<style>.hero{background-image:url('${heroImageDataUrl}');}</style>`;
  const styledHead = head.replace("</head>", `${heroStyle}
${segmentStyle}
</head>`);
  let finalBodyHtml = bodyHtml;
  let _effectivePhotoUrl = userPhotoUrl;
  if (!_effectivePhotoUrl && _contextPhotoResult && _contextPhotoResult.status === "fulfilled" && _contextPhotoResult.value?.predictions?.[0]?.bytesBase64Encoded) {
    const _cB64 = _contextPhotoResult.value.predictions[0].bytesBase64Encoded;
    const _cMime = _contextPhotoResult.value.predictions[0].mimeType || "image/jpeg";
    _effectivePhotoUrl = `data:${_cMime};base64,${_cB64}`;
  }
  if (_effectivePhotoUrl) {
    finalBodyHtml = finalBodyHtml.replace(
      /(<div[^>]*class="[^"]*about-photo[^"]*"[^>]*>)\s*(<\/div>)/,
      `$1<img src="${_effectivePhotoUrl}" alt="About photo" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;" />$2`
    );
    finalBodyHtml = finalBodyHtml.replace(
      /(<div[^>]*class="[^"]*about-photo[^"]*"[^>]*>)[^<]*(<\/div>)/,
      `$1<img src="${_effectivePhotoUrl}" alt="About photo" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;" />$2`
    );
  }
  const cleanHtml = `<!DOCTYPE html>
<html lang="en" data-segment="${segment || "expert"}" data-theme="${theme}">
${styledHead}
<body>
${finalBodyHtml}
</body>
</html>`;
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, cleanHtml, {
    httpMetadata: { contentType: "text/html" }
  });
  session.siteGenerated = true;
  session.siteHtml = cleanHtml.substring(0, 500);
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  try {
    await env.DB.prepare("UPDATE sessions SET site_generated = 1, version = version + 1 WHERE id = ?").bind(sessionId).run();
  } catch (_) {
  }
  await logEvent(env, sessionId, "site_generated", {
    qualityScore: finalValidation.score,
    qualityPassed: finalValidation.passed,
    issues: finalValidation.issues.length,
    warnings: finalValidation.warnings.length,
    repairs: repairResult.repairCount,
    htmlSize: cleanHtml.length,
    hadImagenImage: !!imagenResult.value?.predictions?.[0]?.bytesBase64Encoded
  });
  return json({ ok: true, html: cleanHtml, quality: { score: finalValidation.score, passed: finalValidation.passed, issues: finalValidation.issues, repairs: repairResult.repairs } });
}

export async function handleServeSite(path, env) {
  const parts = path.replace(/^\/s\//, "").split("/");
  const slug = parts[0];
  const filePath = parts.slice(1).join("/") || "index.html";
  if (!slug || slug.length < 2) {
    return new Response("Not found", { status: 404 });
  }
  const r2Key = `sites/${slug}/${filePath}`;
  const obj = await env.UPLOADS.get(r2Key);
  if (!obj) {
    return new Response(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Site Not Found</title>
<style>body{font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;padding:0 20px;color:#333;text-align:center;}
h1{font-size:1.4rem;}code{background:#eee;padding:2px 8px;border-radius:4px;}</style></head>
<body><h1>Site Not Found</h1><p>No site exists at <code>${slug.replace(/[<>"'&]/g, "")}</code>.</p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
  const ext = filePath.split(".").pop().toLowerCase();
  const types = {
    html: "text/html; charset=utf-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff2: "font/woff2",
    woff: "font/woff",
    ttf: "font/ttf",
    pdf: "application/pdf"
  };
  const ct = types[ext] || "application/octet-stream";
  const headers = { "Content-Type": ct, "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "https://love.jamesguldan.com" };
  if (ext === "html") {
    headers["X-Content-Type-Options"] = "nosniff";
  }
  return new Response(obj.body, { headers });
}

export async function handleDeploy(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (!session.siteGenerated)
    return json({ error: "Site not generated yet" }, 400);
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj)
    return json({ error: "Site file not found" }, 404);
  const siteHtml = await siteObj.text();
  const bp = session.blueprint?.blueprint || session.blueprint || {};
  const rawBrand = bp.part1?.brandNames?.[0] || "";
  const cleanBrand = rawBrand.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 28);
  const slug = cleanBrand ? `${cleanBrand}-${Math.random().toString(36).slice(2, 6)}` : `site-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const liveUrl = `${origin}/s/${slug}`;
    const optimizedHtml = injectSEO(siteHtml, bp, liveUrl, slug);
    await env.UPLOADS.put(`sites/${slug}/index.html`, optimizedHtml, {
      httpMetadata: { contentType: "text/html; charset=utf-8" }
    });
    session.cfDeployed = true;
    session.siteUrl = liveUrl;
    session.siteSlug = slug;
    session.seoOptimized = true;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    try {
      await env.DB.prepare("UPDATE sessions SET cf_deployed = 1, pages_url = ? WHERE id = ?").bind(liveUrl, sessionId).run();
    } catch (_) {
    }
    await logEvent(env, sessionId, "site_deployed", { url: liveUrl, slug, seoOptimized: true });
    if (session.email && env.RESEND_API_KEY) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
          to: [session.email],
          subject: "Your website is live",
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;"><tr><td style="padding-bottom:28px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1d1d1f;">JAMES GULDAN</p></td></tr><tr><td style="background:#1d1d1f;border-radius:20px 20px 0 0;padding:40px 40px 36px;"><p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#c4703f;">Deep Work</p><h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Your site is live.</h1><p style="margin:0;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.75;">Your brand strategy is now a real website. Built from your blueprint, deployed, and ready to share with the world.</p></td></tr><tr><td style="background:#ffffff;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;padding:36px 40px 0;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #f0f0f0;border-radius:12px;margin-bottom:28px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#86868b;">Your site URL</p><p style="margin:0;font-size:14px;"><a href="${liveUrl}" style="color:#c4703f;text-decoration:none;word-break:break-all;">${liveUrl}</a></p></td></tr></table></td></tr><tr><td style="background:#ffffff;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;border-radius:0 0 20px 20px;padding:0 40px 40px;"><table cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="border-radius:50px;background:#1d1d1f;"><a href="${liveUrl}" style="display:inline-block;background:#1d1d1f;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.01em;">Visit My Site &rarr;</a></td></tr></table><hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;"><p style="margin:0;font-size:13px;color:#86868b;line-height:1.6;">Want a custom domain? Reply here or write to <a href="mailto:james@jamesguldan.com" style="color:#c4703f;text-decoration:none;">james@jamesguldan.com</a></p></td></tr><tr><td style="padding-top:24px;text-align:center;"><p style="margin:0;font-size:12px;color:#c0c0c0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Align Consulting LLC &middot; <a href="https://love.jamesguldan.com/legal/privacy" style="color:#c0c0c0;text-decoration:none;">Privacy Policy</a> &middot; <a href="mailto:james@jamesguldan.com" style="color:#c0c0c0;text-decoration:none;">Support</a></p></td></tr></table></td></tr></table></body></html>`
        })
      }).catch(() => {
      });
    }
    return json({ ok: true, url: liveUrl, slug, seoOptimized: true });
  } catch (e) {
    console.error("Deploy error:", e);
    return json({ error: "Deployment failed: " + e.message }, 500);
  }
}

export async function handleRefineSite(request, env) {
  const body = await request.json();
  const { sessionId, category, option, customText } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const siteObj = await env.UPLOADS.get(`sessions/${sessionId}/site.html`);
  if (!siteObj)
    return json({ error: "No site to refine" }, 404);
  const currentHtml = await siteObj.text();
  const instruction = buildRefineInstruction(category, option, customText);
  const refinedBody = await callClaudeRefine(env, currentHtml, instruction);
  if (!refinedBody || refinedBody.length < 200) {
    return json({ error: "Refinement produced empty result" }, 500);
  }
  const headMatch = currentHtml.match(/<head[\s\S]*?<\/head>/i);
  const headHtml = headMatch ? headMatch[0] : '<head><meta charset="UTF-8"><title>Site</title></head>';
  let cleanBody = refinedBody.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<\/html>/gi, "").replace(/<\/body>/gi, "").replace(/<html[^>]*>/gi, "").replace(/<body[^>]*>/gi, "").replace(/<\/head>/gi, "").replace(/<head[\s\S]*?>/gi, "").trim();
  const finalHtml = `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body>
${cleanBody}
</body>
</html>`;
  await env.UPLOADS.put(`sessions/${sessionId}/site.html`, finalHtml, {
    httpMetadata: { contentType: "text/html" }
  });
  if (!session.refinements)
    session.refinements = [];
  session.refinements.push({ category, option, customText, at: (/* @__PURE__ */ new Date()).toISOString() });
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  await logEvent(env, sessionId, "site_refined", { category, option });
  return json({ ok: true, refinementCount: session.refinements.length });
}

export async function handleExport(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const blueprint = session.blueprint;
  const exportHtml = buildExportHTML(blueprint, session);
  await logEvent(env, sessionId, "export_downloaded", {});
  return new Response(exportHtml, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": 'attachment; filename="deep-work-blueprint.html"',
      ...CORS
    }
  });
}

export async function handleExportSite(request, env) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId)
    return json({ error: "Missing sessionId" }, 400);
  const authHeader = request.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = await verifySessionToken(token, getJWTSecret(env)).catch(() => null);
    if (!payload || payload.sessionId !== sessionId) {
      return json({ error: "Unauthorized" }, 401);
    }
  }
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const siteObj = await env.UPLOADS.get("sessions/" + sessionId + "/site.html");
  if (!siteObj)
    return json({ error: "Site not generated yet. Build your website first." }, 404);
  const siteHtml = await siteObj.text();
  const bp = session.blueprint?.blueprint || {};
  const brandName = bp.part1?.brandNames?.[0] || "my-site";
  const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "my-site";
  await logEvent(env, sessionId, "site_downloaded", {});
  return new Response(siteHtml, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": 'attachment; filename="' + safeName + '.html"',
      ...CORS
    }
  });
}
