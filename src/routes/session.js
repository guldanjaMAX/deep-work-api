// src/routes/session.js
// Session management route handlers

export async function handleSessionStart(request, env) {
  const body = await request.json();
  const { sessionId, tier, existingWebsiteUrl, linkedinUrl, competitorUrls, testimonials, uploadedKeys, phone } = body;
  let userId = null;
  try {
    const authHeader = request.headers.get("Authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = await verifySessionToken(token, getJWTSecret(env));
      if (payload)
        userId = payload.userId;
    }
  } catch (_) {
  }
  let session;
  const sessionRaw = await env.SESSIONS.get(sessionId);
  if (sessionRaw) {
    session = JSON.parse(sessionRaw);
  } else {
    session = {
      id: sessionId || "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      tier: tier || "blueprint",
      phase: 1,
      messages: [],
      userData: {},
      userId,
      blueprintGenerated: false,
      siteGenerated: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (userId)
    session.userId = userId;
  if (phone)
    session.phone = phone;
  session.userData = {
    existingWebsiteUrl: existingWebsiteUrl || "",
    linkedinUrl: linkedinUrl || "",
    competitorUrls: competitorUrls || [],
    testimonials: testimonials || "",
    uploadedKeys: uploadedKeys || [],
    phone: phone || "",
    existingWebsiteAnalysis: "",
    linkedinData: "",
    competitorAnalyses: []
  };
  const fetchPromises = [];
  if (existingWebsiteUrl) {
    fetchPromises.push(
      fetchAndSummarize(env, existingWebsiteUrl, "Summarize this website in 200 words: what they offer, their positioning, their target audience, and what is missing.").then((text) => {
        session.userData.existingWebsiteAnalysis = text;
      }).catch(() => {
      })
    );
  }
  if (competitorUrls && competitorUrls.length > 0) {
    competitorUrls.slice(0, 3).forEach((url, i) => {
      fetchPromises.push(
        fetchAndSummarize(env, url, "Summarize this competitor website: their positioning, target audience, pricing signals, and main differentiators in 150 words.").then((text) => {
          session.userData.competitorAnalyses[i] = text;
        }).catch(() => {
        })
      );
    });
  }
  await Promise.allSettled(fetchPromises);
  if ((!competitorUrls || competitorUrls.length === 0) && (session.userData.existingWebsiteAnalysis || session.userData.linkedinData)) {
    try {
      const autoCompetitors = await autoResearchCompetitors(env, session.userData.existingWebsiteAnalysis, session.userData.linkedinData);
      if (autoCompetitors) {
        session.userData.autoResearchedCompetitors = autoCompetitors;
      }
    } catch (_) {
    }
  }
  const contextExtra = contextEnrichmentPrompt(session.userData);
  const systemWithContext = DEEP_WORK_SYSTEM_PROMPT + (contextExtra ? "\n\n" + contextExtra : "");
  session.systemPrompt = systemWithContext;
  const openingMessages = [
    { role: "user", content: "Start the interview. Introduce yourself briefly and ask your first question for Phase 1." }
  ];
  const firstMessage = await callClaude(env, systemWithContext, openingMessages, false);
  const cleanFirst = stripMetadata(firstMessage);
  session.messages = [
    { role: "user", content: "Start the interview." },
    { role: "assistant", content: firstMessage }
  ];
  await env.SESSIONS.put(session.id, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
  await initSessionInD1(env, session);
  await logEvent(env, session.id, "session_started", { tier, phase: 1 });
  if (session.userId) {
    getUserById(env, session.userId).then((user) => {
      if (user?.email) {
        fireEventToDripWorker(env, user.email, "interview_started", {
          name: user.name || "",
          phone: session.phone || ""
        }).catch(() => {
        });
      }
    }).catch(() => {
    });
  }
  return json({ ok: true, sessionId: session.id, firstMessage: cleanFirst });
}

export async function handleSessionClaim(request, env) {
  try {
    const { accessToken, sessionId } = await request.json();
    if (!accessToken || !sessionId)
      return json({ error: "Missing accessToken or sessionId" }, 400);
    const kvKey = `session_access:${accessToken}`;
    const raw = await env.SESSIONS.get(kvKey);
    if (!raw)
      return json({ error: "Invalid or expired access token" }, 401);
    const record = JSON.parse(raw);
    if (record.sessionId !== sessionId)
      return json({ error: "Token does not match session" }, 401);
    await env.SESSIONS.delete(kvKey);
    const jwt = await createSessionToken({ sessionId, type: "session_access" }, getJWTSecret(env), 60 * 60 * 24 * 30);
    return json({ token: jwt, sessionId });
  } catch (e) {
    return json({ error: "Claim failed", detail: e.message }, 500);
  }
}

export async function handleSessionResume(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const body = await request.json();
    const { sessionId } = body;
    if (!sessionId)
      return json({ error: "sessionId required" }, 400);
    const row = await env.DB.prepare(`SELECT user_id FROM sessions WHERE id = ?`).bind(sessionId).first();
    if (!row)
      return json({ error: "Session not found" }, 404);
    if (row.user_id && row.user_id !== user.id)
      return json({ error: "Not your session" }, 403);
    const kvData = await env.SESSIONS.get(sessionId);
    if (!kvData)
      return json({ error: "Session data expired. Please start a new session." }, 410);
    const session = JSON.parse(kvData);
    const displayMessages = (session.messages || []).filter((m, i) => {
      if (i === 0 && m.role === "user" && m.content === "Start the interview.")
        return false;
      return true;
    });
    await logEvent(env, sessionId, "session_resumed", { phase: session.phase, messageCount: displayMessages.length });
    return json({
      ok: true,
      sessionId: session.id,
      tier: session.tier,
      phase: session.phase || 1,
      messages: displayMessages.map((m) => ({ role: m.role, content: m.role === "assistant" ? stripMetadata(m.content) : m.content })),
      blueprintGenerated: session.blueprintGenerated || false,
      blueprint: session.blueprint || null,
      strategistDebrief: session.strategistDebrief || null,
      siteGenerated: session.siteGenerated || false,
      siteUrl: session.siteUrl || null,
      siteSlug: session.siteSlug || null
    });
  } catch (e) {
    return json({ error: "Failed to resume session", detail: e.message }, 500);
  }
}

export async function handleSessionRestart(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const userRow = await env.DB.prepare("SELECT restart_count FROM users WHERE id = ?").bind(user.id).first();
    const restartCount = userRow?.restart_count || 0;
    if (restartCount >= 1) {
      return json({ ok: false, error: "restart_limit_reached" });
    }
    const activeSessions = await env.DB.prepare(
      "SELECT id FROM sessions WHERE user_id = ? AND (status = 'active' OR status IS NULL)"
    ).bind(user.id).all();
    for (const row of activeSessions?.results || []) {
      try {
        await env.SESSIONS.delete(row.id);
      } catch (_) {
      }
    }
    await env.DB.prepare(
      "UPDATE sessions SET status = 'restarted', updated_at = ? WHERE user_id = ? AND (status = 'active' OR status IS NULL)"
    ).bind((/* @__PURE__ */ new Date()).toISOString(), user.id).run();
    await env.DB.prepare("UPDATE users SET restart_count = restart_count + 1 WHERE id = ?").bind(user.id).run();
    try {
      await env.DB.prepare(
        "INSERT INTO event_log (type, data, created_at) VALUES ('session_restart', ?, ?)"
      ).bind(JSON.stringify({ userId: user.id, email: user.email }), (/* @__PURE__ */ new Date()).toISOString()).run();
    } catch (_) {
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Failed to restart", detail: e.message }, 500);
  }
}

export async function handleGetSession(request, env, path) {
  const sessionId = path.split("/").pop();
  const raw = await env.SESSIONS.get(sessionId);
  if (!raw)
    return json({ error: "Session not found" }, 404);
  const session = JSON.parse(raw);
  return json({
    id: session.id,
    tier: session.tier,
    phase: session.phase,
    blueprintGenerated: session.blueprintGenerated,
    siteGenerated: session.siteGenerated,
    siteUrl: session.siteUrl || null,
    siteSlug: session.siteSlug || null
  });
}

export async function handleUserActiveSession(request, env) {
  const user = await requireAuth(request, env);
  if (!user)
    return json({ error: "Not authenticated" }, 401);
  try {
    const completedRow = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND blueprint_generated = 1
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();
    if (completedRow) {
      const kvData2 = await env.SESSIONS.get(completedRow.id);
      if (kvData2) {
        const session2 = JSON.parse(kvData2);
        return json({
          hasActiveSession: true,
          blueprintComplete: true,
          session: {
            id: completedRow.id,
            tier: completedRow.tier,
            phase: session2.phase || completedRow.phase,
            messageCount: session2.messages ? session2.messages.length : completedRow.message_count,
            createdAt: completedRow.created_at,
            updatedAt: completedRow.updated_at
          }
        });
      } else {
        await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(completedRow.id).run();
      }
    }
    const row = await env.DB.prepare(`
      SELECT id, tier, phase, message_count, created_at, updated_at, blueprint_generated, status
      FROM sessions
      WHERE user_id = ? AND (status = 'active' OR status IS NULL) AND blueprint_generated = 0
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(user.id).first();
    if (!row)
      return json({ hasActiveSession: false });
    const kvData = await env.SESSIONS.get(row.id);
    if (!kvData) {
      await env.DB.prepare(`UPDATE sessions SET status = 'expired' WHERE id = ?`).bind(row.id).run();
      return json({ hasActiveSession: false });
    }
    const session = JSON.parse(kvData);
    return json({
      hasActiveSession: true,
      blueprintComplete: false,
      session: {
        id: row.id,
        tier: row.tier,
        phase: session.phase || row.phase,
        messageCount: session.messages ? session.messages.length : row.message_count,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (e) {
    return json({ hasActiveSession: false, error: e.message });
  }
}
