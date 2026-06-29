"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
class UserRepository {
    async findById(id) {
        return database_1.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return database_1.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    }
    async findByPhone(phone) {
        return database_1.prisma.user.findUnique({ where: { phone } });
    }
    async findByIdentifier(identifier) {
        const isEmail = identifier.includes('@');
        return isEmail
            ? this.findByEmail(identifier)
            : this.findByPhone(identifier);
    }
    async findByCustomerId(customerId) {
        return database_1.prisma.user.findUnique({ where: { customerId } });
    }
    async create(data) {
        return database_1.prisma.user.create({ data });
    }
    async update(id, data) {
        return database_1.prisma.user.update({ where: { id }, data });
    }
    async incrementFailedLogin(id) {
        await database_1.prisma.user.update({
            where: { id },
            data: { failedLoginCount: { increment: 1 } },
        });
    }
    async resetFailedLogin(id) {
        await database_1.prisma.user.update({
            where: { id },
            data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
        });
    }
    async lockAccount(id, until) {
        await database_1.prisma.user.update({ where: { id }, data: { lockedUntil: until } });
    }
    async findAll(pagination, where) {
        const { page, pageSize, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const [users, total] = await database_1.prisma.$transaction([
            database_1.prisma.user.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder },
            }),
            database_1.prisma.user.count({ where }),
        ]);
        return { users, total };
    }
    async getSafeProfile(id) {
        return database_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, customerId: true, firstName: true, lastName: true,
                email: true, phone: true, role: true, kycStatus: true,
                isActive: true, isPhoneVerified: true, isEmailVerified: true,
                avatarUrl: true, dateOfBirth: true, gender: true, occupation: true,
                addressLine1: true, addressLine2: true, city: true, state: true,
                pincode: true, country: true, lastLoginAt: true, createdAt: true,
            },
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map