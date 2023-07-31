// src/models/Comment.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface CommentDocument extends Document {
  text: string;
  ticket: string;
  user: string;
}

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});




class CommentModel extends BaseMongooseModel<CommentDocument> {
    constructor() {
      super(model<CommentDocument>('Comment', commentSchema));
    }
  }
  
  const commentModel = new CommentModel();
  
export default commentModel;
  