// src/routes/authRoutes.ts
import { Router } from 'express';
import TicketModel from '../models/Ticket';
import { TicketService } from '../services/TicketService';
import { TicketController } from '../controllers/TicketController';
import { authTokenValidator, validateIsAdmin } from '../middleware/authMiddleware';
import validateTicket from '../middleware/validateTicket';
import CommentModel from '../models/Comment';
import { CommentService } from '../services/CommentService';

const router = Router();
const ticketModel = new TicketModel();
const ticketService = new TicketService(ticketModel);
const commentModel = new CommentModel();
const commentService = new CommentService(commentModel, ticketModel)
const ticketController = new TicketController(ticketService, commentService);


router.use(authTokenValidator)
router.post('/tickets', validateTicket, ticketController.createTicket.bind(ticketController));
router.put('/tickets/:id', validateTicket, ticketController.updateTicket.bind(ticketController));
router.get('/tickets/:id', ticketController.getTicket.bind(ticketController));
router.get('/tickets/comment/:id', ticketController.getCommentsForTicket.bind(ticketController));
router.get('/tickets', ticketController.getTickets.bind(ticketController));

router.use(validateIsAdmin);
router.get('/tickets/closed', ticketController.generateClosedTicketsReport.bind(ticketController));
router.delete('/tickets/:id', ticketController.deleteTicket.bind(ticketController));

export default router;
