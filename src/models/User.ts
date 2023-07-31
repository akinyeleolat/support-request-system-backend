// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
});

class UserModel extends BaseMongooseModel<UserDocument> {
  constructor() {
    super(model<UserDocument>('User', userSchema));
  }
}

const userModel = new UserModel();

export default userModel;
