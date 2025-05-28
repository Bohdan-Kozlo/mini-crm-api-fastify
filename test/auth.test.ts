import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

describe('Auth Module', () => {
  let server: FastifyInstance;
  let prisma: PrismaClient;

  beforeAll(() => {
    server = global.server;
    prisma = global.prisma;
  });


  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /register', () => {
    const registerPayload = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: registerPayload
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload)).toHaveProperty('accessToken');

      const user = await prisma.user.findUnique({
        where: { email: registerPayload.email }
      });
      expect(user).toBeTruthy();
      expect(user?.email).toBe(registerPayload.email);
    });

    it('should not register user with existing email', async () => {
      await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: registerPayload
      });

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: registerPayload
      });

      expect(response.statusCode).toBe(401);
    });

    it('should not register user without confirmPassword', async () => {
      const invalidPayload = {
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: invalidPayload
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /login', () => {
    const user = {
      email: 'login@example.com',
      password: 'password123',
      name: 'Login Test',
    };

    beforeEach(async () => {
      await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: user
      });
    });

    it('should fail with incorrect password', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: user.email,
          password: 'wrongpassword'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /refresh', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'refresh@example.com',
          password: 'password123',
          confirmPassword: 'password123',
          name: 'Refresh Test',
        }
      });

      const tokens = JSON.parse(response.payload);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    });

    it('should refresh tokens successfully', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/refresh',
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          refreshToken
        }
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('accessToken');
      expect(JSON.parse(response.payload)).toHaveProperty('refreshToken');
    });

    it('should fail with invalid refresh token', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/refresh',
        headers: {
          authorization: 'Bearer invalid-token'
        },
        payload: {
          refreshToken: 'invalid-token'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'logout@example.com',
          password: 'password123',
          name: 'Logout Test',
          confirmPassword: 'password123'
        }
      });

      const tokens = JSON.parse(response.payload);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/logout',
        headers: {
          authorization: `Bearer ${accessToken}`
        },
        payload: {
          refreshToken
        }
      });

      expect(response.statusCode).toBe(200);
    });

    it('should fail with invalid token', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/logout',
        headers: {
          authorization: 'Bearer invalid-token'
        },
        payload: {
          refreshToken: 'invalid-token'
        }
      });

      expect(response.statusCode).toBe(401);
    });
  });
});