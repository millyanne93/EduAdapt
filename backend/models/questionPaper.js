const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  extractedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true }  // Add topic field
});

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
