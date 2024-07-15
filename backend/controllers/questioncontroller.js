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
    res.status(500).json({ msg: 'Server error' });
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
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get question by id
exports.getQuestionById = async (req, res) => {
  try {
    const response = await Question.findById(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ msg: 'Server error'});
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.json({ msg: 'Question removed' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
