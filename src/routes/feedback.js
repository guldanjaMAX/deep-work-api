// src/routes/feedback.js
// Feedback and event logging route handlers

import { json } from '../utils/helpers.js';

export async function handleFeedback(request, env) {
  const body = await request.json();
  const { sessionId, rating, mostValuable, whatWasOff } = body;
  try {
    await env.DB.prepare(`
      UPDATE sessions
      SET satisfaction_score = ?, feedback_most_valuable = ?, feedback_what_was_off = ?
      WHERE id = ?
    `).bind(rating, mostValuable, whatWasOff, sessionId).run();
  } catch (e) {
    console.error("Feedback save error:", e);
  }
  return json({ ok: true });
}

export async function handleLogEvent(request, env) {
  try {
    const body = await request.json();
    const { type, action, detail, sessionId, email, timestamp } = body;
    if (!["help_bot", "site_review", "refinement"].includes(type)) {
      return json({ ok: true });
    }
    await env.DB.prepare(`
      INSERT INTO event_log (type, action, detail, session_id, email, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      type || "unknown",
      action || "",
      (detail || "").slice(0, 500),
      sessionId || "",
      email || "",
      timestamp || (/* @__PURE__ */ new Date()).toISOString()
    ).run();
  } catch (e) {
    console.error("Event log error:", e);
  }
  return json({ ok: true });
}
