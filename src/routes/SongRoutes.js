const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const authMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Operations related to reviews
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *               - rating
 *             properties:
 *               songId:
 *                 type: integer
 *                 description: The ID of the song
 *               content:
 *                 type: string
 *                 description: The content of the review
 *               rating:
 *                 type: integer
 *                 description: Rating from 1 to 5
 *     responses:
 *       201:
 *         description: Review successfully created
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Error creating review
 */
router.post('/', authMiddleware, ReviewController.createReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   patch:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the review
 *               rating:
 *                 type: integer
 *                 description: The updated rating from 1 to 5
 *     responses:
 *       200:
 *         description: Review successfully updated
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Error updating review
 */
router.patch('/:reviewId', authMiddleware, ReviewController.updateReview);

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review
 *     responses:
 *       204:
 *         description: Review successfully deleted
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Error deleting review
 */
router.delete('/:reviewId', authMiddleware, ReviewController.deleteReview);

/**
 * @swagger
 * /reviews/song/{songId}:
 *   get:
 *     summary: List reviews for a song
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the song
 *     responses:
 *       200:
 *         description: List of reviews successfully retrieved
 *       500:
 *         description: Error retrieving reviews
 */
router.get('/song/:songId', ReviewController.getReviewsBySong);

module.exports = router;
