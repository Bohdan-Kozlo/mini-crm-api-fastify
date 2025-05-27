import { FastifyInstance } from "fastify";
import { registerUserSchema, loginUserSchema, refreshTokenSchema, authResponseSchema } from "./auth.schema";
import { loginHandler, logoutHandler, refreshTokenHandler, registerHandler } from "./auth.controller";

async function authRoutes(server: FastifyInstance) {

    server.post(
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

    server.post(
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

    server.post(
        "/refresh",
        {
            schema: {
                body: refreshTokenSchema.shape.body,
                response: {
                    200: authResponseSchema
                }
            }
        },
        refreshTokenHandler
    );

    server.post(
        "/logout",
        {
            schema: {
                body: refreshTokenSchema.shape.body,
                response: {
                    200: {
                        type: "object",
                        properties: {
                            success: { type: "boolean" }
                        }
                    }
                }
            }
        },
        logoutHandler
    );
}

export default authRoutes;