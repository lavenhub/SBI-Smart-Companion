import { z } from 'zod';
export declare const createFolderSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        parentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        description: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
        icon?: string | undefined;
        parentId?: string | null | undefined;
    }, {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
        icon?: string | undefined;
        parentId?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
        icon?: string | undefined;
        parentId?: string | null | undefined;
    };
}, {
    body: {
        name: string;
        description?: string | undefined;
        color?: string | undefined;
        icon?: string | undefined;
        parentId?: string | null | undefined;
    };
}>;
export declare const uploadDocumentSchema: z.ZodObject<{
    body: z.ZodObject<{
        folderId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodEnum<["STATEMENT", "LOAN_DOCUMENT", "FD_CERTIFICATE", "INSURANCE_POLICY", "TAX_DOCUMENT", "RECEIPT", "INVOICE", "WARRANTY", "GST_BILL", "KYC_DOCUMENT", "CHEQUE", "MANDATE", "OTHER"]>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        category: "RECEIPT" | "STATEMENT" | "LOAN_DOCUMENT" | "FD_CERTIFICATE" | "INSURANCE_POLICY" | "TAX_DOCUMENT" | "INVOICE" | "WARRANTY" | "GST_BILL" | "KYC_DOCUMENT" | "CHEQUE" | "MANDATE" | "OTHER";
        description?: string | undefined;
        folderId?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        name: string;
        category: "RECEIPT" | "STATEMENT" | "LOAN_DOCUMENT" | "FD_CERTIFICATE" | "INSURANCE_POLICY" | "TAX_DOCUMENT" | "INVOICE" | "WARRANTY" | "GST_BILL" | "KYC_DOCUMENT" | "CHEQUE" | "MANDATE" | "OTHER";
        description?: string | undefined;
        folderId?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        category: "RECEIPT" | "STATEMENT" | "LOAN_DOCUMENT" | "FD_CERTIFICATE" | "INSURANCE_POLICY" | "TAX_DOCUMENT" | "INVOICE" | "WARRANTY" | "GST_BILL" | "KYC_DOCUMENT" | "CHEQUE" | "MANDATE" | "OTHER";
        description?: string | undefined;
        folderId?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
}, {
    body: {
        name: string;
        category: "RECEIPT" | "STATEMENT" | "LOAN_DOCUMENT" | "FD_CERTIFICATE" | "INSURANCE_POLICY" | "TAX_DOCUMENT" | "INVOICE" | "WARRANTY" | "GST_BILL" | "KYC_DOCUMENT" | "CHEQUE" | "MANDATE" | "OTHER";
        description?: string | undefined;
        folderId?: string | undefined;
        tags?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
}>;
export declare const documentSearchSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        folderId: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        pageSize: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        q: string;
        category?: string | undefined;
        folderId?: string | undefined;
        startDate?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        endDate?: string | undefined;
    }, {
        q: string;
        category?: string | undefined;
        folderId?: string | undefined;
        startDate?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        q: string;
        category?: string | undefined;
        folderId?: string | undefined;
        startDate?: string | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        q: string;
        category?: string | undefined;
        folderId?: string | undefined;
        startDate?: string | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export declare const folderIdSchema: z.ZodObject<{
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
export declare const documentIdSchema: z.ZodObject<{
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
//# sourceMappingURL=vault.validator.d.ts.map