import { describe, it, expect } from 'vitest';
import { computeHonestAnswerCount, computeBreakthroughCount } from '../../src/lib/metrics.js';

describe('computeHonestAnswerCount', () => {
  it('counts user messages with >40 words', () => {
    const msgs = [
      { role: 'user', content: 'yes' },
      { role: 'user', content: 'I think what I am really trying to say is that I have always struggled with this particular pattern in my work and it goes back many years and many decisions I made without full awareness of my own patterns' },
      { role: 'assistant', content: 'Thank you for sharing that deeply personal story about your journey and the challenges you have faced throughout your professional life and personal development over the many decades you have lived and grown' },
    ];
    expect(computeHonestAnswerCount(msgs)).toBe(1);
  });
  it('returns 0 for empty array', () => {
    expect(computeHonestAnswerCount([])).toBe(0);
    expect(computeHonestAnswerCount(null)).toBe(0);
  });
});

describe('computeBreakthroughCount', () => {
  it('counts messages with breakthrough markers', () => {
    const msgs = [
      { role: 'user', content: 'I realized I have been running from this my whole life' },
      { role: 'user', content: 'regular answer about my work' },
      { role: 'user', content: "I've never told anyone this before" },
      { role: 'assistant', content: "I realized something about you too" }, // assistant — should not count
    ];
    expect(computeBreakthroughCount(msgs)).toBe(2);
  });
  it('detects all 10 markers', () => {
    const markers = [
      "i realized something big",
      "I've never said this out loud",
      "I have never admitted this",
      "i don't usually talk about this",
      "i don't normally open up like this",
      "the truth is I was afraid",
      "honestly I don't know why",
      "I'm scared of what this means",
      "I'm ashamed to say",
      "that's the first time I have said that"
    ];
    for (const content of markers) {
      expect(computeBreakthroughCount([{ role: 'user', content }])).toBe(1);
    }
  });
  it('returns 0 for empty or null', () => {
    expect(computeBreakthroughCount([])).toBe(0);
    expect(computeBreakthroughCount(null)).toBe(0);
  });
});
