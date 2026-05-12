const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const { createUser, createQuestion, generateToken } = require('../testUtils');
const Question = require('../../models/question');
const User = require('../../models/user');

describe('Question Routes', () => {
  afterEach(async () => {
    await Question.deleteMany();
    await User.deleteMany();
  });

  it('should create a question', async () => {
    const user = await createUser();
    const token = generateToken(user);

    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'What is 2 + 2?',
        difficulty: 'Easy',
        topic: 'Math',
        options: [
          { text: '3', isCorrect: false },
          { text: '4', isCorrect: true }
        ],
        createdBy: user._id
      });

    expect(res.status).to.equal(201);
    expect(res.body.text).to.equal('What is 2 + 2?');
  });

  it('should get all questions', async () => {
    const user = await createUser();
    const token = generateToken(user);
    await createQuestion({ createdBy: user._id });

    const res = await request(app)
      .get('/api/questions')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
});
