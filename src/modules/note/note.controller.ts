import { FastifyReply, FastifyRequest } from 'fastify';
import { createNote, getNotesByDealId } from './note.service';
import { NoteCreateInput, QuerySchema } from './note.schema';

export async function createNoteHandler(
  request: FastifyRequest<{ Body: NoteCreateInput }>,
  reply: FastifyReply,
) {
  const note = await createNote(request.body, request.server);
  return reply.code(201).send(note);
}

export async function getNotesHandler(
  request: FastifyRequest<{ Querystring: QuerySchema }>,
  reply: FastifyReply,
) {
  const notes = await getNotesByDealId(request.query.dealId, request.server);
  return reply.code(200).send(notes);
}
