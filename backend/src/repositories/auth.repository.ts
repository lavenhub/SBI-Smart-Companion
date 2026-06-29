import { RefreshToken, Session } from '@prisma/client';
import { prisma } from '../config/database';
import { sha256 } from '../utils/helpers';

export class AuthRepository {
  // ── Sessions ──────────────────────────────────────────────────────────────
  async createSession(data: {
    userId: string;
    deviceId?: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }): Promise<Session> {
    return prisma.session.create({ data });
  }

  async findActiveSession(id: string): Promise<Session | null> {
    return prisma.session.findFirst({ where: { id, isActive: true } });
  }

  async invalidateSession(id: string): Promise<void> {
    await prisma.session.update({ where: { id }, data: { isActive: false } });
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  // ── Refresh Tokens ─────────────────────────────────────────────────────────
  async createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    deviceId?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, isRevoked: false },
    });
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  // ── OTP ───────────────────────────────────────────────────────────────────
  async createOtp(data: {
    identifier: string;
    otpHash: string;
    purpose: string;
    expiresAt: Date;
  }) {
    // Invalidate old OTPs for same identifier + purpose
    await prisma.otpRecord.deleteMany({
      where: { identifier: data.identifier, purpose: data.purpose },
    });
    return prisma.otpRecord.create({ data });
  }

  async findValidOtp(identifier: string, purpose: string) {
    return prisma.otpRecord.findFirst({
      where: {
        identifier,
        purpose,
        isUsed: false,
        expiresAt: { gt: new Date() },
        attempts: { lt: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markOtpUsed(id: string): Promise<void> {
    await prisma.otpRecord.update({ where: { id }, data: { isUsed: true } });
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await prisma.otpRecord.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  // ── Devices ───────────────────────────────────────────────────────────────
  async upsertDevice(data: {
    userId: string;
    deviceId: string;
    deviceName?: string;
    deviceType?: string;
    platform?: string;
    pushToken?: string;
  }) {
    return prisma.userDevice.upsert({
      where: { deviceId: data.deviceId },
      create: { ...data, lastSeenAt: new Date() },
      update: { ...data, lastSeenAt: new Date() },
    });
  }
}
