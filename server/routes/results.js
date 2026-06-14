const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const { normalizeScores } = require('../utils/normalize');

router.get('/:examId', async (req, res) => {
  try {
    const attempts = await Attempt.find({ examId: req.params.examId });

    if (attempts.length === 0) {
      return res.json({ attempts: [] });
    }

    const normalized = normalizeScores(attempts.map(a => a.toObject()));

    // Update normalized scores in DB
    for (const a of normalized) {
      await Attempt.findByIdAndUpdate(a._id, { normalizedScore: a.normalizedScore });
    }

    res.json({ attempts: normalized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;