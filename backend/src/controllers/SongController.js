const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SongController {
  static async createSong(req, res) {
    try {
      const { 
        title,
        artist,
        album,
        genre,
        did,
        cover_image,
        duration,
       } = req.body;

      const song = await prisma.song.create({
        data: {
          title,
          artist,
          album,
          genre,
          did,
          cover_image,
          duration: parseInt(duration, 10),
        },
      });
      song.did = String(song.did);
      res.status(201).json(song);
    } catch (error) {
      console.error('Error creating music:', error);
      res.status(500).json({ error: 'Error creating music' });
    }
  }

  static async listFavorites(req, res) {
    try {
      const userId = req.user.id;

      const favoriteSongs = await prisma.favoriteSong.findMany({
        where: {
          userId: userId,
        },
        include: {
          song: true,
        },
      });

      const songs = favoriteSongs.map((favorite) => favorite.song);

      res.status(200).json(songs);
    } catch (error) {
      console.error('Error listing favorite songs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { songId } = req.params;

      const songExists = await prisma.song.findUnique({
        where: { id: parseInt(songId) },
      });

      if (!songExists) {
        return res.status(404).json({ error: 'Song not found' });
      }

      const alreadyFavorited = await prisma.favoriteSong.findUnique({
        where: {
          userId_songId: {
            userId: userId,
            songId: parseInt(songId),
          },
        },
      });

      if (alreadyFavorited) {
        return res.status(400).json({ error: 'Song already added to favorites' });
      }

      const favorite = await prisma.favoriteSong.create({
        data: {
          userId: userId,
          songId: parseInt(songId),
        },
      });

      res.status(201).json(favorite);
    } catch (error) {
      console.error('Error adding song to favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { songId } = req.params;

      const favorite = await prisma.favoriteSong.findUnique({
        where: {
          userId_songId: {
            userId: userId,
            songId: parseInt(songId),
          },
        },
      });

      if (!favorite) {
        return res.status(404).json({ error: 'Favorite song not found' });
      }

      await prisma.favoriteSong.delete({
        where: {
          userId_songId: {
            userId: userId,
            songId: parseInt(songId),
          },
        },
      });

      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      console.error('Error removing favorite song:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateSong(req, res) {
    try {
      const { songId } = req.params;
      const { title, artist, album, genre, releaseYear } = req.body;

      const updatedSong = await prisma.song.update({
        where: { id: parseInt(songId, 10) },
        data: {
          title, artist, album, genre,
          releaseYear: releaseYear ? parseInt(releaseYear, 10) : null,
        },
      });

      res.status(200).json(updatedSong);
    } catch (error) {
      console.error('Error updating music:', error);
      res.status(500).json({ error: 'Error updating music' });
    }
  }

  static async deleteSong(req, res) {
    try {
      const { songId } = req.params;

      await prisma.song.delete({
        where: { id: parseInt(songId, 10) },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error when deleting music:', error);
      res.status(500).json({ error: 'Error when deleting music' });
    }
  }

  static async listSongs(req, res) {
    try {
      const songs = await prisma.song.findMany();
      res.status(200).json(songs);
    } catch (error) {
      console.error('Error when listing songs:', error);
      res.status(500).json({ error: 'Error when listing songs' });
    }
  }

  static async getSongDetails(req, res) {
    try {
      const { songId } = req.params;

      const song = await prisma.song.findFirst({
        where: {
          OR: [
            { id: Number(songId) },
            { did: songId },
          ],
        },
        include: {
          reviews: true,
        },
      });

      if (!song) {
        return res.status(404).json({ error: 'Song not found' });
      }

      res.status(200).json(song);
    } catch (error) {
      console.error('Error getting song details:', error);
      res.status(500).json({ error: 'Error getting song details' });
    }
  }

  static async searchSongs(req, res) {
    try {
      const { query } = req.query;

      const songs = await prisma.song.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { artist: { contains: query } },
            { album: { contains: query } },
            { genre: { contains: query } },
          ],
        },
      });

      res.status(200).json(songs);
    } catch (error) {
      console.error('Error searching songs:', error);
      res.status(500).json({ error: 'Error searching songs' });
    }
  }
}

module.exports = SongController;
