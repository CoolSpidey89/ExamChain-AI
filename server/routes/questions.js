const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { generateVariants } = require('../utils/llm');
const { createBlock } = require('../utils/hash');

// Teacher adds a question
router.post('/add', async (req, res) => {
  try {
    const { original, concept, difficulty, examId } = req.body;

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

// Get all questions for an exam
router.get('/:examId', async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lock exam - no more edits
router.post('/lock/:examId', async (req, res) => {
  try {
    await Question.updateMany({ examId: req.params.examId }, { locked: true });
    res.json({ success: true, message: 'Exam locked on chain' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;