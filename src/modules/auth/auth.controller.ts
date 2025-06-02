import { FastifyReply, FastifyRequest } from "fastify";
import { login, logout, refreshTokens, register } from "./auth.service";
import { LoginUserInput, RefreshTokenInput, RegisterUserInput } from "./auth.schema";

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterUserInput }>,
  reply: FastifyReply
) {
  const result = await register(request.body, request.server);
  return reply.code(201).send(result);
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply
) {
  const result = await login(request.body, request.server);
  return reply.send(result);
}

export async function refreshTokenHandler(
  request: FastifyRequest<{ Body: RefreshTokenInput }>,
  reply: FastifyReply
) {
  const { refreshToken } = request.body;
  const result = await refreshTokens(refreshToken, request.server);
  return reply.send(result);
}

export async function logoutHandler(
  request: FastifyRequest<{ Body: RefreshTokenInput }>,
  reply: FastifyReply
) {
  const { refreshToken } = request.body;
  const result = await logout(refreshToken, request.server);
  return reply.send(result);
}