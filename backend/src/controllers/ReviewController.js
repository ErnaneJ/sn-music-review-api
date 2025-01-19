const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReviewController {
  static async createReview(req, res) {
    try {
      const { songId, content, rating } = req.body;
      const userId = req.user.id;

      if (!rating || rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'The rating must be between 1 and 5.' });
      }

      const review = await prisma.review.create({
        data: {
          content, rating, userId, songId
        },
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Error creating review' });
    }
  }

  static async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId, 10) },
      });

      if (!review || review.userId !== userId) {
        return res.status(403).json({ error: 'Permission denied or review not found.' });
      }

      const updatedReview = await prisma.review.update({
        where: { id: parseInt(reviewId, 10) },
        data: {
          content, rating,
        },
      });

      res.status(200).json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Error updating review' });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(reviewId, 10) },
      });

      if (!review || review.userId !== userId) {
        return res.status(403).json({ error: 'Permission denied or review not found.' });
      }

      await prisma.review.delete({
        where: { id: parseInt(reviewId, 10) },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error when deleting review:', error);
      res.status(500).json({ error: 'Error when deleting review' });
    }
  }

  static async getReviewsBySong(req, res) {
    try {
      const { songId } = req.params;

      const reviews = await prisma.review.findMany({
        where: { songId: parseInt(songId, 10) },
        include: {
          user: { select: { id: true, email: true } },
        },
      });

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error when searching for reviews:', error);
      res.status(500).json({ error: 'Error when searching for reviews' });
    }
  }
}

module.exports = ReviewController;
