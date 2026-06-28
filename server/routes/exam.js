const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Exam = require('../models/Exam');
const { difficultyWeightedScore } = require('../utils/normalize');
const { authMiddleware, studentOnly } = require('../middleware/auth');

// Student gets their unique variant set
router.get('/start/:examId/:studentId', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { examId, studentId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const questions = await Question.find({ examId, locked: true });

    if (questions.length === 0) {
      return res.status(400).json({ error: 'Exam not found or not locked yet' });
    }

    let attempt = await Attempt.findOne({ examId, studentId });

    if (attempt && attempt.submittedAt) {
      return res.status(400).json({ error: 'Already attempted this exam' });
    }

    // If no attempt exists yet, this is the first time they're starting — record start time
    if (!attempt) {
      attempt = new Attempt({
        studentId,
        examId,
        startedAt: new Date(),
        answers: []
      });
      await attempt.save();
    }

    const deadline = new Date(attempt.startedAt.getTime() + exam.durationMinutes * 60000);
    const now = new Date();

    if (now >= deadline) {
      return res.status(400).json({ error: 'Time is up for this exam', expired: true });
    }

    const allAttempts = await Attempt.find({ examId, submittedAt: { $ne: null } });

    const studentExamQuestions = [];

    for (const q of questions) {
      const usedVariantIndexes = allAttempts
        .flatMap(a => a.answers)
        .filter(ans => ans.questionId === q._id.toString())
        .map(ans => ans.variantIndex);

      const availableIndexes = q.variants
        .map((_, idx) => idx)
        .filter(idx => !usedVariantIndexes.includes(idx));

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

    res.json({
      questions: studentExamQuestions,
      startedAt: attempt.startedAt,
      durationMinutes: exam.durationMinutes,
      deadline
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits answers
router.post('/submit', authMiddleware, studentOnly, async (req, res) => {
  try {
    const { studentId, studentName, examId, answers } = req.body;

    const exam = await Exam.findById(examId);
    const attempt = await Attempt.findOne({ examId, studentId });

    if (!attempt) return res.status(400).json({ error: 'No active attempt found. Start the exam first.' });
    if (attempt.submittedAt) return res.status(400).json({ error: 'Already submitted' });

    // Server-side deadline check — cannot be bypassed by editing frontend
    const deadline = new Date(attempt.startedAt.getTime() + exam.durationMinutes * 60000);
    const now = new Date();
    const isLate = now > deadline;

    const questions = await Question.find({ examId });
    const questionMap = {};
    questions.forEach(q => { questionMap[q._id.toString()] = q; });

    const gradedAnswers = answers.map(ans => {
      const q = questionMap[ans.questionId];
      const correctAnswer = q.variants[ans.variantIndex].correctAnswer;
      return {
        questionId: ans.questionId,
        concept: q.concept,
        variantIndex: ans.variantIndex,
        selectedAnswer: ans.selectedAnswer,
        correct: ans.selectedAnswer === correctAnswer,
        difficulty: q.difficulty
      };
    });

    const rawScore = isLate ? 0 : difficultyWeightedScore(gradedAnswers);
    const correctCount = gradedAnswers.filter(a => a.correct).length;
    const totalQuestions = gradedAnswers.length;

    attempt.studentName = studentName;
    attempt.answers = gradedAnswers;
    attempt.rawScore = rawScore;
    attempt.correctCount = isLate ? 0 : correctCount;
    attempt.totalQuestions = totalQuestions;
    attempt.normalizedScore = rawScore;
    attempt.submittedAt = now;

    await attempt.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;