const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty_level: { type: String, required: true },
  topic: { type: String, required: true },
  answers: [
    {
      answer_text: { type: String, required: true },
      correct: { type: Boolean, required: true },
    },
  ],
});

module.exports = mongoose.model('Question', QuestionSchema);
