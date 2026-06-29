"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const database_1 = require("../config/database");
class DashboardRepository {
    async getPreferences(userId) {
        return database_1.prisma.dashboardPreference.findUnique({ where: { userId } });
    }
    async upsertPreferences(userId, data) {
        const toStr = (v) => typeof v === 'string' ? v : JSON.stringify(v ?? []);
        return database_1.prisma.dashboardPreference.upsert({
            where: { userId },
            create: {
                userId,
                layout: toStr(data.layout),
                pinnedWidgets: toStr(data.pinnedWidgets),
                hiddenWidgets: toStr(data.hiddenWidgets),
                quickActionIds: toStr(data.quickActionIds),
                colorScheme: data.colorScheme ?? 'sbi-blue',
                compactMode: data.compactMode ?? false,
                showBalanceOnLoad: data.showBalanceOnLoad ?? true,
                updatedAt: new Date(),
            },
            update: {
                layout: data.layout !== undefined ? toStr(data.layout) : undefined,
                pinnedWidgets: data.pinnedWidgets !== undefined ? toStr(data.pinnedWidgets) : undefined,
                hiddenWidgets: data.hiddenWidgets !== undefined ? toStr(data.hiddenWidgets) : undefined,
                quickActionIds: data.quickActionIds !== undefined ? toStr(data.quickActionIds) : undefined,
                colorScheme: data.colorScheme,
                compactMode: data.compactMode,
                showBalanceOnLoad: data.showBalanceOnLoad,
                updatedAt: new Date(),
            },
        });
    }
    async getQuickActions(userId) {
        return database_1.prisma.quickAction.findMany({
            where: { userId },
            orderBy: [{ isPinned: 'desc' }, { usageCount: 'desc' }, { sortOrder: 'asc' }],
        });
    }
    async upsertQuickAction(data) {
        return database_1.prisma.quickAction.upsert({
            where: { userId_featureKey: { userId: data.userId, featureKey: data.featureKey } },
            create: { ...data, usageCount: 1, lastUsedAt: new Date() },
            update: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
        });
    }
    async pinQuickAction(userId, featureKey, isPinned) {
        return database_1.prisma.quickAction.updateMany({
            where: { userId, featureKey },
            data: { isPinned },
        });
    }
    async getRecentActivities(userId, limit = 10) {
        return database_1.prisma.recentActivity.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async addRecentActivity(data) {
        return database_1.prisma.recentActivity.create({ data: {
                userId: data.userId,
                featureKey: data.featureKey,
                label: data.label,
                route: data.route,
                icon: data.icon,
                metadata: (data.metadata ?? null),
            } });
    }
    async getRewardBalance(userId) {
        const result = await database_1.prisma.rewardPoint.aggregate({
            where: { userId },
            _sum: { points: true },
        });
        // balance is tracked cumulatively; latest record has running balance
        const latest = await database_1.prisma.rewardPoint.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { balance: true },
        });
        return latest?.balance ?? 0;
    }
    async addRewardPoints(data) {
        const newBalance = data.currentBalance + data.points;
        return database_1.prisma.rewardPoint.create({
            data: {
                userId: data.userId,
                type: data.type,
                points: data.points,
                description: data.description,
                referenceId: data.referenceId,
                referenceType: data.referenceType,
                balance: newBalance,
            },
        });
    }
}
exports.DashboardRepository = DashboardRepository;
//# sourceMappingURL=dashboard.repository.js.map