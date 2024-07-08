const Question = require('../models/question');

// Create a new question
exports.createQuestion = async (req, res) => {
  const { text, difficulty, options, createdBy } = req.body;

  try {
    // Validate the options array
    if (!options || options.length === 0) {
      return res.status(400).json({ msg: 'At least one option is required' });
    }

    // Ensure that there is at least one correct option
    const hasCorrectOption = options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      return res.status(400).json({ msg: 'At least one option must be marked as correct' });
    }

    // Create a new question
    const question = new Question({ text, difficulty, options, createdBy });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    // Find questions and populate the createdBy field
    const questions = await Question.find().populate('createdBy', 'name email');
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
