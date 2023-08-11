import request from 'supertest';
import sinon from 'sinon';
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
    app.patch('/api/comments/:id', commentController.updateComment.bind(commentController));
    app.delete('/api/comments/:id', commentController.deleteComment.bind(commentController));
    app.get('/api/comments', commentController.getAllComments.bind(commentController));
  });

  describe('createComment', () => {
    it('should create a new comment and return 201', async () => {
      const newCommentData = { text: 'New Comment', ticket: 'ticketId', user: 'userId' };
      const createdComment = { ...newCommentData, _id: 'newCommentId' };
  
      // Mock the CommentService create method
      commentService.create = sinon.stub().resolves(createdComment);
  
      const res = await request(app).post('/api/comments').send(newCommentData);
  
      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(createdComment);
      sinon.assert.calledOnce(commentService.create);
      sinon.assert.calledWithExactly(commentService.create, newCommentData);
    });

    it('should not create a new comment and return 500, when ticketId is invalid', async () => {
      const newCommentData = { text: 'New Comment', ticket: 'ticketId', user: 'userId' };
      commentService.create = async () => newCommentData;

      const res = await request(app).post('/api/comments').send(newCommentData);

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to create comment.');
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
      const existingCommentId = 'commentId';
      const updatedCommentData = { text: 'Updated Comment' };
  
      // Mock the CommentService update method
      commentService.update = sinon.stub().resolves({ ...updatedCommentData, _id: existingCommentId });
  
      const res = await request(app).patch(`/api/comments/${existingCommentId}`).send(updatedCommentData);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ ...updatedCommentData, _id: existingCommentId });
      sinon.assert.calledOnce(commentService.update);
      sinon.assert.calledWithExactly(commentService.update, existingCommentId, updatedCommentData);
    });

    it('should not update an existing comment and return 500, when ticketId is invalid', async () => {
      const updatedCommentData = { text: 'Updated Comment' };
      commentService.update = async () => updatedCommentData;

      const res = await request(app).patch('/api/comments/commentId').send(updatedCommentData);

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to update comment.');
    });

    it('should handle updating a non-existing comment and return 500', async () => {
      commentService.update = async () => null;

      const res = await request(app).patch('/api/comments/nonExistentId').send({ text: 'Updated Comment' });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('error', 'Failed to update comment.');
    });

    it('should handle errors during comment update and return 500', async () => {
      commentService.update = async () => {
        throw new Error('Failed to update comment');
      };

      const res = await request(app).patch('/api/comments/commentId').send({});

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
