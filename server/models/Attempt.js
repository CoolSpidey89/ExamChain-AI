const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  examId: String,
  startedAt: Date,
  submittedAt: Date,
  answers: [
    {
      questionId: String,
      variantIndex: Number,
      selectedAnswer: String,
      correct: Boolean,
      difficulty: Number
    }
  ],
  rawScore: Number,
  normalizedScore: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', AttemptSchema);