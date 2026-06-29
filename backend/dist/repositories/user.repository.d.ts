import { Prisma, User } from '@prisma/client';
import { PaginationQuery } from '../types';
export declare class UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findByIdentifier(identifier: string): Promise<User | null>;
    findByCustomerId(customerId: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    incrementFailedLogin(id: string): Promise<void>;
    resetFailedLogin(id: string): Promise<void>;
    lockAccount(id: string, until: Date): Promise<void>;
    findAll(pagination: PaginationQuery, where?: Prisma.UserWhereInput): Promise<{
        users: User[];
        total: number;
    }>;
    getSafeProfile(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        gender: string | null;
        occupation: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        id: string;
        createdAt: Date;
        customerId: string;
        phone: string;
        role: string;
        kycStatus: string;
        isActive: boolean;
        isPhoneVerified: boolean;
        isEmailVerified: boolean;
        dateOfBirth: Date | null;
        avatarUrl: string | null;
        country: string;
        lastLoginAt: Date | null;
    } | null>;
}
//# sourceMappingURL=user.repository.d.ts.map