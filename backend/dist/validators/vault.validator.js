"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentIdSchema = exports.folderIdSchema = exports.documentSearchSchema = exports.uploadDocumentSchema = exports.createFolderSchema = void 0;
const zod_1 = require("zod");
exports.createFolderSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(200),
        parentId: zod_1.z.string().uuid().optional().nullable(),
        description: zod_1.z.string().max(500).optional(),
        color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
        icon: zod_1.z.string().max(50).optional(),
    }),
});
exports.uploadDocumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        folderId: zod_1.z.string().uuid().optional(),
        name: zod_1.z.string().min(1).max(300),
        description: zod_1.z.string().max(1000).optional(),
        category: zod_1.z.enum([
            'STATEMENT', 'LOAN_DOCUMENT', 'FD_CERTIFICATE', 'INSURANCE_POLICY',
            'TAX_DOCUMENT', 'RECEIPT', 'INVOICE', 'WARRANTY', 'GST_BILL',
            'KYC_DOCUMENT', 'CHEQUE', 'MANDATE', 'OTHER',
        ]),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
exports.documentSearchSchema = zod_1.z.object({
    query: zod_1.z.object({
        q: zod_1.z.string().min(1).max(200),
        category: zod_1.z.string().optional(),
        folderId: zod_1.z.string().uuid().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        page: zod_1.z.string().transform(Number).optional(),
        pageSize: zod_1.z.string().transform(Number).optional(),
    }),
});
exports.folderIdSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.documentIdSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
//# sourceMappingURL=vault.validator.js.map