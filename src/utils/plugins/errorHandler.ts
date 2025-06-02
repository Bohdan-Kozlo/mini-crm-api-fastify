import { FastifyPluginAsync } from 'fastify';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.statusCode && error.name?.startsWith('HttpError')) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    if (error instanceof Error) {
      return reply.status(400).send({
        statusCode: 400,
        message: error.message,
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  });
};

export default errorHandlerPlugin;
