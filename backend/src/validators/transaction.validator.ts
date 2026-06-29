import { z } from 'zod';

export const initiateTransactionSchema = z.object({
  body: z.object({
    accountId: z.string().uuid(),
    beneficiaryId: z.string().uuid().optional(),
    amount: z.number().positive().multipleOf(0.01),
    mode: z.enum(['UPI', 'NEFT', 'RTGS', 'IMPS', 'CARD', 'WALLET', 'INTERNAL']),
    description: z.string().max(500).optional(),
    remarks: z.string().max(500).optional(),
    senderUpi: z.string().max(100).optional(),
    receiverUpi: z.string().max(100).optional(),
    cardId: z.string().uuid().optional(),
    mpin: z.string().length(6).optional(),
  }),
});

export const getTransactionsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).optional(),
    pageSize: z.string().transform(Number).optional(),
    accountId: z.string().uuid().optional(),
    type: z.enum(['CREDIT', 'DEBIT']).optional(),
    mode: z.string().optional(),
    status: z.string().optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minAmount: z.string().transform(Number).optional(),
    maxAmount: z.string().transform(Number).optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
