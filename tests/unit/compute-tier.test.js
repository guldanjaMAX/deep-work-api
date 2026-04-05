import { describe, it, expect } from 'vitest';
import { computeUserTier } from '../../src/lib/tier.js';

describe('computeUserTier', () => {
  it("returns Didn't Flinch Once for A+ (23-25)", () => {
    expect(computeUserTier(25).tier_title).toBe("Didn't Flinch Once");
    expect(computeUserTier(23).tier_title).toBe("Didn't Flinch Once");
    expect(computeUserTier(25).grade).toBe('A+');
  });
  it('returns Sat With The Fire for A (20-22)', () => {
    expect(computeUserTier(22).tier_title).toBe("Sat With The Fire");
    expect(computeUserTier(20).tier_title).toBe("Sat With The Fire");
  });
  it('returns Named The Pattern for B+ (17-19)', () => {
    expect(computeUserTier(19).tier_title).toBe("Named The Pattern");
  });
  it('returns Told On Yourself for B (14-16)', () => {
    expect(computeUserTier(15).tier_title).toBe("Told On Yourself");
  });
  it('returns Took The First Swing for C (<14)', () => {
    expect(computeUserTier(10).tier_title).toBe("Took The First Swing");
    expect(computeUserTier(0).tier_title).toBe("Took The First Swing");
  });
  it('returns null for missing score', () => {
    expect(computeUserTier(null)).toBe(null);
    expect(computeUserTier(undefined)).toBe(null);
  });
  it('returns null for NaN or non-numeric input', () => {
    expect(computeUserTier(NaN)).toBe(null);
    expect(computeUserTier('bad')).toBe(null);
  });
  it('covers tier boundaries at 13, 14, 16, 17', () => {
    expect(computeUserTier(14).grade).toBe('B');
    expect(computeUserTier(13).grade).toBe('C');
    expect(computeUserTier(17).grade).toBe('B+');
    expect(computeUserTier(16).grade).toBe('B');
  });
});
