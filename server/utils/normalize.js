function normalizeScores(attempts) {
  const sorted = [...attempts].sort((a, b) => a.rawScore - b.rawScore);
  const n = sorted.length;

  // Assign percentile rank to each attempt based on how many scored lower
  const withPercentile = attempts.map(attempt => {
    const lowerCount = sorted.filter(a => a.rawScore < attempt.rawScore).length;
    const sameCount = sorted.filter(a => a.rawScore === attempt.rawScore).length;
    // Standard percentile rank formula, accounts for ties
    const percentile = n <= 1
      ? 100
      : Math.round(((lowerCount + 0.5 * sameCount) / n) * 100);

    return { ...attempt, normalizedScore: percentile };
  });

  return withPercentile;
}

function difficultyWeightedScore(answers) {
  let total = 0;
  let maxPossible = 0;
  answers.forEach(ans => {
    const weight = ans.difficulty;
    maxPossible += weight;
    if (ans.correct) total += weight;
  });
  return maxPossible === 0 ? 0 : Math.round((total / maxPossible) * 100);
}

module.exports = { normalizeScores, difficultyWeightedScore };