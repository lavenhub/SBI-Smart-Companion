import { Prisma, Transaction } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationQuery } from '../types';

export class TransactionRepository {
  async findById(id: string, userId?: string): Promise<Transaction | null> {
    return prisma.transaction.findFirst({
      where: { id, ...(userId ? { userId } : {}) },
      include: {
        account: { select: { accountNumber: true, accountType: true } },
        merchant: { select: { name: true, logoUrl: true } },
        beneficiary: { select: { name: true, upiId: true } },
        receipt: { select: { id: true, amount: true } },
      },
    });
  }

  async findByReference(referenceId: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({ where: { referenceId } });
  }

  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return prisma.transaction.create({ data });
  }

  async update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
    return prisma.transaction.update({ where: { id }, data });
  }

  async findMany(
    userId: string,
    pagination: PaginationQuery,
    filters: {
      accountId?: string;
      type?: string;
      mode?: string;
      status?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      search?: string;
    },
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const { page, pageSize, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(filters.accountId && { accountId: filters.accountId }),
      ...(filters.type && { type: filters.type as any }),
      ...(filters.mode && { mode: filters.mode as any }),
      ...(filters.status && { status: filters.status as any }),
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

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include: {
          merchant: { select: { name: true, logoUrl: true } },
          receipt: { select: { id: true } },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  }

  async getMonthlyStats(userId: string, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return prisma.transaction.groupBy({
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

  async getCategoryBreakdown(userId: string, startDate: Date, endDate: Date) {
    return prisma.transaction.groupBy({
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
