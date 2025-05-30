import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

const testUserPayload = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('Client Module E2E Tests', () => {
  let server: FastifyInstance;
  let token: string;
  let userId: string;
  let prisma: PrismaClient;

  beforeAll(() => {
    server = global.server;
    prisma = global.prisma;
  });

  beforeEach(async () => {
    await server.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: testUserPayload,
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: testUserPayload.email,
        password: testUserPayload.password,
      },
    });
    const loginBody = loginResponse.json();
    userId = loginBody.user.id;
    token = loginBody.accessToken;
  });

  afterEach(async () => {
    await prisma.client.deleteMany({ where: { ownerId: userId } });
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.deleteMany({ where: { id: userId } });
    }
  });

  describe('POST /api/clients', () => {
    it('should create a new client successfully', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/clients',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: 'New Client',
          industry: 'Technology',
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toHaveProperty('id');
      expect(response.json().name).toBe('New Client');
    });

    it('should not create a client without authentication', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/clients',
        payload: {
          name: 'Unauthorized Client',
          industry: 'Finance',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should not create a client with invalid data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/clients',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: 'A',
          industry: 'B',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toContain('body/name Name must be at least 3 characters, body/industry Industry must be at least 3 characters');
    });
  });

  describe('GET /api/clients', () => {
    it('should return an empty array if no clients exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/clients',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(0);
    });

    it('should not get clients without authentication', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/clients',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/clients/search', () => {
    it('should return clients matching the search query', async () => {
      await prisma.client.createMany({
        data: [
          { name: 'Apple Inc.', industry: 'Technology', ownerId: userId },
          { name: 'Microsoft Corp.', industry: 'Technology', ownerId: userId },
          { name: 'Google LLC', industry: 'Internet', ownerId: userId },
        ],
      });

      const response = await server.inject({
        method: 'GET',
        url: '/api/clients/search?query=Apple',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(1);
      expect(response.json()[0].name).toBe('Apple Inc.');
    });

    it('should return empty array if no clients match', async () => {
      await prisma.client.createMany({
        data: [
          { name: 'Apple Inc.', industry: 'Technology', ownerId: userId },
          { name: 'Microsoft Corp.', industry: 'Technology', ownerId: userId },
        ],
      });

      const response = await server.inject({
        method: 'GET',
        url: '/api/clients/search?query=NonExistent',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toHaveLength(0);
    });

    it('should not search clients without authentication', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/clients/search?query=Apple',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/clients/:id', () => {
    it('should return 404 if client not found', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/clients/${randomUUID()}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should not get a client by ID without authentication', async () => {
      const client = await prisma.client.create({
        data: { name: 'Auth Client', industry: 'Auth Industry', ownerId: userId },
      });

      const response = await server.inject({
        method: 'GET',
        url: `/api/clients/${client.id}`,
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should update a client successfully', async () => {
      const client = await prisma.client.create({
        data: { name: 'Old Name', industry: 'Old Industry', ownerId: userId },
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/api/clients/${client.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: 'Updated Name',
          industry: 'Updated Industry',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().name).toBe('Updated Name');
    });

    it('should not update a client without authentication', async () => {
      const client = await prisma.client.create({
        data: { name: 'Auth Update', industry: 'Auth Update', ownerId: userId },
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/api/clients/${client.id}`,
        payload: {
          name: 'Unauthorized Update',
          industry: 'Unauthorized Industry',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 if client to update not found', async () => {
      const response = await server.inject({
        method: 'PUT',
        url: `/api/clients/${randomUUID()}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: 'Non Existent',
          industry: 'Non Existent',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should not update a client with invalid data', async () => {
      const client = await prisma.client.create({
        data: { name: 'Valid Client', industry: 'Valid Industry', ownerId: userId },
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/api/clients/${client.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: 'A',
          industry: 'B',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json().message).toContain('body/name Name must be at least 3 characters, body/industry Industry must be at least 3 characters');
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete a client successfully', async () => {
      const client = await prisma.client.create({
        data: { name: 'Client to Delete', industry: 'Delete Industry', ownerId: userId },
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/api/clients/${client.id}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(204);

      const checkClient = await prisma.client.findUnique({ where: { id: client.id } });
      expect(checkClient).toBeNull();
    });

    it('should not delete a client without authentication', async () => {
      const client = await prisma.client.create({
        data: { name: 'Auth Delete', industry: 'Auth Delete', ownerId: userId },
      });

      const response = await server.inject({
        method: 'DELETE',
        url: `/api/clients/${client.id}`,
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 if client to delete not found', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/clients/${randomUUID()}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});