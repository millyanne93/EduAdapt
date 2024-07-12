const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const { createUser, createQuestion, createAssessment, generateToken } = require('../testUtils');
const Assessment = require('../../models/assessment');
const User = require('../../models/user');
const Question = require('../../models/question');

describe('Assessment Routes', () => {
  afterEach(async () => {
    await Assessment.deleteMany();  // Clear the Assessment collection
    await User.deleteMany();       // Clear the User collection
    await Question.deleteMany();   // Clear the Question collection
  });

  it('should create an assessment', async () => {
    const user = await createUser();
    const question = await createQuestion({ createdBy: user._id });
    const token = generateToken(user);

    const res = await request(app)
      .post('/api/assessments')
      .set('x-auth-token', token)
      .send({
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

    expect(res.status).to.equal(201);
    expect(res.body.student).to.equal(user._id.toString());
  });

  it('should get user assessments', async () => {
    const user = await createUser();
    const token = generateToken(user);
    await createAssessment({ student: user._id });

    const res = await request(app)
      .get('/api/assessments')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
