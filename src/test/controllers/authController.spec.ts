import mocha from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import express, { Application } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { AuthService } from '../../services/AuthService';


describe('AuthController', () => {
  let app: Application;

  before(() => {
    // Set up the Express app with the AuthController and mock services
    app = express();
    app.use(express.json());

    // Mock AuthService
    const authService = {
      signUp: async () => ({
        error: false,
        statusCode: 201,
        authToken: 'mockAuthToken',
        refreshToken: 'mockRefreshToken',
        user: { id: 'mockUserId', username: 'mockUsername', role: 'mockRole' },
      }),
      login: async () => ({
        error: false,
        statusCode: 200,
        authToken: 'mockAuthToken',
        refreshToken: 'mockRefreshToken',
      }),
      forgotPassword: async () => ({
        error: false,
        statusCode: 200,
        message: 'Password reset token sent via email.',
      }),
      resetPassword: async () => ({
        error: false,
        statusCode: 200,
        message: 'Password reset successful.',
      }),
    };

    const authController = new AuthController(authService as unknown as AuthService);

    // Set up routes
    app.post('/api/auth/signup', authController.signUp);
    app.post('/api/auth/login', authController.login);
    app.post('/api/auth/forgot-password', authController.forgotPassword);
    app.post('/api/auth/reset-password', authController.resetPassword);
  });

  describe('POST /api/auth/signup', () => {
    it('should return 201 status and auth tokens on successful sign up', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpassword',
        role: 'user',
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('authToken');
      expect(res.body).to.have.property('refreshToken');
      expect(res.body).to.have.property('user');
    });

    // Add more test cases for error scenarios if needed
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 status and auth tokens on successful login', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'testpassword',
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('authToken');
      expect(res.body).to.have.property('refreshToken');
    });

    // Add more test cases for error scenarios if needed
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 200 status and success message on successful request', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({
        email: 'test@example.com',
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Password reset token sent via email.');
    });

    // Add more test cases for error scenarios if needed
  });

  describe('POST /api/auth/reset-password', () => {
    it('should return 200 status and success message on successful reset', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({
        userId: 'mockUserId',
        password: 'newpassword',
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Password reset successful.');
    });

    // Add more test cases for error scenarios if needed
  });
});

