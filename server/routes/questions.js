const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const { generateVariants } = require('../utils/llm');
const { createBlock } = require('../utils/hash');
const { authMiddleware, teacherOnly } = require('../middleware/auth');

router.post('/add', authMiddleware, teacherOnly, async (req, res) => {
  try {
    const { original, concept, difficulty, examId } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    if (exam.teacherId !== req.user.id) return res.status(403).json({ error: 'Not your exam' });
    if (exam.locked) return res.status(400).json({ error: 'Exam is locked, cannot add questions' });

    const variants = await generateVariants(original, concept, difficulty);

    const lastQuestion = await Question.findOne({ examId }).sort({ timestamp: -1 });
    const prevHash = lastQuestion ? lastQuestion.hash : '0';
    const { hash } = createBlock(variants, prevHash);

    const question = new Question({
      concept,
      difficulty,
      original,
      variants,
      hash,
      prevHash,
      examId
    });

    await question.save();
    res.json({ success: true, question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:examId', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/reset/:examId', authMiddleware, teacherOnly, async (req, res) => {
  try {
    await Question.deleteMany({ examId: req.params.examId });
    res.json({ success: true, message: 'Reset done' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;