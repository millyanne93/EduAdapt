const mongoose = require ('mongoose');

// Test Result Schema
const testResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOption: { type: Number, required: true },
        timeSpent: { type: Number, required: true }
      }
    ],
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('TestResult', testResultSchema);
