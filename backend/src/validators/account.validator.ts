import { z } from 'zod';

export const accountIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const getStatementSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  query: z.object({
    startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
    endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
    format: z.enum(['json', 'pdf']).optional().default('json'),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    fromAccountId: z.string().uuid(),
    toAccountId: z.string().uuid().optional(),
    beneficiaryId: z.string().uuid().optional(),
    amount: z.number().positive(),
    mode: z.enum(['UPI', 'NEFT', 'RTGS', 'IMPS', 'INTERNAL']),
    remarks: z.string().max(200).optional(),
    scheduledAt: z.string().optional(),
  }),
});

export const createBeneficiarySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    nickname: z.string().max(100).optional(),
    bankName: z.string().max(200).optional(),
    accountNumber: z.string().max(20).optional(),
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
      .optional(),
    upiId: z.string().max(100).optional(),
    phone: z.string().regex(/^\d{10}$/).optional(),
  }).refine(
    (d) => d.accountNumber || d.upiId || d.phone,
    'At least one of accountNumber, upiId, or phone is required',
  ),
});
