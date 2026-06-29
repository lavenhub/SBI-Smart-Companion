"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
exports.optionalAuthenticate = optionalAuthenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const database_1 = require("../config/database");
const redis_1 = require("../config/redis");
const constants_1 = require("../constants");
/**
 * Verifies the JWT access token and attaches the decoded payload to req.user.
 */
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errors_1.AuthenticationError('No token provided');
        }
        const token = authHeader.slice(7);
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.AuthenticationError('Token expired');
            }
            throw new errors_1.AuthenticationError('Invalid token');
        }
        // Verify session is still active (check cache first)
        const cacheKey = constants_1.CACHE_KEYS.USER_PROFILE(payload.userId);
        let user = await redis_1.cache.get(cacheKey);
        if (!user) {
            const dbUser = await database_1.prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, isActive: true, role: true, lockedUntil: true },
            });
            if (!dbUser)
                throw new errors_1.AuthenticationError('User not found');
            if (!dbUser.isActive)
                throw new errors_1.AuthenticationError('Account deactivated');
            if (dbUser.lockedUntil && dbUser.lockedUntil > new Date()) {
                throw new errors_1.AuthenticationError('Account temporarily locked');
            }
            user = { isActive: dbUser.isActive, role: dbUser.role };
        }
        req.user = { ...payload, role: user.role };
        req.deviceId = req.headers['x-device-id'];
        req.sessionId = payload.sessionId;
        next();
    }
    catch (err) {
        next(err);
    }
}
/**
 * Role-based access control middleware factory.
 */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            next(new errors_1.AuthenticationError());
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(new errors_1.AuthorizationError(`Role '${req.user.role}' is not allowed`));
            return;
        }
        next();
    };
}
/**
 * Soft-authenticate — sets req.user if token present, does not fail if absent.
 */
async function optionalAuthenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        next();
        return;
    }
    await authenticate(req, res, next);
}
//# sourceMappingURL=auth.middleware.js.map