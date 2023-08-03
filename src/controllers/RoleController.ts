// src/controllers/RoleController.ts

import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/RoleService';
import { RoleDocument } from '../models/Role';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      const newRole: RoleDocument = await this.roleService.createRoleWithValidation(name, description);

      return res.status(201).json(newRole);
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.roleService.getAllRoles();
      return res.status(200).json({ roles });
    } catch (error) {
      next(error);
    }
  }

  async getRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const role = await this.roleService.findById(id);
      if (!role) {
        return res.status(404).json({ error: true, message: 'Role not found.' });
      }

      return res.status(200).json({ role });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updatedRole = await this.roleService.update(id, { name, description });
      if (!updatedRole) {
        return res.status(404).json({ error: true, message: 'Role not found.' });
      }

      return res.status(200).json({ role: updatedRole });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deletedRole = await this.roleService.delete(id);
      if (!deletedRole) {
        return res.status(404).json({ error: true, message: 'Role not found.' });
      }

      return res.status(200).json({ message: 'Role deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
}
