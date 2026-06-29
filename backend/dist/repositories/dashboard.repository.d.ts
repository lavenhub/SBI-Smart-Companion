export declare class DashboardRepository {
    getPreferences(userId: string): Promise<{
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
    } | null>;
    upsertPreferences(userId: string, data: any): Promise<{
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
    getQuickActions(userId: string): Promise<{
        route: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        sortOrder: number;
        featureKey: string;
        label: string;
        usageCount: number;
        lastUsedAt: Date | null;
        isPinned: boolean;
    }[]>;
    upsertQuickAction(data: {
        userId: string;
        featureKey: string;
        label: string;
        route: string;
        icon: string;
    }): Promise<{
        route: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        icon: string;
        sortOrder: number;
        featureKey: string;
        label: string;
        usageCount: number;
        lastUsedAt: Date | null;
        isPinned: boolean;
    }>;
    pinQuickAction(userId: string, featureKey: string, isPinned: boolean): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getRecentActivities(userId: string, limit?: number): Promise<{
        route: string;
        id: string;
        userId: string;
        createdAt: Date;
        metadata: string | null;
        icon: string | null;
        featureKey: string;
        label: string;
    }[]>;
    addRecentActivity(data: {
        userId: string;
        featureKey: string;
        label: string;
        route: string;
        icon?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        route: string;
        id: string;
        userId: string;
        createdAt: Date;
        metadata: string | null;
        icon: string | null;
        featureKey: string;
        label: string;
    }>;
    getRewardBalance(userId: string): Promise<number>;
    addRewardPoints(data: {
        userId: string;
        type: string;
        points: number;
        description: string;
        referenceId?: string;
        referenceType?: string;
        currentBalance: number;
    }): Promise<{
        type: string;
        id: string;
        userId: string;
        referenceId: string | null;
        description: string;
        createdAt: Date;
        balance: number;
        expiresAt: Date | null;
        points: number;
        referenceType: string | null;
    }>;
}
//# sourceMappingURL=dashboard.repository.d.ts.map