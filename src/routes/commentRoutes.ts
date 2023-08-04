// src/routes/authRoutes.ts
import { Router } from 'express';
import CommentModel from '../models/Comment';
import { CommentService } from '../services/CommentService';
import { CommentController } from '../controllers/CommentController';
import validateComment from '../middleware/validateComment';
import { authTokenValidator, validateIsAdmin } from '../middleware/authMiddleware';
import TicketModel from '../models/Ticket';

const router = Router();
const commentModel = new CommentModel();
const ticketModel = new TicketModel();
const commentService = new CommentService(commentModel, ticketModel);
const commentController = new CommentController(commentService);

router.use(authTokenValidator)
router.post('/comments', validateComment, commentController.createComment.bind(commentController));
router.put('/comments/:id', validateComment, commentController.updateComment.bind(commentController));
router.get('/comments', commentController.getAllComments.bind(commentController));

router.use(validateIsAdmin);
router.delete('/comments/:id', commentController.deleteComment.bind(commentController));


export default router;
