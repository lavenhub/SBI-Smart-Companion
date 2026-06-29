"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const user_repository_1 = require("../repositories/user.repository");
const auth_repository_1 = require("../repositories/auth.repository");
const notification_repository_1 = require("../repositories/notification.repository");
const account_repository_1 = require("../repositories/account.repository");
const dashboard_repository_1 = require("../repositories/dashboard.repository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const redis_1 = require("../config/redis");
const constants_1 = require("../constants");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const database_1 = require("../config/database");
const userRepo = new user_repository_1.UserRepository();
const authRepo = new auth_repository_1.AuthRepository();
const notifRepo = new notification_repository_1.NotificationRepository();
const accountRepo = new account_repository_1.AccountRepository();
const dashboardRepo = new dashboard_repository_1.DashboardRepository();
class AuthService {
    // ── Register ───────────────────────────────────────────────────────────────
    async register(dto) {
        const emailLower = dto.email.toLowerCase();
        const [existingEmail, existingPhone] = await Promise.all([
            userRepo.findByEmail(emailLower),
            userRepo.findByPhone(dto.phone),
        ]);
        if (existingEmail)
            throw new errors_1.ConflictError('Email already registered');
        if (existingPhone)
            throw new errors_1.ConflictError('Phone number already registered');
        const passwordHash = await bcrypt_1.default.hash(dto.password, env_1.env.BCRYPT_ROUNDS);
        const user = await database_1.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: emailLower,
                    phone: dto.phone,
                    passwordHash,
                    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                    role: 'CUSTOMER',
                    kycStatus: 'PENDING',
                },
            });
            // Create default savings account
            await tx.account.create({
                data: {
                    userId: newUser.id,
                    accountNumber: (0, helpers_1.generateAccountNumber)(),
                    accountType: 'SAVINGS',
                    status: 'ACTIVE',
                    balance: 0,
                    availableBalance: 0,
                    minBalance: 1000,
                    interestRate: 3.5,
                    branch: 'Home Branch',
                    ifscCode: 'SBIN0000001',
                },
            });
            // Create system vault folders
            for (const folder of constants_1.SYSTEM_VAULT_FOLDERS) {
                await tx.vaultFolder.create({
                    data: {
                        userId: newUser.id,
                        name: folder.name,
                        slug: folder.slug,
                        icon: folder.icon,
                        color: folder.color,
                        isSystem: true,
                        sortOrder: constants_1.SYSTEM_VAULT_FOLDERS.indexOf(folder),
                    },
                });
            }
            // Default dashboard preferences
            await tx.dashboardPreference.create({
                data: {
                    userId: newUser.id,
                    layout: JSON.stringify([]),
                    pinnedWidgets: JSON.stringify(['balance', 'transactions', 'bills']),
                    hiddenWidgets: JSON.stringify([]),
                    quickActionIds: JSON.stringify([]),
                },
            });
            // Welcome notification
            await tx.notification.create({
                data: {
                    userId: newUser.id,
                    type: 'SYSTEM',
                    channel: 'IN_APP',
                    title: 'Welcome to YONO Smart Companion!',
                    body: `Hi ${dto.firstName}, your account is set up. Complete KYC to unlock all features.`,
                    isSent: true,
                    sentAt: new Date(),
                },
            });
            return newUser;
        });
        await (0, audit_middleware_1.createAuditEntry)({
            userId: user.id,
            action: 'LOGIN',
            description: `New account registered: ${emailLower}`,
        });
        return this.toSafeUser(user);
    }
    // ── Login ──────────────────────────────────────────────────────────────────
    async login(dto) {
        const user = await userRepo.findByIdentifier(dto.identifier);
        if (!user) {
            await (0, audit_middleware_1.createAuditEntry)({
                action: 'LOGIN_FAILED',
                description: `Failed login attempt for: ${dto.identifier}`,
                ipAddress: dto.ipAddress,
                userAgent: dto.userAgent,
            });
            throw new errors_1.AuthenticationError('Invalid credentials');
        }
        // Account lockout check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new errors_1.AuthenticationError(`Account locked. Try again in ${minutes} minutes.`);
        }
        if (!user.isActive)
            throw new errors_1.AuthenticationError('Account is deactivated');
        const passwordMatch = await bcrypt_1.default.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            await userRepo.incrementFailedLogin(user.id);
            // Lock after 5 failed attempts
            if (user.failedLoginCount + 1 >= 5) {
                const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
                await userRepo.lockAccount(user.id, lockUntil);
            }
            await (0, audit_middleware_1.createAuditEntry)({
                userId: user.id,
                action: 'LOGIN_FAILED',
                description: 'Incorrect password',
                ipAddress: dto.ipAddress,
            });
            throw new errors_1.AuthenticationError('Invalid credentials');
        }
        // Successful — reset failed count
        await userRepo.resetFailedLogin(user.id);
        // Create session
        const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = await authRepo.createSession({
            userId: user.id,
            deviceId: dto.deviceId,
            ipAddress: dto.ipAddress,
            userAgent: dto.userAgent,
            expiresAt: sessionExpiresAt,
        });
        const tokens = await this.generateTokenPair(user.id, user.email, user.role, session.id);
        // Register device if provided
        if (dto.deviceId) {
            await authRepo.upsertDevice({
                userId: user.id,
                deviceId: dto.deviceId,
                deviceName: dto.deviceName,
                deviceType: dto.deviceType,
                platform: dto.platform,
            });
        }
        // Invalidate cached profile to force refresh
        await redis_1.cache.del(constants_1.CACHE_KEYS.USER_PROFILE(user.id));
        await (0, audit_middleware_1.createAuditEntry)({
            userId: user.id,
            action: 'LOGIN',
            description: `Successful login from ${dto.ipAddress}`,
            ipAddress: dto.ipAddress,
            userAgent: dto.userAgent,
            deviceId: dto.deviceId,
        });
        return { user: this.toSafeUser(user), tokens, sessionId: session.id };
    }
    // ── Logout ─────────────────────────────────────────────────────────────────
    async logout(userId, sessionId, refreshToken) {
        await Promise.all([
            authRepo.invalidateSession(sessionId),
            refreshToken ? authRepo.revokeRefreshToken((0, helpers_1.sha256)(refreshToken)) : Promise.resolve(),
            redis_1.cache.del(constants_1.CACHE_KEYS.USER_PROFILE(userId)),
        ]);
        await (0, audit_middleware_1.createAuditEntry)({
            userId,
            action: 'LOGOUT',
            description: 'User logged out',
        });
    }
    // ── Refresh Token ──────────────────────────────────────────────────────────
    async refreshTokens(refreshToken) {
        const tokenHash = (0, helpers_1.sha256)(refreshToken);
        const stored = await authRepo.findRefreshToken(tokenHash);
        if (!stored || stored.expiresAt < new Date()) {
            throw new errors_1.AuthenticationError('Invalid or expired refresh token');
        }
        const user = await userRepo.findById(stored.userId);
        if (!user || !user.isActive)
            throw new errors_1.AuthenticationError('User not found or inactive');
        // Rotate: revoke old, issue new
        await authRepo.revokeRefreshToken(tokenHash);
        const session = await authRepo.findActiveSession(stored.userId);
        const sessionId = session?.id ?? stored.userId;
        return this.generateTokenPair(user.id, user.email, user.role, sessionId);
    }
    // ── Change Password ────────────────────────────────────────────────────────
    async changePassword(userId, currentPassword, newPassword) {
        const user = await userRepo.findById(userId);
        if (!user)
            throw new errors_1.NotFoundError('User');
        const match = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!match)
            throw new errors_1.AuthenticationError('Current password is incorrect');
        if (currentPassword === newPassword) {
            throw new errors_1.BusinessError('New password must be different from current password');
        }
        const newHash = await bcrypt_1.default.hash(newPassword, env_1.env.BCRYPT_ROUNDS);
        await userRepo.update(userId, { passwordHash: newHash, passwordChangedAt: new Date() });
        // Invalidate all sessions on password change
        await authRepo.invalidateAllUserSessions(userId);
        await authRepo.revokeAllUserRefreshTokens(userId);
        await redis_1.cache.del(constants_1.CACHE_KEYS.USER_PROFILE(userId));
        await (0, audit_middleware_1.createAuditEntry)({
            userId,
            action: 'PASSWORD_CHANGE',
            description: 'Password changed successfully',
        });
    }
    // ── OTP ────────────────────────────────────────────────────────────────────
    async sendOtp(identifier, purpose) {
        const otp = (0, helpers_1.generateOtp)(env_1.env.OTP_LENGTH);
        const otpHash = (0, helpers_1.sha256)(otp);
        const expiresAt = new Date(Date.now() + env_1.env.OTP_EXPIRY_MINUTES * 60 * 1000);
        await authRepo.createOtp({ identifier, otpHash, purpose, expiresAt });
        // In production, send via SMS/Email. Log for development.
        console.log(`[OTP] ${identifier} (${purpose}): ${otp}`);
    }
    async verifyOtp(identifier, otp, purpose) {
        const record = await authRepo.findValidOtp(identifier, purpose);
        if (!record)
            throw new errors_1.BusinessError('OTP expired or invalid');
        const otpHash = (0, helpers_1.sha256)(otp);
        if (record.otpHash !== otpHash) {
            await authRepo.incrementOtpAttempts(record.id);
            throw new errors_1.BusinessError('Incorrect OTP');
        }
        await authRepo.markOtpUsed(record.id);
        return true;
    }
    // ── Helpers ───────────────────────────────────────────────────────────────
    async generateTokenPair(userId, email, role, sessionId) {
        const payload = { userId, email, role, sessionId };
        const accessToken = jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
            expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN,
        });
        const refreshTokenValue = crypto_1.default.randomBytes(64).toString('hex');
        const tokenHash = (0, helpers_1.sha256)(refreshTokenValue);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await authRepo.createRefreshToken({ userId, tokenHash, expiresAt });
        return {
            accessToken,
            refreshToken: refreshTokenValue,
            expiresIn: 15 * 60, // 15 minutes in seconds
        };
    }
    toSafeUser(user) {
        return {
            id: user.id,
            customerId: user.customerId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            kycStatus: user.kycStatus,
            isActive: user.isActive,
            isPhoneVerified: user.isPhoneVerified,
            isEmailVerified: user.isEmailVerified,
            avatarUrl: user.avatarUrl,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map