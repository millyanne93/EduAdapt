const path = require('path');
console.log('Loading .env.test from:', path.resolve('./.env.test'));
require('dotenv').config({ path: './.env.test' });
const mongoose = require('mongoose');
const User = require('../../models/user');
const { expect } = require('chai');
const { createUser } = require('../testUtils');

console.log("MONGO_URI_TEST:", process.env.MONGO_URI_TEST);

describe('User Model', () => {
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

  // Clear the User collection after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user successfully', async () => {
    const user = await createUser();
    expect(user._id).to.exist;
    expect(user.username).to.equal('Test User');
    expect(user.email).to.equal('testuser@example.com');
  });

  it('should not save a user without a required field', async () => {
    const user = new User({
      email: 'test@example.com',
      classname: '10A',
      password: 'password123'
    });

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).to.exist;
    expect(err.errors.name).to.exist;
  });

  it('should not allow duplicate email addresses', async () => {
    const user1 = await createUser();
    const user2 = new User({
      username: 'Another User',
      email: user1.email,
      classname: '10B',
      password: 'password456'
    });

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).to.exist;
    expect(err.code).to.equal(11000); // Duplicate key error code
  });
});
