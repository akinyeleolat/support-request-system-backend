// src/controllers/RoleController.ts

import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/RoleService';
import { RoleDocument } from '../models/Role';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  /**
   * @swagger
   * /api/roles:
   *   post:
   *     summary: Create a new role
   *     description: Create a new role with the provided name and description
   *     tags:
   *       - Roles
   *     parameters:
   *       - in: body
   *         name: role
   *         description: The role information to create
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             description:
   *               type: string
   *     responses:
   *       201:
   *         description: Successfully created a new role
   *       500:
   *         description: Internal server error
   */
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      const newRole: RoleDocument = await this.roleService.createRoleWithValidation(name, description);

      return res.status(201).json(newRole);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/roles:
   *   get:
   *     summary: Get all roles
   *     description: Get a list of all roles
   *     tags:
   *       - Roles
   *     responses:
   *       200:
   *         description: Successfully fetched roles
   *       500:
   *         description: Internal server error
   */
  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.roleService.getAllRoles();
      return res.status(200).json({ roles });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/roles/{id}:
   *   get:
   *     summary: Get a role by ID
   *     description: Get a role by its ID
   *     tags:
   *       - Roles
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the role to retrieve
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully fetched the role
   *       404:
   *         description: Role not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/roles/{id}:
   *   put:
   *     summary: Update a role
   *     description: Update an existing role with the provided name and description
   *     tags:
   *       - Roles
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the role to update
   *         required: true
   *         type: string
   *       - in: body
   *         name: role
   *         description: The updated role information
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *             description:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully updated the role
   *       404:
   *         description: Role not found
   *       500:
   *         description: Internal server error
   */
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

   /**
   * @swagger
   * /api/roles/{id}:
   *   delete:
   *     summary: Delete a role
   *     description: Delete a role by its ID
   *     tags:
   *       - Roles
   *     parameters:
   *       - in: path
   *         name: id
   *         description: The ID of the role to delete
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Successfully deleted the role
   *       404:
   *         description: Role not found
   *       500:
   *         description: Internal server error
   */
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
