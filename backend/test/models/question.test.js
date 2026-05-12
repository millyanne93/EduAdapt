const path = require('path');
console.log('Loading .env.test from:', path.resolve('../../.env.test'));
require('dotenv').config({ path: './.env.test' }); 
const mongoose = require('mongoose');
const Question = require('../../models/question');
const { expect } = require('chai');
const { createUser, createQuestion } = require('../testUtils');

console.log("MONGO_URI_TEST:", process.env.MONGO_URI_TEST);

describe('Question Model', () => {
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

  after(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Question.deleteMany({});
  });

  it('should create a question successfully', async () => {
    console.log("Creating user...");
    const user = await createUser();
    console.log("User created:", user);

    console.log("Creating question...");
    const question = await createQuestion({ createdBy: user._id });
    console.log("Question created:", question);

    expect(question._id).to.exist;
    expect(question.text).to.equal('Sample Question?');
  });

  it('should require at least one option', async () => {
    const user = await createUser();
    const question = new Question({
      text: 'What is 2 + 2?',
      difficulty: 'Easy',
      topic: 'Math',
      options: [],  // No options
      createdBy: user._id
    });

    let err;
    try {
      await question.save();
    } catch (error) {
      err = error;
    }
    expect(err).to.exist;
    expect(err.errors.options).to.exist;  // Check for the options validation error
  });

  it('should require at least one correct option', async () => {
    const user = await createUser();
    const question = new Question({
      text: 'What is 2 + 2?',
      difficulty: 'Easy',
      topic: 'Math',
      options: [
        { text: '3', isCorrect: false },
        { text: '5', isCorrect: false }
      ],
      createdBy: user._id
    });

    let err;
    try {
      await question.save();
    } catch (error) {
      err = error;
    }
    expect(err).to.exist;
    expect(err.message).to.include('At least one option must be marked as correct');  // Check the error message
  });
});
