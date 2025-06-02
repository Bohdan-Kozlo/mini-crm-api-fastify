import { FastifyInstance } from "fastify";
import { NoteCreateInput } from "./note.schema";


export async function createNote(input: NoteCreateInput ,server: FastifyInstance) {
    const deal = await server.prisma.deal.findUnique({
        where: {
            id: input.dealId,
        },
    });

    if (!deal) {
        throw server.httpErrors.notFound('Deal not found');
    }

    return await server.prisma.note.create({
        data: {
            title: input.title,
            content: input.content,
            deal: {
                connect: {
                    id: input.dealId,
                },
            },
        },
    });
}

export async  function getNotesByDealId(dealId: string, server: FastifyInstance) {
    const deal = await server.prisma.deal.findUnique({
        where: {
            id: dealId,
        },
    });

    if (!deal) {
        throw server.httpErrors.notFound('Deal not found');
    }

    const notes = await server.prisma.note.findMany({
        where: {
            dealId: dealId,
        },
    });

    if (!notes) {
        throw server.httpErrors.notFound('Notes not found');
    }

    return notes;
}