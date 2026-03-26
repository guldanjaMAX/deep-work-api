// src/routes/upload.js
// Upload and image generation route handlers

import { json } from '../utils/helpers.js';
import { CORS, extractDocumentText, getJWTSecret } from '../utils/internal.js';
import { DEEP_WORK_SYSTEM_PROMPT, contextEnrichmentPrompt, imagePrompts } from '../prompts.js';
import { verifySessionToken, requireAuth, extractToken } from '../auth.js';

export async function handleUpload(request, env) {
  const formData = await request.formData();
  const file = formData.get("file");
  const sessionId = formData.get("sessionId");
  if (!file)
    return json({ error: "No file provided" }, 400);
  const ext = file.name.split(".").pop().toLowerCase();
  const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const ALLOWED_DOC_EXTS = ["pdf", "txt", "md"];
  const allAllowed = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_DOC_EXTS];
  if (!allAllowed.includes(ext)) {
    return json({ error: `File type .${ext} is not supported. Allowed: images (JPG, PNG, WebP), documents (PDF, TXT).` }, 400);
  }
  const declaredType = (file.type || "").toLowerCase();
  const ALLOWED_MIME = {
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    png: ["image/png"],
    gif: ["image/gif"],
    webp: ["image/webp"],
    svg: ["image/svg+xml"],
    pdf: ["application/pdf"],
    txt: ["text/plain"],
    md: ["text/plain", "text/markdown", ""]
  };
  const allowedMimes = ALLOWED_MIME[ext] || [];
  if (allowedMimes.length > 0 && allowedMimes[0] !== "" && !allowedMimes.includes(declaredType)) {
    return json({ error: `File content does not match extension. Expected ${allowedMimes[0]} for .${ext} files.` }, 400);
  }
  const maxSize = ALLOWED_DOC_EXTS.includes(ext) ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > maxSize) {
    return json({ error: `File too large. Maximum ${maxSize / 1024 / 1024}MB for this file type.` }, 400);
  }
  const key = `uploads/${sessionId}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
  await env.UPLOADS.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type }
  });
  const isDocument = ALLOWED_DOC_EXTS.includes(ext);
  let extractedText = "";
  if (isDocument) {
    extractedText = await extractDocumentText(env, key);
    if (extractedText) {
      const raw = await env.SESSIONS.get(sessionId);
      if (raw) {
        const session = JSON.parse(raw);
        if (!session.userData)
          session.userData = {};
        if (!session.userData.uploadedDocuments)
          session.userData.uploadedDocuments = [];
        session.userData.uploadedDocuments.push(`[Document: ${file.name}]
