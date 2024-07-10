const Assessment = require('../models/assessment');
const Question = require('../models/question');

exports.createAssessment = async (req, res) => {
  const { results, score, topic, sessionDuration, skippedQuestions } = req.body;
  const student = req.user.id;

  try {
    for (let i = 0; i < results.length; i++) {
      const question = await Question.findById(results[i].question);
      if (!question) {
        return res.status(400).json({ msg: `Question with ID ${results[i].question} does not exist` });
      }

      // Check if the answer is correct
      const correctOption = question.options.find(option => option.isCorrect);
      results[i].correct = results[i].answer === correctOption.text;
    }

    const assessment = new Assessment({
      student,
      results,
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
    const assessments = await Assessment.find({ student: req.user.id }).populate('results.question');
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};