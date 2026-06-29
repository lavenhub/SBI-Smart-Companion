import { z } from 'zod';

export const searchSchema = z.object({
  body: z.object({
    query: z.string().min(1).max(200),
    limit: z.number().int().min(1).max(50).optional().default(10),
    sessionId: z.string().optional(),
  }),
});

export const searchQuerySchema = z.object({
  query: z.object({
    q: z.string().min(1).max(200),
    limit: z.string().transform(Number).optional(),
  }),
});

export const recordClickSchema = z.object({
  body: z.object({
    historyId: z.string().uuid(),
    clickedId: z.string(),
    clickedType: z.string().max(50),
  }),
});
