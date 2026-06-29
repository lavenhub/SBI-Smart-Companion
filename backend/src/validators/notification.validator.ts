import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    isRead: z.enum(['true', 'false']).optional(),
    type: z.string().optional(),
    page: z.string().transform(Number).optional(),
    pageSize: z.string().transform(Number).optional(),
  }),
});

export const markReadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const markAllReadSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).optional(),
  }),
});
