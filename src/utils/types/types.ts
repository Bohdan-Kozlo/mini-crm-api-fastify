import { PrismaClient } from '@prisma/client';
import { JWT } from '@fastify/jwt'


declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    jwt: JWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { id: string; role: string };
  }
}