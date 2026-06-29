import { prisma } from '../config/database';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountRepository } from '../repositories/account.repository';
import { VaultRepository } from '../repositories/vault.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { DashboardRepository } from '../repositories/dashboard.repository';
import {
  BusinessError, NotFoundError, AuthorizationError,
} from '../utils/errors';
import {
  generateReferenceId, detectCategory, generateOtp,
} from '../utils/helpers';
import { TRANSACTION, REWARD_RATES } from '../constants';
import { InitiateTransactionDto, PaginationQuery } from '../types';
import { createAuditEntry } from '../middlewares/audit.middleware';

const txnRepo = new TransactionRepository();
const accountRepo = new AccountRepository();
const vaultRepo = new VaultRepository();
const notifRepo = new NotificationRepository();
const dashRepo = new DashboardRepository();

export class TransactionService {
  // ── Initiate ───────────────────────────────────────────────────────────────
  async initiate(userId: string, dto: InitiateTransactionDto) {
    const account = await accountRepo.findById(dto.accountId, userId);
    if (!account) throw new NotFoundError('Account');
    if (account.status !== 'ACTIVE') throw new BusinessError('Account is not active');

    const amount = Number(dto.amount);
    this.validateTransactionLimits(amount, dto.mode);

    if (Number(account.availableBalance) < amount) {
      throw new BusinessError('Insufficient balance');
    }

    // Calculate charges
    const charges = this.calculateCharges(amount, dto.mode);
    const netAmount = amount + charges;

    if (Number(account.availableBalance) < netAmount) {
      throw new BusinessError('Insufficient balance including charges');
    }

    const referenceId = generateReferenceId(dto.mode);
    const balanceBefore = Number(account.balance);
    const balanceAfter = balanceBefore - netAmount;

    // Execute atomically
    const transaction = await prisma.$transaction(async (tx) => {
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

      const category = detectCategory(dto.description ?? '');

      const txn = await tx.transaction.create({
        data: {
          userId,
          accountId: dto.accountId,
          cardId: dto.cardId,
          beneficiaryId: dto.beneficiaryId,
          referenceId,
          type: 'DEBIT',
          mode: dto.mode as any,
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

    await createAuditEntry({
      userId,
      action: 'TRANSFER_COMPLETED',
      entityType: 'Transaction',
      entityId: transaction.id,
      description: `${dto.mode} transfer of ₹${amount} — Ref: ${referenceId}`,
    });

    return transaction;
  }

  // ── Get Transactions ───────────────────────────────────────────────────────
  async getTransactions(userId: string, pagination: PaginationQuery, filters: any) {
    const page = Math.max(1, pagination.page);
    const pageSize = Math.min(pagination.pageSize, 100);

    // Convert date strings
    if (filters.startDate) filters.startDate = new Date(filters.startDate);
    if (filters.endDate) filters.endDate = new Date(filters.endDate);

    return txnRepo.findMany(userId, { ...pagination, page, pageSize }, filters);
  }

  // ── Get by ID ──────────────────────────────────────────────────────────────
  async getById(id: string, userId: string) {
    const txn = await txnRepo.findById(id, userId);
    if (!txn) throw new NotFoundError('Transaction');
    return txn;
  }

  // ── Monthly Analytics ──────────────────────────────────────────────────────
  async getMonthlyAnalytics(userId: string) {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const stats = await prisma.transaction.aggregate({
        where: { userId, status: 'COMPLETED', createdAt: { gte: start, lte: end } },
        _sum: { amount: true },
        _count: true,
      });

      const income = await prisma.transaction.aggregate({
        where: { userId, status: 'COMPLETED', type: 'CREDIT', createdAt: { gte: start, lte: end } },
        _sum: { amount: true },
      });

      const expense = await prisma.transaction.aggregate({
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
  async getCategoryBreakdown(userId: string, month?: string) {
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
  private validateTransactionLimits(amount: number, mode: string): void {
    if (amount < TRANSACTION.MIN_AMOUNT) {
      throw new BusinessError(`Minimum transaction amount is ₹${TRANSACTION.MIN_AMOUNT}`);
    }
    const limits: Record<string, number> = {
      UPI: TRANSACTION.MAX_UPI_AMOUNT,
      NEFT: TRANSACTION.MAX_NEFT_AMOUNT,
      RTGS: TRANSACTION.MAX_RTGS_AMOUNT,
      IMPS: TRANSACTION.MAX_IMPS_AMOUNT,
    };
    if (limits[mode] && amount > limits[mode]) {
      throw new BusinessError(`Maximum ${mode} amount is ₹${limits[mode].toLocaleString('en-IN')}`);
    }
    if (mode === 'RTGS' && amount < TRANSACTION.MIN_RTGS_AMOUNT) {
      throw new BusinessError(`Minimum RTGS amount is ₹${TRANSACTION.MIN_RTGS_AMOUNT.toLocaleString('en-IN')}`);
    }
  }

  private calculateCharges(amount: number, mode: string): number {
    if (mode === 'UPI' || mode === 'INTERNAL') return 0;
    if (mode === 'NEFT') {
      for (const slab of TRANSACTION.NEFT_FEE_SLAB) {
        if (amount <= slab.max) return slab.fee;
      }
    }
    if (mode === 'IMPS') return Math.min(amount * TRANSACTION.IMPS_FEE_RATE, 25);
    return 0;
  }

  private async postTransactionEffects(userId: string, transaction: any, amount: number) {
    // Award reward points for card transactions
    if (transaction.mode === 'CARD') {
      const points = Math.floor((amount / 100) * REWARD_RATES.CARD_TRANSACTION_PER_100);
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

  private async createVaultReceipt(userId: string, transaction: any) {
    const receiptsFolder = await prisma.vaultFolder.findFirst({
      where: { userId, slug: 'receipts', isSystem: true },
    });
    if (!receiptsFolder) return;

    await prisma.receipt.create({
      data: {
        transactionId: transaction.id,
        amount: transaction.amount,
        currency: 'INR',
        receiptDate: transaction.createdAt,
      },
    });
  }
}
