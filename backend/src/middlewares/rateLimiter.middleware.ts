import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { HTTP_STATUS } from '../constants';

const rateLimitResponse = (windowMs: number) => ({
  success: false,
  message: 'Too many requests. Please try again later.',
  retryAfter: Math.ceil(windowMs / 1000),
  timestamp: new Date().toISOString(),
});

/** Global API rate limiter */
export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(
      rateLimitResponse(env.RATE_LIMIT_WINDOW_MS),
    );
  },
});

/** Strict limiter for auth endpoints */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}:${req.body?.identifier ?? ''}`,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      ...rateLimitResponse(15 * 60 * 1000),
      message: 'Too many login attempts. Please wait 15 minutes.',
    });
  },
});

/** Limiter for OTP requests */
export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `otp:${req.ip}:${req.body?.identifier ?? ''}`,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      ...rateLimitResponse(10 * 60 * 1000),
      message: 'Too many OTP requests. Please wait 10 minutes.',
    });
  },
});

/** Transaction limiter */
export const transactionRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      ...rateLimitResponse(60 * 1000),
      message: 'Transaction rate limit exceeded.',
    });
  },
});
