const bcrypt = require('bcryptjs');

async function seedUsers(prisma) {
  console.log('🔄 Inserting users...');
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      password: passwordHash,
    })),
  });

  console.log('✅ Entered users!');
}

module.exports = seedUsers;
