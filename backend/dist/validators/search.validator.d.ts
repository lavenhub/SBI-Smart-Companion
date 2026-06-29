import { z } from 'zod';
export declare const searchSchema: z.ZodObject<{
    body: z.ZodObject<{
        query: z.ZodString;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        sessionId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        query: string;
        sessionId?: string | undefined;
    }, {
        query: string;
        limit?: number | undefined;
        sessionId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        limit: number;
        query: string;
        sessionId?: string | undefined;
    };
}, {
    body: {
        query: string;
        limit?: number | undefined;
        sessionId?: string | undefined;
    };
}>;
export declare const searchQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodString;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        q: string;
        limit?: number | undefined;
    }, {
        q: string;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        q: string;
        limit?: number | undefined;
    };
}, {
    query: {
        q: string;
        limit?: string | undefined;
    };
}>;
export declare const recordClickSchema: z.ZodObject<{
    body: z.ZodObject<{
        historyId: z.ZodString;
        clickedId: z.ZodString;
        clickedType: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        clickedId: string;
        clickedType: string;
        historyId: string;
    }, {
        clickedId: string;
        clickedType: string;
        historyId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        clickedId: string;
        clickedType: string;
        historyId: string;
    };
}, {
    body: {
        clickedId: string;
        clickedType: string;
        historyId: string;
    };
}>;
//# sourceMappingURL=search.validator.d.ts.map