"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllReadSchema = exports.markReadSchema = exports.getNotificationsSchema = void 0;
const zod_1 = require("zod");
exports.getNotificationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        isRead: zod_1.z.enum(['true', 'false']).optional(),
        type: zod_1.z.string().optional(),
        page: zod_1.z.string().transform(Number).optional(),
        pageSize: zod_1.z.string().transform(Number).optional(),
    }),
});
exports.markReadSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().uuid() }),
});
exports.markAllReadSchema = zod_1.z.object({
    body: zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string().uuid()).optional(),
    }),
});
//# sourceMappingURL=notification.validator.js.map