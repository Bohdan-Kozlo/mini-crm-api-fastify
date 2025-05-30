import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientCreateInput, ClientUpdateInput, ClientDeleteInput } from './client.schema';
import { clientCreate, clientUpdate, clientDelete, clientGetByUserId, clientSearch } from './client.service';

export async function createClientHandler(
  request: FastifyRequest<{ Body: ClientCreateInput }>,
  reply: FastifyReply,
) {
  try {
    const client = await clientCreate(request.body, request.user.id, request.server);
    return reply.code(201).send(client);
  } catch (error) {
    request.log.error(error, 'Error creating client');
    return reply.code(400).send({ message: 'Error creating client' });
  }
}

export async function updateClientHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: ClientUpdateInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const client = await clientUpdate(
      { ...request.body, id: request.params.id },
      request.user.id,
      request.server,
    );
    return reply.code(200).send(client);
  } catch (error: unknown) {
    request.log.error(error, 'Error updating client');
    if (error instanceof Error && error.message === 'Client not found or access denied') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error updating client' });
  }
}

export async function deleteClientHandler(
  request: FastifyRequest<{ Params: ClientDeleteInput }>,
  reply: FastifyReply,
) {
  try {
    await clientDelete(request.params, request.user.id ,request.server);
    return reply.code(204).send();
  } catch (error: unknown) {
    request.log.error(error, 'Error deleting client');
    if (error instanceof Error && error.message === 'Client not found or access denied') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error deleting client' });
  }
}

export async function getClientsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;
    const clients = await clientGetByUserId(userId, request.server);
    return reply.code(200).send(clients);
  } catch (error) {
    request.log.error(error, 'Error getting clients');
    return reply.code(400).send({ message: 'Error getting clients' });
  }
}

export async function searchClientsHandler(
  request: FastifyRequest<{ Querystring: { query: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;
    const clients = await clientSearch(request.query.query, userId, request.server);
    return reply.code(200).send(clients);
  } catch (error) {
    request.log.error(error, 'Error searching clients');
    return reply.code(400).send({ message: 'Error searching clients' });
  }
}