const QuestionPaper = require('../models/questionPaper');

const getQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id).populate('extractedQuestions');
    if (!questionPaper) {
      return res.status(404).json({ msg: 'Question paper not found' });
    }
    res.json(questionPaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getQuestionPaper };
