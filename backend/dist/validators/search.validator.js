"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordClickSchema = exports.searchQuerySchema = exports.searchSchema = void 0;
const zod_1 = require("zod");
exports.searchSchema = zod_1.z.object({
    body: zod_1.z.object({
        query: zod_1.z.string().min(1).max(200),
        limit: zod_1.z.number().int().min(1).max(50).optional().default(10),
        sessionId: zod_1.z.string().optional(),
    }),
});
exports.searchQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        q: zod_1.z.string().min(1).max(200),
        limit: zod_1.z.string().transform(Number).optional(),
    }),
});
exports.recordClickSchema = zod_1.z.object({
    body: zod_1.z.object({
        historyId: zod_1.z.string().uuid(),
        clickedId: zod_1.z.string(),
        clickedType: zod_1.z.string().max(50),
    }),
});
//# sourceMappingURL=search.validator.js.map