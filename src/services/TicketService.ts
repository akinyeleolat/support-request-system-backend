// src/services/TicketService.ts
import fs from 'fs';
import { join } from 'path';
import * as csv from 'fast-csv';
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

  async findClosedTicketsInRange(startDate: Date, endDate: Date): Promise<TicketDocument[]> {
    return this.ticketModel.findAll({
      status: 'Closed',
      updatedAt: { $gte: startDate, $lte: endDate },
    });
  }

  async generateClosedTicketsReport(startDate: Date, endDate: Date): Promise<string> {
    const closedTickets = await this.findClosedTicketsInRange(startDate, endDate);

    const fileName = `closed_tickets_report_${Date.now()}.csv`;
    const filePath = join(__dirname, '..', 'reports', fileName);

    const ws = fs.createWriteStream(filePath);
    csv.write(closedTickets, { headers: true }).pipe(ws);

    return filePath;
  }
}


