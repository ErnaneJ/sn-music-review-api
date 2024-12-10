const express = require('express');
const authMiddleware = require('../middlewares/AuthMiddleware');
const UserController = require('../controllers/UserController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Error creating user
 */
router.post('/', UserController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Error listing users
 */
router.get('/', authMiddleware, UserController.listUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get details of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User details successfully retrieved
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving user details
 */
router.get('/:userId', UserController.getUserDetails);

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     summary: Update user data
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data successfully updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
router.patch('/:userId', UserController.updateUser);

/**
 * @swagger
 * /users/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToFollow:
 *                 type: integer
 *                 description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Error in following user
 *       500:
 *         description: Internal server error
 */
router.post('/follow', authMiddleware, UserController.followUser);

/**
 * @swagger
 * /users/unfollow:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIdToUnfollow:
 *                 type: integer
 *                 description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       400:
 *         description: Error in unfollowing user
 *       500:
 *         description: Internal server error
 */
router.post('/unfollow', authMiddleware, UserController.unfollowUser);

/**
 * @swagger
 * /users/{userId}/followers:
 *   get:
 *     summary: List followers of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of followers returned successfully
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/followers', UserController.listFollowers);

/**
 * @swagger
 * /users/{userId}/following:
 *   get:
 *     summary: List users followed by the user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of following users returned successfully
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/following', UserController.listFollowing);

module.exports = router;
