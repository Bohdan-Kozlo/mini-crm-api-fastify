import { FastifyInstance } from 'fastify';
import {
  createDealHandler,
  deleteDealHandler,
  getDealsHandler,
  searchDealsHandler,
  updateDealHandler,
} from './deal.controller';
import {
  dealCreateSchema,
  dealUpdateSchema,
  dealResponseSchema,
  dealsResponseSchema,
  DealCreateInput,
  DealUpdateInput,
  paramsSchema
} from './deal.schema';

async function dealRoutes(server: FastifyInstance) {
  server.post<{ Body: DealCreateInput }>(
    '/',
    {
      schema: {
        body: dealCreateSchema,
        response: {
          201: dealResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    createDealHandler,
  );

  server.get(
    '/',
    {
      schema: {
        response: {
          200: dealsResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    getDealsHandler,
  );

  server.get<{ Querystring: { query: string } }>(
    '/search',
    {
      schema: {
        querystring: paramsSchema,
        response: {
          200: dealsResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    searchDealsHandler,
  );

  server.put<
    {
      Params: { id: string };
      Body: DealUpdateInput;
    }
  >(
    '/:id',
    {
      schema: {
        body: dealUpdateSchema,
        params: paramsSchema,
      },
      preHandler: [server.authenticate],
    },
    updateDealHandler,
  );

  server.delete<{ Params: { id: string } }>(
    '/:id',
    {
      schema: {
        params: paramsSchema,
      },
      preHandler: [server.authenticate],
    },
    deleteDealHandler,
  );
}

export default dealRoutes;