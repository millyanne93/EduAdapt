const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');
const app = require('../../server');
const User = require('../../models/user');
const { createUser, generateToken } = require('../testUtils');

// Close the Mongoose connection after all tests
after(async () => {
  await mongoose.connection.close();
});

describe('User Controller Tests', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await createUser();
    token = generateToken(user);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'New User',
        email: 'newuser@example.com',
        classname: 'New Class',
        password: 'password123'
      });

    expect(res.status).to.equal(201);
    expect(res.body.msg).to.equal('User registered successfully');
  });

  it('should not register a user if email already exists', async () => {
    const res = await request(app)
      .post('/api/users/register') // Correct endpoint for registration
      .send({
        username: 'Test User',
        email: user.email, // Use the email of the created user
        classname: 'Test Class',
        password: 'password123'
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.equal('User already exists');
  });

  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: user.email, // Use the email of the user created in beforeEach
        password: 'password123' // Use the password of the user created in beforeEach
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should not login a user with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: user.email, // Use the email of the created user
        password: 'wrongpassword' // Use incorrect password
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.equal('Invalid credentials');
  });

  it('should get the user information', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body.email).to.equal(user.email);
    expect(res.body).to.not.have.property('password');
  });

  it('should return server error when trying to get user with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('x-auth-token', 'invalidtoken');

    expect(res.status).to.equal(401);
    expect(res.body.msg).to.equal('Token is not valid');
  });

  it('should return unauthorized if token is not provided', async () => {
    const res = await request(app)
      .get('/api/users/me');

    expect(res.status).to.equal(401);
    expect(res.body.msg).to.equal('No token, authorization denied');
  });
});
