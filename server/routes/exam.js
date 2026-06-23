const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { difficultyWeightedScore } = require('../utils/normalize');
const { authMiddleware, studentOnly } = require('../middleware/auth');

// Student gets their unique variant set
router.get('/start/:examId/:studentId', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const questions = await Question.find({ examId, locked: true });

    if (questions.length === 0) {
      return res.status(400).json({ error: 'Exam not found or not locked yet' });
    }

    const existing = await Attempt.findOne({ examId, studentId });
    if (existing) {
      return res.status(400).json({ error: 'Already attempted this exam' });
    }

    // For each question, find which variants have already been assigned to other students
    const allAttempts = await Attempt.find({ examId });

    const studentExamQuestions = [];

    for (const q of questions) {
      const usedVariantIndexes = allAttempts
        .flatMap(a => a.answers)
        .filter(ans => ans.questionId === q._id.toString())
        .map(ans => ans.variantIndex);

      // Find variants not yet used by anyone
      const availableIndexes = q.variants
        .map((_, idx) => idx)
        .filter(idx => !usedVariantIndexes.includes(idx));

      // If all variants used (more students than variants), fall back to random
      const pool = availableIndexes.length > 0
        ? availableIndexes
        : q.variants.map((_, idx) => idx);

      const variantIndex = pool[Math.floor(Math.random() * pool.length)];

      studentExamQuestions.push({
        questionId: q._id,
        concept: q.concept,
        difficulty: q.difficulty,
        variantIndex,
        questionText: q.variants[variantIndex].questionText,
        options: q.variants[variantIndex].options
      });
    }

    res.json({ questions: studentExamQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits answers
router.post('/submit', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { studentId, studentName, examId, answers } = req.body;

    const questions = await Question.find({ examId });
    const questionMap = {};
    questions.forEach(q => { questionMap[q._id.toString()] = q; });

    const gradedAnswers = answers.map(ans => {
      const q = questionMap[ans.questionId];
      const correctAnswer = q.variants[ans.variantIndex].correctAnswer;
      return {
        questionId: ans.questionId,
        variantIndex: ans.variantIndex,
        selectedAnswer: ans.selectedAnswer,
        correct: ans.selectedAnswer === correctAnswer,
        difficulty: q.difficulty
      };
    });

    const rawScore = difficultyWeightedScore(gradedAnswers);

    const attempt = new Attempt({
      studentId,
      studentName,
      examId,
      answers: gradedAnswers,
      rawScore,
      normalizedScore: rawScore
    });

    await attempt.save();
    res.json({ success: true, rawScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;