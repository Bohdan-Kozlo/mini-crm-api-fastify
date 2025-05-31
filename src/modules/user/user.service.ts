import { FastifyInstance } from "fastify";
import { UserUpdateInput } from "./user.schema";

export async function findUserByEmail(email: string, server: FastifyInstance) {
  const user = await server.prisma.user.findUnique({
    where: { email }
  });
  
  return user;
}

export async function getAllUsers(server: FastifyInstance) {
  const users = await server.prisma.user.findMany();
  return users;
}

export async function getUserById(id: string, server: FastifyInstance) {
  const user = await server.prisma.user.findUnique({
    where: { id }
  });
  return user;
}

export async function updateUser(id: string, input: UserUpdateInput, server: FastifyInstance) {
  const user = await server.prisma.user.update({
    where: { id },
    data: input,
  });
  return user;
}

export async function deleteUser(id: string, server: FastifyInstance) {
  await server.prisma.user.delete({
    where: { id }
  });
}