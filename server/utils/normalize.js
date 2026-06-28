function normalizeScores(attempts) {
  const n = attempts.length;

  return attempts.map(attempt => {
    if (n <= 1) {
      return { ...attempt, normalizedScore: 100 };
    }

    // Percentage of all students (including ties with self) scoring at or below this attempt.
    // This guarantees the top scorer always reaches 100, and correctly handles ties.
    const countAtOrBelow = attempts.filter(a => a.rawScore <= attempt.rawScore).length;
    const percentile = Math.round((countAtOrBelow / n) * 100);

    return { ...attempt, normalizedScore: percentile };
  });
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