export function computeNextNudge(session, existingNudges, now = new Date()) {
  if (!session) return null;
  // Respect opt-out
  if (session.nudges_opted_out) return null;

  const health = session.session_health;
  const nowMs = now.getTime();

  // Only nudge sessions with a problem state
  if (!['cold_abandoned', 'mid_drop'].includes(health)) return null;

  // Don't nudge sessions created in last 48h (let welcome email land first)
  const createdMs = session.created_at ? new Date(session.created_at).getTime() : nowMs;
  if ((nowMs - createdMs) < 48 * 60 * 60 * 1000) return null;

  const sentTypes = (existingNudges || []).map((n) => n.nudge_type);

  // Cold abandoned flow: cold_48h → cold_7d → stop
  if (health === 'cold_abandoned') {
    if (!sentTypes.includes('cold_48h')) {
      return { nudge_type: 'cold_48h', send_after: new Date(createdMs + 48 * 60 * 60 * 1000) };
    }
    const cold48 = existingNudges.find((n) => n.nudge_type === 'cold_48h');
    const cold48SentMs = cold48 ? new Date(cold48.sent_at).getTime() : 0;
    if (!sentTypes.includes('cold_7d') && cold48SentMs && (nowMs - cold48SentMs) > 5 * 24 * 60 * 60 * 1000) {
      return { nudge_type: 'cold_7d', send_after: new Date(cold48SentMs + 5 * 24 * 60 * 60 * 1000) };
    }
    return null; // 2 nudges sent, stop
  }

  // Mid-drop flow: initial → followup → stop
  if (health === 'mid_drop') {
    // Productive pause bonus: if last message was >80 words, add 48h grace
    const lastUserMsg = (session.messages || []).filter((m) => m.role === 'user').pop();
    const lastMsgWords = lastUserMsg ? (lastUserMsg.content || '').split(/\s+/).filter(Boolean).length : 0;
    const gracePeriodMs = lastMsgWords > 80 ? 48 * 60 * 60 * 1000 : 0;

    const lastActiveMs = session.last_active_at ? new Date(session.last_active_at).getTime() : createdMs;
    const sendAfterInitial = new Date(lastActiveMs + 24 * 60 * 60 * 1000 + gracePeriodMs);

    if (!sentTypes.includes('mid_drop_initial') && now >= sendAfterInitial) {
      return { nudge_type: 'mid_drop_initial', send_after: sendAfterInitial };
    }
    const initial = existingNudges.find((n) => n.nudge_type === 'mid_drop_initial');
    const initialSentMs = initial ? new Date(initial.sent_at).getTime() : 0;
    if (!sentTypes.includes('mid_drop_followup') && initialSentMs && (nowMs - initialSentMs) > 4 * 24 * 60 * 60 * 1000) {
      return { nudge_type: 'mid_drop_followup', send_after: new Date(initialSentMs + 4 * 24 * 60 * 60 * 1000) };
    }
    return null;
  }

  return null;
}
