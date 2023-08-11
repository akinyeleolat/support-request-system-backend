// src/routes/authRoutes.ts
import { Router } from 'express';
import CommentModel from '../models/Comment';
import { CommentService } from '../services/CommentService';
import { CommentController } from '../controllers/CommentController';
import validateComment from '../middleware/validateComment';
import { authTokenValidator, validateIsAdmin } from '../middleware/authMiddleware';
import TicketModel from '../models/Ticket';
import { userActivityLogger, userActivityLogService } from '../middleware/userActivityLogger';

const router = Router();
const commentModel = new CommentModel();
const ticketModel = new TicketModel();
const commentService = new CommentService(commentModel, ticketModel);
const commentController = new CommentController(commentService);

router.use(authTokenValidator)
router.use(userActivityLogger(userActivityLogService))

router.post('/', validateComment, commentController.createComment.bind(commentController));
router.patch('/:id', validateComment, commentController.updateComment.bind(commentController));
router.get('/', commentController.getAllComments.bind(commentController));

router.use(validateIsAdmin);
router.delete('/:id', commentController.deleteComment.bind(commentController));


export default router;
