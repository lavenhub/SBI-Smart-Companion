import { z } from 'zod';

export const updatePreferencesSchema = z.object({
  body: z.object({
    layout: z.array(z.unknown()).optional(),
    pinnedWidgets: z.array(z.string()).optional(),
    hiddenWidgets: z.array(z.string()).optional(),
    quickActionIds: z.array(z.string()).optional(),
    colorScheme: z.string().optional(),
    compactMode: z.boolean().optional(),
    showBalanceOnLoad: z.boolean().optional(),
  }),
});

export const trackActivitySchema = z.object({
  body: z.object({
    featureKey: z.string().min(1).max(100),
    label: z.string().min(1).max(200),
    route: z.string().min(1).max(200),
    icon: z.string().max(50).optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const pinActionSchema = z.object({
  body: z.object({
    featureKey: z.string().min(1),
    label: z.string().min(1),
    route: z.string().min(1),
    icon: z.string().min(1),
  }),
});
