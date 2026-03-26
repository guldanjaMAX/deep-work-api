// src/routes/admin.js
// Admin API route handlers

import { json } from '../utils/helpers.js';
import {
  generateStrategistDebrief, validateBlueprint, autoRepairBlueprint,
  DEEP_WORK_SYSTEM_PROMPT, STRATEGIST_DEBRIEF_PROMPT,
  generateSessionAccessToken, logEvent, runDailyHealthCheck
} from '../utils/internal.js';
import {
  requireAdmin, getUserByEmail, getUserById, createUser,
  hashPassword, updateUserPassword, generateMagicToken, storeMagicToken,
  getAllSettings, setSetting
} from '../auth.js';
import {
  logError, runFullHealthCheck, handleMonitoringDashboard, generateDailyDigest
} from '../monitor.js';

export async function handleAdminStats(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const [usersRow, sessionsRow, revenueRow, completedRow] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first(),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first(),
      env.DB.prepare(`SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='succeeded'`).first().catch(() => ({ total: 0 })),
      env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions WHERE phase >= 8`).first().catch(() => ({ cnt: 0 }))
    ]);
    const funnelRows = await env.DB.prepare(`
      SELECT
        SUM(CASE WHEN created_at >= date('now') THEN 1 ELSE 0 END) as today,
        SUM(CASE WHEN created_at >= date('now','-7 days') THEN 1 ELSE 0 END) as week,
        SUM(CASE WHEN created_at >= date('now','-30 days') THEN 1 ELSE 0 END) as month
      FROM sessions
    `).first().catch(() => ({ today: 0, week: 0, month: 0 }));
    return json({
      users: usersRow?.cnt || 0,
      sessions: sessionsRow?.cnt || 0,
      revenue: revenueRow?.total || 0,
      completed: completedRow?.cnt || 0,
      funnel: funnelRows,
      sessionsToday: funnelRows?.today || 0,
      usersThisWeek: 0
    });
  } catch (e) {
    return json({ error: "Stats query failed", detail: e.message }, 500);
  }
}

export async function handleAdminListUsers(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query, params;
    if (search) {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [`%${search}%`, `%${search}%`, limit, offset];
    } else {
      query = `SELECT id, email, name, role, tier, stripe_customer_id, last_login, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }
    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first();
    return json({ users: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: "Failed to list users", detail: e.message }, 500);
  }
}

export async function handleAdminCreateUser(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, name, role, password } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    const existing = await getUserByEmail(env, email);
    if (existing)
      return json({ error: "Email already exists" }, 409);
    const user = await createUser(env, { email, name: name || "", role: role || "user" });
    if (password) {
      const hash = await hashPassword(password);
      await updateUserPassword(env, user.id, hash);
    }
    const token = generateMagicToken();
    const linkType = user.role === "admin" ? "admin_magic" : "magic_login";
    await storeMagicToken(env, token, user.id, linkType, 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ user, magicLink }, 201);
  } catch (e) {
    return json({ error: "Failed to create user", detail: e.message }, 500);
  }
}

export async function handleAdminListSessions(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const tier = url.searchParams.get("tier") || "";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query, params;
    if (tier) {
      query = `SELECT id, user_id, tier, phase, status, blueprint_generated, created_at, updated_at FROM sessions WHERE tier = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [tier, limit, offset];
    } else {
      query = `SELECT id, user_id, tier, phase, status, blueprint_generated, created_at, updated_at FROM sessions ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params = [limit, offset];
    }
    const { results } = await env.DB.prepare(query).bind(...params).all();
    const countRow = await env.DB.prepare(`SELECT COUNT(*) as cnt FROM sessions`).first();
    return json({ sessions: results, total: countRow?.cnt || 0 });
  } catch (e) {
    return json({ error: "Failed to list sessions", detail: e.message }, 500);
  }
}

