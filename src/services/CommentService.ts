import { Model } from 'mongoose';
import { CommentDocument } from '../models/Comment'; 
import { TicketDocument } from '../models/Ticket'; 
import { BaseService } from './BaseService';


export class CommentService extends BaseService<CommentDocument> {
  private ticketModel: Model<TicketDocument>;

  constructor(commentModel: Model<CommentDocument>, ticketModel: Model<TicketDocument>) {
    super(commentModel);
    this.ticketModel = ticketModel;
  }

  // Inside CommentService class
async createComment(ticketId: string, user: string, text: string): Promise<CommentDocument> {
  // Find the ticket based on the given ticketId
  const ticket: TicketDocument | null = await this.ticketModel.findById(ticketId);

  // Check if the ticket exists and if a support agent has commented on the ticket
  if (!ticket || !ticket.supportAgent) {
    throw new Error('Ticket not found or a support agent must comment on the ticket before a customer can comment.');
  }

  // Create the comment
  const newComment = await this.model.create({ ticket: ticket._id, user, text });

  return newComment;
}

async getCommentsForTicket(ticketId: string): Promise<CommentDocument[]> {
  // Get all comments associated with the given ticket ID
  const comments = await this.model.find({ ticket: ticketId });

  return comments;
}
}
