import { describe, it, expect } from 'vitest';
import { computeUserTier } from '../../src/lib/tier.js';

// These tests verify that tier titles render as expected
// (Full HTML snapshot testing is deferred until we can import the renderer)
describe('tier title rendering inputs', () => {
  const cases = [
    { score: 25, expected: "Didn't Flinch Once" },
    { score: 21, expected: "Sat With The Fire" },
    { score: 18, expected: "Named The Pattern" },
    { score: 15, expected: "Told On Yourself" },
    { score: 5, expected: "Took The First Swing" },
  ];

  for (const { score, expected } of cases) {
    it(`score ${score} → "${expected}"`, () => {
      const tier = computeUserTier(score);
      expect(tier.tier_title).toBe(expected);
    });
  }
});
