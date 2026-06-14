const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  concept: String,
  difficulty: Number,
  original: String,
  variants: [
    {
      questionText: String,
      options: [String],
      correctAnswer: String
    }
  ],
  hash: String,
  prevHash: String,
  locked: { type: Boolean, default: false },
  examId: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);