// src/routes/interview.js
// Interview and chat route handlers

import { json } from '../utils/helpers.js';
import {
  CORS, isRateLimited, logEvent, pickChatModel, MODEL_OPUS,
  trackTokenUsage, validateBlueprint, autoRepairBlueprint,
  saveToRAG, generateStrategistDebrief, updateSessionPhaseInD1,
  fireEventToDripWorker, getJWTSecret
} from '../utils/internal.js';
import { DEEP_WORK_SYSTEM_PROMPT } from '../prompts.js';
import { logError, trackAPICall, trackFunnelEvent } from '../monitor.js';
import { getUserById } from '../auth.js';

export async function handleChat(request, env) {
  const body = await request.json();
  const { sessionId, message } = body;
  if (!message || typeof message !== "string" || message.trim().length === 0)
    return json({ error: "Message is required" }, 400);
  if (message.length > 1e4)
    return json({ error: "Message is too long (max 10,000 characters)" }, 400);
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  if (session.blueprintGenerated) {
    return json({
      error: "interview_complete",
      message: "Your Deep Work Interview is complete and your blueprint has been generated. If you need to start a new session, please contact support."
    }, 403);
  }
  const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
  if (session.createdAt && Date.now() - new Date(session.createdAt).getTime() > SESSION_MAX_AGE_MS) {
    return json({
      error: "session_expired",
      message: "This session has expired. Please contact support to have your access refreshed."
    }, 403);
  }
  const MESSAGE_CAP = 200;
  if (session.messages && session.messages.length >= MESSAGE_CAP) {
    return json({
      error: "message_limit",
      message: "You have reached the message limit for this session. Your interview should be complete \u2014 check your blueprint above. If you believe this is an error, contact support."
    }, 429);
  }
  const limited = await isRateLimited(env, session.userId, sessionId);
  if (limited) {
    return json({
      error: "rate_limited",
      message: "You are sending messages too quickly. Please wait a moment and try again."
    }, 429);
  }
  session.messages.push({ role: "user", content: message });
  await logEvent(env, sessionId, "message_sent", { phase: session.phase, messageCount: session.messages.length });
  const recentMessages = session.messages.slice(-40);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const sendEvent = /* @__PURE__ */ __name222(async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  }, "sendEvent");
  const chatModel = pickChatModel(session);
  if (chatModel === MODEL_OPUS && (session.phase || 1) > (session.lastPhaseOpusUsed || 1)) {
    session.lastPhaseOpusUsed = session.phase || 1;
  }
  const streamPromise = (async () => {
    try {
      const apiStart = Date.now();
      const chatAbort = new AbortController();
      const isBlueprintPhase = (session.phase || 1) >= 7;
      const chatTimeout = setTimeout(() => chatAbort.abort(), isBlueprintPhase ? 3e5 : 9e4);
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: chatAbort.signal,
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: chatModel,
            max_tokens: isBlueprintPhase ? 16384 : 2048,
            stream: true,
            system: [
              {
                type: "text",
                text: session.systemPrompt || DEEP_WORK_SYSTEM_PROMPT,
                cache_control: { type: "ephemeral" }
              }
            ],
            messages: recentMessages
          })
        });
      } catch (fetchErr) {
        clearTimeout(chatTimeout);
        const isTimeout = fetchErr.name === "AbortError";
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: 0, errorType: isTimeout ? "timeout" : "fetch_error", errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: "error", message: isTimeout ? "The AI took too long to respond. Please try again." : "Connection error. Please check your internet and try again." });
        await writer.close();
        return;
      }
      clearTimeout(chatTimeout);
      trackAPICall(env, "anthropic", "/v1/messages", res.status, Date.now() - apiStart);
      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: `Model: ${chatModel}. ${errText.substring(0, 500)}`, sessionId });
        await sendEvent({ type: "error", message: "We hit a temporary issue generating your response. Please try sending your message again." });
        await logError(env, { endpoint: "/api/chat", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: errText, sessionId });
        await trackFunnelEvent(env, "ai_error", { phase: session.phase, status: res.status });
        await writer.close();
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let usageData = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]")
              continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: "delta", content: chunk });
              }
              if (ev.type === "message_start" && ev.message?.usage) {
                usageData.input = ev.message.usage.input_tokens || 0;
                usageData.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                usageData.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === "message_delta" && ev.usage) {
                usageData.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {
            }
          }
        }
      }
      trackTokenUsage(env, { sessionId, userId: session.userId, model: chatModel, endpoint: "/api/chat", inputTokens: usageData.input, outputTokens: usageData.output, cacheRead: usageData.cacheRead, cacheWrite: usageData.cacheWrite, phase: session.phase });
      const metadataMatch = fullContent.match(/METADATA:\{([^}]+)\}/);
      let metadata = { phase: session.phase, phaseProgress: 0, sessionComplete: false };
      if (metadataMatch) {
        try {
          metadata = JSON.parse(`{${metadataMatch[1]}}`);
        } catch (_) {
        }
      }
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\r?\n?([\s\S]*?)\r?\n?```/) || fullContent.match(/```json\r?\n?([\s\S]*\})\s*(?:```|$)/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          const bpValidation = validateBlueprint(blueprint);
          console.log("[Blueprint QA] session=" + sessionId + " score=" + bpValidation.score + " summary=" + bpValidation.summary + " issues=" + bpValidation.issues.length + " warnings=" + bpValidation.warnings.length);
          if (!bpValidation.passed) {
            const bpRepair = autoRepairBlueprint(blueprint);
            blueprint = bpRepair.blueprint;
            if (bpRepair.repairCount > 0) {
              console.log("[Blueprint QA] Repaired " + bpRepair.repairCount + " issues: " + bpRepair.repairs.join("; "));
            }
            const postRepairValidation = validateBlueprint(blueprint);
            console.log("[Blueprint QA] Post-repair score=" + postRepairValidation.score + " summary=" + postRepairValidation.summary);
          }
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
          await saveToRAG(env, session, blueprint);
          const li2 = blueprint?.leadIntel;
          if (li2) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(
                sessionId,
                session.userId || null,
                session.email || session.phone || null,
                session.phone || null,
                li2.estimatedRevenue || "Unknown",
                li2.industry || "Unknown",
                li2.yearsInBusiness || "Unknown",
                li2.teamSize || "Unknown",
                li2.hasExistingBrand ? 1 : 0,
                li2.hasExistingWebsite ? 1 : 0,
                li2.hasInternalTeam ? 1 : 0,
                li2.brandMaturity || "Unknown",
                li2.buyingTemperature || "Unknown",
                li2.biggestPainPoint || "",
                li2.budgetSignals || "",
                li2.bestFitService || "",
                li2.bestFitReason || "",
                JSON.stringify(li2.notableQuotes || []),
                li2.followUpAngle || "",
                blueprint?.blueprint?.part8?.recommendation || "self_guided"
              ).run();
            } catch (liErr) {
            }
          }
          if (session.userId) {
            getUserById(env, session.userId).then((user) => {
              if (user?.email) {
                fireEventToDripWorker(env, user.email, "interview_completed", {
                  name: user.name || "",
                  phone: session.phone || session.userData?.phone || "",
                  highlight_quote: blueprint?.blueprint?.debrief?.paragraph3_quote || (blueprint?.blueprint?.leadIntel?.notableQuotes?.[0]) || "",
                  niche_statement: blueprint?.blueprint?.part3?.nicheStatement || "",
                  brand_name: (blueprint?.blueprint?.part1?.brandNames?.[0]) || blueprint?.blueprint?.part1?.brandName || "",
                  next_step: blueprint?.blueprint?.part8?.recommendation || "self_guided"
                }).catch(() => {
                });
              }
            }).catch(() => {
            });
          }
        } catch (_) {
        }
      }
      const cleanContent = fullContent.replace(/METADATA:\{[^\n]*\}/g, "").replace(/```json[\s\S]*?```/g, "").trim();
      session.messages.push({ role: "assistant", content: fullContent });
      if (metadata.phase)
        session.phase = metadata.phase;
      if (blueprint) {
        try {
          await sendEvent({ type: "debrief_status", message: "Your strategist is writing you a personal note..." });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: "debrief", debrief });
          }
        } catch (debriefErr) {
        }
      }
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
      await updateSessionPhaseInD1(env, sessionId, session.phase, session.messages.length, session.blueprintGenerated);
      await logEvent(env, sessionId, "message_received", {
        phase: session.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete
      });
      await sendEvent({
        type: "metadata",
        phase: metadata.phase,
        phaseProgress: metadata.phaseProgress,
        sessionComplete: metadata.sessionComplete || session.blueprintGenerated,
        blueprint
      });
      await sendEvent({ type: "done" });
      await writer.close();
    } catch (err) {
      console.error("Stream error:", err);
      try {
        await sendEvent({ type: "error", message: err.message });
        await writer.close();
      } catch (_) {
      }
    }
  })();
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...CORS
    }
  });
}

export async function handleIntakeChat(request, env) {
  const body = await request.json();
  const { sessionId, fieldKey, messages } = body;
  if (!fieldKey || !messages || !Array.isArray(messages))
    return json({ error: "fieldKey and messages are required" }, 400);
  let blueprintCtx = "";
  if (sessionId) {
    try {
      const raw = await env.SESSIONS.get(sessionId);
      if (raw) {
        const session = JSON.parse(raw);
        const bp = session.blueprint || {};
        const p3 = bp.part3 || {};
        const p4 = bp.part4 || {};
        const p1 = bp.part1 || {};
        const niche = p3.nicheStatement || "";
        const offers = (p4.offers || []).map((o) => o.name || "").filter(Boolean).join(", ");
        const avatar = p3.dreamCustomer || p3.idealClient || "";
        const tone = (p1.toneKeywords || []).join(", ");
        blueprintCtx = [
          niche ? "NICHE: " + niche : "",
          offers ? "OFFERS: " + offers : "",
          avatar ? "IDEAL CLIENT: " + avatar : "",
          tone ? "TONE: " + tone : ""
        ].filter(Boolean).join("\n");
      }
    } catch (_) {
    }
  }
  const FIELD_PROMPTS = {
    startingPrice: `You are a friendly pricing coach helping a coach or consultant figure out what to charge. Your job is to help them arrive at a confident starting price or price range in 2-3 short messages.

Ask them: (1) What transformation do clients get, and how long does the engagement typically last? (2) What have they charged before, or what feels scary-high but maybe right?

Then, in your final message, give a specific recommended price or range (e.g. "Starting at $2,500" or "$3K\u2013$5K/month") and end with exactly:
SUGGESTION: [your recommended price text here]

Keep messages short \u2014 2-4 sentences max. Be warm and encouraging. No lecture. Just help them land on a number.`,
    methodologyName: `You are a brand naming coach helping a consultant or coach name their signature process or framework. Your job is to help them land on a compelling methodology name in 2-3 messages.

Ask them: (1) Walk me through the main steps or phases of what you do with clients \u2014 even roughly. (2) Is there a metaphor, outcome, or feeling that captures the transformation?

Then suggest 3 name options (e.g. "The Clarity Sprint", "The Growth OS", "The 90-Day Breakthrough") and end with exactly:
SUGGESTION: [your top recommended name here]

Keep messages short and energetic. Make the names feel aspirational and ownable.`,
    bestResult: `You are a copywriter helping a course creator or coach articulate their best student result as a compelling one-liner. Your goal is a real, specific, before-and-after result in 2 messages.

Ask them: Tell me about a student or client who had a great result \u2014 what did they start with, and what did they achieve? (Ballpark numbers or story, doesn't have to be exact.)

Then craft a punchy result statement (e.g. "Went from 0 to $8K/month in 90 days" or "Landed their first 5 clients in 6 weeks") and end with exactly:
SUGGESTION: [your result statement here]

One question only. Keep your response under 3 sentences.`,
    coreServices: `You are a business strategist helping a service provider clearly name their 3 core services. Your goal is 3 clean, client-facing service names in 1-2 messages.

Ask them: What are the 3 main things you do for clients? Just describe them briefly \u2014 I'll help you turn them into clean names.

Then give them 3 polished service names separated by commas (e.g. "Brand Identity, Website Design, Marketing Strategy") and end with exactly:
SUGGESTION: [service 1, service 2, service 3]

Be direct. Suggest professional-sounding names, not internal jargon.`,
    keynoteTopics: `You are a speaker agency consultant helping a speaker define their top keynote topics. Your goal is 2-3 tight topic names in 2 messages.

Ask them: What themes do you get booked to speak on most? And who is typically in the audience \u2014 is it corporate, entrepreneurs, women in leadership, etc.?

Then suggest 2-3 sharp keynote topic names (e.g. "Leading Through Uncertainty, Building Resilient Teams, The Future of Work") and end with exactly:
SUGGESTION: [topic 1, topic 2, topic 3]

Make the topic names feel big-stage worthy. Short, powerful, memorable.`,
    testimonials: `You are a testimonial writing coach helping a professional get 2-3 compelling client testimonials onto their website. Your goal: help them recall specific client wins, then turn those rough stories into polished, believable quotes in 2-3 exchanges.

Start with: "Think of 1-3 clients who got real results with you \u2014 the ones you're most proud of. For each one, tell me: what were they struggling with when they came to you, what changed while working together, and where are they now? Give me the messy version \u2014 I'll make it shine."

Once you have enough material (even rough), write 2-3 polished testimonials in this exact format:
"[Transformation quote \u2014 specific result, emotional truth, 2-3 sentences. No generic praise. Real details only.]"
\u2014 [First Name], [Role or short descriptor]

Then end with exactly:
SUGGESTION: [all testimonials, each on its own line, separated by a blank line]

Rules: One client story = one testimonial. Make each one feel like a real person said it. Include a specific number, timeframe, or outcome whenever possible. No "working with [name] was amazing" generics.`
  };
  const systemPrompt = FIELD_PROMPTS[fieldKey];
  if (!systemPrompt)
    return json({ error: "Unknown fieldKey: " + fieldKey }, 400);
  const FIELD_KICKOFFS = {
    startingPrice: "What transformation do clients get when they work with you, and how long does the engagement typically last?",
    methodologyName: "Walk me through the main steps or phases of what you do with clients \u2014 even roughly. What happens from start to finish?",
    bestResult: "Tell me about a student or client who had a great result \u2014 what did they start with, and what did they achieve? Ballpark numbers or a story, doesn't have to be exact.",
    coreServices: "What are the 3 main things you do for clients? Just describe them in plain terms \u2014 I'll help turn them into clean service names.",
    keynoteTopics: "What themes do you get booked to speak on most? And who is typically in the audience \u2014 corporate, entrepreneurs, women in leadership, etc.?",
    testimonials: "Think of 1\u20133 clients who got real results with you \u2014 the ones you're most proud of. For each one, tell me: what were they struggling with when they came to you, what changed while working together, and where are they now? Give me the messy version \u2014 I'll make it shine."
  };
  if (!messages.length) {
    const kickoff = FIELD_KICKOFFS[fieldKey];
    if (kickoff)
      return json({ ok: true, reply: kickoff, suggestion: null });
  }
  const fullSystem = systemPrompt + (blueprintCtx ? "\n\nCONTEXT ABOUT THIS PERSON:\n" + blueprintCtx : "");
  const truncatedMessages = messages.slice(-10);
  try {
    const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      system: fullSystem,
      messages: truncatedMessages,
      max_tokens: 300,
      temperature: 0.7
    });
    const reply = (aiResponse.response || "").trim();
    let suggestion = null;
    const suggMatch = reply.match(/SUGGESTION:\s*\[?([^\]\n]+)\]?/i);
    if (suggMatch)
      suggestion = suggMatch[1].trim();
    return json({ ok: true, reply, suggestion });
  } catch (err) {
    return json({ error: "AI error: " + (err.message || String(err)) }, 500);
  }
}

export async function handleTestBlueprint(request, env) {
  const fakeMessages = [
    { role: "assistant", content: `Before we dive in, let\u2019s take a breath. Seriously. This work goes a lot deeper when you\u2019re not still half-distracted by whatever was happening 10 minutes ago. Take three slow breaths with me. In through the nose, hold for a beat, out through the mouth. I\u2019ll be here.

Good. The reason this matters is that what we are about to do together is not a questionnaire. It\u2019s an excavation. We\u2019re going to find the things about you that most people never bother to articulate. That takes presence. So thank you for showing up ready to actually go there.

I\u2019m your brand strategist for this session. Think of me as a really smart friend who happens to know a lot about positioning, offers, and what actually makes people choose you over everyone else. I don\u2019t do corporate speak. I don\u2019t do fluff. I do honest, and I do deep.

What do you do, and how did you end up doing it? Not the elevator pitch version. The real version. The one with the twist in it.
METADATA:{"phase":1,"phaseProgress":10,"sessionComplete":false,"key":"Opening the session"}` },
    { role: "user", content: `I run a leadership coaching company called Peak Performance Partners. I work with mid-level executives at Fortune 500 companies who are stuck in that weird zone where they are too senior for generic training programs but not senior enough for the C-suite coaches. I got into this because I spent 15 years climbing the corporate ladder at Microsoft, made it to VP of Product, and then one day realized I was great at developing my team but terrible at developing myself. I burned out hard, took six months off, did a bunch of therapy and executive coaching myself, and came out the other side thinking "this stuff saved my career and probably my marriage, but most people like me would never seek it out because there is such a stigma." So I started doing it myself. That was four years ago. I have worked with about 200 leaders since then.` },
    { role: "assistant", content: `That. Right there. "Too senior for generic training, not senior enough for C-suite coaches." That is a real gap and I can already feel the positioning potential in it.

Tell me about the burnout. Not the polished version you tell at keynotes. What was the actual moment you knew something had to change?
METADATA:{"phase":1,"phaseProgress":35,"sessionComplete":false,"key":"15 years at Microsoft, VP of Product, burned out, found coaching"}` },
    { role: "user", content: `Honestly it was a Tuesday. I was in a one-on-one with someone on my team, and she was telling me about a problem she was having with a cross-functional partner, and I realized I had zero capacity to care. Not that I did not want to, I physically could not. I had been running on empty for so long that I had nothing left to give. I went home that night and my wife said something totally normal, like "how was your day," and I just started crying. I could not stop. That was the moment. I took medical leave the next week.` },
    { role: "assistant", content: `Thank you for sharing that. The fact that it was a Tuesday, not some dramatic boardroom moment, is actually what makes your story powerful. Most burnout does not announce itself. It just quietly drains you until there is nothing left.

Let me ask you this: in the four years since, what is the single most surprising thing you have learned about the leaders you work with?
METADATA:{"phase":1,"phaseProgress":65,"sessionComplete":false,"key":"Burnout moment was mundane, not dramatic - that's the real story"}` },
    { role: "user", content: `That almost all of them are terrified. These are people running teams of 50, 100, 200 people, making decisions that affect millions in revenue, and underneath all of that confidence is this deep fear that they are going to be found out. Impostor syndrome at scale. And the higher they climb, the lonelier it gets, so they have nobody to talk to about it. Their spouse does not understand the pressure, their peers are their competition, and their boss is the one they are trying to impress. So they just perform. Until they can not anymore.` },
    { role: "assistant", content: `"Impostor syndrome at scale." Write that down because we are going to use it.

Okay, let us move into your expertise. You said you have worked with about 200 leaders. What are the results you can actually prove? I do not mean "they felt better." I mean what changed in measurable, undeniable terms?
METADATA:{"phase":2,"phaseProgress":15,"sessionComplete":false,"key":"Leaders are terrified - impostor syndrome at scale, loneliness of mid-level leadership"}` },
    { role: "user", content: `So I track a few things. 83% of my clients have received a promotion within 18 months of starting with me. Average team engagement scores go up 34% in the first year. Three clients have gone on to become C-suite executives. I have a 92% completion rate on my six month program, which is really high for coaching. I have NPS of 87. I also have my PCC credential from the ICF, I am a certified Enneagram practitioner, and I did my Masters in Organizational Psychology at Columbia. But honestly the thing that gives me the most credibility is that I have been in their exact shoes. I know what it feels like to lead a team of 150 people while pretending you have it all figured out.` },
    { role: "assistant", content: `Those numbers are genuinely strong. 83% promotion rate is a headline stat. The "I have been in their shoes" credibility is your biggest asset though because no amount of credentials replaces lived experience.

Now here is the harder question. What are you NOT great at? What is the gap between what you promise and what you can actually deliver? I need you to be honest here because if we do not address it now, it becomes a positioning landmine later.
METADATA:{"phase":2,"phaseProgress":60,"sessionComplete":false,"key":"83% promotion rate, 34% engagement increase, PCC + Columbia - strong proof points"}` },
    { role: "user", content: `Fair question. I am not great with people who want a quick fix. If someone comes to me expecting three sessions and a transformation, I am going to disappoint them. My process takes time. I am also not the best fit for people in deeply toxic work environments because my approach assumes the system is basically functional and the leader is the variable. If the whole system is broken, coaching alone will not fix it. And honestly, I am still building my reputation. I am not a household name. I do not have a book. I do not have a TED talk. My marketing has basically been word of mouth and LinkedIn posts.` },
    { role: "assistant", content: `That is a beautifully honest assessment. The "quick fix" thing is actually a positioning strength, not a weakness. It means you can filter out the wrong clients before they waste your time.

Let us get into your beliefs. What is the thing you believe about leadership development that most people in your industry would disagree with? The hot take that might make some people uncomfortable.
METADATA:{"phase":3,"phaseProgress":10,"sessionComplete":false,"key":"Honest about gaps: not for quick fixes, not for toxic systems, no book/TED talk yet"}` },
    { role: "user", content: `I believe most leadership training is a waste of money. Companies spend billions on it and almost none of it sticks because it is designed to be delivered at scale, not to actually change behavior. Real leadership development is deeply personal. It requires vulnerability, which you cannot get in a room full of your peers and your boss. The entire industry is built on the premise that you can train leadership like you train a skill, but leadership is not a skill. It is an identity shift. And identity shifts require safety, time, and someone who will call you on your own patterns. That is why one-on-one coaching works and two-day workshops do not.` },
    { role: "assistant", content: `"Leadership is not a skill, it is an identity shift." That is a belief worth building an entire brand around.

Give me another one. What do you believe about the people you serve that they might not want to hear?
METADATA:{"phase":3,"phaseProgress":40,"sessionComplete":false,"key":"Leadership is an identity shift, not a skill - most training is wasted money"}` },
    { role: "user", content: `I believe most mid-level leaders are addicted to being needed. They say they want to delegate, they say they want their team to be more autonomous, but deep down they are terrified of becoming irrelevant. Their identity is wrapped up in being the person who solves the problem, who stays late, who everyone depends on. And until they untangle their self-worth from their productivity, no amount of time management tips or delegation frameworks will help. The real work is internal. Always.` },
    { role: "assistant", content: `That is going to resonate deeply with your ideal client because it is the thing they secretly know but have never heard anyone say out loud.

Let us talk about your people. Describe your absolute best client. Not a demographic profile. Tell me about one specific person you have worked with who was a perfect fit.
METADATA:{"phase":4,"phaseProgress":10,"sessionComplete":false,"key":"Leaders addicted to being needed - identity wrapped in productivity"}` },
    { role: "user", content: `Sarah. She was a Senior Director of Engineering at a Series D startup. 38 years old, two kids under five, married to someone who also had a demanding career. She was managing a team of 60 engineers and had just been passed over for VP because, according to her boss, she was "too in the weeds." She came to me frustrated, exhausted, and honestly a little angry. She knew she was good at her job but could not figure out why it was not translating into advancement. Over six months we worked on her executive presence, her ability to let go of technical decisions, and most importantly, her belief that asking for help was a sign of weakness. She got the VP title eight months after we started. But more importantly, she told me she actually enjoys her job again. She stops working at 6pm most nights. Her marriage improved. That is the transformation I am going for.` },
    { role: "assistant", content: `Sarah is a goldmine for positioning. She is specific enough to be real but universal enough that thousands of leaders will see themselves in her.

What words does someone like Sarah use when describing her problem to a friend? Not how she would describe it to her boss or in a coaching intake form. How does she talk about it at dinner with her college roommate?
METADATA:{"phase":4,"phaseProgress":50,"sessionComplete":false,"key":"Sarah: Sr Director, passed over for VP, 'too in the weeds', transformed in 6 months"}` },
    { role: "user", content: `She would say something like "I feel like I am running on a treadmill that keeps getting faster and I cannot figure out how to get off without everything falling apart." Or "I know I should delegate more but every time I do, it does not get done right and I end up doing it myself anyway." Or "I feel like I am killing it at work and failing at home, or failing at work and killing it at home, but never both at the same time." The big one is "I do not even know what I want anymore. I have been so focused on the next promotion that I forgot to ask myself if I actually want the job."` },
    { role: "assistant", content: `Every single one of those is a headline waiting to happen. "Running on a treadmill that keeps getting faster" is the kind of language that makes people stop scrolling.

Let us shift to your voice and visual identity. When someone interacts with your brand, what three feelings do you want them to walk away with?
METADATA:{"phase":5,"phaseProgress":10,"sessionComplete":false,"key":"Client language: treadmill getting faster, killing it at work failing at home"}` },
    { role: "user", content: `I want them to feel safe, challenged, and understood. Safe enough to be honest about what is not working. Challenged enough to stop making excuses. And understood in a way that feels like "finally, someone gets it." I do not want my brand to feel clinical or academic. I want it to feel like that conversation you have with a mentor over whiskey where they tell you the truth you have been avoiding but you do not feel judged. Warm but direct. Smart but not pretentious. Professional but human.` },
    { role: "assistant", content: `"Mentor over whiskey." That is your brand in three words. Warm, direct, human.

What brands do you admire? Not necessarily in coaching. What brands make you think "that is the vibe I want"?
METADATA:{"phase":5,"phaseProgress":40,"sessionComplete":false,"key":"Safe, challenged, understood - mentor over whiskey vibe"}` },
    { role: "user", content: `Brene Brown is an obvious one but specifically her earlier work before it became too corporate. Patagonia for how they communicate values without being preachy. The School of Life for how they make psychology feel accessible. And honestly, Peloton for how they make something difficult feel like a community experience. I do not want to look like a corporate consulting firm. I do not want stock photos of people in suits shaking hands. I want something that feels more like a high end editorial magazine mixed with a really well designed personal blog.` },
    { role: "assistant", content: `Great references. The editorial magazine meets personal blog is a really clear visual direction.

Let us talk about your market. Who else does what you do? Who are the competitors that your ideal client is comparing you to, even if they are not a direct match?
METADATA:{"phase":6,"phaseProgress":10,"sessionComplete":false,"key":"Brand references: Brene Brown, Patagonia, School of Life, Peloton - editorial + personal"}` },
    { role: "user", content: `The main competitors in my space are BetterUp which is the big tech-enabled platform for executive coaching, there is also Reboot.io which is Jerry Colonna's company that does CEO coaching with a more emotional depth approach, and then there are a ton of independent coaches who mostly market through LinkedIn. BetterUp is more scalable but less personal. Reboot is amazing but they focus on founders and CEOs, not the mid-level leader. Most independent coaches do not have the corporate experience I have. They come from a counseling or therapy background, not a Fortune 500 VP background. That is my gap: I am not a platform, I am not C-suite only, and I am not a therapist pretending to be a business coach. I am the person who has actually done the job my clients are doing.` },
    { role: "assistant", content: `"Not a platform, not C-suite only, not a therapist pretending to be a business coach." That right there is your competitive wedge.

What positioning territory do you think is completely unclaimed in this space?
METADATA:{"phase":6,"phaseProgress":55,"sessionComplete":false,"key":"Competitors: BetterUp (scalable/impersonal), Reboot (CEO only), independent coaches (no corp experience)"}` },
    { role: "user", content: `Nobody is specifically owning the "middle leadership" space. Everyone is either going after the C-suite because the fees are higher, or they are doing mass-market stuff like online courses for first-time managers. The director and VP level is this massive underserved market. These people have real budgets, their companies will pay for coaching, and they are at the exact inflection point where the right support can change the entire trajectory of their career. But nobody is speaking directly to them with messaging that says "I see you, I was you, and I know exactly what you need."` },
    { role: "assistant", content: `You have identified a legitimate blue ocean. The "forgotten middle" of leadership. Let us design your offers around this.

Let us think about a three-tier structure. What is the entry point for someone who is interested but not ready to commit to a full coaching engagement?
METADATA:{"phase":7,"phaseProgress":10,"sessionComplete":false,"key":"Blue ocean: middle leadership (directors/VPs) is massively underserved"}` },
    { role: "user", content: `I have been thinking about this. For the entry level, I want to do a "Leadership Audit" which is a single 90-minute deep dive session where I assess where they are, identify their top three blind spots, and give them an action plan. Price it around $497. It gives them a taste of the work without a big commitment. For my core offer, it is a six-month coaching engagement, two sessions per month, with async Slack support between sessions. That is $12,000 for the six months. And for premium, I want to do an annual retainer that includes the six-month intensive plus ongoing monthly sessions, quarterly 360 reviews with their team, and a spot in a small peer group of other leaders I work with. That would be $30,000 per year. The ascension makes sense because the audit identifies the problems, the six-month program solves them, and the annual retainer maintains and deepens the growth.` },
    { role: "assistant", content: `That is a clean, logical offer ladder. The Leadership Audit at $497 is smart because it is low enough risk that their company will approve it without a procurement process, and it gives you a chance to demonstrate value.

The pricing feels right for the market. $12K for six months of executive coaching with async support is competitive. $30K for the annual retainer with peer group and 360 reviews is premium but justifiable given the scope.

I have everything I need to generate your complete brand blueprint. Give me a moment to synthesize everything we have discussed across all seven phases into your comprehensive blueprint document.
METADATA:{"phase":7,"phaseProgress":100,"sessionComplete":false,"key":"Three-tier: $497 audit, $12K 6-month coaching, $30K annual retainer with peer group"}` }
  ];
  const sessionId = "test_blueprint_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  const session = {
    id: sessionId,
    tier: "blueprint",
    phase: 8,
    messages: fakeMessages,
    userData: {},
    blueprintGenerated: false,
    siteGenerated: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    systemPrompt: DEEP_WORK_SYSTEM_PROMPT
  };
  await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });
  session.messages.push({ role: "user", content: "I am ready. Please generate my complete brand blueprint now." });
  const recentMessages = session.messages.slice(-40);
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const sendEvent = /* @__PURE__ */ __name222(async (data) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  }, "sendEvent");
  const streamPromise = (async () => {
    try {
      const bpAbort = new AbortController();
      const bpTimeout = setTimeout(() => bpAbort.abort(), 48e4);
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          signal: bpAbort.signal,
          headers: {
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "anthropic-beta": "prompt-caching-2024-07-31"
          },
          body: JSON.stringify({
            model: MODEL_OPUS,
            max_tokens: 8192,
            stream: true,
            system: [{ type: "text", text: session.systemPrompt, cache_control: { type: "ephemeral" } }],
            messages: recentMessages
          })
        });
      } catch (fetchErr) {
        clearTimeout(bpTimeout);
        const isTimeout = fetchErr.name === "AbortError";
        await logError(env, { endpoint: "/api/generate-blueprint", method: "POST", statusCode: 0, errorType: isTimeout ? "timeout" : "fetch_error", errorMessage: fetchErr.message, sessionId });
        await sendEvent({ type: "error", message: isTimeout ? "Blueprint generation timed out. Please try again \u2014 your conversation is saved." : "Connection error during blueprint generation. Please try again." });
        await writer.close();
        return;
      }
      clearTimeout(bpTimeout);
      if (!res.ok) {
        const errText = await res.text();
        await logError(env, { endpoint: "/api/generate-blueprint", method: "POST", statusCode: res.status, errorType: "anthropic_api", errorMessage: `Model: ${MODEL_OPUS}. ${errText.substring(0, 500)}`, sessionId });
        await sendEvent({ type: "error", message: "Blueprint generation hit a temporary issue (error " + res.status + "). Please try again \u2014 your conversation is saved." });
        await writer.close();
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";
      let bpUsage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]")
              continue;
            try {
              const ev = JSON.parse(data);
              if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
                const chunk = ev.delta.text;
                fullContent += chunk;
                await sendEvent({ type: "delta", content: chunk });
              }
              if (ev.type === "message_start" && ev.message?.usage) {
                bpUsage.input = ev.message.usage.input_tokens || 0;
                bpUsage.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
                bpUsage.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
              }
              if (ev.type === "message_delta" && ev.usage) {
                bpUsage.output = ev.usage.output_tokens || 0;
              }
            } catch (_) {
            }
          }
        }
      }
      trackTokenUsage(env, { sessionId, userId: session.userId, model: MODEL_OPUS, endpoint: "/api/generate-blueprint", inputTokens: bpUsage.input, outputTokens: bpUsage.output, cacheRead: bpUsage.cacheRead, cacheWrite: bpUsage.cacheWrite, phase: 8 });
      let blueprint = null;
      const blueprintMatch = fullContent.match(/```json\r?\n?([\s\S]*?)\r?\n?```/) || fullContent.match(/```json\r?\n?([\s\S]*\})\s*(?:```|$)/);
      if (blueprintMatch) {
        try {
          blueprint = JSON.parse(blueprintMatch[1]);
          const tbpValidation = validateBlueprint(blueprint);
          console.log("[Blueprint QA][test] score=" + tbpValidation.score + " summary=" + tbpValidation.summary);
          if (!tbpValidation.passed) {
            const tbpRepair = autoRepairBlueprint(blueprint);
            blueprint = tbpRepair.blueprint;
            if (tbpRepair.repairCount > 0)
              console.log("[Blueprint QA][test] Repaired " + tbpRepair.repairCount + ": " + tbpRepair.repairs.join("; "));
          }
          session.blueprint = blueprint;
          session.blueprintGenerated = true;
          await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
          if (session.email && env.RESEND_API_KEY) {
            const bp = blueprint.blueprint || blueprint;
            const userName = bp.name || session.name || "";
            const firstName = userName.split(" ")[0] || "";
            const nicheStatement = bp.part3?.nicheStatement || "";
            const brandPromise = bp.part1?.coreBrandPromise || "";
            const brandNames = (bp.part1?.brandNames || []).join(" / ");
            const tagline = (bp.part1?.taglines || [])[0] || "";
            const idealClient = bp.part2?.name || "your ideal client";
            const coreOfferName = bp.part4?.coreOffer?.name || "";
            const heroHeadline = (bp.part7?.heroHeadlineOptions || [])[0] || "";
            const emailGreeting = firstName ? `${firstName}, your` : "Your";
            fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({
                from: "James Guldan | Deep Work <noreply@jamesguldan.com>",
                to: [session.email],
                subject: `${emailGreeting} Deep Work Blueprint is ready`,
                html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue',sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 20px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;"><tr><td style="padding-bottom:28px;"><p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#1d1d1f;">JAMES GULDAN</p></td></tr><tr><td style="background:#1d1d1f;border-radius:20px 20px 0 0;padding:44px 40px 40px;"><p style="margin:0 0 14px;font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#c4703f;">Deep Work Blueprint</p><h1 style="margin:0 0 20px;font-size:30px;font-weight:700;color:#ffffff;line-height:1.2;letter-spacing:-0.02em;">${firstName ? firstName + ", your" : "Your"} brand clarity<br>is ready.</h1><p style="margin:0;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.8;">You just completed something most people never do. You sat down, answered the hard questions, and built a brand strategy from scratch. That takes real commitment.</p></td></tr></table></td></tr></table></body></html>`
              })
            }).catch(() => {
            });
          }
          const li = blueprint?.leadIntel;
          if (li) {
            try {
              await env.DB.prepare(`INSERT OR REPLACE INTO lead_intel (session_id, user_id, email, phone, estimated_revenue, industry, years_in_business, team_size, has_existing_brand, has_existing_website, has_internal_team, brand_maturity, buying_temperature, biggest_pain_point, budget_signals, best_fit_service, best_fit_reason, notable_quotes, follow_up_angle, recommendation, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).bind(
                sessionId,
                session.userId || null,
                session.email || session.phone || null,
                session.phone || null,
                li.estimatedRevenue || "Unknown",
                li.industry || "Unknown",
                li.yearsInBusiness || "Unknown",
                li.teamSize || "Unknown",
                li.hasExistingBrand ? 1 : 0,
                li.hasExistingWebsite ? 1 : 0,
                li.hasInternalTeam ? 1 : 0,
                li.brandMaturity || "Unknown",
                li.buyingTemperature || "Unknown",
                li.biggestPainPoint || "",
                li.budgetSignals || "",
                li.bestFitService || "",
                li.bestFitReason || "",
                JSON.stringify(li.notableQuotes || []),
                li.followUpAngle || "",
                blueprint?.blueprint?.part8?.recommendation || "self_guided"
              ).run();
            } catch (liErr) {
            }
          }
        } catch (_) {
        }
      }
      session.messages.push({ role: "assistant", content: fullContent });
      env.UPLOADS.put(`sessions/${sessionId}/messages_backup.json`, JSON.stringify({
        sessionId,
        messages: session.messages,
        phase: session.phase,
        tier: session.tier,
        userId: session.userId,
        email: session.email,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }), { httpMetadata: { contentType: "application/json" } }).catch(() => {
      });
      if (blueprint) {
        try {
          await sendEvent({ type: "debrief_status", message: "Your strategist is writing you a personal note..." });
          const debrief = await generateStrategistDebrief(env, session, blueprint, sessionId);
          if (debrief) {
            session.strategistDebrief = debrief;
            await sendEvent({ type: "debrief", debrief });
          }
        } catch (debriefErr) {
        }
      }
      await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 });
      await sendEvent({ type: "metadata", phase: 8, phaseProgress: 100, sessionComplete: true, blueprint });
      await sendEvent({ type: "done", sessionId });
      await writer.close();
    } catch (err) {
      try {
        await sendEvent({ type: "error", message: err.message });
        await writer.close();
      } catch (_) {
      }
    }
  })();
  return new Response(readable, {
    headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" }
  });
}
