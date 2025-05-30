import { FastifyReply, FastifyRequest } from 'fastify';
import { DealCreateInput, DealUpdateInput, DealDeleteInput } from './deal.schema';
import { dealCreate, dealUpdate, dealDelete, dealGetByUserId, dealSearch } from './deal.service';

export async function createDealHandler(
  request: FastifyRequest<{ Body: DealCreateInput }>,
  reply: FastifyReply,
) {
  try {
    const deal = await dealCreate(request.body, request.user.id, request.server);
    return reply.code(201).send(deal);
  } catch (error) {
    request.log.error(error, 'Error creating deal');
    return reply.code(400).send({ message: 'Error creating deal' });
  }
}

export async function updateDealHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: DealUpdateInput;
  }>,
  reply: FastifyReply,
) {
  try {
    const deal = await dealUpdate(
      { ...request.body, id: request.params.id },
      request.user.id,
      request.server,
    );
    return reply.code(200).send(deal);
  } catch (error: unknown) {
    request.log.error(error, 'Error updating deal');
    if (error instanceof Error && error.message === 'Deal not found or access denied') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error updating deal' });
  }
}

export async function deleteDealHandler(
  request: FastifyRequest<{ Params: DealDeleteInput }>,
  reply: FastifyReply,
) {
  try {
    await dealDelete(request.params, request.user.id ,request.server);
    return reply.code(204).send();
  } catch (error: unknown) {
    request.log.error(error, 'Error deleting deal');
    if (error instanceof Error && error.message === 'Deal not found or access denied') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error deleting deal' });
  }
}

export async function getDealsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;
    const deals = await dealGetByUserId(userId, request.server);
    return reply.code(200).send(deals);
  } catch (error) {
    request.log.error(error, 'Error getting deals');
    return reply.code(400).send({ message: 'Error getting deals' });
  }
}

export async function searchDealsHandler(
  request: FastifyRequest<{ Querystring: { query: string } }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user.id;
    const deals = await dealSearch(request.query.query, userId, request.server);
    return reply.code(200).send(deals);
  } catch (error) {
    request.log.error(error, 'Error searching deals');
    return reply.code(400).send({ message: 'Error searching deals' });
  }
}