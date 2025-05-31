import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["ADMIN", "MANAGER"]),
});

export const UserUpdateInput = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    role: z.enum(["ADMIN", "MANAGER"]).optional(),
});

export const paramsSchema = z.object({
    id: z.string().uuid(),
});

export type UserUpdateInput = z.infer<typeof UserUpdateInput>;
export type ParamsInput = z.infer<typeof paramsSchema>;