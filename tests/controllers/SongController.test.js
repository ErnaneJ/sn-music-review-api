// const request = require('supertest');
// const app = require('../../src/server');
// const { PrismaClient } = require('@prisma/client');

// describe('GET /songs/', () => {
//   it('should return an empty list when there are no songs', async () => {
//     const response = await request(app).get('/songs/');

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBe(0);
//   });

//   it('should return a song when there is one', async () => {
//     const prisma = new PrismaClient();

//     await prisma.song.create({ data:{ title: "string", artist: "string", album: "string", genre: "string", releaseYear: 0}});

//     const response = await request(app).get('/songs/');
    
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBe(1);
//   });
// });
