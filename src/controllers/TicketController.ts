// src/controllers/TicketController.ts
import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/TicketService';
import { CommentService } from '../services/CommentService';

export class TicketController {
  private ticketService: TicketService;
  private commentService: CommentService;

  constructor(ticketService: TicketService, commentService: CommentService) {
    this.ticketService = ticketService;
    this.commentService = commentService;
  }

  async createTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, customer } = req.body;
      const ticketData = {
        title,
        description,
        customer,
      };

      const newTicket = await this.ticketService.create(ticketData);
      res.status(201).json(newTicket);
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;
      const { title, description } = req.body;
      const ticketData = {
        title,
        description,
      };

      const updatedTicket = await this.ticketService.update(ticketId, ticketData);
      if (!updatedTicket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      res.json(updatedTicket);
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;

      const deleted = await this.ticketService.delete(ticketId);
      if (!deleted) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;

      const ticket = await this.ticketService.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      next(error);
    }
  }

  async getTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await this.ticketService.findAll();
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  async getCommentsForTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;

      // Retrieve the comments for the specific ticket
      const comments = await this.commentService.getCommentsForTicket(ticketId);

      // Return the comments in the response
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  // Add more methods as needed for your use case
}
