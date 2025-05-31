import { FastifyReply, FastifyRequest } from 'fastify';
import { createNote, getNotesByDealId } from './note.service';
import { NoteCreateInput, QuerySchema } from './note.schema';

export async function createNoteHandler(
  request: FastifyRequest<{ Body: NoteCreateInput }>,
  reply: FastifyReply,
) {
  try {
    const note = await createNote(request.body, request.server);
    return reply.code(201).send(note);
  } catch (error: unknown) {
    request.log.error(error, 'Error creating note');
    if (error instanceof Error && error.message === 'Deal not found') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error creating note' });
  }
}

export async function getNotesHandler(
  request: FastifyRequest<{ Querystring: QuerySchema }>,
  reply: FastifyReply,
) {
  try {
    const notes = await getNotesByDealId(request.query.dealId, request.server);
    return reply.code(200).send(notes);
  } catch (error: unknown) {
    request.log.error(error, 'Error getting notes');
    if (error instanceof Error && error.message === 'Deal not found') {
      return reply.code(404).send({ message: error.message });
    }
    return reply.code(400).send({ message: 'Error getting notes' });
  }
}
