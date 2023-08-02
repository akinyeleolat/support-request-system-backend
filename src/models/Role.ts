// src/models/Role.ts
import { Schema, model, Document } from 'mongoose';
import { BaseMongooseModel } from './BaseModel';

export interface RoleDocument extends Document {
  name: string;
}

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});


class RoleModel extends BaseMongooseModel<RoleDocument> {
  constructor() {
    super(model<RoleDocument>('Role', roleSchema));
  }
}

export default RoleModel;

