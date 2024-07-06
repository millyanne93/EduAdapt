const Question = require('../models/question');

exports.createQuestion = async (req, res) => {
  const { text, difficulty_level, topic, answers } = req.body;

  try {
    const question = new Question({ text, difficulty_level, topic, answers });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
