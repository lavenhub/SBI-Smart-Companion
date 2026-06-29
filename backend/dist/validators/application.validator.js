"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsSchema = exports.applicationIdSchema = exports.submitApplicationSchema = exports.saveDraftSchema = exports.startApplicationSchema = void 0;
const zod_1 = require("zod");
exports.startApplicationSchema = zod_1.z.object({
    body: zod_1.z.object({
        applicationType: zod_1.z.enum([
            'LOAN', 'CREDIT_CARD', 'FIXED_DEPOSIT', 'INSURANCE',
            'NOMINEE_UPDATE', 'ADDRESS_UPDATE', 'KYC_UPDATE',
            'CHEQUE_BOOK', 'ACCOUNT_OPENING',
        ]),
        title: zod_1.z.string().min(1).max(200).optional(),
    }),
});
exports.saveDraftSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
    body: zod_1.z.object({
        stepIndex: zod_1.z.number().int().min(0),
        fieldData: zod_1.z.record(zod_1.z.unknown()),
    }),
});
exports.submitApplicationSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.applicationIdSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.getApplicationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.string().optional(),
        applicationType: zod_1.z.string().optional(),
        page: zod_1.z.string().transform(Number).optional(),
        pageSize: zod_1.z.string().transform(Number).optional(),
    }),
});
//# sourceMappingURL=application.validator.js.map