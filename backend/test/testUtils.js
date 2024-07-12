const User = require('../models/user');
const Question = require('../models/question');
const Assessment = require('../models/assessment');
const jwt = require('jsonwebtoken');

const createUser = async (userData = {}) => {
  const user = new User({
    username: userData.username || 'Test User',
    email: userData.email || `testuser${Date.now()}@example.com`, 
    classname: userData.classname || 'Test Class',
    password: userData.password || 'password123'
  });

  await user.save();
  return user;
};

const createQuestion = async (questionData = {}) => {
  const question = new Question({
    text: questionData.text || 'Sample Question?',
    difficulty: questionData.difficulty || 'easy',
    topic: questionData.topic || 'Sample Topic',
    options: questionData.options || [
      { text: 'Option 1', isCorrect: true },
      { text: 'Option 2', isCorrect: false }
    ],
    createdBy: questionData.createdBy || await createUser()
  });

  await question.save();
  return question;
};

const createAssessment = async (assessmentData = {}) => {
  const assessment = new Assessment({
    student: assessmentData.student || await createUser(),
    results: assessmentData.results || [{
      question: await createQuestion(),
      answer: 'Option 1',
      correct: true,
      timeSpent: 10,
      attempts: 1,
      hintsUsed: 0,
      perceivedDifficulty: 2,
      answerPattern: ['correct']
    }],
    topic: assessmentData.topic || 'Sample Assessment Topic',
    sessionDuration: assessmentData.sessionDuration || 30,
    skippedQuestions: assessmentData.skippedQuestions || [],
    score: assessmentData.score || 10
  });

  await assessment.save();
  return assessment;
};

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  createUser,
  createQuestion,
  createAssessment,
  generateToken
};
