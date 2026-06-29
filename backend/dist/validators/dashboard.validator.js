"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinActionSchema = exports.trackActivitySchema = exports.updatePreferencesSchema = void 0;
const zod_1 = require("zod");
exports.updatePreferencesSchema = zod_1.z.object({
    body: zod_1.z.object({
        layout: zod_1.z.array(zod_1.z.unknown()).optional(),
        pinnedWidgets: zod_1.z.array(zod_1.z.string()).optional(),
        hiddenWidgets: zod_1.z.array(zod_1.z.string()).optional(),
        quickActionIds: zod_1.z.array(zod_1.z.string()).optional(),
        colorScheme: zod_1.z.string().optional(),
        compactMode: zod_1.z.boolean().optional(),
        showBalanceOnLoad: zod_1.z.boolean().optional(),
    }),
});
exports.trackActivitySchema = zod_1.z.object({
    body: zod_1.z.object({
        featureKey: zod_1.z.string().min(1).max(100),
        label: zod_1.z.string().min(1).max(200),
        route: zod_1.z.string().min(1).max(200),
        icon: zod_1.z.string().max(50).optional(),
        metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
exports.pinActionSchema = zod_1.z.object({
    body: zod_1.z.object({
        featureKey: zod_1.z.string().min(1),
        label: zod_1.z.string().min(1),
        route: zod_1.z.string().min(1),
        icon: zod_1.z.string().min(1),
    }),
});
//# sourceMappingURL=dashboard.validator.js.map