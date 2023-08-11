// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     description: Register a new user with the provided information
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: user
   *         description: The user information to sign up
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             username:
   *               type: string
   *             lastName:
   *               type: string
   *             firstName:
   *               type: string
   *             email:
   *               type: string
   *             password:
   *               type: string
   *             role:
   *               type: string
   *     responses:
   *       201:
   *         description: Successfully signed up a new user
   *       400:
   *         description: Bad request, missing required fields or invalid data
   *       500:
   *         description: Internal server error
   */
  signUp = async (req: Request, res: Response)=> {
    try {
      const { username,lastName, firstName, email, password, role } = req.body;

      const signUpResult = await this.authService.signUp(username,lastName, firstName,  email, password, role);
      if (signUpResult.error) {
        console.log(signUpResult.error);
        return res.status(signUpResult.statusCode).json({ message: signUpResult.message });
      }

      const { user, authToken, refreshToken } = signUpResult;

      res.status(201).json({ authToken, refreshToken, user });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Internal server error.' });
    }
  }


  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate user with provided credentials
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: credentials
   *         description: The user credentials for login
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             username:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       200:
   *         description: Successfully logged in, returns authentication tokens
   *       401:
   *         description: Unauthorized, invalid credentials
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/auth/forgot-password:
   *   post:
   *     summary: Request password reset
   *     description: Send a password reset link to the provided email address
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: email
   *         description: The email address for password reset
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *     responses:
   *       200:
   *         description: Password reset link sent successfully
   *       404:
   *         description: Email address not found
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Reset user password
   *     description: Reset the user password with the provided new password
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: credentials
   *         description: The user ID and new password for password reset
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             userId:
   *               type: string
   *             password:
   *               type: string
   *     responses:
   *       200:
   *         description: Password reset successful
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
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
