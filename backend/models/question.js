const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  topic: { type: String, required: true }
});

// Export the Question model
module.exports = mongoose.model('Question', questionSchema);
