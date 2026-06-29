import { z } from 'zod';

export const createFolderSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    parentId: z.string().uuid().optional().nullable(),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    icon: z.string().max(50).optional(),
  }),
});

export const uploadDocumentSchema = z.object({
  body: z.object({
    folderId: z.string().uuid().optional(),
    name: z.string().min(1).max(300),
    description: z.string().max(1000).optional(),
    category: z.enum([
      'STATEMENT', 'LOAN_DOCUMENT', 'FD_CERTIFICATE', 'INSURANCE_POLICY',
      'TAX_DOCUMENT', 'RECEIPT', 'INVOICE', 'WARRANTY', 'GST_BILL',
      'KYC_DOCUMENT', 'CHEQUE', 'MANDATE', 'OTHER',
    ]),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const documentSearchSchema = z.object({
  query: z.object({
    q: z.string().min(1).max(200),
    category: z.string().optional(),
    folderId: z.string().uuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.string().transform(Number).optional(),
    pageSize: z.string().transform(Number).optional(),
  }),
});

export const folderIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const documentIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
