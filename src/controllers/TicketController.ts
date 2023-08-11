// src/controllers/TicketController.ts
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { TicketService } from '../services/TicketService';
import { CommentService } from '../services/CommentService';

export class TicketController {
  private ticketService: TicketService;
  private commentService: CommentService;

  constructor(ticketService: TicketService, commentService: CommentService) {
    this.ticketService = ticketService;
    this.commentService = commentService;
  }

  /**
   * @swagger
   * /api/tickets:
   *   post:
   *     summary: Create a new ticket
   *     description: Create a new ticket with the provided title, description, and customer ID
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: body
   *         name: ticket
   *         description: The ticket information to create
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               type: string
   *             description:
   *               type: string
   *             customer:
   *               type: string
   *     responses:
   *       201:
   *         description: Successfully created a new ticket
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/tickets/{id}:
   *   patch:
   *     summary: Update a ticket
   *     description: Update an existing ticket with the provided title and description
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the ticket to update
   *         required: true
   *         type: string
   *       - in: body
   *         name: ticket
   *         description: The updated ticket information
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             title:
   *               type: string
   *             description:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully updated the ticket
   *       404:
   *         description: Ticket not found
   *       500:
   *         description: Internal server error
   */
  async updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;
      const { title, description, ...data } = req.body;
      const ticketData = {
        title,
        description,
        ...data
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

  /**
   * @swagger
   * /api/tickets/{id}:
   *   delete:
   *     summary: Delete a ticket
   *     description: Delete a ticket by its ID
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the ticket to delete
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully deleted the ticket
   *       404:
   *         description: Ticket not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/tickets/{id}:
   *   get:
   *     summary: Get a ticket by ID
   *     description: Get a ticket by its ID
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the ticket to retrieve
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully fetched the ticket
   *       404:
   *         description: Ticket not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/tickets:
   *   get:
   *     summary: Get all tickets
   *     description: Get a list of all tickets
   *     tags:
   *       - Tickets
   *     responses:
   *       200:
   *         description: Successfully fetched tickets
   *       500:
   *         description: Internal server error
   */
  async getTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await this.ticketService.findAll();
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/tickets/{id}/comment:
   *   get:
   *     summary: Get comments for a ticket
   *     description: Get all comments associated with a specific ticket
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the ticket to retrieve comments for
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully fetched comments for the ticket
   *       404:
   *         description: Ticket not found
   *       500:
   *         description: Internal server error
   */
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


  /**
 * @swagger
 * /api/tickets/reports/closed:
 *   get:
 *     summary: Generate a report of closed tickets within a date range
 *     description: Generate a CSV report containing closed tickets within the specified start and end date
 *     tags:
 *       - Tickets
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description:The start date for the report (format: YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 * 
 *       - name: endDate
 *         in: query
 *         description:The end date for the report (format: YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully generated the report
 *       400:
 *         description: Invalid date format or missing start/end date
 *       500:
 *         description: Internal server error
 */
  async generateClosedTicketsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required.' });
      }

      const startDateObj = new Date(startDate as string);
      const endDateObj = new Date(endDate as string);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format. Please provide dates in valid format (YYYY-MM-DD).' });
      }

      const reportFilePath = await this.ticketService.generateClosedTicketsReport(startDateObj, endDateObj);

      res.download(reportFilePath, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          return res.status(500).json({ message: 'Error downloading file.' });
        }

        // // Delete the report file after it's downloaded
        // fs.unlink(reportFilePath, (err: any) => {
        //   if (err) {
        //     console.error('Error deleting file:', err);
        //   }
        // });
      });
    } catch (error) {
      next(error);
    }
  }


  /**
   * @swagger
   * /api/tickets/{id}/assign:
   *   post:
   *     summary: Assign tickets to support agent
   *     description: Assign an existing ticket with the provided title and description
   *     tags:
   *       - Tickets
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the ticket to assign
   *         required: true
   *         type: string
   *       - in: body
   *         name: ticket
   *         description: The assigned ticket information
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             supportAgent:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully assigned the ticket
   *       404:
   *         description: Ticket or support agent not found
   *       500:
   *         description: Internal server error
   */
  async assignTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketId = req.params.id;
      const { supportAgent } = req.body;

      const assignedTicket = await this.ticketService.assignTicketToSupportAgent(ticketId, supportAgent);
      if (!assignedTicket) {
        return res.status(404).json({ message: 'Assigned Ticket not found' });
      }

      res.status(200).json(assignedTicket);
    } catch (error) {
      next(error);
    }
  }
}