export async function handleAdminGetSession(request, env, path) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const sessionId = path.split("/").pop();
    const session = await env.DB.prepare(`SELECT * FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!session)
      return json({ error: "Session not found" }, 404);
    let messages = [];
    try {
      const kvData = await env.SESSIONS.get(sessionId, "json");
      if (kvData?.messages)
        messages = kvData.messages;
    } catch (_) {
    }
    let events = [];
    try {
      const evRows = await env.DB.prepare(`SELECT * FROM events WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
      events = evRows.results || [];
    } catch (_) {
    }
    return json({ session, messages, events });
  } catch (e) {
    return json({ error: "Failed to get session", detail: e.message }, 500);
  }
}

export async function handleAdminMagicLink(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { userId, email, type, createIfMissing, tier } = await request.json();
    let user = null;
    if (userId) {
      user = await getUserById(env, userId);
    } else if (email) {
      user = await getUserByEmail(env, email);
      if (!user && createIfMissing) {
        user = await createUser(env, { email, name: "", role: "user" });
      }
    }
    if (!user)
      return json({ error: "User not found" }, 404);
    const token = generateMagicToken();
    const linkType = type || (user.role === "admin" ? "admin_magic" : "magic_login");
    await storeMagicToken(env, token, user.id, linkType, 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ magicLink, url: magicLink, token, expires_in_hours: 72 });
  } catch (e) {
    return json({ error: "Failed to generate magic link", detail: e.message }, 500);
  }
}

export async function handleAdminInjectDebrief(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { sessionId, debrief } = await request.json();
    if (!sessionId || !debrief)
      return json({ error: "sessionId and debrief required" }, 400);
    const raw = await env.SESSIONS.get(sessionId);
    if (!raw)
      return json({ error: "Session not found in KV" }, 404);
    const session = JSON.parse(raw);
    session.strategistDebrief = debrief;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    return json({ ok: true, message: "Debrief injected successfully" });
  } catch (e) {
    return json({ error: "Failed to inject debrief", detail: e.message }, 500);
  }
}

export async function handleAdminGenerateDebrief(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { sessionId } = await request.json();
    if (!sessionId)
      return json({ error: "sessionId required" }, 400);
    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData)
      return json({ error: "Session not found in KV" }, 404);
    const session = JSON.parse(kvData);
    if (!session.blueprint)
      return json({ error: "No blueprint in this session" }, 400);
    const debrief = await generateStrategistDebrief(env, session, session.blueprint, sessionId);
    if (!debrief)
      return json({ error: "Debrief generation failed" }, 500);
    session.strategistDebrief = debrief;
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    return json({ ok: true, debrief });
  } catch (e) {
    return json({ error: "Failed to generate debrief", detail: e.message }, 500);
  }
}

