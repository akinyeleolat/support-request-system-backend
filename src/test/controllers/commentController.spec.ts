import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import { CommentController } from '../../controllers/CommentController';
import { CommentService } from '../../services/CommentService';
import CommentModel from '../../models/Comment';
import TicketModel from '../../models/Ticket';

describe('CommentController', () => {
  let app:any;
  let commentService:any;

  beforeEach(() => {
    app = express();
    const commentModel = new CommentModel();
    const ticketModel = new TicketModel()
    commentService = new CommentService(commentModel, ticketModel);
    const commentController = new CommentController(commentService);

    app.post('/api/comments', commentController.createComment.bind(commentController));
    app.put('/api/comments/:id', commentController.updateComment.bind(commentController));
    app.delete('/api/comments/:id', commentController.deleteComment.bind(commentController));
    app.get('/api/comments', commentController.getAllComments.bind(commentController));
  });

  describe('createComment', () => {
    it('should create a new comment and return 201', async () => {
      commentService.create = async () => ({ text: 'New Comment' });

      const res = await request(app).post('/api/comments').send({});

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal({ text: 'New Comment' });
    });

    it('should handle errors during comment creation and return 500', async () => {
      commentService.create = async () => {
        throw new Error('Failed to create comment');
      };

      const res = await request(app).post('/api/comments').send({});

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to create comment.');
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment and return 200', async () => {
      commentService.update = async () => ({ text: 'Updated Comment' });

      const res = await request(app).put('/api/comments/commentId').send({ text: 'Updated Comment' });

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ text: 'Updated Comment' });
    });

    it('should handle updating a non-existing comment and return 500', async () => {
      commentService.update = async () => null;

      const res = await request(app).put('/api/comments/nonExistentId').send({ text: 'Updated Comment' });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to update comment.');
    });

    it('should handle errors during comment update and return 500', async () => {
      commentService.update = async () => {
        throw new Error('Failed to update comment');
      };

      const res = await request(app).put('/api/comments/commentId').send({});

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to update comment.');
    });
  });

  describe('deleteComment', () => {
    it('should delete an existing comment', async () => {
      commentService.delete = async () => true;

      const res = await request(app).delete('/api/comments/commentId');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ message: 'Comment deleted successfully.' });
    });

    it('should handle deleting a non-existing comment', async () => {
      commentService.delete = async () => false;

      const res = await request(app).delete('/api/comments/nonExistentId');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('error', 'Comment not found.');
    });

    it('should handle errors during comment deletion', async () => {
      commentService.delete = async () => {
        throw new Error('Failed to delete comment');
      };

      const res = await request(app).delete('/api/comments/commentId');

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to delete comment.');
    });
  });

  describe('getAllComments', () => {
    it('should fetch all comments', async () => {
      const comments = [{ _id: 'commentId1', text: 'Comment 1' }, { _id: 'commentId2', text: 'Comment 2' }];
      commentService.findAll = async () => comments;

      const res = await request(app).get('/api/comments');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(comments);
    });

    it('should handle errors during fetching comments', async () => {
      commentService.findAll = async () => {
        throw new Error('Failed to fetch comments');
      };

      const res = await request(app).get('/api/comments');

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to fetch comments.');
    });
  });
});
