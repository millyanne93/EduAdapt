const path = require('path');
console.log('Loading .env.test from:', path.resolve('../../.env.test'));
require('dotenv').config({ path: './.env.test' });
const mongoose = require('mongoose');
const Assessment = require('../../models/assessment');
const { expect } = require('chai');
const { createUser, createQuestion, createAssessment } = require('../testUtils');

console.log("MONGO_URI_TEST:", process.env.MONGO_URI_TEST);

describe('Assessment Model', () => {
  // Use `before` hook to establish the connection to the database
  before(async () => {
    if (!mongoose.connection.readyState) {
      console.log("Connecting to the database...");
      await mongoose.connect(process.env.MONGO_URI_TEST, {
        // Removed deprecated options
      });
    } else {
      console.log("Already connected to the database.");
    }
  });

  // Use `after` hook to close the connection to the database
  after(async () => {
    await mongoose.connection.close();
  });

  // Clear the Assessment collection after each test
  afterEach(async () => {
    await Assessment.deleteMany({});
  });

  it('should create an assessment successfully', async () => {
    const user = await createUser();
    const question = await createQuestion({ createdBy: user._id });
    const assessment = await createAssessment({
      student: user._id,
      results: [{
        question: question._id,
        answer: 'Option 1',
        correct: true,
        timeSpent: 30,
        attempts: 1
      }],
      topic: 'Math',
      sessionDuration: 600,
      skippedQuestions: [],
      score: 90
    });

    expect(assessment._id).to.exist;
    expect(assessment.student.toString()).to.equal(user._id.toString());
    expect(assessment.results).to.be.an('array').that.is.not.empty;
    expect(assessment.results[0].question.toString()).to.equal(question._id.toString());
    expect(assessment.results[0].answer).to.equal('Option 1');
  });

  it('should require a student field', async () => {
    const question = await createQuestion();
    const assessment = new Assessment({
      results: [{
        question: question._id,
        answer: 'Option 1',
        correct: true,
        timeSpent: 30,
        attempts: 1
      }],
      topic: 'Math',
      sessionDuration: 600,
      skippedQuestions: [],
      score: 90
    });

    let err;
    try {
      await assessment.save();
    } catch (error) {
      err = error;
    }
    expect(err).to.exist;
    expect(err.errors.student).to.exist;
  });

  // More tests
});

