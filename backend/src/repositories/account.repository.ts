import { Prisma, Account } from '@prisma/client';
import { prisma } from '../config/database';

export class AccountRepository {
  async findById(id: string, userId?: string): Promise<Account | null> {
    return prisma.account.findFirst({
      where: { id, ...(userId ? { userId } : {}) },
    });
  }

  async findByNumber(accountNumber: string): Promise<Account | null> {
    return prisma.account.findUnique({ where: { accountNumber } });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return prisma.account.create({ data });
  }

  async update(id: string, data: Prisma.AccountUpdateInput): Promise<Account> {
    return prisma.account.update({ where: { id }, data });
  }

  async updateBalance(
    id: string,
    amount: number,
    operation: 'increment' | 'decrement',
  ): Promise<Account> {
    return prisma.account.update({
      where: { id },
      data: {
        balance: { [operation]: amount },
        availableBalance: { [operation]: amount },
        updatedAt: new Date(),
      },
    });
  }

  async findBeneficiaries(userId: string) {
    return prisma.beneficiary.findMany({
      where: { userId },
      orderBy: [{ isFavorite: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findBeneficiaryById(id: string, userId: string) {
    return prisma.beneficiary.findFirst({ where: { id, userId } });
  }

  async createBeneficiary(data: Prisma.BeneficiaryCreateInput) {
    return prisma.beneficiary.create({ data });
  }

  async updateBeneficiary(id: string, data: Prisma.BeneficiaryUpdateInput) {
    return prisma.beneficiary.update({ where: { id }, data });
  }

  async deleteBeneficiary(id: string, userId: string): Promise<void> {
    await prisma.beneficiary.deleteMany({ where: { id, userId } });
  }

  async getTotalBalance(userId: string): Promise<number> {
    const result = await prisma.account.aggregate({
      where: { userId, status: 'ACTIVE' },
      _sum: { balance: true },
    });
    return Number(result._sum.balance ?? 0);
  }
}
