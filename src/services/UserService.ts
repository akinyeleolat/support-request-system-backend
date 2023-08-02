// src/services/UserService.ts
import UserModel, {UserDocument } from '../models/User';

export class UserService {
  private userModel: UserModel; // Use the actual type for the UserModel

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  async findBy(conditions: object): Promise<UserDocument | null> {
    return this.userModel.findBy(conditions);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async update(id: string, data: Partial<UserDocument>): Promise<UserDocument | null> {
    return this.userModel.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.userModel.delete(id);
  }

  async findAll(filter?: object): Promise<UserDocument[]> {
    return this.userModel.findAll(filter);
  }
}
