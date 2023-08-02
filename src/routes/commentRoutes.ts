// src/routes/authRoutes.ts
import { Router } from 'express';
import CommentModel from '../models/Comment';
import { CommentService } from '../services/CommentService';
import { CommentController } from '../controllers/CommentController';
import validateComment from '../middleware/validateComment';
import { authTokenValidator } from '../middleware/authTokenValidatorMiddleware';

const router = Router();
const commentModel = new CommentModel();
const commentService = new CommentService(commentModel);
const commentController = new CommentController(commentService);

router.use(authTokenValidator)
router.post('/comments', validateComment, commentController.createComment.bind(commentController));
router.put('/comments/:id', validateComment, commentController.updateComment.bind(commentController));
router.get('/comments', commentController.getAllComments.bind(commentController));


// router.delete('/comments/:id', commentController.deleteComment.bind(commentController)); TODO: for admin

// ... (other routes)

export default router;
