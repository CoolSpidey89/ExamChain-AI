const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  examId: { type: String, required: true },
  concept: String,
  difficulty: Number,
  original: String,
  variants: [
    {
      _id: false,
      questionText: String,
      options: [String],
      correctAnswer: String
    }
  ],
  hash: String,
  prevHash: String,
  locked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);