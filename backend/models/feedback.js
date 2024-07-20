const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestResult', required: true },
  feedbackText: { type: String, required: true },
  recommendations: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Assuming teachers are also in the User model
});

module.exports = mongoose.model('Feedback', feedbackSchema);
