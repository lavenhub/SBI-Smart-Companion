  import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { AccountRepository } from '../repositories/account.repository';
import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  AuthenticationError, ConflictError, BusinessError, NotFoundError,
} from '../utils/errors';
import { generateAccountNumber, generateOtp, sha256 } from '../utils/helpers';
import { cache } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL, OTP_PURPOSE, SYSTEM_VAULT_FOLDERS } from '../constants';
import { LoginResult, SafeUser, TokenPair } from '../types';
import { createAuditEntry } from '../middlewares/audit.middleware';
import { prisma } from '../config/database';
import slugify from 'slugify';

const userRepo = new UserRepository();
const authRepo = new AuthRepository();
const notifRepo = new NotificationRepository();
const accountRepo = new AccountRepository();
const dashboardRepo = new DashboardRepository();

export class AuthService {
  // ── Register ───────────────────────────────────────────────────────────────
  async register(dto: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth?: string;
  }): Promise<SafeUser> {
    const emailLower = dto.email.toLowerCase();

    const [existingEmail, existingPhone] = await Promise.all([
      userRepo.findByEmail(emailLower),
      userRepo.findByPhone(dto.phone),
    ]);

    if (existingEmail) throw new ConflictError('Email already registered');
    if (existingPhone) throw new ConflictError('Phone number already registered');

    const passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
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
          accountNumber: generateAccountNumber(),
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
      for (const folder of SYSTEM_VAULT_FOLDERS) {
        await tx.vaultFolder.create({
          data: {
            userId: newUser.id,
            name: folder.name,
            slug: folder.slug,
            icon: folder.icon,
            color: folder.color,
            isSystem: true,
            sortOrder: SYSTEM_VAULT_FOLDERS.indexOf(folder),
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

    await createAuditEntry({
      userId: user.id,
      action: 'LOGIN',
      description: `New account registered: ${emailLower}`,
    });

    return this.toSafeUser(user);
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  async login(dto: {
    identifier: string;
    password: string;
    deviceId?: string;
    deviceName?: string;
    deviceType?: string;
    platform?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<LoginResult> {
    const user = await userRepo.findByIdentifier(dto.identifier);

    if (!user) {
      await createAuditEntry({
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for: ${dto.identifier}`,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      });
      throw new AuthenticationError('Invalid credentials');
    }

    // Account lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new AuthenticationError(`Account locked. Try again in ${minutes} minutes.`);
    }

    if (!user.isActive) throw new AuthenticationError('Account is deactivated');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      await userRepo.incrementFailedLogin(user.id);
      // Lock after 5 failed attempts
      if (user.failedLoginCount + 1 >= 5) {
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
        await userRepo.lockAccount(user.id, lockUntil);
      }
      await createAuditEntry({
        userId: user.id,
        action: 'LOGIN_FAILED',
        description: 'Incorrect password',
        ipAddress: dto.ipAddress,
      });
      throw new AuthenticationError('Invalid credentials');
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
    await cache.del(CACHE_KEYS.USER_PROFILE(user.id));

    await createAuditEntry({
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
  async logout(userId: string, sessionId: string, refreshToken?: string): Promise<void> {
    await Promise.all([
      authRepo.invalidateSession(sessionId),
      refreshToken ? authRepo.revokeRefreshToken(sha256(refreshToken)) : Promise.resolve(),
      cache.del(CACHE_KEYS.USER_PROFILE(userId)),
    ]);

    await createAuditEntry({
      userId,
      action: 'LOGOUT',
      description: 'User logged out',
    });
  }

  // ── Refresh Token ──────────────────────────────────────────────────────────
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const tokenHash = sha256(refreshToken);
    const stored = await authRepo.findRefreshToken(tokenHash);

    if (!stored || stored.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const user = await userRepo.findById(stored.userId);
    if (!user || !user.isActive) throw new AuthenticationError('User not found or inactive');

    // Rotate: revoke old, issue new
    await authRepo.revokeRefreshToken(tokenHash);

    const session = await authRepo.findActiveSession(stored.userId);
    const sessionId = session?.id ?? stored.userId;

    return this.generateTokenPair(user.id, user.email, user.role, sessionId);
  }

  // ── Change Password ────────────────────────────────────────────────────────
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepo.findById(userId);
    if (!user) throw new NotFoundError('User');

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) throw new AuthenticationError('Current password is incorrect');

    if (currentPassword === newPassword) {
      throw new BusinessError('New password must be different from current password');
    }

    const newHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
    await userRepo.update(userId, { passwordHash: newHash, passwordChangedAt: new Date() });

    // Invalidate all sessions on password change
    await authRepo.invalidateAllUserSessions(userId);
    await authRepo.revokeAllUserRefreshTokens(userId);
    await cache.del(CACHE_KEYS.USER_PROFILE(userId));

    await createAuditEntry({
      userId,
      action: 'PASSWORD_CHANGE',
      description: 'Password changed successfully',
    });
  }

  // ── OTP ────────────────────────────────────────────────────────────────────
  async sendOtp(identifier: string, purpose: string): Promise<void> {
    const otp = generateOtp(env.OTP_LENGTH);
    const otpHash = sha256(otp);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    await authRepo.createOtp({ identifier, otpHash, purpose, expiresAt });

    // In production, send via SMS/Email. Log for development.
    console.log(`[OTP] ${identifier} (${purpose}): ${otp}`);
  }

  async verifyOtp(identifier: string, otp: string, purpose: string): Promise<boolean> {
    const record = await authRepo.findValidOtp(identifier, purpose);
    if (!record) throw new BusinessError('OTP expired or invalid');

    const otpHash = sha256(otp);
    if (record.otpHash !== otpHash) {
      await authRepo.incrementOtpAttempts(record.id);
      throw new BusinessError('Incorrect OTP');
    }

    await authRepo.markOtpUsed(record.id);
    return true;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private async generateTokenPair(
    userId: string,
    email: string,
    role: string,
    sessionId: string,
  ): Promise<TokenPair> {
    const payload = { userId, email, role, sessionId };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const tokenHash = sha256(refreshTokenValue);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await authRepo.createRefreshToken({ userId, tokenHash, expiresAt });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  toSafeUser(user: any): SafeUser {
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
