import { z } from 'zod';

export const startApplicationSchema = z.object({
  body: z.object({
    applicationType: z.enum([
      'LOAN', 'CREDIT_CARD', 'FIXED_DEPOSIT', 'INSURANCE',
      'NOMINEE_UPDATE', 'ADDRESS_UPDATE', 'KYC_UPDATE',
      'CHEQUE_BOOK', 'ACCOUNT_OPENING',
    ]),
    title: z.string().min(1).max(200).optional(),
  }),
});

export const saveDraftSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    stepIndex: z.number().int().min(0),
    fieldData: z.record(z.unknown()),
  }),
});

export const submitApplicationSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const applicationIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const getApplicationsSchema = z.object({
  query: z.object({
    status: z.string().optional(),
    applicationType: z.string().optional(),
    page: z.string().transform(Number).optional(),
    pageSize: z.string().transform(Number).optional(),
  }),
});
