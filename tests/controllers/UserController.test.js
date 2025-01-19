const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/server');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

describe('UserController', () => {
  let user, token;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: { email: 'user@example.com', password: await bcrypt.hash('plaintextpassword', 10) },
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'user@example.com', password: 'plaintextpassword',
    });

    token = `Bearer ${loginResponse.body.token}`;
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'newuser@example.com',
          password: 'newpassword',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('newuser@example.com');
    });

    it('should return 400 if email is already in use', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'user@example.com',
          password: 'anotherpassword',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email is already in use' });
    });
  });

  describe('GET /users', () => {
    it('should list all users', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return user details', async () => {
      const response = await request(app)
        .get(`/users/${user.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(user.email);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app).get('/users/99999');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should update user details', async () => {
      const response = await request(app)
        .patch(`/users/${user.id}`)
        .set('Authorization', token)
        .send({
          email: 'updated@example.com',
          password: 'newpassword',
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('updated@example.com');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .patch('/users/99999')
        .set('Authorization', token)
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('POST /users/follow', () => {
    let userToFollow;

    beforeEach(async () => {
      userToFollow = await prisma.user.create({
        data: { email: 'followeduser@example.com', password: await bcrypt.hash('password', 10) },
      });
    });

    it('should follow another user', async () => {
      const response = await request(app)
        .post('/users/follow')
        .set('Authorization', token)
        .send({
          userIdToFollow: userToFollow.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User followed successfully.' });
    });

    it('should return 400 if trying to follow self', async () => {
      const response = await request(app)
        .post('/users/follow')
        .set('Authorization', token)
        .send({
          userIdToFollow: user.id,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'You cannot follow yourself.' });
    });

    it('should return 400 if already following', async () => {
      await prisma.follower.create({
        data: {
          followerId: user.id,
          followingId: userToFollow.id,
        },
      });

      const response = await request(app)
        .post('/users/follow')
        .set('Authorization', token)
        .send({
          userIdToFollow: userToFollow.id,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'You are already following this user.' });
    });
  });

  describe('POST /users/unfollow', () => {
    let userToUnfollow;

    beforeEach(async () => {
      userToUnfollow = await prisma.user.create({
        data: { email: 'unfolloweduser@example.com', password: await bcrypt.hash('password', 10) },
      });

      await prisma.follower.create({
        data: {
          followerId: user.id,
          followingId: userToUnfollow.id,
        },
      });
    });

    it('should unfollow another user', async () => {
      const response = await request(app)
        .post('/users/unfollow')
        .set('Authorization', token)
        .send({
          userIdToUnfollow: userToUnfollow.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User unfollowed successfully.' });
    });
  });

  describe('GET /users/:userId/followers', () => {
    it('should list followers of a user', async () => {
      await prisma.follower.create({
        data: {
          followerId: user.id,
          followingId: user.id,
        },
      });

      const response = await request(app)
        .get(`/users/${user.id}/followers`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /users/:userId/following', () => {
    it('should list users that the user is following', async () => {
      const response = await request(app)
        .get(`/users/${user.id}/following`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
