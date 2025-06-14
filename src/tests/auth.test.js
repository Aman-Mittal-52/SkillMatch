const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth Routes', () => {
  it('should register and login a user', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'pass1234' })
      .expect(201);
    expect(registerRes.body).toHaveProperty('token');

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'pass1234' })
      .expect(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});