import { Prisma, Transaction } from '@prisma/client';
import { PaginationQuery } from '../types';
export declare class TransactionRepository {
    findById(id: string, userId?: string): Promise<Transaction | null>;
    findByReference(referenceId: string): Promise<Transaction | null>;
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
    findMany(userId: string, pagination: PaginationQuery, filters: {
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
    }): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    getMonthlyStats(userId: string, months?: number): Promise<(Prisma.PickEnumerable<Prisma.TransactionGroupByOutputType, "type"[]> & {
        _count: number;
        _sum: {
            amount: number | null;
        };
    })[]>;
    getCategoryBreakdown(userId: string, startDate: Date, endDate: Date): Promise<(Prisma.PickEnumerable<Prisma.TransactionGroupByOutputType, "category"[]> & {
        _count: number;
        _sum: {
            amount: number | null;
        };
    })[]>;
}
//# sourceMappingURL=transaction.repository.d.ts.map