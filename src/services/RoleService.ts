// src/services/RoleService.ts
import RoleModel, { RoleDocument } from '../models/Role';

export class RoleService {
  private roleModel: RoleModel; // Use the actual type for the RoleModel

  constructor(roleModel: RoleModel) {
    this.roleModel = roleModel;
  }

  async findBy(conditions: object): Promise<RoleDocument | null> {
    return this.roleModel.findBy(conditions);
  }

  async findById(id: string): Promise<RoleDocument | null> {
    return this.roleModel.findById(id);
  }

  async create(data: Partial<RoleDocument>): Promise<RoleDocument> {
    return this.roleModel.create(data);
  }

  async update(id: string, data: Partial<RoleDocument>): Promise<RoleDocument | null> {
    return this.roleModel.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.roleModel.delete(id);
  }

  async findAll(filter?: object): Promise<RoleDocument[]> {
    return this.roleModel.findAll(filter);
  }
}

