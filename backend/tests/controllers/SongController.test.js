const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../../src/server');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

describe('SongController', () => {
  let user, song, token;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: { email: 'user@example.com', password: await bcrypt.hash('plaintextpassword', 10) },
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'user@example.com', password: 'plaintextpassword',
    });

    token = `Bearer ${loginResponse.body.token}`;
  });

  describe('POST /songs', () => {
    it('should create a new song', async () => {
      const response = await request(app)
        .post('/songs')
        .set('Authorization', token)
        .send({
          title: 'New Song',
          artist: 'Artist Name',
          album: 'Album Name',
          genre: 'Pop',
          did: "123",
          releaseYear: 2023,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Song');
    });
  });

  describe('GET /songs', () => {
    it('should list all songs', async () => {
      await prisma.song.create({
        data: {
          title: 'Song 1',
          artist: 'Artist 1',
          album: 'Album 1',
          genre: 'Pop',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app).get('/songs');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /songs/:songId/favorites', () => {
    it('should add a song to favorites', async () => {
      song = await prisma.song.create({
        data: {
          title: 'Favorite Song',
          artist: 'Artist 2',
          album: 'Album 2',
          genre: 'Rock',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app)
        .post(`/songs/${song.id}/favorite`)
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(user.id);
      expect(response.body.songId).toBe(song.id);
    });

    it('should return 400 if the song is already in favorites', async () => {
      song = await prisma.song.create({
        data: {
          title: 'Favorite Song',
          artist: 'Artist 2',
          album: 'Album 2',
          genre: 'Rock',
          did: "123",
          releaseYear: 2023,
        },
      });

      await prisma.favoriteSong.create({
        data: {
          userId: user.id,
          songId: song.id,
        },
      });

      const response = await request(app)
        .post(`/songs/${song.id}/favorite`)
        .set('Authorization', token);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Song already added to favorites' });
    });

    it('should return 404 if the song does not exist', async () => {
      const response = await request(app)
        .post('/songs/99999/favorite') // Non-existent song ID
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Song not found' });
    });
  });

  describe('DELETE /songs/:songId/favorite', () => {
    it('should remove a song from favorites', async () => {
      song = await prisma.song.create({
        data: {
          title: 'Favorite Song',
          artist: 'Artist 2',
          album: 'Album 2',
          genre: 'Rock',
          did: "123",
          releaseYear: 2023,
        },
      });

      await prisma.favoriteSong.create({
        data: {
          userId: user.id,
          songId: song.id,
        },
      });

      const response = await request(app)
        .delete(`/songs/${song.id}/favorite`)
        .set('Authorization', token);

      expect(response.status).toBe(204);
    });

    it('should return 404 if the song is not in favorites', async () => {
      const response = await request(app)
        .delete(`/songs/9999/favorite`)
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Favorite song not found' });
    });
  });

  describe('GET /songs/:songId', () => {
    it('should return song details with reviews', async () => {
      song = await prisma.song.create({
        data: {
          title: 'Favorite Song',
          artist: 'Artist 2',
          album: 'Album 2',
          genre: 'Rock',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app).get(`/songs/${song.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.reviews).toBeDefined();
    });

    it('should return 404 if the song does not exist', async () => {
      const response = await request(app).get('/songs/9999'); // Non-existent song ID

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Song not found' });
    });
  });

  describe('PATCH /songs/:songId', () => {
    it('should update a song', async () => {
      song = await prisma.song.create({
        data: {
          title: 'Favorite Song',
          artist: 'Artist 2',
          album: 'Album 2',
          genre: 'Rock',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app)
        .patch(`/songs/${song.id}`)
        .set('Authorization', token)
        .send({
          title: 'Updated Song Title',
          artist: 'Updated Artist',
          album: 'Updated Album',
          genre: 'Updated Genre',
          releaseYear: 2024,
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Song Title');
    });
  });

  describe('DELETE /songs/:songId', () => {
    it('should delete a song', async () => {
      const songToDelete = await prisma.song.create({
        data: {
          title: 'Song to Delete',
          artist: 'Artist Name',
          album: 'Album Name',
          genre: 'Pop',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app)
        .delete(`/songs/${songToDelete.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(204);
    });
  });

  describe('GET /song/search?query=:query', () => {
    it('should search songs based on query', async () => {
      await prisma.song.create({
        data: {
          title: 'Song Search Test',
          artist: 'Test Artist',
          album: 'Test Album',
          genre: 'Pop',
          did: "123",
          releaseYear: 2023,
        },
      });

      const response = await request(app).get('/songs/search?query=Test');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].title).toBe('Song Search Test');
    });
  });
});
