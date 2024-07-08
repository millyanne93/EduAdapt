const mongoose = require('mongoose');

// Define the Option schema
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
});

// Define the Question schema
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty: { type: String, required: true },
  topic: { type: String, required: true },
  options: [optionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Export the Question model
module.exports = mongoose.model('Question', QuestionSchema);
