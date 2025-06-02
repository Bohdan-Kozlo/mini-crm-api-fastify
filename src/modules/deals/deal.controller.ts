import { FastifyReply, FastifyRequest } from 'fastify';
import { DealCreateInput, DealUpdateInput, DealDeleteInput } from './deal.schema';
import { dealCreate, dealUpdate, dealDelete, dealGetByUserId, dealSearch } from './deal.service';

export async function createDealHandler(
  request: FastifyRequest<{ Body: DealCreateInput }>,
  reply: FastifyReply,
) {
  const deal = await dealCreate(request.body, request.user.id, request.server);
  return reply.code(201).send(deal);
}

export async function updateDealHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: DealUpdateInput;
  }>,
  reply: FastifyReply,
) {
  const deal = await dealUpdate(
    { ...request.body, id: request.params.id },
    request.user.id,
    request.server,
  );
  return reply.code(200).send(deal);
}

export async function deleteDealHandler(
  request: FastifyRequest<{ Params: DealDeleteInput }>,
  reply: FastifyReply,
) {
  await dealDelete(request.params, request.user.id ,request.server);
  return reply.code(204).send();
}

export async function getDealsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const deals = await dealGetByUserId(userId, request.server);
  return reply.code(200).send(deals);
}

export async function searchDealsHandler(
  request: FastifyRequest<{ Querystring: { query: string } }>,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const deals = await dealSearch(request.query.query, userId, request.server);
  return reply.code(200).send(deals);
}

export async function updateDealStatusHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: { status: 'OPEN' | 'CLOSED' | 'WON' | 'LOST' } }>,
  reply: FastifyReply,
) {
  const deal = await dealUpdate(
    { id: request.params.id, status: request.body.status },
    request.user.id,
    request.server,
  );
  return reply.code(200).send(deal);
}