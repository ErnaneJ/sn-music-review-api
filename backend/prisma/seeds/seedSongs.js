async function seedSongs(prisma) {
  console.log('🔄 Searching for songs from the Deezer API and inserting them into the database...');

  try {
    const response = await fetch('https://api.deezer.com/chart');
    const data = await response.json();

    const tracks = data.tracks.data.map((track) => ({
      title: track.title,
      artist: track.artist.name,
      album: track.album.title,
      genre: 'Pop', // Deezer does not provide gender directly, as it is only a seed we will always leave Pop for now
      releaseYear: track.release_date ? new Date(track.release_date).getFullYear() : 2023,
    }));

    await prisma.song.createMany({
      data: tracks,
    });

    console.log(`✅ Added ${tracks.length} songs to the database.`);
  } catch (error) {
    console.error('❌ Error when searching or inserting songs:', error);
  }
}

module.exports = seedSongs;