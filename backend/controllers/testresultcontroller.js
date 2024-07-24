const TestResult = require('../models/testResult');

const provideFeedback = async (req, res) => {
  const testResultId = req.params.id;

  try {
    const testResult = await TestResult.findById(testResultId);
    if (!testResult) {
      return res.status(404).json({ msg: 'Test result not found' });
    }

    // Dynamically import the generateFeedbackWithGemini function
    const { default: generateFeedbackWithGemini } = await import('../ai/gemini-start.js');

    const feedback = await generateFeedbackWithGemini(testResult);

    res.status(200).json({ feedback });
  } catch (err) {
    console.error('Error generating feedback:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Save test result
const saveTestResult = async (req, res) => {
  const { testId, responses, score } = req.body;
  const userId = req.user.id;

  // Calculate total time spent
  const totalTimeSpent = responses.reduce((acc, res) => acc + res.timeSpent, 0);

  try {
    const testResult = new TestResult({ userId, testId, responses, score, totalTimeSpent });
    await testResult.save();
    res.json(testResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get test results for a user
const getUserTestResults = async (req, res) => {
  const userId = req.user.id;

  try {
    const testResults = await TestResult.find({ userId }).populate('testId');
    res.json(testResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { saveTestResult, getUserTestResults, provideFeedback };
