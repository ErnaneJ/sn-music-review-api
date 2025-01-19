// Importar o PrismaClient para garantir que a conexão ao banco de dados esteja pronta
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  jest.clearAllMocks();
  
  await prisma.$connect();

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.favoriteSong.deleteMany();
  await prisma.review.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  jest.clearAllMocks();

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.favoriteSong.deleteMany();
  await prisma.review.deleteMany();
  await prisma.song.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$disconnect();
});