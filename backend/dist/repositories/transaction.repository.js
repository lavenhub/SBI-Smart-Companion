"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const database_1 = require("../config/database");
class TransactionRepository {
    async findById(id, userId) {
        return database_1.prisma.transaction.findFirst({
            where: { id, ...(userId ? { userId } : {}) },
            include: {
                account: { select: { accountNumber: true, accountType: true } },
                merchant: { select: { name: true, logoUrl: true } },
                beneficiary: { select: { name: true, upiId: true } },
                receipt: { select: { id: true, amount: true } },
            },
        });
    }
    async findByReference(referenceId) {
        return database_1.prisma.transaction.findUnique({ where: { referenceId } });
    }
    async create(data) {
        return database_1.prisma.transaction.create({ data });
    }
    async update(id, data) {
        return database_1.prisma.transaction.update({ where: { id }, data });
    }
    async findMany(userId, pagination, filters) {
        const { page, pageSize, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const where = {
            userId,
            ...(filters.accountId && { accountId: filters.accountId }),
            ...(filters.type && { type: filters.type }),
            ...(filters.mode && { mode: filters.mode }),
            ...(filters.status && { status: filters.status }),
            ...(filters.category && { category: filters.category }),
            ...(filters.startDate || filters.endDate
                ? { createdAt: { ...(filters.startDate && { gte: filters.startDate }), ...(filters.endDate && { lte: filters.endDate }) } }
                : {}),
            ...(filters.minAmount !== undefined || filters.maxAmount !== undefined
                ? { amount: { ...(filters.minAmount !== undefined && { gte: filters.minAmount }), ...(filters.maxAmount !== undefined && { lte: filters.maxAmount }) } }
                : {}),
            ...(filters.search
                ? { OR: [
                        { description: { contains: filters.search } },
                        { referenceId: { contains: filters.search } },
                    ] }
                : {}),
        };
        const [transactions, total] = await database_1.prisma.$transaction([
            database_1.prisma.transaction.findMany({
                where,
                include: {
                    merchant: { select: { name: true, logoUrl: true } },
                    receipt: { select: { id: true } },
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { [sortBy]: sortOrder },
            }),
            database_1.prisma.transaction.count({ where }),
        ]);
        return { transactions, total };
    }
    async getMonthlyStats(userId, months = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        return database_1.prisma.transaction.groupBy({
            by: ['type'],
            where: {
                userId,
                status: 'COMPLETED',
                createdAt: { gte: startDate },
            },
            _sum: { amount: true },
            _count: true,
        });
    }
    async getCategoryBreakdown(userId, startDate, endDate) {
        return database_1.prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId,
                type: 'DEBIT',
                status: 'COMPLETED',
                createdAt: { gte: startDate, lte: endDate },
                category: { not: null },
            },
            _sum: { amount: true },
            _count: true,
            orderBy: { _sum: { amount: 'desc' } },
        });
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map