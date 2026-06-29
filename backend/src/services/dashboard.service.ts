import { DashboardRepository } from '../repositories/dashboard.repository';
import { AccountRepository } from '../repositories/account.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { prisma } from '../config/database';
import { cache } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants';
import { DashboardSummary } from '../types';
import { daysUntil } from '../utils/helpers';

const dashRepo = new DashboardRepository();
const accountRepo = new AccountRepository();
const notifRepo = new NotificationRepository();

export class DashboardService {
  // ── Full Summary ──────────────────────────────────────────────────────────
  async getSummary(userId: string): Promise<DashboardSummary> {
    const cacheKey = CACHE_KEYS.USER_DASHBOARD(userId);
    const cached = await cache.get<DashboardSummary>(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      accounts,
      monthlyCredit,
      monthlyDebit,
      rewardPoints,
      upcomingBills,
      recentTransactions,
    ] = await Promise.all([
      accountRepo.findByUserId(userId),
      prisma.transaction.aggregate({
        where: { userId, type: 'CREDIT', status: 'COMPLETED', createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: monthStart } },
        _sum: { amount: true },
      }),
      dashRepo.getRewardBalance(userId),
      prisma.bill.findMany({
        where: { userId, status: 'PENDING', dueDate: { gte: now } },
        orderBy: { dueDate: 'asc' },
        take: 10,
      }),
      prisma.transaction.findMany({
        where: { userId, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { merchant: { select: { name: true, logoUrl: true } } },
      }),
    ]);

    const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
    const availableBalance = accounts.reduce((s, a) => s + Number(a.availableBalance), 0);
    const income = Number(monthlyCredit._sum.amount ?? 0);
    const expense = Number(monthlyDebit._sum.amount ?? 0);

    const summary: DashboardSummary = {
      totalBalance,
      availableBalance,
      monthlyIncome: income,
      monthlyExpense: expense,
      monthlySavings: income - expense,
      rewardPoints,
      creditScore: 782, // Would integrate with CIBIL API in production
      upcomingBills: upcomingBills.map((b) => ({
        id: b.id,
        name: b.name,
        amount: Number(b.amount),
        dueDate: b.dueDate,
        category: b.category,
        status: b.status,
        daysUntilDue: daysUntil(b.dueDate),
      })),
      recentTransactions: recentTransactions as any,
      savingsGoalProgress: 0,
    };

    await cache.set(cacheKey, summary, CACHE_TTL.DASHBOARD);
    return summary;
  }

  // ── Preferences ───────────────────────────────────────────────────────────
  async getPreferences(userId: string) {
    const cached = await cache.get(CACHE_KEYS.DASHBOARD_PREFS(userId));
    if (cached) return cached;

    const prefs = await dashRepo.getPreferences(userId);
    if (prefs) await cache.set(CACHE_KEYS.DASHBOARD_PREFS(userId), prefs, CACHE_TTL.LONG);
    return prefs;
  }

  async updatePreferences(userId: string, data: any) {
    const prefs = await dashRepo.upsertPreferences(userId, data);
    await cache.del(CACHE_KEYS.DASHBOARD_PREFS(userId));
    return prefs;
  }

  // ── Quick Actions ─────────────────────────────────────────────────────────
  async getQuickActions(userId: string) {
    const cached = await cache.get(CACHE_KEYS.QUICK_ACTIONS(userId));
    if (cached) return cached;

    const actions = await dashRepo.getQuickActions(userId);
    await cache.set(CACHE_KEYS.QUICK_ACTIONS(userId), actions, CACHE_TTL.MEDIUM);
    return actions;
  }

  // ── Track Activity ────────────────────────────────────────────────────────
  async trackActivity(userId: string, data: {
    featureKey: string;
    label: string;
    route: string;
    icon?: string;
    metadata?: Record<string, unknown>;
  }) {
    await Promise.all([
      dashRepo.upsertQuickAction({
        userId,
        featureKey: data.featureKey,
        label: data.label,
        route: data.route,
        icon: data.icon ?? 'star',
      }),
      dashRepo.addRecentActivity({ userId, ...data }),
    ]);

    // Invalidate caches
    await cache.del(CACHE_KEYS.QUICK_ACTIONS(userId));
  }

  async pinAction(userId: string, featureKey: string, isPinned: boolean) {
    await dashRepo.pinQuickAction(userId, featureKey, isPinned);
    await cache.del(CACHE_KEYS.QUICK_ACTIONS(userId));
  }

  // ── Recent Activities ─────────────────────────────────────────────────────
  async getRecentActivities(userId: string) {
    return dashRepo.getRecentActivities(userId);
  }

  // ── Analytics ─────────────────────────────────────────────────────────────
  async getSpendingInsights(userId: string) {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [thisMonth, lastMonth] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: thisMonthStart } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
        _sum: { amount: true },
      }),
    ]);

    const current = Number(thisMonth._sum.amount ?? 0);
    const previous = Number(lastMonth._sum.amount ?? 0);
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return {
      currentMonth: current,
      previousMonth: previous,
      changePercent: Math.round(change * 10) / 10,
      trend: change < 0 ? 'decreasing' : 'increasing',
    };
  }
}
