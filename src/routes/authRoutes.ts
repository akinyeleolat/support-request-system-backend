// src/routes/authRoutes.ts
import { Router } from 'express';
import UserModel from '../models/User';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { AuthController } from '../controllers/AuthController';
import { RoleService } from '../services/RoleService';
import RoleModel from '../models/Role';
import {
  signUpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../middleware/authValidationMiddleware';
import { authTokenValidator } from '../middleware/authTokenValidatorMiddleware';

const router = Router();

const userModel = new UserModel();
const roleModel = new RoleModel();
const userService = new UserService(userModel);
const roleService = new RoleService(roleModel);
const authService = new AuthService(userService, roleService);
const authController = new AuthController(authService);

router.post('/signup', signUpValidation, authController.signUp.bind(authController));
router.post('/login', loginValidation, authController.login.bind(authController));
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword.bind(authController));
router.post('/reset-password', resetPasswordValidation, authController.resetPassword.bind(authController));

// Test authTokenValidator middleware to routes that require authentication
router.get('/protected-route', authTokenValidator, (req, res) => {
  // Access the authenticated user using req.user
  const userId = req.user?.id;
  res.json({ message: 'You accessed a protected route', userId });
});

export default router;
