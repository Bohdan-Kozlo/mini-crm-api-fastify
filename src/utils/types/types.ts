import { PrismaClient } from '@prisma/client';
import { JWT } from '@fastify/jwt'


declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {
    jwt: JWT
  }
}
