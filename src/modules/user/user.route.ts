import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function userRoutes(server: FastifyInstance) {
    server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send({ message: 'Hello World' });
    })
}

export default userRoutes;