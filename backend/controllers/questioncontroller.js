const Question = require('../models/question');

async function generateQuestionsWithGemini(difficulty, topic, numberOfQuestions) {
  const { default: generateQuestions } = await import('../../ai/gemini-start.js');
  return generateQuestions(difficulty, topic, numberOfQuestions);
}

// Create and store generated questions
exports.generateAndStoreQuestions = async (req, res) => {
  const { difficulty, topic, numberOfQuestions } = req.body;

  try {
    const generatedQuestions = await generateQuestionsWithGemini(difficulty, topic, numberOfQuestions);

    // Store the generated questions in the database
    const questions = await Question.insertMany(generatedQuestions);

    res.status(201).json(questions);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ msg: 'Error generating questions' });
  }
};

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
    res.status(500).json({ message: 'Server error' });
  }
};