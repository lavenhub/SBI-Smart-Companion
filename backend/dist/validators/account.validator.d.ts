import { z } from 'zod';
export declare const accountIdSchema: z.ZodObject<{
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
export declare const getStatementSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    query: z.ZodObject<{
        startDate: z.ZodEffects<z.ZodString, string, string>;
        endDate: z.ZodEffects<z.ZodString, string, string>;
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["json", "pdf"]>>>;
    }, "strip", z.ZodTypeAny, {
        format: "json" | "pdf";
        startDate: string;
        endDate: string;
    }, {
        startDate: string;
        endDate: string;
        format?: "json" | "pdf" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    query: {
        format: "json" | "pdf";
        startDate: string;
        endDate: string;
    };
}, {
    params: {
        id: string;
    };
    query: {
        startDate: string;
        endDate: string;
        format?: "json" | "pdf" | undefined;
    };
}>;
export declare const transferSchema: z.ZodObject<{
    body: z.ZodObject<{
        fromAccountId: z.ZodString;
        toAccountId: z.ZodOptional<z.ZodString>;
        beneficiaryId: z.ZodOptional<z.ZodString>;
        amount: z.ZodNumber;
        mode: z.ZodEnum<["UPI", "NEFT", "RTGS", "IMPS", "INTERNAL"]>;
        remarks: z.ZodOptional<z.ZodString>;
        scheduledAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL";
        fromAccountId: string;
        beneficiaryId?: string | undefined;
        remarks?: string | undefined;
        toAccountId?: string | undefined;
        scheduledAt?: string | undefined;
    }, {
        amount: number;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL";
        fromAccountId: string;
        beneficiaryId?: string | undefined;
        remarks?: string | undefined;
        toAccountId?: string | undefined;
        scheduledAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL";
        fromAccountId: string;
        beneficiaryId?: string | undefined;
        remarks?: string | undefined;
        toAccountId?: string | undefined;
        scheduledAt?: string | undefined;
    };
}, {
    body: {
        amount: number;
        mode: "UPI" | "NEFT" | "RTGS" | "IMPS" | "INTERNAL";
        fromAccountId: string;
        beneficiaryId?: string | undefined;
        remarks?: string | undefined;
        toAccountId?: string | undefined;
        scheduledAt?: string | undefined;
    };
}>;
export declare const createBeneficiarySchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        nickname: z.ZodOptional<z.ZodString>;
        bankName: z.ZodOptional<z.ZodString>;
        accountNumber: z.ZodOptional<z.ZodString>;
        ifscCode: z.ZodOptional<z.ZodString>;
        upiId: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    }, {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    }>, {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    }, {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    };
}, {
    body: {
        name: string;
        accountNumber?: string | undefined;
        ifscCode?: string | undefined;
        phone?: string | undefined;
        nickname?: string | undefined;
        bankName?: string | undefined;
        upiId?: string | undefined;
    };
}>;
//# sourceMappingURL=account.validator.d.ts.map