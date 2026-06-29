"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpSchema = exports.verifyOtpSchema = exports.changeMpinSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().min(2).max(100),
        lastName: zod_1.z.string().min(2).max(100),
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
        password: zod_1.z
            .string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, digit and special character'),
        dateOfBirth: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date').optional(),
        referralCode: zod_1.z.string().optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        identifier: zod_1.z.string().min(3), // email or phone
        password: zod_1.z.string().min(1),
        deviceId: zod_1.z.string().optional(),
        deviceName: zod_1.z.string().optional(),
        deviceType: zod_1.z.string().optional(),
        platform: zod_1.z.string().optional(),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1),
        newPassword: zod_1.z
            .string()
            .min(8)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, digit and special character'),
    }),
});
exports.changeMpinSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentMpin: zod_1.z.string().length(6).regex(/^\d+$/).optional(),
        newMpin: zod_1.z.string().length(6).regex(/^\d+$/, 'MPIN must be 6 digits'),
        otp: zod_1.z.string().length(6),
    }),
});
exports.verifyOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        identifier: zod_1.z.string().min(1),
        otp: zod_1.z.string().length(6),
        purpose: zod_1.z.string().min(1),
    }),
});
exports.sendOtpSchema = zod_1.z.object({
    body: zod_1.z.object({
        identifier: zod_1.z.string().min(1),
        purpose: zod_1.z.string().min(1),
    }),
});
//# sourceMappingURL=auth.validator.js.map