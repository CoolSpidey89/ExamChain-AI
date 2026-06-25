const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const ExamRelease = require('../models/ExamRelease');
const { normalizeScores } = require('../utils/normalize');
const { authMiddleware, teacherOnly, studentOnly } = require('../middleware/auth');

// TEACHER VIEW — full report, always visible regardless of release status
router.get('/teacher/:examId', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { examId } = req.params;
    const attempts = await Attempt.find({ examId });

    if (attempts.length === 0) {
      return res.json({ attempts: [], released: false });
    }

    const normalized = normalizeScores(attempts.map(a => a.toObject()));

    for (const a of normalized) {
      await Attempt.findByIdAndUpdate(a._id, { normalizedScore: a.normalizedScore });
    }

    const releaseDoc = await ExamRelease.findOne({ examId });

    res.json({
      attempts: normalized,
      released: releaseDoc?.released || false,
      totalSubmissions: attempts.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RELEASE SCORES — teacher triggers this
router.post('/release/:examId', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { examId } = req.params;

    await ExamRelease.findOneAndUpdate(
      { examId },
      { released: true, releasedAt: new Date() },
      { upsert: true }
    );

    res.json({ success: true, message: 'Scores released to students' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UNDO RELEASE — optional, in case teacher wants to re-hide
router.post('/unrelease/:examId', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { examId } = req.params;
    await ExamRelease.findOneAndUpdate({ examId }, { released: false });
    res.json({ success: true, message: 'Scores hidden again' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEACHER VIEW — concept-wise weakness analytics
router.get('/analytics/:examId', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { examId } = req.params;
    const attempts = await Attempt.find({ examId, submittedAt: { $ne: null } });

    if (attempts.length === 0) {
      return res.json({ concepts: [], totalSubmissions: 0 });
    }

    const conceptStats = {};

    attempts.forEach(attempt => {
      attempt.answers.forEach(ans => {
        if (!ans.concept) return;
        if (!conceptStats[ans.concept]) {
          conceptStats[ans.concept] = { total: 0, correct: 0 };
        }
        conceptStats[ans.concept].total += 1;
        if (ans.correct) conceptStats[ans.concept].correct += 1;
      });
    });

    const concepts = Object.entries(conceptStats).map(([concept, stats]) => ({
      concept,
      totalAttempts: stats.total,
      correctCount: stats.correct,
      incorrectCount: stats.total - stats.correct,
      accuracyPercent: Math.round((stats.correct / stats.total) * 100)
    })).sort((a, b) => a.accuracyPercent - b.accuracyPercent);

    res.json({ concepts, totalSubmissions: attempts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STUDENT VIEW — only their own score, only if released
router.get('/student/:examId', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { examId } = req.params;
    const rollNumber = req.user.rollNumber;

    const releaseDoc = await ExamRelease.findOne({ examId });

    if (!releaseDoc?.released) {
      return res.json({ released: false, message: 'Scores have not been released yet' });
    }

    const attempt = await Attempt.findOne({ examId, studentId: rollNumber });

    if (!attempt) {
      return res.status(404).json({ error: 'No submission found for this exam' });
    }

    // IMPORTANT: only return their own percentile score, nothing else
    res.json({
      released: true,
      percentileScore: attempt.normalizedScore
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;