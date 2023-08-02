// src/routes/authRoutes.ts
import { Router } from 'express';
import TicketModel from '../models/Ticket';
import { TicketService } from '../services/TicketService';
import { TicketController } from '../controllers/TicketController';
import { authTokenValidator } from '../middleware/authTokenValidatorMiddleware';
import validateTicket from '../middleware/validateTicket';

const router = Router();
const ticketModel = new TicketModel();
const ticketService = new TicketService(ticketModel);
const ticketController = new TicketController(ticketService);

router.use(authTokenValidator)
router.post('/tickets', validateTicket, ticketController.createTicket.bind(ticketController));
router.put('/tickets/:id', validateTicket, ticketController.updateTicket.bind(ticketController));
router.get('/tickets/:id', ticketController.getTicket.bind(ticketController));
router.get('/tickets', ticketController.getTickets.bind(ticketController));

// router.delete('/tickets/:id', ticketController.deleteTicket.bind(ticketController)); TODO: for admin

export default router;
