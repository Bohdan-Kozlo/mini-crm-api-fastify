import { PrismaClient } from '@prisma/client';
import { buildServer } from '../src/server';
import { FastifyInstance } from 'fastify';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
  // eslint-disable-next-line no-var
  var server: FastifyInstance;
}

beforeAll(async () => {
  global.prisma = new PrismaClient();
  global.server = await buildServer();
});

beforeEach(async () => {
  await global.prisma.user.deleteMany();
});

afterAll(async () => {
  await global.prisma.$disconnect();
  await global.server.close();
});