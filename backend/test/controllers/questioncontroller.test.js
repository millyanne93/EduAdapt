const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const mongoose = require('mongoose');
const Question = require('../../models/question');
const User = require('../../models/user');
const { generateToken, createUser, createQuestion } = require('../testUtils');

describe('Question Controller', () => {
  let token;
  let user;

  beforeEach(async () => {
    await User.deleteMany();
    user = await createUser();
    token = generateToken(user);
  });

  afterEach(async () => {
    await Question.deleteMany();
    await User.deleteMany();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should create a new question', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'Test Question',
        difficulty: 'Easy',
        topic: 'Math',
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ],
        createdBy: user.id
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('text', 'Test Question');
    expect(res.body).to.have.property('topic', 'Math');
  });

  it('should return an error if no options are provided', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'Test Question',
        difficulty: 'Easy',
        topic: 'Math',
        options: [],
        createdBy: user.id
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.equal('At least one option is required');
  });

  it('should return an error if no correct option is provided', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'Test Question',
        difficulty: 'Easy',
        topic: 'Math',
        options: [
          { text: 'Option 1', isCorrect: false },
          { text: 'Option 2', isCorrect: false }
        ],
        createdBy: user.id
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.equal('At least one option must be marked as correct');
  });

  it('should get all questions', async () => {
    await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'Test Question 1',
        difficulty: 'Easy',
        topic: 'Math',
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ],
        createdBy: user.id
      });

    await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        text: 'Test Question 2',
        difficulty: 'Medium',
        topic: 'Science',
        options: [
          { text: 'Option 1', isCorrect: false },
          { text: 'Option 2', isCorrect: true }
        ],
        createdBy: user.id
      });

    const res = await request(app)
      .get('/api/questions')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(2);
  });

  it('should return server error if there is a problem with the database', async () => {
  // Simulate a database error
  const originalFind = Question.find;
  Question.find = () => { throw new Error('Database error'); };

  const res = await request(app)
    .get('/api/questions')
    .set('x-auth-token', token);

  expect(res.status).to.equal(500);
  expect(res.body).to.have.property('message', 'Server error');

  // Restore the original function
  Question.find = originalFind;
  });
});
