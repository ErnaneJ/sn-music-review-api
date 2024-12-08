const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CommentController {
  static async createComment(req, res) {
    try {
      const { content, reviewId, parentId } = req.body;
      const userId = req.user.id;

      const newComment = await prisma.comment.create({
        data: {
          content, userId, reviewId, parentId,
        },
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Error creating comment' });
    }
  }

  static async getCommentsByReview(req, res) {
    try {
      const { reviewId } = req.params;

      const comments = await prisma.comment.findMany({
        where: { reviewId: parseInt(reviewId, 10) },
        include: {
          user: { select: { id: true, email: true } },
          replies: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error('Error when searching for comments:', error);
      res.status(500).json({ error: 'Error when searching for comments' });
    }
  }

  static async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const comment = await prisma.comment.findUnique({ where: { id: parseInt(id, 10) } });
      if (!comment || comment.userId !== userId) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id, 10) },
        data: { content },
      });

      res.status(200).json(updatedComment);
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Error updating comment' });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await prisma.comment.findUnique({ where: { id: parseInt(id, 10) } });
      if (!comment || comment.userId !== userId) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      await prisma.comment.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error when deleting comment:', error);
      res.status(500).json({ error: 'Error when deleting comment' });
    }
  }
}

module.exports = CommentController;