import { describe, it, expect } from 'vitest';
import { computeSessionHealth } from '../../src/lib/session-health.js';

const NOW = new Date('2026-04-05T12:00:00Z');
const hoursAgo = (h) => new Date(NOW.getTime() - h * 60 * 60 * 1000).toISOString();

describe('computeSessionHealth', () => {
  it('returns complete for completed status', () => {
    expect(computeSessionHealth({ status: 'completed', blueprint_generated: 1 }, NOW)).toBe('complete');
    expect(computeSessionHealth({ status: 'blueprint_complete', blueprint_generated: 1 }, NOW)).toBe('complete');
  });
  it('returns shallow_complete for blueprint_generated=1 with depth_grade C', () => {
    expect(computeSessionHealth({ blueprint_generated: 1, depth_grade: 'C', status: 'completed' }, NOW)).toBe('shallow_complete');
  });
  it('returns failed for failed status', () => {
    expect(computeSessionHealth({ status: 'failed' }, NOW)).toBe('failed');
  });
  it('returns cold_abandoned when 0 messages and >24h old', () => {
    expect(computeSessionHealth({
      status: 'active', message_count: 0,
      created_at: hoursAgo(25), last_active_at: hoursAgo(25)
    }, NOW)).toBe('cold_abandoned');
  });
  it('returns healthy for brand new session', () => {
    expect(computeSessionHealth({
      status: 'active', message_count: 0,
      created_at: hoursAgo(1), last_active_at: hoursAgo(1)
    }, NOW)).toBe('healthy');
  });
  it('returns stuck_phase for 30+ msgs stuck at phase 1 or 2', () => {
    expect(computeSessionHealth({
      status: 'active', message_count: 35, phase: 1,
      created_at: hoursAgo(48), last_active_at: hoursAgo(1)
    }, NOW)).toBe('stuck_phase');
  });
  it('returns mid_drop for structural phase idle >48h', () => {
    expect(computeSessionHealth({
      status: 'active', message_count: 10, phase: 4,
      created_at: hoursAgo(72), last_active_at: hoursAgo(50)
    }, NOW)).toBe('mid_drop');
  });
  it('gives emotional phases 5-day grace (120h)', () => {
    // Phase 2 is emotional — 50h idle should still be healthy
    expect(computeSessionHealth({
      status: 'active', message_count: 10, phase: 2,
      created_at: hoursAgo(72), last_active_at: hoursAgo(50)
    }, NOW)).toBe('healthy');
    // But 121h idle should be mid_drop
    expect(computeSessionHealth({
      status: 'active', message_count: 10, phase: 2,
      created_at: hoursAgo(200), last_active_at: hoursAgo(121)
    }, NOW)).toBe('mid_drop');
  });
  it('returns healthy for active recent session', () => {
    expect(computeSessionHealth({
      status: 'active', message_count: 5, phase: 3,
      created_at: hoursAgo(10), last_active_at: hoursAgo(2)
    }, NOW)).toBe('healthy');
  });
  it('returns unknown for null', () => {
    expect(computeSessionHealth(null, NOW)).toBe('unknown');
  });
});