${extractedText}`);
        const contextExtra = contextEnrichmentPrompt(session.userData);
        session.systemPrompt = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? "\n\n" + contextExtra : "");
        await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
      }
    }
  }
  return json({
    ok: true,
    key,
    name: file.name,
    isDocument,
    textExtracted: !!extractedText,
    textPreview: extractedText ? extractedText.slice(0, 200) + "..." : void 0
  });
}

export async function handlePhotoProcess(request, env) {
  const token = extractToken(request);
  if (!token)
    return json({ error: "Authentication required" }, 401);
  const payload = await verifySessionToken(token, env.JWT_SECRET || "dev-secret-change-me");
  if (!payload)
    return json({ error: "Invalid or expired session" }, 401);
  const contentType = request.headers.get("content-type") || "";
  let photo, sessionId, mime, originalBuf;
  if (contentType.includes("application/json")) {
    let body;
    try {
      body = await request.json();
    } catch (_) {
      return json({ error: "Invalid JSON body" }, 400);
    }
    const { imageDataUrl, sessionId: sid } = body;
    if (!imageDataUrl || !sid)
      return json({ error: "imageDataUrl and sessionId are required" }, 400);
    sessionId = sid;
    const match = imageDataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
    if (!match)
      return json({ error: "Invalid imageDataUrl format" }, 400);
    mime = match[1];
    try {
      const b64 = match[2];
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++)
        bytes[i] = binary.charCodeAt(i);
      originalBuf = bytes.buffer;
    } catch (_) {
      return json({ error: "Could not decode image data" }, 400);
    }
  } else {
    let formData;
    try {
      formData = await request.formData();
    } catch (_) {
      return json({ error: "Invalid form data" }, 400);
    }
    photo = formData.get("photo");
    sessionId = formData.get("sessionId");
    if (!photo || !sessionId)
      return json({ error: "photo and sessionId are required" }, 400);
    mime = photo.type || "";
    if (!mime.startsWith("image/"))
      return json({ error: "Must be an image file" }, 400);
    try {
      originalBuf = await photo.arrayBuffer();
    } catch (_) {
      return json({ error: "Could not read photo" }, 400);
    }
  }
  if (!mime.startsWith("image/"))
    return json({ error: "Must be an image file" }, 400);
  if (originalBuf.byteLength > 10 * 1024 * 1024)
    return json({ error: "Max 10MB" }, 400);
  const dbSession = await env.DB.prepare("SELECT id, user_id FROM sessions WHERE id = ?").bind(sessionId).first();
  if (!dbSession)
    return json({ error: "Session not found" }, 404);
  if (dbSession.user_id && dbSession.user_id !== payload.userId)
    return json({ error: "Unauthorized" }, 403);
  const ext = mime.split("/")[1]?.replace("jpeg", "jpg").replace("svg+xml", "svg") || "jpg";
  const originalKey = `sessions/${sessionId}/original.${ext}`;
  await env.UPLOADS.put(originalKey, originalBuf, {
    httpMetadata: { contentType: mime },
    customMetadata: { sessionId, userId: payload.userId, uploadedAt: (/* @__PURE__ */ new Date()).toISOString() }
  });
  const PHOTO_BASE = "https://deep-work-photo-processor.james-d13.workers.dev";
  const originalUrl = `${PHOTO_BASE}/asset/${sessionId}/original.${ext}`;
  let cutoutUrl = null;
  let cutoutKey = null;
  if (env.PHOTOROOM_API_KEY) {
    try {
      const prForm = new FormData();
      prForm.append("image_file", new Blob([originalBuf], { type: mime }), `photo.${ext}`);
      const prRes = await fetch("https://sdk.photoroom.com/v1/segment", {
        method: "POST",
        headers: { "x-api-key": env.PHOTOROOM_API_KEY },
        body: prForm
      });
      if (prRes.ok) {
        const cutoutBuf = await prRes.arrayBuffer();
        cutoutKey = `sessions/${sessionId}/cutout.png`;
        await env.UPLOADS.put(cutoutKey, cutoutBuf, {
          httpMetadata: { contentType: "image/png" },
          customMetadata: { sessionId, userId: payload.userId }
        });
        cutoutUrl = `${PHOTO_BASE}/asset/${sessionId}/cutout.png`;
      }
    } catch (_) {
    }
  }
  try {
    const kvRaw = await env.SESSIONS.get(sessionId);
    if (kvRaw) {
      const kvSession = JSON.parse(kvRaw);
      if (!kvSession.userData)
        kvSession.userData = {};
      kvSession.userData.clientPhoto = {
        originalKey,
        cutoutKey,
        originalUrl,
        cutoutUrl,
        processedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await env.SESSIONS.put(sessionId, JSON.stringify(kvSession), { expirationTtl: 60 * 60 * 24 * 30 });
    }
  } catch (_) {
  }
  return json({ ok: true, originalUrl, cutoutUrl, sessionId });
}

export async function handleGenerateImages(request, env) {
  const body = await request.json();
  const { sessionId } = body;
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const blueprint = session.blueprint;
  if (!blueprint)
    return json({ error: "Blueprint not ready" }, 400);
  const PROXY_URL = "https://gemini-proxy.james-d13.workers.dev";
  const PROXY_TOKEN = env.GEMINI_PROXY_TOKEN || "";
  const generatedImages = [];
  for (let i = 0; i < 4; i++) {
    try {
      const prompt = i === 0 ? imagePrompts.hero(blueprint.blueprint) : imagePrompts.moodboard(blueprint.blueprint, i - 1);
      const res = await fetch(`${PROXY_URL}/v1beta/models/imagen-4.0-generate-001:predict`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PROXY_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: i === 0 ? "16:9" : "1:1"
          }
        })
      });
      const data = await res.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const imgData = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        const imgKey = `sessions/${sessionId}/images/img_${i}.png`;
        const imgBytes = Uint8Array.from(atob(data.predictions[0].bytesBase64Encoded), (c) => c.charCodeAt(0));
        await env.UPLOADS.put(imgKey, imgBytes, { httpMetadata: { contentType: "image/png" } });
        generatedImages.push(imgData);
      }
    } catch (e) {
      console.error("Image gen error:", e);
    }
  }
  session.generatedImageKeys = generatedImages.map((_, i) => `sessions/${sessionId}/images/img_${i}.png`);
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  return json({ ok: true, images: generatedImages });
}

export async function handleGenerateSectionImage(request, env) {
  const body = await request.json().catch(() => ({}));
  const { sessionId, sectionIndex, imageTheme } = body;
  if (!sessionId)
    return json({ error: "sessionId required" }, 400);
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  const bp = session.blueprint?.blueprint || session.blueprint;
  if (!bp)
    return json({ error: "Blueprint not ready" }, 400);
  const cacheKey = `sessions/${sessionId}/picker-images/section_${sectionIndex}.png`;
  try {
    const cached = await env.UPLOADS.get(cacheKey);
    if (cached) {
      return json({ ok: true, imageUrl: `/api/section-image?sessionId=${sessionId}&idx=${sectionIndex}`, cached: true });
    }
  } catch (_) {
  }
  const p1 = bp.part1 || {};
  const aesthetic = p1.visualDirection?.aesthetic || "clean, modern";
  const colors = (p1.visualDirection?.colors || []).map((c) => c.name || c).filter(Boolean).join(", ");
  const descriptors = (p1.brandVoice?.descriptors || []).join(", ");
  const rawSectionName = (bp.part5?.sections?.[sectionIndex]?.name || "").toLowerCase();
  const sectionMoodMap = {
    hero: "aspirational open landscape, beginning of a journey, dramatic light",
    about: "warm intimate workspace, authentic human environment, personal and real",
    services: "clean professional environment, tools of mastery, precision and craft",
    offerings: "clean professional environment, tools of mastery, precision and craft",
    offers: "clean professional environment, tools of mastery, precision and craft",
    testimonials: "warm community gathering, trust and connection, genuine human warmth",
    proof: "achievement and transformation, confident energy, results and momentum",
    results: "achievement and transformation, confident energy, results and momentum",
    faq: "calm organized space, clarity and simplicity, quiet confidence",
    contact: "open welcoming space, warmth and approachability, an open door",
    cta: "decisive powerful moment, forward momentum, confident action",
    process: "methodical crafted steps, thoughtful progression, elegant workflow",
    solution: "breakthrough moment, light after darkness, clarity emerging",
    problem: "quiet tension, relatable struggle, honest and grounded",
    method: "methodical crafted steps, thoughtful progression, elegant workflow"
  };
  const sectionMood = Object.keys(sectionMoodMap).find((k) => rawSectionName.includes(k));
  const visualMood = sectionMood ? sectionMoodMap[sectionMood] : "atmospheric lifestyle photography, professional environment, thoughtful composition";
  const resolvedTheme = imageTheme && imageTheme !== "none" && imageTheme.length > 4 ? imageTheme : null;
  const noTextRule = "IMPORTANT: absolutely no text, words, letters, numbers, labels, captions, watermarks, titles, or typography of any kind anywhere in the image. Pure photography only, zero text.";
  let prompt;
  if (resolvedTheme) {
    prompt = `${resolvedTheme}. Color palette: ${colors || "deep navy, warm copper"}. Style: ${aesthetic}. Mood: ${descriptors || "professional, clean"}. ${noTextRule} Cinematic, high quality photography. Wide 16:9 format.`;
  } else {
    prompt = `${visualMood}. Color palette: ${colors || "deep navy, warm copper"}. Style: ${aesthetic}. Mood: ${descriptors || "professional, clean"}. ${noTextRule} Atmospheric, slightly abstract or lifestyle-oriented. Wide 16:9 format.`;
  }
  const PROXY_URL = "https://gemini-proxy.james-d13.workers.dev";
  const PROXY_TOKEN = env.GEMINI_PROXY_TOKEN || "";
  try {
    const res = await fetch(`${PROXY_URL}/v1beta/models/imagen-4.0-generate-001:predict`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROXY_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
      })
    });
    const data = await res.json();
    if (!data.predictions?.[0]?.bytesBase64Encoded) {
      return json({ ok: false, error: "No image returned from Imagen" });
    }
    const b64 = data.predictions[0].bytesBase64Encoded;
    try {
      const imgBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      await env.UPLOADS.put(cacheKey, imgBytes, { httpMetadata: { contentType: "image/png" } });
    } catch (_) {
    }
    return json({ ok: true, imageUrl: `/api/section-image?sessionId=${sessionId}&idx=${sectionIndex}` });
  } catch (e) {
    console.error("Section image gen error:", e);
    return json({ ok: false, error: e.message });
  }
}

export async function handleGenerateSectionVariants(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  }
  const { sessionId, sectionIndex, feedback } = body;
  if (!sessionId)
    return new Response(JSON.stringify({ error: "Missing sessionId" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  const sessionRaw = await env.SESSIONS.get(sessionId);
  if (!sessionRaw)
    return new Response(JSON.stringify({ error: "Session not found" }), { status: 404, headers: { ...CORS, "Content-Type": "application/json" } });
  const session = JSON.parse(sessionRaw);
  const blueprint = session.blueprint?.blueprint || session.blueprint;
  if (!blueprint?.part5?.sections)
    return new Response(JSON.stringify({ error: "No blueprint sections" }), { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
  const sections = blueprint.part5.sections;
  const idx = parseInt(sectionIndex, 10) || 0;
  const section = sections[idx];
  if (!section)
    return new Response(JSON.stringify({ error: "Section index out of range" }), { status: 404, headers: { ...CORS, "Content-Type": "application/json" } });
  const p1 = blueprint.part1 || {};
  const p2 = blueprint.part2 || {};
  const p3 = blueprint.part3 || {};
  const p4 = blueprint.part4 || {};
  const brandName = (p1.brandNames || [])[0] || "Your Brand";
  const vd = p1.visualDirection || {};
  const vdColors = vd.colors || [];
  const vdFonts = vd.fonts || {};
  const primaryColor = vdColors[0] && vdColors[0].hex || "#1d1d1f";
  const secondaryColor = vdColors[2] && vdColors[2].hex || vdColors[1] && vdColors[1].hex || "#c4703f";
  const primaryFont = vdFonts.heading || vdFonts.body || "Outfit";
  const tone = (p1.toneKeywords || []).join(", ") || "professional, approachable";
  const niche = p3.nicheStatement || "";
  const avatarName = p2.avatarName || "ideal client";
  const coreOffer = (p4.offers || []).find((o) => o.tier === "core") || (p4.offers || [])[1] || {};
  const LAYOUT_DEFS = {
    A: { name: "Full-width centered", slots: "eyebrow (optional, short), headline, subheadline, cta_text", example: '{"eyebrow":"...","headline":"...","subheadline":"...","cta_text":"..."}' },
    B: { name: "Split 2-column (text + feature list)", slots: "eyebrow (optional), headline, body (2-3 sentences), cta_text, items (array of 3: {icon, title, body})", example: '{"eyebrow":"...","headline":"...","body":"...","cta_text":"...","items":[{"icon":"\u2713","title":"...","body":"..."},{"icon":"\u2192","title":"...","body":"..."},{"icon":"\u2605","title":"...","body":"..."}]}' },
    C: { name: "Dark header + card grid", slots: "eyebrow (optional), headline, subheadline, cards (array of 3: {title, body})", example: '{"eyebrow":"...","headline":"...","subheadline":"...","cards":[{"title":"...","body":"..."},{"title":"...","body":"..."},{"title":"...","body":"..."}]}' },
    D: { name: "Dark full-bleed statement", slots: 'eyebrow (optional), headline (bold and provocative), stat_number (e.g. "87%"), stat_label (e.g. "of clients see results in 30 days"), cta_text (optional)', example: '{"eyebrow":"...","headline":"...","stat_number":"87%","stat_label":"of clients...","cta_text":"..."}' },
    E: { name: "Numbers / proof strip (3 stats)", slots: 'eyebrow (optional), headline, stats (array of exactly 3: {number (e.g. "4.9\u2605"), label (short ALL CAPS), body (1 short sentence)})', example: '{"eyebrow":"...","headline":"...","stats":[{"number":"4.9\u2605","label":"RATING","body":"..."},{"number":"200+","label":"CLIENTS","body":"..."},{"number":"3x","label":"ROI","body":"..."}]}' },
    F: { name: "Story split (text + accent panel)", slots: 'eyebrow (optional), headline, body (2-3 sentences), cta_text, accent_word (1-4 bold impactful words shown large on right panel, e.g. "Built for you")', example: '{"eyebrow":"...","headline":"...","body":"...","cta_text":"...","accent_word":"Built for you"}' },
    G: { name: "Photo story split (headshot right)", slots: "eyebrow (optional), headline, body (2-3 sentences connecting to the person in the photo), cta_text, photo_caption (optional, 3-5 words about the person)", example: '{"eyebrow":"...","headline":"...","body":"...","cta_text":"...","photo_caption":"Coaching since 2018"}' },
    H: { name: "Cinematic hero (photo/gradient background, text bottom)", slots: "eyebrow (optional), headline (short and punchy, max 8 words), subheadline (1-2 sentences), cta_text", example: '{"eyebrow":"...","headline":"...","subheadline":"...","cta_text":"..."}' },
    P: { name: "Pull quote / testimonial spotlight", slots: 'headline (optional, e.g. "What clients say"), quote (the testimonial, 1-3 sentences), attribution (client first name + last initial), attribution_title (client role or company)', example: '{"headline":"What clients say","quote":"...","attribution":"Sarah K.","attribution_title":"Marketing Director"}' },
    N: { name: "Numbered steps (3-step process)", slots: "eyebrow (optional), headline, steps (array of exactly 3: {title, body})", example: '{"eyebrow":"How it works","headline":"...","steps":[{"title":"Step 1 name","body":"..."},{"title":"Step 2 name","body":"..."},{"title":"Step 3 name","body":"..."}]}' }
  };
  function getSectionType(sec) {
    var t = ((sec.name || "") + " " + (sec.purpose || "")).toLowerCase();
    if (/hero|above.fold|first impression|headline|main intro|landing/.test(t))
      return "hero";
    if (/about|story|who.*i am|my journey|background|founder|meet me|personal/.test(t))
      return "about";
    if (/service|offer|work with|package|program|solution|what.*do|coaching|consulting/.test(t))
      return "services";
    if (/testimonial|review|client.*say|proof|result|case study|success|what.*say/.test(t))
      return "testimonials";
    if (/process|how.*work|step|method|approach|framework|system|way i work/.test(t))
      return "process";
    if (/cta|call.*action|book|contact|schedule|start|ready|next step|get in touch/.test(t))
      return "cta";
    return "generic";
  }
  const SECTION_TYPE_LAYOUTS = {
    hero: ["H", "A", "G"],
    about: ["G", "F", "A"],
    services: ["C", "B", "N"],
    testimonials: ["P", "E", "D"],
    process: ["N", "B", "C"],
    cta: ["D", "A", "F"],
    generic: ["A", "B", "C"]
  };
  const sectionType = getSectionType(section);
  const layoutSet = SECTION_TYPE_LAYOUTS[sectionType] || SECTION_TYPE_LAYOUTS["generic"];
  const photoHint = sectionType === "hero" || sectionType === "about" ? "\\nPHOTO NOTE: Layouts G and H display the person's professional headshot. Write body copy and captions that complement having a personal photo present \u2014 make the person the focus." : sectionType === "testimonials" ? "\\nPHOTO NOTE: Layout P shows a small circular avatar next to the testimonial. Write a realistic, specific client testimonial with a real-sounding name and role." : "";
  const layoutDescs = layoutSet.map((l, i) => `Layout ${l} \u2014 ${LAYOUT_DEFS[l].name}: ${LAYOUT_DEFS[l].slots}`).join("\\n");
  const exampleJson = '{"variants":[' + layoutSet.map((l) => `{"layout":"${l}","title":"...","rationale":"...","confidence":85,"slots":${LAYOUT_DEFS[l].example}}`).join(",") + "]}";
  const prompt = `You are generating 3 layout variants for a section of ${brandName}'s website.

