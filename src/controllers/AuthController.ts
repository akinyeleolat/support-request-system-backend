// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import userModel from '../models/User';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response)=> {
    try {
      const { username,lastName, firstName, email, password, role } = req.body;

      const signUpResult = await this.authService.signUp(username,lastName, firstName,  email, password, role);
      if (signUpResult.error) {
        return res.status(signUpResult.statusCode).json({ message: signUpResult.message });
      }

      const { user, authToken, refreshToken } = signUpResult;

      res.status(201).json({ authToken, refreshToken, user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }


  login = async (req: Request, res: Response)=>{
    try {
      const { username, password } = req.body;

      const loginResult = await this.authService.login(username, password);
      if (loginResult.error) {
        return res.status(loginResult.statusCode).json({ message: loginResult.message });
      }

      const { authToken, refreshToken } = loginResult;

      res.json({ authToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  forgotPassword = async(req: Request, res: Response)=> {
    try {
      const { email } = req.body;

      const forgotPasswordResult = await this.authService.forgotPassword(email);
      if (forgotPasswordResult.error) {
        return res.status(forgotPasswordResult.statusCode).json({ message: forgotPasswordResult.message });
      }

      res.json({ message: forgotPasswordResult.message });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }

  resetPassword= async (req: Request, res: Response)=> {
    try {
      const { userId, password } = req.body;

      const resetPasswordResult = await this.authService.resetPassword(userId, password);
      if (resetPasswordResult.error) {
        return res.status(resetPasswordResult.statusCode).json({ message: resetPasswordResult.message });
      }

      res.json({ message: resetPasswordResult.message });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
}
