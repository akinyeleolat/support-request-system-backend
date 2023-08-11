// src/models/Ticket.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface TicketDocument extends Document {
  createdAt: any;
  updatedAt: any;
  title: string;
  description: string;
  status: string;
  customer: string;
  supportAgent: string;
}

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supportAgent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
},
{ timestamps: true },);


class TicketModel extends BaseMongooseModel<TicketDocument> {
  constructor() {
    super(model<TicketDocument>('Ticket', ticketSchema));
  }
}


export default TicketModel;

