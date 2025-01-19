const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/server');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
let user, song, review, token;

beforeEach(async () => {
  user = await prisma.user.create({
    data: { email: 'user@example.com', password: await bcrypt.hash('plaintextpassword', 10) },
  });

  song = await prisma.song.create({
    data: {
      title: "Uma música bem legal",
      artist: "Um artista bem legal",
      album: "Um album bem legal",
      genre: "Pop",
      releaseYear: 2023,
    },
  });

  review = await prisma.review.create({
    data: { content: 'Great review content', userId: user.id, rating: 5, songId: song.id },
  });

  const loginResponse = await request(app).post('/auth/login').send({
    email: 'user@example.com', password: 'plaintextpassword',
  });

  token = `Bearer ${loginResponse.body.token}`;
});

describe('LikeController', () => {
  describe('POST /likes', () => {
    it('should add a like to a review', async () => {
      const response = await request(app)
        .post('/likes')
        .set('Authorization', token)
        .send({ reviewId: review.id });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.reviewId).toBe(review.id);
      expect(response.body.userId).toBe(user.id);
    });

    it('should return 400 if the user already liked the review', async () => {
      await prisma.like.create({
        data: { reviewId: review.id, userId: user.id },
      });

      const response = await request(app)
        .post('/likes')
        .set('Authorization', token)
        .send({ reviewId: review.id });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'You already liked this review.' });
    });
  });

  describe('DELETE /likes', () => {
    it('should remove a like from a review', async () => {
      await prisma.like.create({
        data: { reviewId: review.id, userId: user.id },
      });

      const response = await request(app)
        .delete('/likes')
        .set('Authorization', token)
        .send({ reviewId: review.id });

      expect(response.status).toBe(204);
    });

    it('should return 404 if the like does not exist', async () => {
      const response = await request(app)
        .delete('/likes')
        .set('Authorization', token)
        .send({ reviewId: review.id });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Like not found.' });
    });
  });

  describe('GET /likes/:reviewId', () => {
    it('should return likes for a specific review', async () => {
      await prisma.like.create({
        data: { reviewId: review.id, userId: user.id },
      });

      const response = await request(app).get(`/likes/${review.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
