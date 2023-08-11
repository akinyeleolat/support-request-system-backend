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

    const formattedClosedTickets = closedTickets.map(ticket => ({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      customer: ticket.customer,
      supportAgent: ticket.supportAgent,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));

    // Create the 'reports' directory if it doesn't exist
    const reportsDir = join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const fileName = `closed_tickets_report_${Date.now()}.csv`;
    const filePath = join(reportsDir, fileName);

    const ws = fs.createWriteStream(filePath);
    const csvStream = csv.format({ headers: true });
    csvStream.pipe(ws);
    
    for (const ticket of formattedClosedTickets) {
      csvStream.write(ticket);
    }
    
    csvStream.end();
    
    return new Promise<string>((resolve, reject) => {
      ws.on('finish', () => {
        resolve(filePath);
      });
    
      ws.on('error', (error) => {
        reject(error);
      });
    })
  }

  async assignTicketToSupportAgent(ticketId: string, supportAgent: string) {

    if (!supportAgent) {
      const errorResponse: CustomError = generateError(StatusCodes.BAD_REQUEST,'Support Agent missing.')
      return errorResponse;
    }


    const ticket = await this.ticketModel.findById(ticketId);
    const supportAgentData = await this.userModel.findById(supportAgent)

    if (!supportAgentData) {
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

    ticket.supportAgent = supportAgent;

    return this.update(ticketId, ticket);
  }

  //TODO: 
  // create close ticket method, you can use update
  // error handling or error utils completion
  // write more test
  // implement refresh token
  // reduce service code with abstract base class

}


