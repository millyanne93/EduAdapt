const Assessment = require('../models/assessment');
const Question = require('../models/question');

exports.createAssessment = async (req, res) => {
  const { questions, score, topic, sessionDuration, skippedQuestions } = req.body;
  const student = req.user.id;

  try {
    // Validate that all question IDs exist and determine correctness
    for (let i = 0; i < questions.length; i++) {
      const question = await Question.findById(questions[i].question);
      if (!question) {
        return res.status(400).json({ msg: `Question with ID ${questions[i].question} does not exist` });
      }

      // Check if the answer is correct
      const correctAnswer = question.answers.find(answer => answer.correct).answer_text;
      questions[i].correct = questions[i].answer === correctAnswer;
    }

    const assessment = new Assessment({
      student,
      questions,
      score,
      topic,
      sessionDuration,
      skippedQuestions
    });

    await assessment.save();
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
