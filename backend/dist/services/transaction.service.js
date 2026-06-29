"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const database_1 = require("../config/database");
const transaction_repository_1 = require("../repositories/transaction.repository");
const account_repository_1 = require("../repositories/account.repository");
const vault_repository_1 = require("../repositories/vault.repository");
const notification_repository_1 = require("../repositories/notification.repository");
const dashboard_repository_1 = require("../repositories/dashboard.repository");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../constants");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const txnRepo = new transaction_repository_1.TransactionRepository();
const accountRepo = new account_repository_1.AccountRepository();
const vaultRepo = new vault_repository_1.VaultRepository();
const notifRepo = new notification_repository_1.NotificationRepository();
const dashRepo = new dashboard_repository_1.DashboardRepository();
class TransactionService {
    // ── Initiate ───────────────────────────────────────────────────────────────
    async initiate(userId, dto) {
        const account = await accountRepo.findById(dto.accountId, userId);
        if (!account)
            throw new errors_1.NotFoundError('Account');
        if (account.status !== 'ACTIVE')
            throw new errors_1.BusinessError('Account is not active');
        const amount = Number(dto.amount);
        this.validateTransactionLimits(amount, dto.mode);
        if (Number(account.availableBalance) < amount) {
            throw new errors_1.BusinessError('Insufficient balance');
        }
        // Calculate charges
        const charges = this.calculateCharges(amount, dto.mode);
        const netAmount = amount + charges;
        if (Number(account.availableBalance) < netAmount) {
            throw new errors_1.BusinessError('Insufficient balance including charges');
        }
        const referenceId = (0, helpers_1.generateReferenceId)(dto.mode);
        const balanceBefore = Number(account.balance);
        const balanceAfter = balanceBefore - netAmount;
        // Execute atomically
        const transaction = await database_1.prisma.$transaction(async (tx) => {
            // Debit source account
            await tx.account.update({
                where: { id: dto.accountId },
                data: {
                    balance: { decrement: netAmount },
                    availableBalance: { decrement: netAmount },
                },
            });
            // Credit beneficiary account if internal
            if (dto.mode === 'INTERNAL' && dto.beneficiaryId) {
                const beneficiary = await tx.beneficiary.findFirst({
                    where: { id: dto.beneficiaryId, userId },
                });
                if (beneficiary?.accountId) {
                    await tx.account.update({
                        where: { id: beneficiary.accountId },
                        data: {
                            balance: { increment: amount },
                            availableBalance: { increment: amount },
                        },
                    });
                }
            }
            const category = (0, helpers_1.detectCategory)(dto.description ?? '');
            const txn = await tx.transaction.create({
                data: {
                    userId,
                    accountId: dto.accountId,
                    cardId: dto.cardId,
                    beneficiaryId: dto.beneficiaryId,
                    referenceId,
                    type: 'DEBIT',
                    mode: dto.mode,
                    status: 'COMPLETED',
                    amount,
                    charges,
                    tax: 0,
                    netAmount,
                    balanceBefore,
                    balanceAfter,
                    description: dto.description,
                    remarks: dto.remarks,
                    category,
                    senderUpi: dto.senderUpi,
                    receiverUpi: dto.receiverUpi,
                    processedAt: new Date(),
                },
                include: {
                    account: { select: { accountNumber: true } },
                    beneficiary: { select: { name: true } },
                },
            });
            return txn;
        });
        // Async side effects (non-blocking)
        this.postTransactionEffects(userId, transaction, amount).catch(console.error);
        await (0, audit_middleware_1.createAuditEntry)({
            userId,
            action: 'TRANSFER_COMPLETED',
            entityType: 'Transaction',
            entityId: transaction.id,
            description: `${dto.mode} transfer of ₹${amount} — Ref: ${referenceId}`,
        });
        return transaction;
    }
    // ── Get Transactions ───────────────────────────────────────────────────────
    async getTransactions(userId, pagination, filters) {
        const page = Math.max(1, pagination.page);
        const pageSize = Math.min(pagination.pageSize, 100);
        // Convert date strings
        if (filters.startDate)
            filters.startDate = new Date(filters.startDate);
        if (filters.endDate)
            filters.endDate = new Date(filters.endDate);
        return txnRepo.findMany(userId, { ...pagination, page, pageSize }, filters);
    }
    // ── Get by ID ──────────────────────────────────────────────────────────────
    async getById(id, userId) {
        const txn = await txnRepo.findById(id, userId);
        if (!txn)
            throw new errors_1.NotFoundError('Transaction');
        return txn;
    }
    // ── Monthly Analytics ──────────────────────────────────────────────────────
    async getMonthlyAnalytics(userId) {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const stats = await database_1.prisma.transaction.aggregate({
                where: { userId, status: 'COMPLETED', createdAt: { gte: start, lte: end } },
                _sum: { amount: true },
                _count: true,
            });
            const income = await database_1.prisma.transaction.aggregate({
                where: { userId, status: 'COMPLETED', type: 'CREDIT', createdAt: { gte: start, lte: end } },
                _sum: { amount: true },
            });
            const expense = await database_1.prisma.transaction.aggregate({
                where: { userId, status: 'COMPLETED', type: 'DEBIT', createdAt: { gte: start, lte: end } },
                _sum: { amount: true },
            });
            months.push({
                month: start.toLocaleString('default', { month: 'short' }),
                year: start.getFullYear(),
                income: Number(income._sum.amount ?? 0),
                expense: Number(expense._sum.amount ?? 0),
                savings: Number(income._sum.amount ?? 0) - Number(expense._sum.amount ?? 0),
                count: stats._count,
            });
        }
        return months;
    }
    // ── Category Breakdown ────────────────────────────────────────────────────
    async getCategoryBreakdown(userId, month) {
        const date = month ? new Date(month) : new Date();
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        const breakdown = await txnRepo.getCategoryBreakdown(userId, start, end);
        const total = breakdown.reduce((s, b) => s + Number(b._sum.amount ?? 0), 0);
        return breakdown.map((b) => ({
            category: b.category ?? 'Others',
            amount: Number(b._sum.amount ?? 0),
            count: b._count,
            percentage: total > 0 ? Math.round((Number(b._sum.amount ?? 0) / total) * 100) : 0,
        }));
    }
    // ── Private Helpers ────────────────────────────────────────────────────────
    validateTransactionLimits(amount, mode) {
        if (amount < constants_1.TRANSACTION.MIN_AMOUNT) {
            throw new errors_1.BusinessError(`Minimum transaction amount is ₹${constants_1.TRANSACTION.MIN_AMOUNT}`);
        }
        const limits = {
            UPI: constants_1.TRANSACTION.MAX_UPI_AMOUNT,
            NEFT: constants_1.TRANSACTION.MAX_NEFT_AMOUNT,
            RTGS: constants_1.TRANSACTION.MAX_RTGS_AMOUNT,
            IMPS: constants_1.TRANSACTION.MAX_IMPS_AMOUNT,
        };
        if (limits[mode] && amount > limits[mode]) {
            throw new errors_1.BusinessError(`Maximum ${mode} amount is ₹${limits[mode].toLocaleString('en-IN')}`);
        }
        if (mode === 'RTGS' && amount < constants_1.TRANSACTION.MIN_RTGS_AMOUNT) {
            throw new errors_1.BusinessError(`Minimum RTGS amount is ₹${constants_1.TRANSACTION.MIN_RTGS_AMOUNT.toLocaleString('en-IN')}`);
        }
    }
    calculateCharges(amount, mode) {
        if (mode === 'UPI' || mode === 'INTERNAL')
            return 0;
        if (mode === 'NEFT') {
            for (const slab of constants_1.TRANSACTION.NEFT_FEE_SLAB) {
                if (amount <= slab.max)
                    return slab.fee;
            }
        }
        if (mode === 'IMPS')
            return Math.min(amount * constants_1.TRANSACTION.IMPS_FEE_RATE, 25);
        return 0;
    }
    async postTransactionEffects(userId, transaction, amount) {
        // Award reward points for card transactions
        if (transaction.mode === 'CARD') {
            const points = Math.floor((amount / 100) * constants_1.REWARD_RATES.CARD_TRANSACTION_PER_100);
            if (points > 0) {
                const balance = await dashRepo.getRewardBalance(userId);
                await dashRepo.addRewardPoints({
                    userId,
                    type: 'EARNED',
                    points,
                    description: `Reward points for card transaction`,
                    referenceId: transaction.id,
                    referenceType: 'Transaction',
                    currentBalance: balance,
                });
            }
        }
        // Auto-create vault receipt for shopping/food transactions
        if (['Shopping', 'Food', 'Electronics'].includes(transaction.category ?? '')) {
            await this.createVaultReceipt(userId, transaction);
        }
        // Send notification
        await notifRepo.create({
            user: { connect: { id: userId } },
            type: 'TRANSACTION_DEBIT',
            channel: 'IN_APP',
            title: 'Money Sent',
            body: `₹${amount.toLocaleString('en-IN')} debited. Ref: ${transaction.referenceId}`,
            data: JSON.stringify({ transactionId: transaction.id, amount }),
            isSent: true,
            sentAt: new Date(),
        });
    }
    async createVaultReceipt(userId, transaction) {
        const receiptsFolder = await database_1.prisma.vaultFolder.findFirst({
            where: { userId, slug: 'receipts', isSystem: true },
        });
        if (!receiptsFolder)
            return;
        await database_1.prisma.receipt.create({
            data: {
                transactionId: transaction.id,
                amount: transaction.amount,
                currency: 'INR',
                receiptDate: transaction.createdAt,
            },
        });
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map