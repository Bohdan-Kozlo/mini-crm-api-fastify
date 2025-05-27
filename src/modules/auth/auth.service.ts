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
        throw new Error("Invalid email or password");
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
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
        throw new Error("User with this email already exists");
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
        throw new Error("Refresh token is required");
    }
    
    const user = await server.prisma.user.findFirst({
        where: { refreshToken }
    });
    
    if (!user) {
        throw new Error("Invalid refresh token");
    }
    
    try {
        const decoded = server.jwt.verify<{ id: string, role: Role }>(refreshToken);
        
        if (decoded.id !== user.id) {
            throw new Error("Invalid refresh token");
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
        throw new Error("Invalid refresh token");
    }
}

async function logout(refreshToken: string, server: FastifyInstance) {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }
    
    const user = await server.prisma.user.findFirst({
        where: { refreshToken }
    });
    
    if (!user) {
        return { success: true };
    }
    
    await server.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null }
    });
    
    return { success: true };
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