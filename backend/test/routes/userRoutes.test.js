const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const { createUser, generateToken } = require('../testUtils');
const User = require('../../models/user');

describe('User Routes', () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        classname: '10A',
        password: 'password123'
      });

    expect(res.status).to.equal(201);
    expect(res.body.msg).to.equal('User registered successfully');
  });

  it('should not register a user with an existing email', async () => {
    await createUser({ email: 'test@example.com' });

    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        classname: '10A',
        password: 'password123'
      });

    expect(res.status).to.equal(400);
    expect(res.body.msg).to.equal('User already exists');
  });

  it('should login a user', async () => {
    await createUser({ email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body.token).to.exist;
  });

  it('should get user profile', async () => {
    const user = await createUser();
    const token = generateToken(user);

    const res = await request(app)
      .get('/api/users/me')
      .set('x-auth-token', token);

    expect(res.status).to.equal(200);
    expect(res.body.email).to.equal(user.email);
  });
});
