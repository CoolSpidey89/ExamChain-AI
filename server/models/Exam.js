const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationMinutes: { type: Number, default: 30 },
  teacherId: { type: String, required: true },
  teacherName: String,
  examCode: { type: String, required: true, unique: true },
  locked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);