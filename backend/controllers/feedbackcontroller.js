const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const TestResult = require('../models/testResult');

// Create Feedback
const createFeedback = async (req, res) => {
  const { studentId, testResultId, feedbackText, recommendations } = req.body;
  const teacherId = req.user.id;

  try {
    const testResult = await TestResult.findById(new mongoose.Types.ObjectId(testResultId));
    if (!testResult) {
      return res.status(404).json({ msg: 'Test result not found' });
    }

    const feedback = new Feedback({
      studentId,
      testResultId,
      feedbackText,
      recommendations,
      teacherId
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Feedback for a student
const getFeedbackForStudent = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const feedback = await Feedback.find({ studentId }).populate('testResultId').populate('teacherId', 'name');
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createFeedback, getFeedbackForStudent };
