import { z } from 'zod';
import { userSchema } from '../user/user.schema';

export const clientCreateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(3, {
      message: 'Name must be at least 3 characters',
    }),
    industry: z.string({
      required_error: 'Industry is required',
    }).min(3, {
      message: 'Industry must be at least 3 characters',
    }),
  }),
});

export const clientUpdateSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(3, {
      message: 'Name must be at least 3 characters',
    }),
    industry: z.string({
      required_error: 'Industry is required',
    }).min(3, {
      message: 'Industry must be at least 3 characters',
    }),
  }).partial(),
});

export const clientResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  ownerId: z.string(),
  owner: userSchema,
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export const clientsResponseSchema = z.array(clientResponseSchema);

export type ClientCreateInput = z.infer<typeof clientCreateSchema>['body'];
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>['body'];
export type ClientDeleteInput = { id: string };
export type ClientResponse = z.infer<typeof clientResponseSchema>;