SECTION: ${section.name}
SECTION TYPE: ${sectionType}
PURPOSE: ${section.purpose}${section.content ? "\nCONTENT GUIDANCE: " + section.content.substring(0, 300) : ""}${section.visualMood ? "\nVISUAL MOOD: " + section.visualMood : ""}${section.rationale ? "\nSTRATEGIC RATIONALE: " + section.rationale : ""}${photoHint}

BRAND:
- Name: ${brandName}
- Primary color: ${primaryColor} | Accent: ${secondaryColor}
- Font: ${primaryFont} | Tone: ${tone}
- Niche: ${niche}
- Ideal client: ${avatarName}
- Core offer: ${coreOffer.name || ""} \u2014 ${coreOffer.description || ""}
${feedback ? "\nUSER FEEDBACK ON PREVIOUS OPTIONS: " + feedback + "\n(The last 3 options did not work. Use this feedback.)" : ""}

Generate exactly 3 content variants using these 3 layouts (one each, in this order):
${layoutDescs}

Rules:
- Speak directly to ${avatarName} by name or implied persona
- Headlines must be specific and outcome-focused, not generic
- Each layout must feel visually and emotionally distinct \u2014 different energy, different emphasis
- Match the section's purpose: a Hero should inspire, a Process should clarify, a Testimonial should build trust
- confidence = honest 50-95 score for how well this layout serves this specific section type
- title = short evocative name for the picker (e.g. "The Direct Hit", "Proof Points", "The Bold Claim")
- rationale = one sentence on why this layout is right for this section

Return ONLY valid JSON, no markdown or explanation:
${exampleJson}`;
  try {
    const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 2800, messages: [{ role: "user", content: prompt }] })
    });
    if (!aiResp.ok)
      throw new Error("AI error " + aiResp.status);
    const aiData = await aiResp.json();
    const text = aiData.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      throw new Error("No JSON in AI response");
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.variants?.length)
      throw new Error("No variants returned");
    return new Response(JSON.stringify({ variants: parsed.variants }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Generation failed" }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
}
