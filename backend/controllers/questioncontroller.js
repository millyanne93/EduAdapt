const Question = require('../models/question');
const Assessment = require('../models/assessment');

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
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get questions by category (topic)
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const questions = await Question.find({ topic: req.params.topic });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ msg: 'No questions found for this category' });
    }
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get question by id
exports.getQuestionById = async (req, res) => {
  try {
    const response = await Question.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Find the assessment containing this question
    const assessment = await Assessment.findOne({ questions: req.params.id });
    const responseObj = {
      response,
      ...(assessment && { assessmentId: assessment._id })
    };
    res.status(200).json(responseObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error'});
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findByIdAndUpdate(questionId, req.body, { new: true });
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
