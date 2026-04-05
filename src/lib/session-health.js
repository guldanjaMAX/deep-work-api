const EMOTIONAL_PHASES = new Set([2, 3, 5, 8]);
const HOUR_MS = 60 * 60 * 1000;

export function computeSessionHealth(s, now = new Date()) {
  if (!s) return 'unknown';
  const nowMs = now.getTime();
  const createdMs = s.created_at ? new Date(s.created_at).getTime() : nowMs;
  const lastActiveMs = s.last_active_at ? new Date(s.last_active_at).getTime() : createdMs;
  const hoursSinceActive = (nowMs - lastActiveMs) / HOUR_MS;
  const hoursSinceCreated = (nowMs - createdMs) / HOUR_MS;
  const phase = Number(s.phase || 0);
  const msgCount = Number(s.message_count || 0);

  // shallow_complete must come before complete (more specific)
  if (s.blueprint_generated === 1 && s.depth_grade === 'C') return 'shallow_complete';
  if (s.status === 'completed' || s.status === 'blueprint_complete') return 'complete';
  if (s.status === 'failed') return 'failed';

  if (msgCount === 0 && hoursSinceCreated > 24) return 'cold_abandoned';
  if (msgCount >= 30 && phase <= 2) return 'stuck_phase';

  const dropThreshold = EMOTIONAL_PHASES.has(phase) ? 24 * 5 : 48;
  if (msgCount > 5 && hoursSinceActive > dropThreshold && s.status === 'active') return 'mid_drop';

  return 'healthy';
}
