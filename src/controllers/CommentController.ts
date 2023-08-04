// src/controllers/CommentController.ts
import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';
import { CommentDocument } from '../models/Comment';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  /**
   * @swagger
   * /api/comments:
   *   post:
   *     summary: Create a new comment
   *     description: Create a new comment with the provided text, ticket, and user
   *     tags:
   *       - Comments
   *     parameters:
   *       - in: body
   *         name: comment
   *         description: The comment information to create
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             text:
   *               type: string
   *             ticket:
   *               type: string
   *             user:
   *               type: string
   *     responses:
   *       201:
   *         description: Successfully created a new comment
   *       500:
   *         description: Internal server error
   */
  async createComment(req: Request, res: Response) {
    try {
      const { text, ticket, user } = req.body;
      const newComment = await this.commentService.create({ text, ticket, user });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment.' });
    }
  }

  /**
   * @swagger
   * /api/comments/{id}:
   *   put:
   *     summary: Update a comment
   *     description: Update the text of an existing comment
   *     tags:
   *       - Comments
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the comment to update
   *         required: true
   *         type: string
   *       - in: body
   *         name: comment
   *         description: The updated comment text
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             text:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully updated the comment
   *       404:
   *         description: Comment not found
   *       500:
   *         description: Internal server error
   */
  async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const updatedComment = await this.commentService.update(id, { text });
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update comment.' });
    }
  }

  /**
   * @swagger
   * /api/comments/{id}:
   *   delete:
   *     summary: Delete a comment
   *     description: Delete an existing comment
   *     tags:
   *       - Comments
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the comment to delete
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully deleted the comment
   *       404:
   *         description: Comment not found
   *       500:
   *         description: Internal server error
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.commentService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete comment.' });
    }
  }

  /**
   * @swagger
   * /api/comments:
   *   get:
   *     summary: Get all comments
   *     description: Get a list of all comments
   *     tags:
   *       - Comments
   *     responses:
   *       200:
   *         description: Successfully fetched comments
   *       500:
   *         description: Internal server error
   */
  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await this.commentService.findAll();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments.' });
    }
  }
}
