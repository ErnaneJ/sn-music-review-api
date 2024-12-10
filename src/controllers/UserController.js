const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

class UserController {
  static async createUser(req, res) {
    try {
      const { email, password } = req.body;
      
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  static async listUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Error listing users' });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        include: {
          followers: true,
          following: true,
          reviews: true,
          likes: true,
          favoriteSongs: true,
          comments: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user details:', error);
      res.status(500).json({ error: 'Error getting user details' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      let hashedPassword = user.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId, 10) },
        data: {
          email: email || user.email,
          password: hashedPassword,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  static async followUser(req, res) {
    try {
      const { userIdToFollow } = req.body;
      const userId = req.user.id;

      if (userId === userIdToFollow) {
        return res.status(400).json({ error: 'You cannot follow yourself.' });
      }

      const existingFollow = await prisma.follower.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userIdToFollow,
          },
        },
      });

      if (existingFollow) {
        return res.status(400).json({ error: 'You are already following this user.' });
      }

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: userIdToFollow,
        },
      });

      res.status(200).json({ message: 'User followed successfully.' });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async unfollowUser(req, res) {
    try {
      const { userIdToUnfollow } = req.body;
      const userId = req.user.id;

      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userIdToUnfollow,
          },
        },
      });

      res.status(200).json({ message: 'User unfollowed successfully.' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listFollowers(req, res) {
    try {
      const { userId } = req.params;

      const followers = await prisma.follower.findMany({
        where: {
          followingId: parseInt(userId),
        },
        include: {
          follower: {
            select: { id: true, email: true },
          },
        },
      });

      res.status(200).json(followers.map((f) => f.follower));
    } catch (error) {
      console.error('Error listing followers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listFollowing(req, res) {
    try {
      const { userId } = req.params;

      const following = await prisma.follower.findMany({
        where: {
          followerId: parseInt(userId),
        },
        include: {
          following: {
            select: { id: true, email: true },
          },
        },
      });

      res.status(200).json(following.map((f) => f.following));
    } catch (error) {
      console.error('Error listing following:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
