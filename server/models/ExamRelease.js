const mongoose = require('mongoose');

const ExamReleaseSchema = new mongoose.Schema({
  examId: { type: String, required: true, unique: true },
  released: { type: Boolean, default: false },
  releasedAt: Date
});

module.exports = mongoose.model('ExamRelease', ExamReleaseSchema);