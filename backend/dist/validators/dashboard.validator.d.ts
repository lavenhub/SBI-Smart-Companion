import { z } from 'zod';
export declare const updatePreferencesSchema: z.ZodObject<{
    body: z.ZodObject<{
        layout: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
        pinnedWidgets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        hiddenWidgets: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        quickActionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        colorScheme: z.ZodOptional<z.ZodString>;
        compactMode: z.ZodOptional<z.ZodBoolean>;
        showBalanceOnLoad: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        layout?: unknown[] | undefined;
        pinnedWidgets?: string[] | undefined;
        hiddenWidgets?: string[] | undefined;
        quickActionIds?: string[] | undefined;
        colorScheme?: string | undefined;
        compactMode?: boolean | undefined;
        showBalanceOnLoad?: boolean | undefined;
    }, {
        layout?: unknown[] | undefined;
        pinnedWidgets?: string[] | undefined;
        hiddenWidgets?: string[] | undefined;
        quickActionIds?: string[] | undefined;
        colorScheme?: string | undefined;
        compactMode?: boolean | undefined;
        showBalanceOnLoad?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        layout?: unknown[] | undefined;
        pinnedWidgets?: string[] | undefined;
        hiddenWidgets?: string[] | undefined;
        quickActionIds?: string[] | undefined;
        colorScheme?: string | undefined;
        compactMode?: boolean | undefined;
        showBalanceOnLoad?: boolean | undefined;
    };
}, {
    body: {
        layout?: unknown[] | undefined;
        pinnedWidgets?: string[] | undefined;
        hiddenWidgets?: string[] | undefined;
        quickActionIds?: string[] | undefined;
        colorScheme?: string | undefined;
        compactMode?: boolean | undefined;
        showBalanceOnLoad?: boolean | undefined;
    };
}>;
export declare const trackActivitySchema: z.ZodObject<{
    body: z.ZodObject<{
        featureKey: z.ZodString;
        label: z.ZodString;
        route: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        route: string;
        featureKey: string;
        label: string;
        metadata?: Record<string, unknown> | undefined;
        icon?: string | undefined;
    }, {
        route: string;
        featureKey: string;
        label: string;
        metadata?: Record<string, unknown> | undefined;
        icon?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        route: string;
        featureKey: string;
        label: string;
        metadata?: Record<string, unknown> | undefined;
        icon?: string | undefined;
    };
}, {
    body: {
        route: string;
        featureKey: string;
        label: string;
        metadata?: Record<string, unknown> | undefined;
        icon?: string | undefined;
    };
}>;
export declare const pinActionSchema: z.ZodObject<{
    body: z.ZodObject<{
        featureKey: z.ZodString;
        label: z.ZodString;
        route: z.ZodString;
        icon: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        route: string;
        icon: string;
        featureKey: string;
        label: string;
    }, {
        route: string;
        icon: string;
        featureKey: string;
        label: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        route: string;
        icon: string;
        featureKey: string;
        label: string;
    };
}, {
    body: {
        route: string;
        icon: string;
        featureKey: string;
        label: string;
    };
}>;
//# sourceMappingURL=dashboard.validator.d.ts.map