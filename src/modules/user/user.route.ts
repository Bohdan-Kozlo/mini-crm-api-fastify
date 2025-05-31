import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAllUsersHandler, getUserByIdHandler, updateUserController, deleteUserController } from "./user.controller";
import { paramsSchema, UserUpdateInput, userSchema } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
    server.get(
        '/',
        {
            preValidation: [server.authenticate, server.authorizeAdmin],
            schema: {
                response: {
                    200: userSchema.array()
                }
            }
        },
        getAllUsersHandler
    );

    server.get<{ Params: { id: string } }>(
        '/:id',
        {
            preValidation: [server.authenticate, server.authorizeAdmin],
            schema: {
                params: paramsSchema,
                response: {
                    200: userSchema
                }
            }
        },
        getUserByIdHandler
    );

    server.put<{ Params: { id: string }, Body: UserUpdateInput }>(
        '/:id',
        {
            preValidation: [server.authenticate, server.authorizeAdmin],
            schema: {
                params: paramsSchema,
                body: UserUpdateInput,
                response: {
                    200: userSchema
                }
            }
        },
        updateUserController
    );

    server.delete<{ Params: { id: string } }>(
        '/:id',
        {
            preValidation: [server.authenticate, server.authorizeAdmin],
            schema: {
                params: paramsSchema,
                response: {
                    204: z.void()
                }
            }
        },
        deleteUserController
    );
}

export default userRoutes;