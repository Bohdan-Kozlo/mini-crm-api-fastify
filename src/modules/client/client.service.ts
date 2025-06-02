import { FastifyInstance } from 'fastify';
import { ClientCreateInput, ClientUpdateInput, ClientDeleteInput } from './client.schema';

export async function clientCreate(input: ClientCreateInput, userId: string, server: FastifyInstance) {
  const client = await server.prisma.client.create({
    data: {
      ...input,
      ownerId: userId,
    },
    include: {
      owner: true,
    },
  });

  return client;
}

export async function clientUpdate(
  input: ClientUpdateInput & { id: string },
  userId: string,
  server: FastifyInstance
) {
  const existingClient = await server.prisma.client.findFirst({
    where: {
      id: input.id,
      ownerId: userId,
    },
  });

  if (!existingClient) {
    throw server.httpErrors.notFound('Client not found or access denied');
  }

  const client = await server.prisma.client.update({
    where: {
      id: input.id,
    },
    data: {
      name: input.name,
      industry: input.industry,
    },
    include: {
      owner: true,
    },
  });

  return client;
}

export async function clientDelete(input: ClientDeleteInput, userId: string ,server: FastifyInstance) {
  const existingClient = await server.prisma.client.findFirst({
    where: {
      id: input.id,
      ownerId: userId,
    },
  });

  if (!existingClient) {
    throw server.httpErrors.notFound('Client not found or access denied');
  }

  await server.prisma.client.delete({
    where: {
      id: input.id,
    },
  });
}

export async function clientGetByUserId(userId: string, server: FastifyInstance) {
  const clients = await server.prisma.client.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      owner: true,
    },
  });

  return clients;
}

export async function clientSearch(
  query: string,
  userId: string,
  server: FastifyInstance,
) {
  const clients = await server.prisma.client.findMany({
    where: {
      ownerId: userId,
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          industry: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    include: {
      owner: true,
    },
  });

  return clients;
}