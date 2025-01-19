const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/server');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

describe('ReviewController', () => {
  let user, song, token;

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

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'user@example.com', password: 'plaintextpassword',
    });

    token = `Bearer ${loginResponse.body.token}`;
  });

  describe('POST /reviews', () => {
    it('should create a new review', async () => {
      const response = await request(app)
        .post('/reviews')
        .set('Authorization', token)
        .send({
          songId: song.id,
          content: 'Great song!',
          rating: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('Great song!');
      expect(response.body.rating).toBe(5);
      expect(response.body.userId).toBe(user.id);
      expect(response.body.songId).toBe(song.id);
    });

    it('should return 400 if rating is not between 1 and 5', async () => {
      const response = await request(app)
        .post('/reviews')
        .set('Authorization', token)
        .send({
          songId: song.id,
          content: 'Great song!',
          rating: 6,  // Invalid rating
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'The rating must be between 1 and 5.' });
    });
  });

  describe('PUT /reviews/:reviewId', () => {
    it('should update a review', async () => {
      const review = await prisma.review.create({
        data: { content: 'Initial review', rating: 4, userId: user.id, songId: song.id },
      });

      const response = await request(app)
        .patch(`/reviews/${review.id}`)
        .set('Authorization', token)
        .send({
          content: 'Updated review',
          rating: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated review');
      expect(response.body.rating).toBe(5);
    });

    it('should return 403 if user does not own the review', async () => {
      const otherUser = await prisma.user.create({
        data: { email: 'other@example.com', password: 'hashedpassword' },
      });
      const review = await prisma.review.create({
        data: { content: 'Another review', rating: 4, userId: otherUser.id, songId: song.id },
      });

      const response = await request(app)
        .patch(`/reviews/${review.id}`)
        .set('Authorization', token)
        .send({
          content: 'Updated review',
          rating: 5,
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Permission denied or review not found.' });
    });
  });

  describe('DELETE /reviews/:reviewId', () => {
    it('should delete a review', async () => {
      const review = await prisma.review.create({
        data: { content: 'Review to be deleted', rating: 4, userId: user.id, songId: song.id },
      });

      const response = await request(app)
        .delete(`/reviews/${review.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(204);
    });

    it('should return 403 if user does not own the review', async () => {
      const otherUser = await prisma.user.create({
        data: { email: 'other@cool-example.com', password: 'plaitextpassword' },
      });
      const review = await prisma.review.create({
        data: { content: 'Another review', rating: 4, userId: otherUser.id, songId: song.id },
      });

      const response = await request(app)
        .delete(`/reviews/${review.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Permission denied or review not found.' });
    });
  });

  describe('GET /reviews/:songId', () => {
    it('should return reviews for a specific song', async () => {
      await prisma.review.create({
        data: {
          content: 'Amazing song!',
          rating: 5,
          userId: user.id,
          songId: song.id,
        },
      });

      const response = await request(app).get(`/reviews/song/${song.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
