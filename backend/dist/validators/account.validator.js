"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBeneficiarySchema = exports.transferSchema = exports.getStatementSchema = exports.accountIdSchema = void 0;
const zod_1 = require("zod");
exports.accountIdSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.getStatementSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    query: zod_1.z.object({
        startDate: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
        endDate: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date'),
        format: zod_1.z.enum(['json', 'pdf']).optional().default('json'),
    }),
});
exports.transferSchema = zod_1.z.object({
    body: zod_1.z.object({
        fromAccountId: zod_1.z.string().uuid(),
        toAccountId: zod_1.z.string().uuid().optional(),
        beneficiaryId: zod_1.z.string().uuid().optional(),
        amount: zod_1.z.number().positive(),
        mode: zod_1.z.enum(['UPI', 'NEFT', 'RTGS', 'IMPS', 'INTERNAL']),
        remarks: zod_1.z.string().max(200).optional(),
        scheduledAt: zod_1.z.string().optional(),
    }),
});
exports.createBeneficiarySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(200),
        nickname: zod_1.z.string().max(100).optional(),
        bankName: zod_1.z.string().max(200).optional(),
        accountNumber: zod_1.z.string().max(20).optional(),
        ifscCode: zod_1.z
            .string()
            .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
            .optional(),
        upiId: zod_1.z.string().max(100).optional(),
        phone: zod_1.z.string().regex(/^\d{10}$/).optional(),
    }).refine((d) => d.accountNumber || d.upiId || d.phone, 'At least one of accountNumber, upiId, or phone is required'),
});
//# sourceMappingURL=account.validator.js.map