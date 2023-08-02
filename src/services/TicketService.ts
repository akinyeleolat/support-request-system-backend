// src/services/TicketService.ts
import TicketModel, { TicketDocument } from '../models/Ticket';

export class TicketService {
  private ticketModel: TicketModel;

  constructor(ticketModel: TicketModel) {
    this.ticketModel = ticketModel;
  }

  async create(data: Partial<TicketDocument>): Promise<TicketDocument> {
    return this.ticketModel.create(data);
  }

  async update(id: string, data: Partial<TicketDocument>): Promise<TicketDocument | null> {
    return this.ticketModel.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.ticketModel.delete(id);
  }

  async findById(id: string): Promise<TicketDocument | null> {
    return this.ticketModel.findById(id);
  }

  async findBy(filter: object): Promise<TicketDocument | null> {
    return this.ticketModel.findBy(filter);
  }

  async findAll(filter?: object): Promise<TicketDocument[]> {
    return this.ticketModel.findAll(filter);
  }

  // Add more methods as needed for your use case
}
