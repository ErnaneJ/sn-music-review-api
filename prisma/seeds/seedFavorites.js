async function seedFavorites(prisma) {
  console.log('🔄 Inserting favorite songs...');
  const users = await prisma.user.findMany();
  const songs = await prisma.song.findMany();

  const favorites = [];

  for (const user of users) {
    const favoriteSongs = songs.slice(0, 5);
    favoriteSongs.forEach((song) => {
      favorites.push({
        userId: user.id,
        songId: song.id,
      });
    });
  }

  await prisma.favoriteSong.createMany({
    data: favorites,
  });

  console.log('✅ Favorites inserted!');
}

module.exports = seedFavorites;
