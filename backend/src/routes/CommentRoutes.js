const express = require('express');
const CommentController = require('../controllers/CommentController');
const authMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operations related to comments
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - reviewId
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *               reviewId:
 *                 type: integer
 *                 description: The ID of the review
 *               parentId:
 *                 type: integer
 *                 description: The ID of the parent comment (optional)
 *     responses:
 *       201:
 *         description: Comment successfully created
 *       500:
 *         description: Error creating the comment
 */
router.post('/', authMiddleware, CommentController.createComment);

/**
 * @swagger
 * /comments/{reviewId}:
 *   get:
 *     summary: Retrieve all comments for a review
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *       500:
 *         description: Error retrieving comments
 */
router.get('/:reviewId', CommentController.getCommentsByReview);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment
 *     responses:
 *       200:
 *         description: Comment successfully updated
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Error updating the comment
 */
router.put('/:id', authMiddleware, CommentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment
 *     responses:
 *       204:
 *         description: Comment successfully deleted
 *       403:
 *         description: Permission denied
 *       500:
 *         description: Error deleting the comment
 */
router.delete('/:id', authMiddleware, CommentController.deleteComment);

module.exports = router;