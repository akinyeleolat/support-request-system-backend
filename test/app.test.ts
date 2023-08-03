import { expect } from 'chai';
import request from 'supertest';
import { app, connectToDatabase, closeServer } from '../src/server';

describe('App', () => {
  beforeEach(async () => {
    // Connect to the database and start the server before each test
    await connectToDatabase();
  });

  afterEach(() => {
    // Close the server after each test
    closeServer();
  });

  describe('GET /api/auth', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/api/auth');
      expect(res.status).to.equal(200);
    });
    // Add more tests for other endpoints if needed
  });

  describe('GET /api/tickets', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/api/tickets');
      expect(res.status).to.equal(200);
    });
    // Add more tests for other endpoints if needed
  });

  describe('GET /api/comments', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/api/comments');
      expect(res.status).to.equal(200);
    });
    // Add more tests for other endpoints if needed
  });

  describe('GET /api/role', () => {
    it('should return 200 status', async () => {
      const res = await request(app).get('/api/role');
      expect(res.status).to.equal(200);
    });
    // Add more tests for other endpoints if needed
  });
});
