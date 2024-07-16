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

// Get all assessment tests
const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate('questions');
    res.json(assessments);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

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

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment
};
