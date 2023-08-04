// src/models/UserActivityLog.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface UserActivityLogDocument extends Document {
  userId: string;
  action: string;
  entityId?: string;
  timestamp: Date;
}

const userActivityLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


class UserActivityLogModel extends BaseMongooseModel<UserActivityLogDocument> {
    constructor() {
      super(model<UserActivityLogDocument>('UserActivityLog', userActivityLogSchema));
    }
  }
  
 
  
  export default UserActivityLogModel;
  