"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_1 = require("../config/database");
class AuthRepository {
    // ── Sessions ──────────────────────────────────────────────────────────────
    async createSession(data) {
        return database_1.prisma.session.create({ data });
    }
    async findActiveSession(id) {
        return database_1.prisma.session.findFirst({ where: { id, isActive: true } });
    }
    async invalidateSession(id) {
        await database_1.prisma.session.update({ where: { id }, data: { isActive: false } });
    }
    async invalidateAllUserSessions(userId) {
        await database_1.prisma.session.updateMany({
            where: { userId, isActive: true },
            data: { isActive: false },
        });
    }
    // ── Refresh Tokens ─────────────────────────────────────────────────────────
    async createRefreshToken(data) {
        return database_1.prisma.refreshToken.create({ data });
    }
    async findRefreshToken(tokenHash) {
        return database_1.prisma.refreshToken.findFirst({
            where: { tokenHash, isRevoked: false },
        });
    }
    async revokeRefreshToken(tokenHash) {
        await database_1.prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: { isRevoked: true },
        });
    }
    async revokeAllUserRefreshTokens(userId) {
        await database_1.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
    // ── OTP ───────────────────────────────────────────────────────────────────
    async createOtp(data) {
        // Invalidate old OTPs for same identifier + purpose
        await database_1.prisma.otpRecord.deleteMany({
            where: { identifier: data.identifier, purpose: data.purpose },
        });
        return database_1.prisma.otpRecord.create({ data });
    }
    async findValidOtp(identifier, purpose) {
        return database_1.prisma.otpRecord.findFirst({
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
    async markOtpUsed(id) {
        await database_1.prisma.otpRecord.update({ where: { id }, data: { isUsed: true } });
    }
    async incrementOtpAttempts(id) {
        await database_1.prisma.otpRecord.update({
            where: { id },
            data: { attempts: { increment: 1 } },
        });
    }
    // ── Devices ───────────────────────────────────────────────────────────────
    async upsertDevice(data) {
        return database_1.prisma.userDevice.upsert({
            where: { deviceId: data.deviceId },
            create: { ...data, lastSeenAt: new Date() },
            update: { ...data, lastSeenAt: new Date() },
        });
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map