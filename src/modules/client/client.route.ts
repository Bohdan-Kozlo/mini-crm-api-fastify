import { FastifyInstance } from 'fastify';
import {
  createClientHandler,
  deleteClientHandler,
  getClientsHandler,
  searchClientsHandler,
  updateClientHandler,
} from './client.controller';
import {
  clientCreateSchema,
  clientUpdateSchema,
  clientResponseSchema,
  clientsResponseSchema,
  ClientCreateInput,
  ClientUpdateInput,
  querySchema,
  paramsSchema
} from './client.schema';

async function clientRoutes(server: FastifyInstance) {
  server.post<{
    Body: ClientCreateInput;
  }>(
    '/',
    {
      schema: {
        body: clientCreateSchema.shape.body,
        response: {
          201: clientResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    createClientHandler,
  );

  server.get(
    '/',
    {
      schema: {
        response: {
          200: clientsResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    getClientsHandler,
  );

  server.get<{
    Querystring: { query: string };
  }>(
    '/search',
    {
      schema: {
        querystring: querySchema,
        response: {
          200: clientsResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    searchClientsHandler,
  );

  server.put<{
    Params: { id: string };
    Body: ClientUpdateInput;
  }>(
    '/:id',
    {
      schema: {
        body: clientUpdateSchema.shape.body,
        params: paramsSchema,
      },
      preHandler: [server.authenticate],
    },
    updateClientHandler,
  );

  server.delete<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        params: paramsSchema,
      },
      preHandler: [server.authenticate],
    },
    deleteClientHandler,
  );
}

export default clientRoutes;