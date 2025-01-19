const express = require('express');
const LikeController = require('../controllers/LikeController');
const authMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Operations related to likes
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Add a like to a review
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewId
 *             properties:
 *               reviewId:
 *                 type: integer
 *                 description: The ID of the review to be liked
 *     responses:
 *       201:
 *         description: Like successfully added
 *       400:
 *         description: Like already exists
 *       500:
 *         description: Error adding like
 */
router.post('/', authMiddleware, LikeController.addLike);

/**
 * @swagger
 * /likes:
 *   delete:
 *     summary: Remove a like from a review
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewId
 *             properties:
 *               reviewId:
 *                 type: integer
 *                 description: The ID of the review from which the like will be removed
 *     responses:
 *       204:
 *         description: Like successfully removed
 *       404:
 *         description: Like not found
 *       500:
 *         description: Error removing like
 */
router.delete('/', authMiddleware, LikeController.removeLike);

/**
 * @swagger
 * /likes/{reviewId}:
 *   get:
 *     summary: Retrieve all likes for a review
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: List of likes retrieved successfully
 *       500:
 *         description: Error retrieving likes
 */
router.get('/:reviewId', LikeController.getLikesByReview);

module.exports = router;
