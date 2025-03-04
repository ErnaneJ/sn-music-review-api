const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client');

describe('AuthController', () => {
  const app = require('../../src/server');
  const prisma = new PrismaClient();

  let user;
  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: await bcrypt.hash('plaintextpassword', 10),
      }
    });
  });

  describe('login', () => {
    it('should return 404 when the user is not found', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid-user@example.com',
        password: 'password',
      });

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    it('should return 400 for invalid password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: user.email,
        password: 'wrongpassword',
      });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return a token for valid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: user.email, password: 'plaintextpassword',
      });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('token');
      expect(jwt.decode(response.body.token).email).toEqual(user.email);
    });

    it('should return 500 for a server error', async () => {
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Server error'));

      const response = await request(app).post('/auth/login').send({
        email: user.email, password: 'plaintextpassword'
      });

      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'Server error' });
    });
  });
});
