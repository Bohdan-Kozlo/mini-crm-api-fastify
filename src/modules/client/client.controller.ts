import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientCreateInput, ClientUpdateInput, ClientDeleteInput } from './client.schema';
import { clientCreate, clientUpdate, clientDelete, clientGetByUserId, clientSearch } from './client.service';

export async function createClientHandler(
  request: FastifyRequest<{ Body: ClientCreateInput }>,
  reply: FastifyReply,
) {
  const client = await clientCreate(request.body, request.user.id, request.server);
  return reply.code(201).send(client);
}

export async function updateClientHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: ClientUpdateInput;
  }>,
  reply: FastifyReply,
) {
  const client = await clientUpdate(
    { ...request.body, id: request.params.id },
    request.user.id,
    request.server,
  );
  return reply.code(200).send(client);
}

export async function deleteClientHandler(
  request: FastifyRequest<{ Params: ClientDeleteInput }>,
  reply: FastifyReply,
) {
  await clientDelete(request.params, request.user.id ,request.server);
  return reply.code(204).send();
}

export async function getClientsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const clients = await clientGetByUserId(userId, request.server);
  return reply.code(200).send(clients);
}

export async function searchClientsHandler(
  request: FastifyRequest<{ Querystring: { query: string } }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const clients = await clientSearch(request.query.query, userId, request.server);
  return reply.code(200).send(clients);
}