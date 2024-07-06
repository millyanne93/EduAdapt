const Assessment = require('../models/assessment');
const Question = require('../models/question');

exports.createAssessment = async (req, res) => {
  const { questions, score } = req.body;
  const student = req.user.id;

  try {
    // Validate that all question IDs exist
    for (let i = 0; i < questions.length; i++) {
      const questionExists = await Question.findById(questions[i].question);
      if (!questionExists) {
        return res.status(400).json({ msg: `Question with ID ${questions[i].question} does not exist` });
      }
    }

    const assessment = new Assessment({ student, questions, score });
    await assessment.save(); // Assessment is saved with valid question IDs
    res.status(201).json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ student: req.user.id }).populate('questions.question');
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
