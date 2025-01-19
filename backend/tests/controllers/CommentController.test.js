const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcryptjs');

describe('CommentController', () => {
  const app = require('../../src/server');  
  const prisma = new PrismaClient();

  let user, song, review, token;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: { email: 'user@example.com', password: await bcrypt.hash('plaintextpassword', 10) },
    });

    song = await prisma.song.create({
      data: {
        title: "Uma música bem legal (Ao Vivo)",
        artist: "Um artista bem legal",
        album: "Um album bem legal (Corazón Partío) (Ao Vivo)",
        genre: "Pop",
        releaseYear: 2023,
      },
    });

    review = await prisma.review.create({
      data: { content: 'Great review content', userId: user.id, rating: 5, songId: song.id },
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: user.email, password: 'plaintextpassword',
    });

    token = `Bearer ${loginResponse.body.token}`;
  });

  describe('POST /comments', () => {
    it('should create a new comment without parent', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', token)
        .send({
          content: 'This is a comment',
          reviewId: review.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('This is a comment');
      expect(response.body.userId).toBe(user.id);
      expect(response.body.reviewId).toBe(review.id);
      expect(response.body.parentId).toBe(null);
    });

    it('should create a new comment with parent', async () => {
      const parentComment = await request(app)
        .post('/comments')
        .set('Authorization', token)
        .send({
          content: 'This is a parent comment',
          reviewId: review.id,
        });

      const response = await request(app)
        .post('/comments')
        .set('Authorization', token)
        .send({
          content: 'This is a comment',
          reviewId: review.id,
          parentId: parentComment.body.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('This is a comment');
      expect(response.body.userId).toBe(user.id);
      expect(response.body.reviewId).toBe(review.id);
      expect(response.body.parentId).toBe(parentComment.body.id);
    });

    it('should return 500 if an error occurs', async () => {
      const response = await request(app)
        .post('/comments')
        .set('Authorization', token)

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error creating comment' });
    });
  });

  describe('GET /comments/:reviewId', () => {
    it('should return comments for a specific review', async () => {
      await prisma.comment.create({
        data: {
          content: 'Another comment',
          userId: user.id,
          reviewId: review.id,
        },
      });

      const response = await request(app).get(`/comments/${review.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /comments/:id', () => {
    it('should update a comment', async () => {
      const comment = await prisma.comment.create({
        data: { content: 'Initial content', userId: user.id, reviewId: review.id },
      });

      const response = await request(app)
        .put(`/comments/${comment.id}`)
        .set('Authorization', token)
        .send({ content: 'Updated content' });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated content');
    });

    it('should return 403 if user does not own the comment', async () => {
      const otherUser = await prisma.user.create({
        data: { email: 'other@example.com', password: 'hashedpassword' },
      });
      const comment = await prisma.comment.create({
        data: { content: 'Initial content', userId: otherUser.id, reviewId: review.id },
      });

      const response = await request(app)
        .put(`/comments/${comment.id}`)
        .set('Authorization', token)
        .send({ content: 'Updated content' });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Permission denied' });
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should delete a comment', async () => {
      const comment = await prisma.comment.create({
        data: { content: 'To be deleted', userId: user.id, reviewId: review.id },
      });

      const response = await request(app)
        .delete(`/comments/${comment.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(204);
    });

    it('should return 403 if user does not own the comment', async () => {
      const otherUser = await prisma.user.create({
        data: { email: 'other2@example.com', password: 'hashedpassword' },
      });
      const comment = await prisma.comment.create({
        data: { content: 'Unauthorized delete', userId: otherUser.id, reviewId: review.id },
      });

      const response = await request(app)
        .delete(`/comments/${comment.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Permission denied' });
    });
  });
});
