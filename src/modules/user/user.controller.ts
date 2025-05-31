import { FastifyReply, FastifyRequest } from "fastify";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./user.service";
import { UserUpdateInput, ParamsInput } from "./user.schema";
import { Role } from "@prisma/client";

export async function getAllUsersHandler(request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role !== Role.ADMIN) {
    return reply.code(403).send({ message: "Forbidden: Only admins can access this resource" });
  }
  try {
    const users = await getAllUsers(request.server);
    return reply.send(users);
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function getUserByIdHandler(request: FastifyRequest<{ Params: ParamsInput }>, reply: FastifyReply) {
  if (request.user.role !== Role.ADMIN) {
    return reply.code(403).send({ message: "Forbidden: Only admins can access this resource" });
  }
  try {
    const { id } = request.params;
    const user = await getUserById(id, request.server);
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    return reply.send(user);
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function updateUserController(request: FastifyRequest<{ Params: ParamsInput, Body: UserUpdateInput }>, reply: FastifyReply) {
  if (request.user.role !== Role.ADMIN) {
    return reply.code(403).send({ message: "Forbidden: Only admins can access this resource" });
  }
  try {
    const { id } = request.params;
    const user = await updateUser(id, request.body, request.server);
    return reply.send(user);
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}

export async function deleteUserController(request: FastifyRequest<{ Params: ParamsInput }>, reply: FastifyReply) {
  if (request.user.role !== Role.ADMIN) {
    return reply.code(403).send({ message: "Forbidden: Only admins can access this resource" });
  }
  try {
    const { id } = request.params;
    await deleteUser(id, request.server);
    return reply.code(204).send();
  } catch (error) {
    request.server.log.error(error);
    return reply.code(500).send({ message: "Internal Server Error" });
  }
}