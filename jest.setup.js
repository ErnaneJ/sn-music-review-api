const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
  jest.clearAllMocks();
  
  await prisma.$connect();

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.favoriteSong.deleteMany();
  await prisma.review.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();
});

afterEach(async () => {
  jest.clearAllMocks();

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.favoriteSong.deleteMany();
  await prisma.review.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});