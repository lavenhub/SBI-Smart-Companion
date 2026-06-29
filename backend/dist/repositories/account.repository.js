"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepository = void 0;
const database_1 = require("../config/database");
class AccountRepository {
    async findById(id, userId) {
        return database_1.prisma.account.findFirst({
            where: { id, ...(userId ? { userId } : {}) },
        });
    }
    async findByNumber(accountNumber) {
        return database_1.prisma.account.findUnique({ where: { accountNumber } });
    }
    async findByUserId(userId) {
        return database_1.prisma.account.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async create(data) {
        return database_1.prisma.account.create({ data });
    }
    async update(id, data) {
        return database_1.prisma.account.update({ where: { id }, data });
    }
    async updateBalance(id, amount, operation) {
        return database_1.prisma.account.update({
            where: { id },
            data: {
                balance: { [operation]: amount },
                availableBalance: { [operation]: amount },
                updatedAt: new Date(),
            },
        });
    }
    async findBeneficiaries(userId) {
        return database_1.prisma.beneficiary.findMany({
            where: { userId },
            orderBy: [{ isFavorite: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async findBeneficiaryById(id, userId) {
        return database_1.prisma.beneficiary.findFirst({ where: { id, userId } });
    }
    async createBeneficiary(data) {
        return database_1.prisma.beneficiary.create({ data });
    }
    async updateBeneficiary(id, data) {
        return database_1.prisma.beneficiary.update({ where: { id }, data });
    }
    async deleteBeneficiary(id, userId) {
        await database_1.prisma.beneficiary.deleteMany({ where: { id, userId } });
    }
    async getTotalBalance(userId) {
        const result = await database_1.prisma.account.aggregate({
            where: { userId, status: 'ACTIVE' },
            _sum: { balance: true },
        });
        return Number(result._sum.balance ?? 0);
    }
}
exports.AccountRepository = AccountRepository;
//# sourceMappingURL=account.repository.js.map