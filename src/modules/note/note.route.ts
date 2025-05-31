import { FastifyInstance } from "fastify";

import { createNoteHandler, getNotesHandler } from './note.controller';
import { NoteCreateInput, noteCreateSchema, noteResponseSchema, querySchema, QuerySchema } from "./note.schema";


async function noteRoutes(server: FastifyInstance) {
  server.post<{ Body: NoteCreateInput }>(
    '/notes',
    {
      schema: {
        body: noteCreateSchema,
        response: {
          201: noteResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    createNoteHandler,
  );

  server.get<{ Querystring: QuerySchema }>(
    '/notes',
    {
      schema: {
        querystring: querySchema,
        response: {
          200: noteResponseSchema,
        },
      },
      preHandler: [server.authenticate],
    },
    getNotesHandler,
  );
}

export default noteRoutes;