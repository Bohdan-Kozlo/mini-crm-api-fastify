import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import userRoutes from './modules/user/user.route'
import prismaPlugin from './utils/plugins/prisma'
import authRoutes from './modules/auth/auth.route'
import { loggerConfig } from './utils/logger'
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'

const server = Fastify({ logger: loggerConfig }).withTypeProvider();

server.get(
    '/healthceck',
    function (request: FastifyRequest, reply: FastifyReply) {
        reply.send({ status: 'OK' })
    }
)

async function main() {
    await server.register(prismaPlugin)
    
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    server.register(userRoutes, { prefix: 'api/users' })
    server.register(authRoutes, { prefix: 'api/auth' })

    try {
        server.listen({ port: 3000 })
        server.log.info('Server is running on port 3000')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

main()
