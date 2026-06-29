import { DashboardSummary } from '../types';
export declare class DashboardService {
    getSummary(userId: string): Promise<DashboardSummary>;
    getPreferences(userId: string): Promise<{} | null>;
    updatePreferences(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        layout: string;
        pinnedWidgets: string;
        hiddenWidgets: string;
        quickActionIds: string;
        colorScheme: string;
        compactMode: boolean;
        showBalanceOnLoad: boolean;
    }>;
    getQuickActions(userId: string): Promise<{}>;
    trackActivity(userId: string, data: {
        featureKey: string;
        label: string;
        route: string;
        icon?: string;
        metadata?: Record<string, unknown>;
    }): Promise<void>;
    pinAction(userId: string, featureKey: string, isPinned: boolean): Promise<void>;
    getRecentActivities(userId: string): Promise<{
        route: string;
        id: string;
        userId: string;
        createdAt: Date;
        metadata: string | null;
        icon: string | null;
        featureKey: string;
        label: string;
    }[]>;
    getSpendingInsights(userId: string): Promise<{
        currentMonth: number;
        previousMonth: number;
        changePercent: number;
        trend: string;
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map