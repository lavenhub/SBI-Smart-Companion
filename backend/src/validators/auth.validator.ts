import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, digit and special character',
      ),
    dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid date').optional(),
    referralCode: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3),  // email or phone
    password: z.string().min(1),
    deviceId: z.string().optional(),
    deviceName: z.string().optional(),
    deviceType: z.string().optional(),
    platform: z.string().optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, digit and special character',
      ),
  }),
});

export const changeMpinSchema = z.object({
  body: z.object({
    currentMpin: z.string().length(6).regex(/^\d+$/).optional(),
    newMpin: z.string().length(6).regex(/^\d+$/, 'MPIN must be 6 digits'),
    otp: z.string().length(6),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    identifier: z.string().min(1),
    otp: z.string().length(6),
    purpose: z.string().min(1),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    identifier: z.string().min(1),
    purpose: z.string().min(1),
  }),
});
