// src/middleware/validateComment.ts
import { Request, Response, NextFunction } from 'express';

interface CommentData {
  text: string;
  ticket: string;
  user: string;
}

function validateComment(req: Request, res: Response, next: NextFunction) {
  const { text, ticket, user } = req.body;
  const errors: string[] = [];

  if (!text || typeof text !== 'string') {
    errors.push('Text is required and must be a string.');
  }

  if (!ticket || typeof ticket !== 'string') {
    errors.push('Ticket ID is required and must be a string.');
  }

  if (!user || typeof user !== 'string') {
    errors.push('User ID is required and must be a string.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export default validateComment;
