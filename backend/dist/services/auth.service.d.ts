import { LoginResult, SafeUser, TokenPair } from '../types';
export declare class AuthService {
    register(dto: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        dateOfBirth?: string;
    }): Promise<SafeUser>;
    login(dto: {
        identifier: string;
        password: string;
        deviceId?: string;
        deviceName?: string;
        deviceType?: string;
        platform?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<LoginResult>;
    logout(userId: string, sessionId: string, refreshToken?: string): Promise<void>;
    refreshTokens(refreshToken: string): Promise<TokenPair>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    sendOtp(identifier: string, purpose: string): Promise<void>;
    verifyOtp(identifier: string, otp: string, purpose: string): Promise<boolean>;
    private generateTokenPair;
    toSafeUser(user: any): SafeUser;
}
//# sourceMappingURL=auth.service.d.ts.map