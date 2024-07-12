const Question = require('../models/question');

// Create a new question
exports.createQuestion = async (req, res) => {
  const { text, options, correctOption, difficulty, topic } = req.body;

  try {
    const question = new Question({ text, options, correctOption, difficulty, topic });
    await question.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get questions by category
exports.getQuestionsByCategory = async (req, res) => {
  const { topic } = req.params;

  try {
    const questions = await Question.find({ topic });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};