export function computeUserTier(score) {
  if (score === null || score === undefined) return null;
  const s = Number(score);
  if (isNaN(s)) return null;
  if (s >= 23) return { grade: 'A+', tier_title: "Didn't Flinch Once" };
  if (s >= 20) return { grade: 'A',  tier_title: "Sat With The Fire" };
  if (s >= 17) return { grade: 'B+', tier_title: "Named The Pattern" };
  if (s >= 14) return { grade: 'B',  tier_title: "Told On Yourself" };
  return           { grade: 'C',  tier_title: "Took The First Swing" };
}
