import { describe, it, expect } from 'vitest';
import { computeNextNudge } from '../../src/lib/nudge-scheduler.js';

const NOW = new Date('2026-04-05T12:00:00Z');
const daysAgo = (d) => new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

describe('computeNextNudge', () => {
  it('returns null for healthy session', () => {
    expect(computeNextNudge({ session_health: 'healthy', created_at: daysAgo(3) }, [], NOW)).toBe(null);
  });
  it('returns null if opted out', () => {
    expect(computeNextNudge({ session_health: 'cold_abandoned', nudges_opted_out: 1, created_at: daysAgo(3) }, [], NOW)).toBe(null);
  });
  it('returns null for sessions created <48h ago', () => {
    expect(computeNextNudge({ session_health: 'cold_abandoned', created_at: daysAgo(1) }, [], NOW)).toBe(null);
  });
  it('schedules cold_48h for cold_abandoned with no nudges', () => {
    const result = computeNextNudge({ session_health: 'cold_abandoned', created_at: daysAgo(3) }, [], NOW);
    expect(result?.nudge_type).toBe('cold_48h');
  });
  it('schedules cold_7d after cold_48h was sent >5d ago', () => {
    const nudges = [{ nudge_type: 'cold_48h', sent_at: daysAgo(6) }];
    const result = computeNextNudge({ session_health: 'cold_abandoned', created_at: daysAgo(10) }, nudges, NOW);
    expect(result?.nudge_type).toBe('cold_7d');
  });
  it('returns null after both cold nudges sent', () => {
    const nudges = [{ nudge_type: 'cold_48h', sent_at: daysAgo(8) }, { nudge_type: 'cold_7d', sent_at: daysAgo(3) }];
    expect(computeNextNudge({ session_health: 'cold_abandoned', created_at: daysAgo(10) }, nudges, NOW)).toBe(null);
  });
  it('schedules mid_drop_initial for mid_drop session', () => {
    const result = computeNextNudge({
      session_health: 'mid_drop', created_at: daysAgo(5),
      last_active_at: daysAgo(2)
    }, [], NOW);
    expect(result?.nudge_type).toBe('mid_drop_initial');
  });
  it('applies grace period when last message >80 words', () => {
    const longMsg = 'word '.repeat(85).trim();
    const session = {
      session_health: 'mid_drop', created_at: daysAgo(5),
      last_active_at: daysAgo(0.5), // only 12h ago — within grace
      messages: [{ role: 'user', content: longMsg }]
    };
    // 12h idle + 48h grace = not due yet
    const result = computeNextNudge(session, [], NOW);
    expect(result).toBe(null); // not yet due
  });
});
