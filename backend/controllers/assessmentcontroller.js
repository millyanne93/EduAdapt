const Assessment = require('../models/assessment');
const Question = require('../models/question');

// Create a new assessment test
const createAssessment = async (req, res) => {
  const { title, questionIds } = req.body;
  const userId = req.user.id;

  try {
    const questions = await Question.find({ _id: { $in: questionIds } });
    const assessmentTest = new Assessment({ title, questions, createdBy: userId });
    await assessmentTest.save();
    res.json(assessmentTest);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Create question in an assessment
const createQuestionInAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const { text, options, correctOption, difficulty, topic } = req.body;

  try {
    const question = new Question({ text, options, correctOption, difficulty, topic });
    await question.save();

    const assessment = await Assessment.findById(assessmentId);
    assessment.questions.push(question);
    await assessment.save();
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all assessment tests
const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('questions');
    res.json(assessments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get questions for assessment
const getQuestionsForAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const assessment = await Assessment.findById(assessmentId).populate('questions');
    res.json(assessment.questions);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

// Get assessment by id
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('questions');
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.json({ msg: 'Assessment removed' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete question from assessment
const deleteQuestionFromAssessment = async (req, res) => {
  const { assessmentId, questionId } = req.params;
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    assessment.questions = assessment.questions.filter(q => q._id.toString() !== questionId);
    await assessment.save();
    res.json({ msg: 'Question removed from assessment'});
  } catch (err) {
    res.status(500).json({ msg: 'Server error'});
  }
}

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getQuestionsForAssessment,
  deleteQuestionFromAssessment,
  createQuestionInAssessment
};
