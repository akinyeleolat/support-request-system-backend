// src/middleware/authTokenValidatorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserService } from "../services/UserService";
import { RoleService } from '../services/RoleService';
import UserModel from "../models/User";
import RoleModel from "../models/Role";

interface TokenPayload {
  userId: string;
}

export async function authTokenValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userModel = new UserModel();
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Invalid or missing authentication token" });
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' from the token string

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const userService = new UserService(userModel); // Create an instance of the UserService
    const user = await userService.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Set the user object in the request with the fetched user from the database
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function validateIsAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(401).json({ error: true, message: 'Unauthorized: User role not found.' });
    }

    const roleModel = new RoleModel()

    const roleService = new RoleService(roleModel);
    const adminRole = await roleService.findByName('admin');

    if (!adminRole) {
      return res.status(500).json({ error: true, message: 'Internal Server Error: Admin role not found.' });
    }

    if (userRole.toString() !== adminRole._id.toString()) {
      return res.status(403).json({ error: true, message: 'Forbidden: Only Admin users can perform this action.' });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateRoleAndNotRole(role: string, notRole: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) {
        return res.status(401).json({ error: true, message: 'Unauthorized: User role not found.' });
      }

      const roleModel = new RoleModel();
      const roleService = new RoleService(roleModel);
      const roleData = await roleService.findByName(role);

      if (notRole && userRole.toString() === roleData?._id.toString()) {
        return res.status(403).json({ error: true, message: `Forbidden: ${role} users cannot perform this action.` });
      }

      if (!notRole && userRole.toString() !== roleData?._id.toString()) {
        return res.status(403).json({ error: true, message: `Forbidden: Only ${role} users can perform this action.` });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}


