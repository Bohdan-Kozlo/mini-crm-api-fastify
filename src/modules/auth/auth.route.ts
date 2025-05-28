import { FastifyInstance } from "fastify";
import { registerUserSchema, loginUserSchema, refreshTokenSchema, authResponseSchema, logoutResponseSchema, RegisterUserInput, LoginUserInput, RefreshTokenInput } from "./auth.schema";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from "./auth.controller";

async function authRoutes(server: FastifyInstance) {

    server.post<{
        Body: RegisterUserInput
    }>(
        "/register",
        {
            schema: {
                body: registerUserSchema.shape.body,
                response: {
                    201: authResponseSchema
                }
            }
        },
        registerHandler
    );

    server.post<{
        Body: LoginUserInput
    }>(
        "/login",
        {
            schema: {
                body: loginUserSchema.shape.body,
                response: {
                    200: authResponseSchema
                }
            }
        },
        loginHandler
    );

    server.post<{
        Body: RefreshTokenInput
    }>(
        "/refresh",
        {
            schema: {
                body: refreshTokenSchema.shape.body,
                response: {
                    200: authResponseSchema
                }
            },
            preValidation: [server.authenticate]
        },
        refreshTokenHandler
    );

    server.post<{
        Body: RefreshTokenInput
    }>(
        "/logout",
        {
            schema: {
                body: refreshTokenSchema.shape.body,
                response: {
                    200: logoutResponseSchema
                }
            },
            preValidation: [server.authenticate]
        },
        logoutHandler
    );
}

export default authRoutes;