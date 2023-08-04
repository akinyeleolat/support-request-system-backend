// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface UserDocument extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  resetToken?: string | null; // Make resetToken optional and accept null
  resetTokenExpiration?: Date | null; // Make resetTokenExpiration optional and accept null
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  resetToken: {
    type: String,
    default: null, // Set default as null to make it optional and accept null
  },
  resetTokenExpiration: {
    type: Date,
    default: null, // Set default as null to make it optional and accept null
  },
});

class UserModel extends BaseMongooseModel<UserDocument> {
  constructor() {
    super(model<UserDocument>('User', userSchema));
  }
}

export default UserModel;
