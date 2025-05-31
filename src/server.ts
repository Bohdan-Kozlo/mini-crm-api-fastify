import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import userRoutes from './modules/user/user.route'
import prismaPlugin from './utils/plugins/prisma'
import authRoutes from './modules/auth/auth.route'
import { loggerConfig } from './utils/logger'
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'
import fastifyJwt from '@fastify/jwt'
import clientRoutes from './modules/client/client.route'
import dealRoutes from './modules/deals/deal.route'
import noteRoutes from './modules/note/note.route'
import { Role } from '@prisma/client'


export async function buildServer() {
    const server = Fastify({ logger: loggerConfig }).withTypeProvider();

    await server.register(prismaPlugin)
    server.register(fastifyJwt, { secret: 'secret' })
    
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
            return
        } catch (err) {
            return reply.code(401).send(err)
        }
    })

    server.decorate('authorizeAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            if (request.user.role !== Role.ADMIN) {
                return reply.code(403).send({ message: 'Forbidden: Only admins can access this resource' });
            }
        } catch (err) {
            return reply.code(403).send(err);
        }
    });

    server.register(userRoutes, { prefix: 'api/users' })
    server.register(authRoutes, { prefix: 'api/auth' })
    server.register(clientRoutes, { prefix: 'api/clients' })
    server.register(dealRoutes, { prefix: 'api/deals' })
    server.register(noteRoutes, { prefix: 'api' })

    server.get(
        '/healthcheck',
        function (request: FastifyRequest, reply: FastifyReply) {
            reply.send({ status: 'OK' })
        }
    )

    return server;
}
