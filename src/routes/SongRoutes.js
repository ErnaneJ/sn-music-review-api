const express = require('express');
const SongController = require('../controllers/SongController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: Operations related to songs
 */

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Create a new song
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the song
 *               artist:
 *                 type: string
 *                 description: Artist of the song
 *               album:
 *                 type: string
 *                 description: Album of the song
 *               genre:
 *                 type: string
 *                 description: Genre of the song
 *               releaseYear:
 *                 type: integer
 *                 description: Release year of the song
 *     responses:
 *       201:
 *         description: Song created successfully
 *       500:
 *         description: Error creating song
 */
router.post('/', SongController.createSong);

/**
 * @swagger
 * /songs/{songId}:
 *   patch:
 *     summary: Update a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the song
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               genre:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Song updated successfully
 *       500:
 *         description: Error updating song
 */
router.patch('/:songId', SongController.updateSong);

/**
 * @swagger
 * /songs/{songId}:
 *   delete:
 *     summary: Delete a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the song
 *     responses:
 *       204:
 *         description: Song deleted successfully
 *       500:
 *         description: Error deleting song
 */
router.delete('/:songId', SongController.deleteSong);

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: List all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of songs returned successfully
 *       500:
 *         description: Error listing songs
 */
router.get('/', SongController.listSongs);

/**
 * @swagger
 * /songs/search:
 *   get:
 *     summary: Search songs by title, artist, album, or genre
 *     description: Allows searching songs using a query string that will be compared against the fields title, artist, album, or genre.
 *     tags: [Songs]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search string to find songs. It can be a title, artist, album, or genre.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of songs that match the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the song
 *                   title:
 *                     type: string
 *                     description: Title of the song
 *                   artist:
 *                     type: string
 *                     description: Artist of the song
 *                   album:
 *                     type: string
 *                     description: Album of the song
 *                   genre:
 *                     type: string
 *                     description: Genre of the song
 *       400:
 *         description: Query parameter 'query' not provided
 *       500:
 *         description: Internal error while searching for songs
 */
router.get('/search', SongController.searchSongs);

/**
 * @swagger
 * /songs/{songId}:
 *   get:
 *     summary: Get details of a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the song
 *     responses:
 *       200:
 *         description: Song details returned successfully
 *       404:
 *         description: Song not found
 *       500:
 *         description: Error retrieving song details
 */
router.get('/:songId', SongController.getSongDetails);

module.exports = router;
