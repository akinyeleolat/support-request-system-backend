// src/middleware/authTokenValidatorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserService } from "../services/UserService";
import UserModel from "../models/User";

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
