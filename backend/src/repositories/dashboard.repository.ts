import { prisma } from '../config/database';

export class DashboardRepository {
  async getPreferences(userId: string) {
    return prisma.dashboardPreference.findUnique({ where: { userId } });
  }

  async upsertPreferences(
    userId: string,
    data: any,
  ) {
    const toStr = (v: any) => typeof v === 'string' ? v : JSON.stringify(v ?? []);
    return prisma.dashboardPreference.upsert({
      where: { userId },
      create: {
        userId,
        layout:          toStr(data.layout),
        pinnedWidgets:   toStr(data.pinnedWidgets),
        hiddenWidgets:   toStr(data.hiddenWidgets),
        quickActionIds:  toStr(data.quickActionIds),
        colorScheme:     data.colorScheme ?? 'sbi-blue',
        compactMode:     data.compactMode ?? false,
        showBalanceOnLoad: data.showBalanceOnLoad ?? true,
        updatedAt: new Date(),
      },
      update: {
        layout:          data.layout !== undefined ? toStr(data.layout) : undefined,
        pinnedWidgets:   data.pinnedWidgets !== undefined ? toStr(data.pinnedWidgets) : undefined,
        hiddenWidgets:   data.hiddenWidgets !== undefined ? toStr(data.hiddenWidgets) : undefined,
        quickActionIds:  data.quickActionIds !== undefined ? toStr(data.quickActionIds) : undefined,
        colorScheme:     data.colorScheme,
        compactMode:     data.compactMode,
        showBalanceOnLoad: data.showBalanceOnLoad,
        updatedAt: new Date(),
      },
    });
  }

  async getQuickActions(userId: string) {
    return prisma.quickAction.findMany({
      where: { userId },
      orderBy: [{ isPinned: 'desc' }, { usageCount: 'desc' }, { sortOrder: 'asc' }],
    });
  }

  async upsertQuickAction(data: {
    userId: string;
    featureKey: string;
    label: string;
    route: string;
    icon: string;
  }) {
    return prisma.quickAction.upsert({
      where: { userId_featureKey: { userId: data.userId, featureKey: data.featureKey } },
      create: { ...data, usageCount: 1, lastUsedAt: new Date() },
      update: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
    });
  }

  async pinQuickAction(userId: string, featureKey: string, isPinned: boolean) {
    return prisma.quickAction.updateMany({
      where: { userId, featureKey },
      data: { isPinned },
    });
  }

  async getRecentActivities(userId: string, limit = 10) {
    return prisma.recentActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async addRecentActivity(data: {
    userId: string;
    featureKey: string;
    label: string;
    route: string;
    icon?: string;
    metadata?: Record<string, unknown>;
  }) {
    return prisma.recentActivity.create({ data: {
      userId: data.userId,
      featureKey: data.featureKey,
      label: data.label,
      route: data.route,
      icon: data.icon,
      metadata: (data.metadata ?? null) as any,
    }});
  }

  async getRewardBalance(userId: string): Promise<number> {
    const result = await prisma.rewardPoint.aggregate({
      where: { userId },
      _sum: { points: true },
    });
    // balance is tracked cumulatively; latest record has running balance
    const latest = await prisma.rewardPoint.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { balance: true },
    });
    return latest?.balance ?? 0;
  }

  async addRewardPoints(data: {
    userId: string;
    type: string;
    points: number;
    description: string;
    referenceId?: string;
    referenceType?: string;
    currentBalance: number;
  }) {
    const newBalance = data.currentBalance + data.points;
    return prisma.rewardPoint.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        points: data.points,
        description: data.description,
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        balance: newBalance,
      },
    });
  }
}
