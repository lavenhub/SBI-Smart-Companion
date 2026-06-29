"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionIdSchema = exports.getTransactionsSchema = exports.initiateTransactionSchema = void 0;
const zod_1 = require("zod");
exports.initiateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        accountId: zod_1.z.string().uuid(),
        beneficiaryId: zod_1.z.string().uuid().optional(),
        amount: zod_1.z.number().positive().multipleOf(0.01),
        mode: zod_1.z.enum(['UPI', 'NEFT', 'RTGS', 'IMPS', 'CARD', 'WALLET', 'INTERNAL']),
        description: zod_1.z.string().max(500).optional(),
        remarks: zod_1.z.string().max(500).optional(),
        senderUpi: zod_1.z.string().max(100).optional(),
        receiverUpi: zod_1.z.string().max(100).optional(),
        cardId: zod_1.z.string().uuid().optional(),
        mpin: zod_1.z.string().length(6).optional(),
    }),
});
exports.getTransactionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().transform(Number).optional(),
        pageSize: zod_1.z.string().transform(Number).optional(),
        accountId: zod_1.z.string().uuid().optional(),
        type: zod_1.z.enum(['CREDIT', 'DEBIT']).optional(),
        mode: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        minAmount: zod_1.z.string().transform(Number).optional(),
        maxAmount: zod_1.z.string().transform(Number).optional(),
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    }),
});
exports.transactionIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
//# sourceMappingURL=transaction.validator.js.map