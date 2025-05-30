import { z } from 'zod';

export const dealCreateSchema = z.object({
  title: z.string().min(3).max(255),
  value: z.number().positive(),
  clientId: z.string().uuid().optional(),
});

export const dealUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  value: z.number().positive().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'WON', 'LOST']).optional(),
  clientId: z.string().uuid().optional(),
});

export const dealResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  value: z.number(),
  status: z.enum(['OPEN', 'CLOSED', 'WON', 'LOST']),
  clientId: z.string().uuid().nullable(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const dealsResponseSchema = z.array(dealResponseSchema);

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

export type DealCreateInput = z.infer<typeof dealCreateSchema>;
export type DealUpdateInput = z.infer<typeof dealUpdateSchema>;
export type DealDeleteInput = z.infer<typeof paramsSchema>;