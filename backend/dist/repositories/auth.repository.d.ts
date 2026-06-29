import { RefreshToken, Session } from '@prisma/client';
export declare class AuthRepository {
    createSession(data: {
        userId: string;
        deviceId?: string;
        ipAddress?: string;
        userAgent?: string;
        expiresAt: Date;
    }): Promise<Session>;
    findActiveSession(id: string): Promise<Session | null>;
    invalidateSession(id: string): Promise<void>;
    invalidateAllUserSessions(userId: string): Promise<void>;
    createRefreshToken(data: {
        userId: string;
        tokenHash: string;
        deviceId?: string;
        ipAddress?: string;
        expiresAt: Date;
    }): Promise<RefreshToken>;
    findRefreshToken(tokenHash: string): Promise<RefreshToken | null>;
    revokeRefreshToken(tokenHash: string): Promise<void>;
    revokeAllUserRefreshTokens(userId: string): Promise<void>;
    createOtp(data: {
        identifier: string;
        otpHash: string;
        purpose: string;
        expiresAt: Date;
    }): Promise<{
        purpose: string;
        identifier: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        otpHash: string;
        attempts: number;
        isUsed: boolean;
    }>;
    findValidOtp(identifier: string, purpose: string): Promise<{
        purpose: string;
        identifier: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        otpHash: string;
        attempts: number;
        isUsed: boolean;
    } | null>;
    markOtpUsed(id: string): Promise<void>;
    incrementOtpAttempts(id: string): Promise<void>;
    upsertDevice(data: {
        userId: string;
        deviceId: string;
        deviceName?: string;
        deviceType?: string;
        platform?: string;
        pushToken?: string;
    }): Promise<{
        id: string;
        userId: string;
        deviceId: string;
        createdAt: Date;
        deviceName: string | null;
        deviceType: string | null;
        platform: string | null;
        pushToken: string | null;
        isTrusted: boolean;
        lastSeenAt: Date;
    }>;
}
//# sourceMappingURL=auth.repository.d.ts.map