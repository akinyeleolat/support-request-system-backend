// src/controllers/CommentController.ts
import { Request, Response } from 'express';
import { CommentService } from '../services/CommentService';
import { CommentDocument } from '../models/Comment';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  async createComment(req: Request, res: Response) {
    try {
      const { text, ticket, user } = req.body;
      const newComment = await this.commentService.create({ text, ticket, user });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment.' });
    }
  }

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

  async getAllComments(req: Request, res: Response) {
    try {
      const comments = await this.commentService.findAll();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments.' });
    }
  }
}
