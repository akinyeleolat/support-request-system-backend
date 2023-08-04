// src/services/CommentService.ts
import CommentModel, { CommentDocument } from '../models/Comment';
import TicketModel, { TicketDocument } from '../models/Ticket';

export class CommentService {
  private commentModel: CommentModel;
  private ticketModel: TicketModel;

  constructor(commentModel: CommentModel, ticketModel: TicketModel) {
    this.commentModel = commentModel;
    this.ticketModel = ticketModel;
  }

  async create(data: Partial<CommentDocument>) {
    return this.commentModel.create(data);
  }

  async update(id: string, data: Partial<CommentDocument>) {
    return this.commentModel.update(id, data);
  }

  async delete(id: string) {
    return this.commentModel.delete(id);
  }

  async findAll(filter?: object) {
    return this.commentModel.findAll(filter);
  }

  async createComment(ticketId: string, user: string, text: string): Promise<CommentDocument> {
    // Find the ticket based on the given ticketId
    const ticket: TicketDocument | null = await this.ticketModel.findById(ticketId);

    // Check if the ticket exists and if a support agent has commented on the ticket
    if (!ticket || !ticket.supportAgent) {
      throw new Error('Ticket not found or a support agent must comment on the ticket before a customer can comment.');
    }

    // Create the comment
    const newComment = await this.commentModel.create({ ticket: ticket._id, user, text });

    return newComment;
  }

  async getCommentsForTicket(ticketId: string): Promise<CommentDocument[]> {
    // Get all comments associated with the given ticket ID
    const comments = await this.commentModel.findAll({ ticket: ticketId });

    return comments;
  }
}
