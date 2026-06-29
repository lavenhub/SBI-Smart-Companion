import { InitiateTransactionDto, PaginationQuery } from '../types';
export declare class TransactionService {
    initiate(userId: string, dto: InitiateTransactionDto): Promise<{
        account: {
            accountNumber: string;
        };
        beneficiary: {
            name: string;
        } | null;
    } & {
        type: string;
        status: string;
        amount: number;
        id: string;
        userId: string;
        accountId: string;
        cardId: string | null;
        beneficiaryId: string | null;
        merchantId: string | null;
        referenceId: string;
        mode: string;
        currency: string;
        charges: number;
        tax: number;
        netAmount: number;
        balanceBefore: number;
        balanceAfter: number;
        description: string | null;
        remarks: string | null;
        category: string | null;
        subCategory: string | null;
        senderUpi: string | null;
        receiverUpi: string | null;
        bankRef: string | null;
        ipAddress: string | null;
        deviceId: string | null;
        location: string | null;
        failureReason: string | null;
        processedAt: Date | null;
        reversedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTransactions(userId: string, pagination: PaginationQuery, filters: any): Promise<{
        transactions: import(".prisma/client").Transaction[];
        total: number;
    }>;
    getById(id: string, userId: string): Promise<{
        type: string;
        status: string;
        amount: number;
        id: string;
        userId: string;
        accountId: string;
        cardId: string | null;
        beneficiaryId: string | null;
        merchantId: string | null;
        referenceId: string;
        mode: string;
        currency: string;
        charges: number;
        tax: number;
        netAmount: number;
        balanceBefore: number;
        balanceAfter: number;
        description: string | null;
        remarks: string | null;
        category: string | null;
        subCategory: string | null;
        senderUpi: string | null;
        receiverUpi: string | null;
        bankRef: string | null;
        ipAddress: string | null;
        deviceId: string | null;
        location: string | null;
        failureReason: string | null;
        processedAt: Date | null;
        reversedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMonthlyAnalytics(userId: string): Promise<{
        month: string;
        year: number;
        income: number;
        expense: number;
        savings: number;
        count: number;
    }[]>;
    getCategoryBreakdown(userId: string, month?: string): Promise<{
        category: string;
        amount: number;
        count: number;
        percentage: number;
    }[]>;
    private validateTransactionLimits;
    private calculateCharges;
    private postTransactionEffects;
    private createVaultReceipt;
}
//# sourceMappingURL=transaction.service.d.ts.map