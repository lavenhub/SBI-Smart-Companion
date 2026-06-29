import { z } from 'zod';
export declare const startApplicationSchema: z.ZodObject<{
    body: z.ZodObject<{
        applicationType: z.ZodEnum<["LOAN", "CREDIT_CARD", "FIXED_DEPOSIT", "INSURANCE", "NOMINEE_UPDATE", "ADDRESS_UPDATE", "KYC_UPDATE", "CHEQUE_BOOK", "ACCOUNT_OPENING"]>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        applicationType: "LOAN" | "CREDIT_CARD" | "FIXED_DEPOSIT" | "INSURANCE" | "NOMINEE_UPDATE" | "ADDRESS_UPDATE" | "KYC_UPDATE" | "CHEQUE_BOOK" | "ACCOUNT_OPENING";
        title?: string | undefined;
    }, {
        applicationType: "LOAN" | "CREDIT_CARD" | "FIXED_DEPOSIT" | "INSURANCE" | "NOMINEE_UPDATE" | "ADDRESS_UPDATE" | "KYC_UPDATE" | "CHEQUE_BOOK" | "ACCOUNT_OPENING";
        title?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        applicationType: "LOAN" | "CREDIT_CARD" | "FIXED_DEPOSIT" | "INSURANCE" | "NOMINEE_UPDATE" | "ADDRESS_UPDATE" | "KYC_UPDATE" | "CHEQUE_BOOK" | "ACCOUNT_OPENING";
        title?: string | undefined;
    };
}, {
    body: {
        applicationType: "LOAN" | "CREDIT_CARD" | "FIXED_DEPOSIT" | "INSURANCE" | "NOMINEE_UPDATE" | "ADDRESS_UPDATE" | "KYC_UPDATE" | "CHEQUE_BOOK" | "ACCOUNT_OPENING";
        title?: string | undefined;
    };
}>;
export declare const saveDraftSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        stepIndex: z.ZodNumber;
        fieldData: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        stepIndex: number;
        fieldData: Record<string, unknown>;
    }, {
        stepIndex: number;
        fieldData: Record<string, unknown>;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        stepIndex: number;
        fieldData: Record<string, unknown>;
    };
}, {
    params: {
        id: string;
    };
    body: {
        stepIndex: number;
        fieldData: Record<string, unknown>;
    };
}>;
export declare const submitApplicationSchema: z.ZodObject<{
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
export declare const applicationIdSchema: z.ZodObject<{
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
export declare const getApplicationsSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodString>;
        applicationType: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        pageSize: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        status?: string | undefined;
        applicationType?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }, {
        status?: string | undefined;
        applicationType?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        status?: string | undefined;
        applicationType?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}, {
    query: {
        status?: string | undefined;
        applicationType?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
    };
}>;
//# sourceMappingURL=application.validator.d.ts.map