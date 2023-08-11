// src/services/TicketService.ts
import fs from 'fs';
import { join } from 'path';
import { StatusCodes } from 'http-status-codes';
import * as csv from 'fast-csv';
import TicketModel, { TicketDocument } from '../models/Ticket';
import UserModel from '../models/User';
import { CustomError, generateError } from '../util/errorUtils';
import { STATUS_CODES } from 'http';

export class TicketService {
  private ticketModel: TicketModel;
  private userModel: UserModel;

  constructor(ticketModel: TicketModel, userModel: UserModel) {
    this.ticketModel = ticketModel;
    this.userModel = userModel;
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

  async assignTicketToSupportAgent(ticketId: string, supportAgentId: string) {

    if (!supportAgentId) {
      const errorResponse: CustomError = generateError(StatusCodes.BAD_REQUEST,'Support AgentId missing.')
      return errorResponse;
    }


    const ticket = await this.ticketModel.findById(ticketId);
    const supportAgent = await this.userModel.findById(supportAgentId)

    if (!supportAgent) {
      const errorResponse: CustomError = generateError(StatusCodes.NOT_FOUND,'Support Agent not found.');
      return errorResponse;
    }

    if (!ticket) {
      const errorResponse: CustomError = generateError(StatusCodes.NOT_FOUND,'Ticket not found.');
      return errorResponse;
    }

    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    ticket.supportAgent = supportAgentId;

    return this.update(ticketId, ticket);
  }

  //TODO: 
  // create close ticket method, you can use update
  // error handling or error utils completion
  // write more test
  // implement refresh token
  // reduce service code with abstract base class

}


