const TestResult = require('../models/testResult');

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

module.exports = { saveTestResult, getUserTestResults };
