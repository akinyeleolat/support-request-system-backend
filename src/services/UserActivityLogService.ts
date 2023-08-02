// src/services/UserService.ts
import UserActivityLogModel, {UserActivityLogDocument } from '../models/UserActivityLog';

export class UserActivityLogService {
  private userActivityLogModel: UserActivityLogModel; // Use the actual type for the UserActivityLogModel

  constructor(userActivityLogModel: UserActivityLogModel) {
    this.userActivityLogModel = userActivityLogModel;
  }

  async findBy(conditions: object): Promise<UserActivityLogDocument | null> {
    return this.userActivityLogModel.findBy(conditions);
  }

  async findById(id: string): Promise<UserActivityLogDocument | null> {
    return this.userActivityLogModel.findById(id);
  }

  async create(data: Partial<UserActivityLogDocument>): Promise<UserActivityLogDocument> {
    return this.userActivityLogModel.create(data);
  }

  async update(id: string, data: Partial<UserActivityLogDocument>): Promise<UserActivityLogDocument | null> {
    return this.userActivityLogModel.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.userActivityLogModel.delete(id);
  }

  async findAll(filter?: object): Promise<UserActivityLogDocument[]> {
    return this.userActivityLogModel.findAll(filter);
  }
}
