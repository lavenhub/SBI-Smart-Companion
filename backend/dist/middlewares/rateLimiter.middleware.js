"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRateLimiter = exports.otpRateLimiter = exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const constants_1 = require("../constants");
const rateLimitResponse = (windowMs) => ({
    success: false,
    message: 'Too many requests. Please try again later.',
    retryAfter: Math.ceil(windowMs / 1000),
    timestamp: new Date().toISOString(),
});
/** Global API rate limiter */
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json(rateLimitResponse(env_1.env.RATE_LIMIT_WINDOW_MS));
    },
});
/** Strict limiter for auth endpoints */
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env_1.env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${req.ip}:${req.body?.identifier ?? ''}`,
    handler: (req, res) => {
        res.status(constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json({
            ...rateLimitResponse(15 * 60 * 1000),
            message: 'Too many login attempts. Please wait 15 minutes.',
        });
    },
});
/** Limiter for OTP requests */
exports.otpRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `otp:${req.ip}:${req.body?.identifier ?? ''}`,
    handler: (req, res) => {
        res.status(constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json({
            ...rateLimitResponse(10 * 60 * 1000),
            message: 'Too many OTP requests. Please wait 10 minutes.',
        });
    },
});
/** Transaction limiter */
exports.transactionRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(constants_1.HTTP_STATUS.TOO_MANY_REQUESTS).json({
            ...rateLimitResponse(60 * 1000),
            message: 'Transaction rate limit exceeded.',
        });
    },
});
//# sourceMappingURL=rateLimiter.middleware.js.map