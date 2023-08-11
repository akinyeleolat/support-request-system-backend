// src/routes/authRoutes.ts
import { Router } from 'express';
import TicketModel from '../models/Ticket';
import { TicketService } from '../services/TicketService';
import { TicketController } from '../controllers/TicketController';
import { authTokenValidator, validateIsAdmin, validateRoleAndNotRole } from '../middleware/authMiddleware';
import validateTicket from '../middleware/validateTicket';
import CommentModel from '../models/Comment';
import { CommentService } from '../services/CommentService';
import { userActivityLogger, userActivityLogService } from '../middleware/userActivityLogger';
import UserModel from '../models/User';


const router = Router();
const ticketModel = new TicketModel();
const userModel = new UserModel()
const ticketService = new TicketService(ticketModel, userModel);
const commentModel = new CommentModel();
const commentService = new CommentService(commentModel, ticketModel)
const ticketController = new TicketController(ticketService, commentService);


router.use(authTokenValidator)

router.use(userActivityLogger(userActivityLogService))

router.post('/', validateTicket, ticketController.createTicket.bind(ticketController));
router.patch('/:id', ticketController.updateTicket.bind(ticketController));
router.get('/:id', ticketController.getTicket.bind(ticketController));
router.get('/:id/comment', ticketController.getCommentsForTicket.bind(ticketController));
router.get('/', ticketController.getTickets.bind(ticketController));

router.post('/:id/assign',validateRoleAndNotRole('customer',true), ticketController.assignTicket.bind(ticketController)), 

router.use(validateIsAdmin);
router.get('/reports/closed', ticketController.generateClosedTicketsReport.bind(ticketController));
router.delete('/:id', ticketController.deleteTicket.bind(ticketController));

export default router;
