import { z } from 'zod';
export declare const initiateTransactionSchema: z.ZodObject<{
    body: z.ZodObject<{
        accountId: z.ZodString;
        beneficiaryId: z.ZodOptional<z.ZodString>;
        amount: z.ZodNumber;
        mode: z.ZodEnum<["UPI", "NEFT", "RTGS", "IMPS", "CARD", "WALLET", "INTERNAL"]>;
        description: z.ZodOptional<z.ZodString>;
        remarks: z.ZodOptional<z.ZodString>;
        senderUpi: z.ZodOptional<z.ZodString>;
        receiverUpi: z.ZodOptional<z.ZodString>;
        cardId: z.ZodOptional<z.ZodString>;
        mpin: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        accountId: string;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL" | "CARD" | "WALLET";
        cardId?: string | undefined;
        beneficiaryId?: string | undefined;
        description?: string | undefined;
        remarks?: string | undefined;
        senderUpi?: string | undefined;
        receiverUpi?: string | undefined;
        mpin?: string | undefined;
    }, {
        amount: number;
        accountId: string;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL" | "CARD" | "WALLET";
        cardId?: string | undefined;
        beneficiaryId?: string | undefined;
        description?: string | undefined;
        remarks?: string | undefined;
        senderUpi?: string | undefined;
        receiverUpi?: string | undefined;
        mpin?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        accountId: string;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL" | "CARD" | "WALLET";
        cardId?: string | undefined;
        beneficiaryId?: string | undefined;
        description?: string | undefined;
        remarks?: string | undefined;
        senderUpi?: string | undefined;
        receiverUpi?: string | undefined;
        mpin?: string | undefined;
    };
}, {
    body: {
        amount: number;
        accountId: string;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL" | "CARD" | "WALLET";
        cardId?: string | undefined;
        beneficiaryId?: string | undefined;
        description?: string | undefined;
        remarks?: string | undefined;
        senderUpi?: string | undefined;
        receiverUpi?: string | undefined;
        mpin?: string | undefined;
    };
}>;
export declare const getTransactionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        pageSize: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        accountId: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
        mode: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        minAmount: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        maxAmount: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    }, "strip", z.ZodTypeAny, {
        type?: "CREDIT" | "DEBIT" | undefined;
        status?: string | undefined;
        search?: string | undefined;
        accountId?: string | undefined;
        mode?: string | undefined;
        category?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        sortBy?: string | undefined;
        endDate?: string | undefined;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    }, {
        type?: "CREDIT" | "DEBIT" | undefined;
        status?: string | undefined;
        search?: string | undefined;
        accountId?: string | undefined;
        mode?: string | undefined;
        category?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
        sortBy?: string | undefined;
        endDate?: string | undefined;
        minAmount?: string | undefined;
        maxAmount?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        type?: "CREDIT" | "DEBIT" | undefined;
        status?: string | undefined;
        search?: string | undefined;
        accountId?: string | undefined;
        mode?: string | undefined;
        category?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        sortBy?: string | undefined;
        endDate?: string | undefined;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    };
}, {
    query: {
        type?: "CREDIT" | "DEBIT" | undefined;
        status?: string | undefined;
        search?: string | undefined;
        accountId?: string | undefined;
        mode?: string | undefined;
        category?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        startDate?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
        sortBy?: string | undefined;
        endDate?: string | undefined;
        minAmount?: string | undefined;
        maxAmount?: string | undefined;
    };
}>;
export declare const transactionIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
//# sourceMappingURL=transaction.validator.d.ts.map