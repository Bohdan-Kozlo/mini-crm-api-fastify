import { z } from "zod";
import { dealResponseSchema } from "../deals/deal.schema";

export const noteCreateSchema = z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(3).max(255),
    dealId: z.string().uuid(),
});


export const noteResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    content: z.string(),
    createdAt: z.date(),
    deal: z.object({
        dealResponseSchema
    })
});

export const querySchema = z.object({
    dealId: z.string().uuid(),
});

export const paramsSchema = z.object({
    id: z.string().uuid(),
});

export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteResponse = z.infer<typeof noteResponseSchema>;
export type QuerySchema = z.infer<typeof querySchema>;
export type ParamsSchema = z.infer<typeof paramsSchema>;