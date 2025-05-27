import { FastifyInstance } from "fastify";

export async function findUserByEmail(email: string, server: FastifyInstance) {
  const user = await server.prisma.user.findUnique({
    where: { email }
  });
  
  return user;
}