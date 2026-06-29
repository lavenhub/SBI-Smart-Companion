"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const constants_1 = require("../constants");
const env_1 = require("../config/env");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            (0, response_1.sendCreated)(res, user, 'Account created successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const ipAddress = req.headers['x-forwarded-for'] ?? req.ip;
            const result = await authService.login({
                ...req.body,
                ipAddress,
                userAgent: req.headers['user-agent'],
            });
            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/v1/auth',
            });
            (0, response_1.sendSuccess)(res, {
                user: result.user,
                accessToken: result.tokens.accessToken,
                expiresIn: result.tokens.expiresIn,
                sessionId: result.sessionId,
            }, 'Login successful');
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken;
            await authService.logout(req.user.userId, req.user.sessionId, refreshToken);
            res.clearCookie('refreshToken', { path: '/api/v1/auth' });
            (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
            if (!token) {
                res.status(constants_1.HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Refresh token required' });
                return;
            }
            const tokens = await authService.refreshTokens(token);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/v1/auth',
            });
            (0, response_1.sendSuccess)(res, {
                accessToken: tokens.accessToken,
                expiresIn: tokens.expiresIn,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            await authService.changePassword(req.user.userId, req.body.currentPassword, req.body.newPassword);
            (0, response_1.sendSuccess)(res, null, 'Password changed successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async sendOtp(req, res, next) {
        try {
            await authService.sendOtp(req.body.identifier, req.body.purpose);
            (0, response_1.sendSuccess)(res, { expiresInMinutes: env_1.env.OTP_EXPIRY_MINUTES }, 'OTP sent successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            await authService.verifyOtp(req.body.identifier, req.body.otp, req.body.purpose);
            (0, response_1.sendSuccess)(res, { verified: true }, 'OTP verified successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async getProfile(req, res, next) {
        try {
            const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/user.repository')));
            const userRepo = new UserRepository();
            const user = await userRepo.getSafeProfile(req.user.userId);
            if (!user) {
                res.status(constants_1.HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
                return;
            }
            (0, response_1.sendSuccess)(res, user);
        }
        catch (err) {
            next(err);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const { UserRepository } = await Promise.resolve().then(() => __importStar(require('../repositories/user.repository')));
            const userRepo = new UserRepository();
            const allowedFields = [
                'firstName', 'lastName', 'dateOfBirth', 'gender', 'occupation',
                'addressLine1', 'addressLine2', 'city', 'state', 'pincode',
            ];
            const updateData = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowedFields.includes(k)));
            const updated = await userRepo.update(req.user.userId, updateData);
            (0, response_1.sendSuccess)(res, authService.toSafeUser(updated), 'Profile updated');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map