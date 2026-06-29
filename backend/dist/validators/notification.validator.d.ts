import { z } from 'zod';
export declare const getNotificationsSchema: z.ZodObject<{
    query: z.ZodObject<{
        isRead: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        type: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        pageSize: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        type?: string | undefined;
        isRead?: "true" | "false" | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    }, {
        type?: string | undefined;
        isRead?: "true" | "false" | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        type?: string | undefined;
        isRead?: "true" | "false" | undefined;
        page?: number | undefined;
        pageSize?: number | undefined;
    };
}, {
    query: {
        type?: string | undefined;
        isRead?: "true" | "false" | undefined;
        page?: string | undefined;
        pageSize?: string | undefined;
    };
}>;
export declare const markReadSchema: z.ZodObject<{
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
export declare const markAllReadSchema: z.ZodObject<{
    body: z.ZodObject<{
        ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        ids?: string[] | undefined;
    }, {
        ids?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        ids?: string[] | undefined;
    };
}, {
    body: {
        ids?: string[] | undefined;
    };
}>;
//# sourceMappingURL=notification.validator.d.ts.map