function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}

async function seedReviews(prisma) {
  console.log('🔄 Inserting reviews...');
  const users = await prisma.user.findMany();
  const songs = await prisma.song.findMany();

  const reviews = [];

  for (const user of users) {
    for (const song of songs.slice(0, 3)) {
      reviews.push({
        content: `Review by ${user.email} on ${song.title}`,
        rating: getRandomRating(),
        userId: user.id,
        songId: song.id,
      });
    }
  }

  await prisma.review.createMany({
    data: reviews,
  });

  console.log('✅ Reviews inserted!');
}

module.exports = seedReviews;