export async function handleAdminTestBlueprint(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, brandName, niche } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    let user = await getUserByEmail(env, email);
    let userCreated = false;
    if (!user) {
      user = await createUser(env, { email, name: brandName || "", role: "user" });
      userCreated = true;
    }
    let sessionId;
    let session;
    const sessionRow = await env.DB.prepare("SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").bind(user.id).first();
    if (sessionRow) {
      sessionId = sessionRow.id;
      const raw = await env.SESSIONS.get(sessionId);
      session = raw ? JSON.parse(raw) : null;
    }
    if (!session) {
      sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      session = {
        id: sessionId,
        tier: "blueprint",
        phase: 1,
        messages: [],
        userData: {},
        userId: user.id,
        email,
        blueprintGenerated: false,
        siteGenerated: false,
        createdAt: (new Date()).toISOString(),
        systemPrompt: DEEP_WORK_SYSTEM_PROMPT
      };
      const now = (new Date()).toISOString();
      await env.DB.prepare("INSERT INTO sessions (id, user_id, tier, phase, status, email, created_at, message_count) VALUES (?,?,?,?,?,?,?,?)").bind(sessionId, user.id, "blueprint", 1, "active", email, now, 0).run();
    }
    const bpRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8e3,
        messages: [{
          role: "user",
          content: `Generate a complete brand blueprint JSON for a person named "${brandName}" in the niche "${niche}". The blueprint should be realistic and detailed with all 8 parts filled out. Follow this exact JSON structure:\n\n{"blueprint":{"name":"Full Name","generatedAt":"${(new Date()).toISOString()}","part1":{"title":"Brand Foundation","brandNames":["Name 1","Name 2","Name 3"],"taglines":["Tag 1","Tag 2","Tag 3"],"visualDirection":{"colors":[{"name":"Primary","hex":"#1B3A4B"},{"name":"Secondary","hex":"#C17F3E"},{"name":"Accent","hex":"#E8B86D"},{"name":"Background","hex":"#F8F5F0"},{"name":"Text","hex":"#1A1A1A"}],"fonts":{"heading":"Playfair Display","body":"Inter"},"aesthetic":"2 sentences"},"brandVoice":{"descriptors":["word1","word2","word3","word4","word5"],"doSay":["ex1","ex2","ex3"],"neverSay":["ex1","ex2","ex3"]},"coreBrandPromise":"One sentence"},"part2":{"title":"Ideal Customer Avatar","name":"First name","ageRange":"range","lifeSituation":"2 sentences","tryingToAchieve":"goal","whatIsStoppingThem":"obstacle","exactWords":["phrase1","phrase2","phrase3"],"alreadyTried":["thing1","thing2"],"whyItDidNotWork":"pattern"},"part3":{"title":"Niche Positioning","nicheStatement":"I help X do Y without Z","whoTheyServe":"desc","whoTheyDoNotServe":"desc","uniqueMechanism":"methodology name","competitorGap":"differentiation"},"part4":{"title":"Offer Suite","entryOffer":{"name":"","description":"","price":"","delivery":""},"coreOffer":{"name":"","description":"","price":"","delivery":""},"premiumOffer":{"name":"","description":"","price":"","delivery":""},"ascensionLogic":"how each leads to next"},"part5":{"title":"Website Blueprint","pageNarrative":"2-3 sentences","heroHeadlines":["1","2","3"],"heroSubheadline":"one line","heroCTA":"button text","heroImageTheme":"specific evocative image description","sections":[{"name":"Section","purpose":"purpose","content":"content","rationale":"why","confidence":85,"imageTheme":"desc","visualMood":"light"}],"testimonialFraming":"approach"},"part6":{"title":"Gap Analysis","credibilityGaps":["gap1","gap2","gap3"],"marketingOpportunities":["opp1","opp2","opp3"],"firstMove":"most important first step"},"part7":{"title":"Headlines and Positioning Statements","heroHeadlineOptions":["1","2","3","4","5","6","7","8","9","10"],"taglineOptions":["1","2","3","4","5"],"positioningStatements":{"website":"for homepage","social":"for bios","inPerson":"for introductions"}},"part8":{"title":"Your Recommended Next Step","recommendation":"site_in_sixty","headline":"compelling one liner","personalizedMessage":"3 to 5 sentences","whyNow":"1 to 2 sentences","specificBenefit":"concrete benefit"},"leadIntel":{"estimatedRevenue":"100K to 500K","industry":"${niche}","yearsInBusiness":"1 to 3","teamSize":"Solo","hasExistingBrand":false,"hasExistingWebsite":false,"hasInternalTeam":false,"brandMaturity":"Starting fresh","buyingTemperature":"Hot","biggestPainPoint":"main pain","budgetSignals":"signal","bestFitService":"site_in_sixty","bestFitReason":"1 sentence","notableQuotes":["quote1","quote2","quote3"],"followUpAngle":"angle"}}}\n\nReturn ONLY the JSON, no other text.`
        }]
      })
    });
    const bpData = await bpRes.json();
    let blueprintText = bpData.content?.[0]?.text || "";
    let blueprint;
    try {
      const jsonMatch = blueprintText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, blueprintText];
      blueprint = JSON.parse(jsonMatch[1]);
    } catch (parseErr) {
      return json({ error: "Failed to parse generated blueprint JSON", detail: blueprintText.slice(0, 500) }, 500);
    }
    const adminBpVal = validateBlueprint(blueprint);
    console.log("[Blueprint QA][admin] score=" + adminBpVal.score + " summary=" + adminBpVal.summary);
    if (!adminBpVal.passed) {
      const adminBpRepair = autoRepairBlueprint(blueprint);
      blueprint = adminBpRepair.blueprint;
      if (adminBpRepair.repairCount > 0)
        console.log("[Blueprint QA][admin] Repaired " + adminBpRepair.repairCount + ": " + adminBpRepair.repairs.join("; "));
    }
    session.blueprint = blueprint;
    session.blueprintGenerated = true;
    session.phase = 8;
    try {
      const b = blueprint?.blueprint || {};
      const debriefRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: STRATEGIST_DEBRIEF_PROMPT,
          messages: [{
            role: "user",
            content: `Imagine you just had an incredible hour-long brand strategy conversation with ${b.name || brandName}. They are in the ${niche || "business coaching"} space. Their niche statement is: "${b.part3?.nicheStatement || "helping people transform their business"}". Their ideal client is ${b.part2?.name || "someone"} who is ${b.part2?.lifeSituation || "stuck and looking for clarity"}. Their brand promise is: "${b.part1?.coreBrandPromise || "transformation"}". Their biggest pain point is ${b.part2?.whatIsStoppingThem || "not knowing where to start"}. They do not have a website yet and have been relying on referrals. During the interview they said something powerful like: "I know I am good at what I do, I just do not know how to show that to the world yet." Their recommended next step is Site in Sixty.\n\nNow write the strategist debrief as a personal letter to this person. Return ONLY the JSON object.`
          }]
        })
      });
      const debriefData = await debriefRes.json();
      const debriefText = debriefData.content?.[0]?.text || "";
      try {
        const djm = debriefText.match(/```json\n?([\s\S]*?)\n?```/) || debriefText.match(/\{[\s\S]*"reflection"[\s\S]*\}/);
        if (djm) {
          const debriefJson = JSON.parse(djm[djm[1] ? 1 : 0]);
          if (debriefJson.reflection && debriefJson.insight) {
            session.strategistDebrief = debriefJson;
          }
        }
      } catch (_debriefParseErr) {
        console.error("Test debrief parse failed, continuing without debrief");
      }
    } catch (_debriefErr) {
      console.error("Test debrief generation failed, continuing without debrief");
    }
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
    await env.DB.prepare("UPDATE sessions SET status = ?, phase = ?, blueprint_generated = 1 WHERE id = ?").bind("blueprint_complete", 8, sessionId).run();
    const token = generateMagicToken();
    await storeMagicToken(env, token, user.id, "magic_login", 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${token}`;
    return json({ ok: true, sessionId, magicLink, hasDebrief: !!session.strategistDebrief, userCreated, brandName: blueprint?.blueprint?.part1?.brandNames?.[0] || brandName });
  } catch (e) {
    return json({ error: "Failed to generate test blueprint", detail: e.message }, 500);
  }
}

export async function handleAdminQuickTestSession(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { email, tier } = await request.json();
    if (!email)
      return json({ error: "Email required" }, 400);
    let user = await getUserByEmail(env, email);
    if (!user) {
      user = await createUser(env, { email, name: "", role: "user" });
    }
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const session = {
      id: sessionId,
      tier: tier || "blueprint",
      phase: 1,
      messages: [],
      userData: {},
      userId: user.id,
      email,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: (new Date()).toISOString(),
      systemPrompt: DEEP_WORK_SYSTEM_PROMPT
    };
    let hasBlueprint = false;
    if (tier === "site") {
      const bpRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 8e3,
          messages: [{
            role: "user",
            content: 'Generate a complete brand blueprint JSON for a fictional executive coaching business. The person is "Alex Rivera" who helps mid-level tech managers become better leaders. Return ONLY valid JSON matching the standard blueprint structure.'
          }]
        })
      });
      const bpData = await bpRes.json();
      let bpText = bpData.content?.[0]?.text || "";
      try {
        const match = bpText.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, bpText];
        const blueprint = JSON.parse(match[1]);
        session.blueprint = blueprint;
        session.blueprintGenerated = true;
        session.phase = 8;
        hasBlueprint = true;
        await env.UPLOADS.put(`sessions/${sessionId}/blueprint.json`, JSON.stringify(blueprint));
        try {
          const b = blueprint?.blueprint || {};
          const debriefRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 1024,
              system: STRATEGIST_DEBRIEF_PROMPT,
              messages: [{
                role: "user",
                content: `Imagine you just had an incredible hour-long brand strategy conversation with ${b.name || "Alex Rivera"}. They are in the executive coaching space. Their niche statement is: "${b.part3?.nicheStatement || "helping mid-level tech managers become better leaders"}". They do not have a website yet. Write the strategist debrief as a personal letter. Return ONLY the JSON object.`
              }]
            })
          });
          const debriefData = await debriefRes.json();
          const debriefText = debriefData.content?.[0]?.text || "";
          try {
            const djm = debriefText.match(/```json\n?([\s\S]*?)\n?```/) || debriefText.match(/\{[\s\S]*"reflection"[\s\S]*\}/);
            if (djm) {
              const debriefJson = JSON.parse(djm[djm[1] ? 1 : 0]);
              if (debriefJson.reflection && debriefJson.insight) {
                session.strategistDebrief = debriefJson;
              }
            }
          } catch (_dpe) {
          }
        } catch (_de) {
          console.error("Quick test debrief generation failed, continuing without debrief");
        }
      } catch (_) {
      }
    }
    await env.SESSIONS.put(sessionId, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    const now = (new Date()).toISOString();
    await env.DB.prepare("INSERT INTO sessions (id, user_id, tier, phase, status, email, created_at, message_count) VALUES (?,?,?,?,?,?,?,?)").bind(sessionId, user.id, tier || "blueprint", hasBlueprint ? 8 : 1, hasBlueprint ? "blueprint_complete" : "active", email, now, 0).run();
    const magicToken = generateMagicToken();
    await storeMagicToken(env, magicToken, user.id, "magic_login", 72);
    const origin = env.APP_ORIGIN || "https://love.jamesguldan.com";
    const magicLink = `${origin}/magic?token=${magicToken}`;
    return json({ ok: true, userId: user.id, sessionId, tier: tier || "blueprint", hasBlueprint, hasDebrief: !!session.strategistDebrief, magicLink });
  } catch (e) {
    return json({ error: "Failed to create test session", detail: e.message }, 500);
  }
}

export async function handleAdminGetSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const settings = await getAllSettings(env);
    return json({ settings });
  } catch (e) {
    return json({ error: "Failed to get settings", detail: e.message }, 500);
  }
}

export async function handleAdminSaveSettings(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const body = await request.json();
    const allowed = ["calendar_link", "site_banner", "maintenance_mode", "stripe_price_blueprint", "stripe_price_call", "stripe_price_site"];
    for (const key of allowed) {
      if (key in body) {
        await setSetting(env, key, String(body[key]));
      }
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to save settings", detail: e.message }, 500);
  }
}

export async function handleAdminGetPrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const row = await env.DB.prepare(`
      SELECT * FROM prompt_versions ORDER BY version DESC LIMIT 1
    `).first().catch(() => null);
    if (!row) {
      return json({ version: 0, prompt: DEEP_WORK_SYSTEM_PROMPT || "", notes: "Default (hardcoded)", active: true });
    }
    return json(row);
  } catch (e) {
    return json({ error: "Failed to get prompt", detail: e.message }, 500);
  }
}

export async function handleAdminSavePrompt(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  try {
    const { prompt, notes } = await request.json();
    if (!prompt)
      return json({ error: "Prompt required" }, 400);
    const vRow = await env.DB.prepare(`SELECT MAX(version) as max_v FROM prompt_versions`).first().catch(() => ({ max_v: 0 }));
    const nextVersion = (vRow?.max_v || 0) + 1;
    await env.DB.prepare(`
      INSERT INTO prompt_versions (version, system_prompt, notes, active, created_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `).bind(nextVersion, prompt, notes || "").run();
    await env.DB.prepare(`UPDATE prompt_versions SET active = 0 WHERE version != ?`).bind(nextVersion).run();
    return json({ ok: true, version: nextVersion });
  } catch (e) {
    return json({ error: "Failed to save prompt", detail: e.message }, 500);
  }
}

export async function handleHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const result = await runFullHealthCheck(env);
  return json(result);
}

export async function handleMonitoring(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const data = await handleMonitoringDashboard(env);
  return json(data);
}

export async function handleDigest(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const digest = await generateDailyDigest(env);
  return json(digest);
}

export async function handleAdminErrors(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const errors = await env.DB.prepare(`SELECT * FROM error_log ORDER BY created_at DESC LIMIT ?`).bind(limit).all();
  return json({ errors: errors.results || [] });
}

export async function handleAPIUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const hours = parseInt(url.searchParams.get("hours") || "24");
  const [calls, byProvider, byStatus, latencyTrend] = await Promise.all([
    env.DB.prepare(`
      SELECT COUNT(*) as total FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
    `).first(),
    env.DB.prepare(`
      SELECT metric_name, COUNT(*) as calls, ROUND(AVG(metric_value),0) as avg_latency_ms,
             MAX(metric_value) as max_latency_ms
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY metric_name ORDER BY calls DESC
    `).all(),
    env.DB.prepare(`
      SELECT tags, COUNT(*) as cnt FROM metrics
      WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      AND tags LIKE '%429%'
      GROUP BY tags ORDER BY cnt DESC LIMIT 10
    `).all(),
    env.DB.prepare(`
      SELECT
        strftime('%Y-%m-%d %H:00', created_at) as hour,
        COUNT(*) as calls,
        ROUND(AVG(metric_value), 0) as avg_latency
      FROM metrics WHERE metric_name LIKE 'api.%' AND created_at >= datetime('now', '-${hours} hours')
      GROUP BY hour ORDER BY hour
    `).all()
  ]);
  return json({
    period: `${hours}h`,
    totalCalls: calls?.total || 0,
    byProvider: byProvider.results || [],
    rateLimitHits: byStatus.results || [],
    latencyTrend: latencyTrend.results || []
  });
}

export async function handleResolveAlert(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const { alertId } = await request.json();
  await env.DB.prepare(`UPDATE alerts SET resolved = 1, resolved_at = datetime('now') WHERE id = ?`).bind(alertId).run();
  return json({ ok: true });
}

export async function handleAdminTestTrigger(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  return json({ ok: true, message: "Test trigger acknowledged" });
}

export async function handleSystemHealthCheck(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const result = await runDailyHealthCheck(env);
  return json(result);
}

export async function handleAdminUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get("days") || "30");
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const allTime = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cache_read_tokens) as cache_read, SUM(cache_write_tokens) as cache_write, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage`).first();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthly = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, COUNT(DISTINCT user_id) as users FROM token_usage WHERE created_at >= ?`).bind(monthStart.toISOString()).first();
  const byModel = await env.DB.prepare(`SELECT model, COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE created_at >= ? GROUP BY model`).bind(since).all();
  const daily = await env.DB.prepare(`SELECT DATE(created_at) as day, SUM(cost_cents) as cost_cents, COUNT(*) as calls, SUM(input_tokens+output_tokens) as total_tokens FROM token_usage WHERE created_at >= ? GROUP BY DATE(created_at) ORDER BY day DESC`).bind(since).all();
  const topUsers = await env.DB.prepare(`SELECT t.user_id, u.email, u.name, COUNT(*) as calls, SUM(t.input_tokens) as input, SUM(t.output_tokens) as output, SUM(t.cost_cents) as cost_cents, COUNT(DISTINCT t.session_id) as sessions, MAX(t.created_at) as last_active FROM token_usage t LEFT JOIN users u ON t.user_id = u.id WHERE t.user_id IS NOT NULL GROUP BY t.user_id ORDER BY cost_cents DESC LIMIT 25`).all();
  const avgPerUser = allTime.users > 0 ? { avgCostCents: Math.round((allTime.cost_cents || 0) / allTime.users * 100) / 100, avgCalls: Math.round((allTime.calls || 0) / allTime.users), avgTokens: Math.round(((allTime.input || 0) + (allTime.output || 0)) / allTime.users) } : { avgCostCents: 0, avgCalls: 0, avgTokens: 0 };
  return json({
    allTime: { calls: allTime.calls, inputTokens: allTime.input, outputTokens: allTime.output, costCents: Math.round((allTime.cost_cents || 0) * 100) / 100, costDollars: "$" + ((allTime.cost_cents || 0) / 100).toFixed(2), sessions: allTime.sessions, users: allTime.users },
    thisMonth: { calls: monthly.calls, costCents: Math.round((monthly.cost_cents || 0) * 100) / 100, costDollars: "$" + ((monthly.cost_cents || 0) / 100).toFixed(2), sessions: monthly.sessions, users: monthly.users },
    avgPerUser,
    byModel: byModel.results,
    daily: daily.results,
    topUsers: topUsers.results
  });
}

export async function handleAdminUserUsage(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const sessionId = url.searchParams.get("sessionId");
  if (userId) {
    const usage = await env.DB.prepare(`SELECT t.session_id, t.model, t.endpoint, t.input_tokens, t.output_tokens, t.cost_cents, t.phase, t.created_at FROM token_usage t WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 200`).bind(userId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents, COUNT(DISTINCT session_id) as sessions, MIN(created_at) as first_use, MAX(created_at) as last_use FROM token_usage WHERE user_id = ?`).bind(userId).first();
    const user = await env.DB.prepare(`SELECT email, name, tier, created_at FROM users WHERE id = ?`).bind(userId).first();
    return json({ user, summary: { ...summary, costDollars: "$" + ((summary.cost_cents || 0) / 100).toFixed(2) }, calls: usage.results });
  }
  if (sessionId) {
    const usage = await env.DB.prepare(`SELECT model, endpoint, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_cents, phase, created_at FROM token_usage WHERE session_id = ? ORDER BY created_at ASC`).bind(sessionId).all();
    const summary = await env.DB.prepare(`SELECT COUNT(*) as calls, SUM(input_tokens) as input, SUM(output_tokens) as output, SUM(cost_cents) as cost_cents FROM token_usage WHERE session_id = ?`).bind(sessionId).first();
    return json({ sessionId, summary: { ...summary, costDollars: "$" + ((summary.cost_cents || 0) / 100).toFixed(2) }, calls: usage.results });
  }
  return json({ error: "Provide userId or sessionId query param" }, 400);
}

export async function handleAdminPurgeKV(request, env) {
  const admin = await requireAdmin(request, env);
  if (!admin)
    return json({ error: "Forbidden" }, 403);
  let deleted = 0;
  let cursor = void 0;
  let errors = [];
  try {
    while (true) {
      const listOpts = cursor ? { limit: 1e3, cursor } : { limit: 1e3 };
      const result = await env.SESSIONS.list(listOpts);
      const keys = result.keys || [];
      for (const k of keys) {
        try {
          await env.SESSIONS.delete(k.name);
          deleted++;
        } catch (e) {
          errors.push(k.name);
        }
      }
      if (result.list_complete)
        break;
      cursor = result.cursor;
    }
    return json({ ok: true, deleted, errors: errors.length ? errors : void 0 });
  } catch (err) {
    return json({ error: err.message || String(err), deleted }, 500);
  }
}
