import { Role } from "@prisma/client";
import { LoginUserInput, RegisterUserInput } from "./auth.schema";
import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";

async function login(loginInput: LoginUserInput, server: FastifyInstance) {
    const { email, password } = loginInput;
    
    const user = await server.prisma.user.findUnique({
        where: { email }
    });
    
    if (!user) {
        throw server.httpErrors.unauthorized("Invalid email or password");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw server.httpErrors.unauthorized("Invalid email or password");
    }
    
    const tokens = await generateTokens(user.id, user.role, server);
    
    await server.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken }
    });
    
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

async function register(registerUserInput: RegisterUserInput, server: FastifyInstance) {
    const { name, email, password } = registerUserInput;
    
    const existingUser = await server.prisma.user.findUnique({
        where: { email }
    });
    
    if (existingUser) {
        throw server.httpErrors.unauthorized("User with this email already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await server.prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.MANAGER
        }
    });
    
    const tokens = await generateTokens(newUser.id, newUser.role, server);
    
    await server.prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken: tokens.refreshToken }
    });
    
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    };
}

async function refreshTokens(refreshToken: string, server: FastifyInstance) {
    if (!refreshToken) {
        throw server.httpErrors.badRequest("Refresh token is required");
    }
    
    const user = await server.prisma.user.findFirst({
        where: { refreshToken }
    });
    
    if (!user) {
        throw server.httpErrors.unauthorized("Invalid refresh token");
    }
    
    try {
        await server.jwt.verify(refreshToken);
        const decoded = server.jwt.decode<{ id: string, role: Role }>(refreshToken);
        
        if (!decoded || decoded.id !== user.id) {
            throw server.httpErrors.unauthorized("Invalid refresh token");
        }
        
        const tokens = await generateTokens(user.id, user.role, server);
        
        await server.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: tokens.refreshToken }
        });
        
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch {
        throw server.httpErrors.unauthorized("Invalid refresh token");
    }
}

async function logout(refreshToken: string, server: FastifyInstance) {
    if (!refreshToken) {
        throw server.httpErrors.badRequest("Refresh token is required");
    }
    
    try {
        await server.jwt.verify(refreshToken);
        const decoded = server.jwt.decode<{ id: string, role: Role }>(refreshToken);
        console.log(decoded);
        if (!decoded) {
            throw server.httpErrors.unauthorized("Invalid refresh token");
        }
        
        const user = await server.prisma.user.findFirst({
            where: { refreshToken }
        });
        console.log(user);
        if (!user || user.id !== decoded.id) {
            throw server.httpErrors.unauthorized("Invalid refresh token");
        }
        
        await server.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: null }
        });
        
        return { success: true };
    } catch {
        throw server.httpErrors.unauthorized("Invalid refresh token");
    }
}

async function generateTokens(userId: string, userRole: Role, server: FastifyInstance) {
    const accessToken = server.jwt.sign(
        { id: userId, role: userRole },
    );
    
    const refreshToken = server.jwt.sign(
        { id: userId, role: userRole },
        { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
}

export {
    login,
    register,
    refreshTokens,
    logout,
}