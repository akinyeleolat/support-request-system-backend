// src/middleware/userActivityLogger.ts
import { Request, Response, NextFunction } from 'express';
import { UserActivityLogService } from '../services/UserActivityLogService';
import UserActivityLogModel from '../models/UserActivityLog';

export function userActivityLogger(userActivityLogService: UserActivityLogService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { method, originalUrl, user } = req;
      const action = `${method} ${originalUrl}`;
      const userId = user?.id || ''; // Access the user property from the extended Request

      // Log the user activity
      if(user != null){
        await userActivityLogService.create({ userId, action });
      }
      next();
    } catch (error) {
      // Handle any error that occurs during logging (optional)
      console.error('Error logging user activity:', error);
      next(error);
    }
  };
}

const userActivityLogModel = new UserActivityLogModel();

export const userActivityLogService = new UserActivityLogService(userActivityLogModel);