import { FastifyInstance } from 'fastify';
import { DealCreateInput, DealUpdateInput, DealDeleteInput } from './deal.schema';
import { Status } from '@prisma/client';

export async function dealCreate(input: DealCreateInput, userId: string, server: FastifyInstance) {
  const deal = await server.prisma.deal.create({
    data: {
      ...input,
      ownerId: userId,
      status: Status.OPEN, // Default status for new deals
    },
    include: {
      client: true,
      owner: true,
    },
  });

  return deal;
}

export async function dealUpdate(
  input: DealUpdateInput & { id: string },
  userId: string,
  server: FastifyInstance
) {
  const existingDeal = await server.prisma.deal.findFirst({
    where: {
      id: input.id,
      ownerId: userId,
    },
  });

  if (!existingDeal) {
    throw new Error('Deal not found or access denied');
  }

  const deal = await server.prisma.deal.update({
    where: {
      id: input.id,
    },
    data: {
      title: input.title,
      value: input.value,
      status: input.status,
      clientId: input.clientId,
    },
    include: {
      client: true,
      owner: true,
    },
  });

  return deal;
}

export async function dealDelete(input: DealDeleteInput, userId: string ,server: FastifyInstance) {
  const existingDeal = await server.prisma.deal.findFirst({
    where: {
      id: input.id,
      ownerId: userId,
    },
  });

  if (!existingDeal) {
    throw new Error('Deal not found or access denied');
  }

  await server.prisma.deal.delete({
    where: {
      id: input.id,
    },
  });
}

export async function dealGetByUserId(userId: string, server: FastifyInstance) {
  const deals = await server.prisma.deal.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      client: true,
      owner: true,
    },
  });

  return deals;
}

export async function dealSearch(
  query: string,
  userId: string,
  server: FastifyInstance,
) {
  const deals = await server.prisma.deal.findMany({
    where: {
      ownerId: userId,
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          client: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      client: true,
      owner: true,
    },
  });

  return deals;
}