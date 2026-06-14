const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { difficultyWeightedScore } = require('../utils/normalize');

// Student gets their unique variant set
router.get('/start/:examId/:studentId', async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const questions = await Question.find({ examId, locked: true });

    if (questions.length === 0) {
      return res.status(400).json({ error: 'Exam not found or not locked yet' });
    }

    // Check if student already started
    const existing = await Attempt.findOne({ examId, studentId });
    if (existing) {
      return res.status(400).json({ error: 'Already attempted this exam' });
    }

    // Assign a unique variant index per student deterministically
    const studentExamQuestions = questions.map(q => {
      const variantIndex = Math.abs(
        studentId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) +
        q._id.toString().charCodeAt(0)
      ) % q.variants.length;

      return {
        questionId: q._id,
        concept: q.concept,
        difficulty: q.difficulty,
        variantIndex,
        questionText: q.variants[variantIndex].questionText,
        options: q.variants[variantIndex].options
      };
    });

    res.json({ questions: studentExamQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits answers
router.post('/submit', async (req, res) => {
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