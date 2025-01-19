const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LikeController {
  static async addLike(req, res) {
    try {
      const { reviewId } = req.body;
      const userId = req.user.id;

      const existingLike = await prisma.like.findFirst({
        where: { reviewId, userId },
      });

      if (existingLike) {
        return res.status(400).json({ error: 'You already liked this review.' });
      }

      const like = await prisma.like.create({
        data: {
          reviewId,
          userId,
        },
      });

      res.status(201).json(like);
    } catch (error) {
      console.error('Error adding like:', error);
      res.status(500).json({ error: 'Error adding like' });
    }
  }

  static async removeLike(req, res) {
    try {
      const { reviewId } = req.body;
      const userId = req.user.id;

      const like = await prisma.like.findFirst({
        where: { reviewId, userId },
      });

      if (!like) {
        return res.status(404).json({ error: 'Like not found.' });
      }

      await prisma.like.delete({
        where: { id: like.id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error removing like:', error);
      res.status(500).json({ error: 'Error removing like' });
    }
  }

  static async getLikesByReview(req, res) {
    try {
      const { reviewId } = req.params;

      const likes = await prisma.like.findMany({
        where: { reviewId: parseInt(reviewId, 10) },
        include: {
          user: { select: { id: true, email: true } },
        },
      });

      res.status(200).json(likes);
    } catch (error) {
      console.error('Error when searching for likes:', error);
      res.status(500).json({ error: 'Error when searching for likes' });
    }
  }
}

module.exports = LikeController;
