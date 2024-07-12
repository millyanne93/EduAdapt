const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const mongoose = require('mongoose');
const Assessment = require('../../models/assessment');
const Question = require('../../models/question');
const User = require('../../models/user');
const { generateToken, createUser, createQuestion } = require('../testUtils');

describe('Assessment Controller', () => {
  let token;
  let user;
  let question;

  beforeEach(async () => {
    await User.deleteMany();  
    user = await createUser();  // Creates a new user for the tests
    token = generateToken(user);  // Generates a JWT token for the user
    question = await createQuestion();  // Creates a new question for the tests
  });

  afterEach(async () => {
    await Assessment.deleteMany();  // Clears the assessments collection
    await Question.deleteMany();  // Clears the questions collection
  });

  after(async () => {
    await mongoose.connection.close();  // Closes the MongoDB connection
  });

  it('should create a new assessment', async () => {
    const res = await request(app)
      .post('/api/assessments')
      .set('x-auth-token', token)
      .send({
        results: [{
          question: question.id,
          answer: 'Option 1',
          correct: true,
          timeSpent: 10,
          attempts: 1,
          hintsUsed: 0,
          perceivedDifficulty: 2,
          answerPattern: ['correct']
        }],
        score: 10,
        topic: 'Test Topic',
        sessionDuration: 120,
        skippedQuestions: [] 
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('student', user.id);
    expect(res.body.results[0]).to.have.property('question', question.id);
  });

  it('should return an error if question does not exist', async () => {
    const res = await request(app)
      .post('/api/assessments')
      .set('x-auth-token', token)
      .send({
        results: [{
          question: new mongoose.Types.ObjectId(),  // Use new keyword
          answer: 'Option 1',
          timeSpent: 10,
          attempts: 1,
          hintsUsed: 0,
          perceivedDifficulty: 2,
          answerPattern: ['correct']
        }],
        score: 10,
        topic: 'Test Topic',
        sessionDuration: 120,
        skippedQuestions: [] 
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.include('Question with ID');
  });

  it('should get all assessments for a user', async () => {
    await request(app)
      .post('/api/assessments')
      .set('x-auth-token', token)
      .send({
        results: [{
          question: question.id,
          answer: 'Option 1',
          timeSpent: 10,  // Ensure all required fields are included
          attempts: 1,
          hintsUsed: 0,
          perceivedDifficulty: 2,
          answerPattern: ['correct']
        }],
        score: 10,
        topic: 'Test Topic',
        sessionDuration: 120,
        skippedQuestions: []
      });

    const res = await request(app)
      .get('/api/assessments')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0]).to.have.property('student', user.id);
  });

  it('should return server error if there is a problem with the database', async () => {
    // Simulate a database error
    const originalFindById = Question.findById;
    Question.findById = () => { throw new Error('Database error'); };

    const res = await request(app)
      .post('/api/assessments')
      .set('x-auth-token', token)
      .send({
        results: [{
          question: question.id,
          answer: 'Option 1',
          timeSpent: 10,  
          attempts: 1,
          hintsUsed: 0,
          perceivedDifficulty: 2,
          answerPattern: ['correct']
        }],
        score: 10,
        topic: 'Test Topic',
        sessionDuration: 120,
        skippedQuestions: []
      });

    expect(res.status).to.equal(500);
    expect(res.text).to.include('Server error');  // Update to check for the text response

    // Restore the original function
    Question.findById = originalFindById;
  });
});
