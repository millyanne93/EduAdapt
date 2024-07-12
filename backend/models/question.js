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
  options: {
    type: [optionSchema],
    validate: {
      validator: function(v) {
        return v.length > 0;  // Ensure there is at least one option
      },
      message: 'At least one option is required'
    }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Add a pre-save hook to ensure at least one option is correct
QuestionSchema.pre('save', function(next) {
  if (this.options.filter(option => option.isCorrect).length === 0) {
    return next(new Error('At least one option must be marked as correct'));
  }
  next();
});

// Export the Question model
module.exports = mongoose.model('Question', QuestionSchema);
