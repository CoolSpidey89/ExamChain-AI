function normalizeScores(attempts) {
  const scores = attempts.map(a => a.rawScore);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const std = Math.sqrt(
    scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length
  );

  return attempts.map(attempt => ({
    ...attempt,
    normalizedScore: std === 0 ? 50 : Math.round(((attempt.rawScore - mean) / std) * 15 + 50)
  }));
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