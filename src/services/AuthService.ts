// src/services/AuthService.ts
import { compare, genSalt, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { UserDocument } from '../models/User';
import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } from '../config';
import { UserService } from './UserService';
import { RoleService } from './RoleService';
import util from 'util';



export class AuthService {
    private userService: UserService; 
    private roleService: RoleService;

    constructor(userService: UserService, roleService:RoleService) {
      this.userService = userService;
      this.roleService = roleService;
    }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  generateAuthToken(user: UserDocument): string {
    return sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  generateRefreshToken(user: UserDocument): string {
    return sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  }


  async signUp(username: string,firstName: string,lastName: string, email: string, password: string, role: string) {
    const existingUser = await this.userService.findBy({ $or: [{ username }, { email }] });
    if (existingUser) {
      return { error: true, statusCode: 409, message: 'Username or email already exists.' };
    }

    const existingRole = await this.roleService.findById(role);
      if (!existingRole) {
        return { error: true, statusCode: 400, message: 'Role does not exist.' };
      }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const authToken = this.generateAuthToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    return { user: newUser, authToken, refreshToken };
  }

  async login(username: string, password: string) {
    const user = await this.userService.findBy({ username });
    if (!user) {
      return { error: true, statusCode: 401, message: 'Invalid credentials.' };
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return { error: true, statusCode: 401, message: 'Invalid credentials.' };
    }

    const authToken = this.generateAuthToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { authToken, refreshToken };
  }


  async forgotPassword(email: string) {
    const user = await this.userService.findBy({ email });
    if (!user) {
      return { error: true, statusCode: 404, message: 'User not found.' };
    }

    const resetToken = (await util.promisify(randomBytes)(20)).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 3600000); // Convert the number to a Date object
    await user.save();

    // Send the reset token to the user via email (implement this part separately)

    return { message: 'Password reset token sent via email.' };
  }

  async resetPassword(userId: string, password: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      return { error: true, statusCode: 404, message: 'User not found.' };
    }

    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return { message: 'Password reset successful.' };
  }
}


