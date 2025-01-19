const { PrismaClient } = require('@prisma/client');
const seedUsers = require('./seeds/seedUsers');
const seedSongs = require('./seeds/seedSongs');
const seedReviews = require('./seeds/seedReviews');
const seedFavorites = require('./seeds/seedFavorites');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting the database seed...');

  await seedUsers(prisma);
  await seedSongs(prisma);
  await seedReviews(prisma);
  await seedFavorites(prisma);

  console.log('✅ Seed completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error when running the seed:', error);
    process.exit(1);
  });
