export function computeHonestAnswerCount(messages) {
  return (messages || []).filter(m =>
    m.role === 'user' && (m.content || '').split(/\s+/).filter(Boolean).length >= 40
  ).length;
}

const BREAKTHROUGH_MARKERS = [
  /\bi realized\b/i, /\bi've never\b/i, /\bi have never\b/i,
  /\bi don't usually\b/i, /\bi don't normally\b/i,
  /\bthe truth is\b/i, /\bhonestly\b/i, /\bi'm scared\b/i,
  /\bi'm ashamed\b/i, /\bthat's the first time\b/i
];

export function computeBreakthroughCount(messages) {
  return (messages || []).filter(m => {
    if (m.role !== 'user') return false;
    const t = m.content || '';
    return BREAKTHROUGH_MARKERS.some(r => r.test(t));
  }).length;
}
