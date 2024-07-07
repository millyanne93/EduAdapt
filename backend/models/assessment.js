const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true },
      correct: { type: Boolean, required: true },
      timeSpent: { type: Number, required: true }, // time in seconds
      attempts: { type: Number, required: true, default: 1 }, // number of attempts
      hintsUsed: { type: Number, default: 0 },
      perceivedDifficulty: { type: Number, min: 1, max: 5 },
      answerPattern: [{ type: String, enum: ['correct', 'incorrect'] }]
    }
  ],
  topic: { type: String, required: true },
  sessionDuration: { type: Number, required: true }, // session duration in seconds
  skippedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
