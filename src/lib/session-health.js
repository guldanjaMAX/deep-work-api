const EMOTIONAL_PHASES = new Set([2, 3, 5, 8]);
const HOUR_MS = 60 * 60 * 1000;

function safeHoursAgo(dateStr, nowMs) {
  if (!dateStr) return null;
  const ms = new Date(dateStr).getTime();
  if (isNaN(ms)) return null;
  return (nowMs - ms) / HOUR_MS;
}

export function computeSessionHealth(s, now = new Date()) {
  if (!s) return 'unknown';
  const nowMs = now.getTime();
  const phase = Number(s.phase || 0);
  const msgCount = Number(s.message_count || 0);

  // Terminal states — hard failures first
  if (s.status === 'failed') return 'failed';
  if (s.blueprint_generated === 1 && s.depth_grade === 'C') return 'shallow_complete';
  if (s.status === 'completed' || s.status === 'blueprint_complete') return 'complete';

  // Active session problem detection — only on active sessions
  if (s.status === 'active') {
    const hoursSinceCreated = safeHoursAgo(s.created_at, nowMs);
    const hoursSinceActive = safeHoursAgo(s.last_active_at, nowMs) ?? safeHoursAgo(s.created_at, nowMs);

    if (msgCount === 0 && hoursSinceCreated !== null && hoursSinceCreated > 24) return 'cold_abandoned';
    if (msgCount >= 30 && phase <= 2) return 'stuck_phase';

    const dropThreshold = EMOTIONAL_PHASES.has(phase) ? 24 * 5 : 48;
    if (msgCount > 5 && hoursSinceActive !== null && hoursSinceActive > dropThreshold) return 'mid_drop';
  }

  return 'healthy';
}
