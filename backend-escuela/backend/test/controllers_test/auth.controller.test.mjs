import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js'; // Adjusted import to app.js which exports the Express app instance

const prisma = new PrismaClient();

describe('Auth Controller', () => {
  let server;
  let testUserEmail = 'testuser@example.com';
  let testUserPassword = 'TestPassword123!';
  let token = '';
  let refreshToken = '';

  beforeAll(async () => {
    // No need to listen, use app directly with supertest
    // Clean up test user if exists
    await prisma.refreshToken.deleteMany({
      where: {
        user: {
          email: testUserEmail,
        },
      },
    });
    await prisma.usuario.deleteMany({
      where: { email: testUserEmail },
    });
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany({
      where: {
        user: {
          email: testUserEmail,
        },
      },
    });
    await prisma.usuario.deleteMany({
      where: { email: testUserEmail },
    });
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test User',
        email: testUserEmail,
        password: testUserPassword,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login the user and return token and refreshToken', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUserEmail,
        password: testUserPassword,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');
    token = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUserEmail);
  });

  it('should refresh access token with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should deny access to protected route without token', async () => {
    const res = await request(app)
      .get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });

  it('should deny access to protected route with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });
});
