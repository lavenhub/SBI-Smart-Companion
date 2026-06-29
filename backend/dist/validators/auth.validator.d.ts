import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        password: z.ZodString;
        dateOfBirth: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        referralCode: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        dateOfBirth?: string | undefined;
        referralCode?: string | undefined;
    }, {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        dateOfBirth?: string | undefined;
        referralCode?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        dateOfBirth?: string | undefined;
        referralCode?: string | undefined;
    };
}, {
    body: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        password: string;
        dateOfBirth?: string | undefined;
        referralCode?: string | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodString;
        deviceId: z.ZodOptional<z.ZodString>;
        deviceName: z.ZodOptional<z.ZodString>;
        deviceType: z.ZodOptional<z.ZodString>;
        platform: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        identifier: string;
        password: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        deviceType?: string | undefined;
        platform?: string | undefined;
    }, {
        identifier: string;
        password: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        deviceType?: string | undefined;
        platform?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        identifier: string;
        password: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        deviceType?: string | undefined;
        platform?: string | undefined;
    };
}, {
    body: {
        identifier: string;
        password: string;
        deviceId?: string | undefined;
        deviceName?: string | undefined;
        deviceType?: string | undefined;
        platform?: string | undefined;
    };
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        refreshToken: string;
    }, {
        refreshToken: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken: string;
    };
}, {
    body: {
        refreshToken: string;
    };
}>;
export declare const changePasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currentPassword: string;
        newPassword: string;
    }, {
        currentPassword: string;
        newPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        currentPassword: string;
        newPassword: string;
    };
}, {
    body: {
        currentPassword: string;
        newPassword: string;
    };
}>;
export declare const changeMpinSchema: z.ZodObject<{
    body: z.ZodObject<{
        currentMpin: z.ZodOptional<z.ZodString>;
        newMpin: z.ZodString;
        otp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newMpin: string;
        otp: string;
        currentMpin?: string | undefined;
    }, {
        newMpin: string;
        otp: string;
        currentMpin?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        newMpin: string;
        otp: string;
        currentMpin?: string | undefined;
    };
}, {
    body: {
        newMpin: string;
        otp: string;
        currentMpin?: string | undefined;
    };
}>;
export declare const verifyOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        otp: z.ZodString;
        purpose: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        identifier: string;
        otp: string;
    }, {
        purpose: string;
        identifier: string;
        otp: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        purpose: string;
        identifier: string;
        otp: string;
    };
}, {
    body: {
        purpose: string;
        identifier: string;
        otp: string;
    };
}>;
export declare const sendOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        purpose: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        purpose: string;
        identifier: string;
    }, {
        purpose: string;
        identifier: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        purpose: string;
        identifier: string;
    };
}, {
    body: {
        purpose: string;
        identifier: string;
    };
}>;
//# sourceMappingURL=auth.validator.d.ts.map