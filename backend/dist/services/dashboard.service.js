"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const dashboard_repository_1 = require("../repositories/dashboard.repository");
const account_repository_1 = require("../repositories/account.repository");
const notification_repository_1 = require("../repositories/notification.repository");
const database_1 = require("../config/database");
const redis_1 = require("../config/redis");
const constants_1 = require("../constants");
const helpers_1 = require("../utils/helpers");
const dashRepo = new dashboard_repository_1.DashboardRepository();
const accountRepo = new account_repository_1.AccountRepository();
const notifRepo = new notification_repository_1.NotificationRepository();
class DashboardService {
    // ── Full Summary ──────────────────────────────────────────────────────────
    async getSummary(userId) {
        const cacheKey = constants_1.CACHE_KEYS.USER_DASHBOARD(userId);
        const cached = await redis_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [accounts, monthlyCredit, monthlyDebit, rewardPoints, upcomingBills, recentTransactions,] = await Promise.all([
            accountRepo.findByUserId(userId),
            database_1.prisma.transaction.aggregate({
                where: { userId, type: 'CREDIT', status: 'COMPLETED', createdAt: { gte: monthStart } },
                _sum: { amount: true },
            }),
            database_1.prisma.transaction.aggregate({
                where: { userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: monthStart } },
                _sum: { amount: true },
            }),
            dashRepo.getRewardBalance(userId),
            database_1.prisma.bill.findMany({
                where: { userId, status: 'PENDING', dueDate: { gte: now } },
                orderBy: { dueDate: 'asc' },
                take: 10,
            }),
            database_1.prisma.transaction.findMany({
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
        const summary = {
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
                daysUntilDue: (0, helpers_1.daysUntil)(b.dueDate),
            })),
            recentTransactions: recentTransactions,
            savingsGoalProgress: 0,
        };
        await redis_1.cache.set(cacheKey, summary, constants_1.CACHE_TTL.DASHBOARD);
        return summary;
    }
    // ── Preferences ───────────────────────────────────────────────────────────
    async getPreferences(userId) {
        const cached = await redis_1.cache.get(constants_1.CACHE_KEYS.DASHBOARD_PREFS(userId));
        if (cached)
            return cached;
        const prefs = await dashRepo.getPreferences(userId);
        if (prefs)
            await redis_1.cache.set(constants_1.CACHE_KEYS.DASHBOARD_PREFS(userId), prefs, constants_1.CACHE_TTL.LONG);
        return prefs;
    }
    async updatePreferences(userId, data) {
        const prefs = await dashRepo.upsertPreferences(userId, data);
        await redis_1.cache.del(constants_1.CACHE_KEYS.DASHBOARD_PREFS(userId));
        return prefs;
    }
    // ── Quick Actions ─────────────────────────────────────────────────────────
    async getQuickActions(userId) {
        const cached = await redis_1.cache.get(constants_1.CACHE_KEYS.QUICK_ACTIONS(userId));
        if (cached)
            return cached;
        const actions = await dashRepo.getQuickActions(userId);
        await redis_1.cache.set(constants_1.CACHE_KEYS.QUICK_ACTIONS(userId), actions, constants_1.CACHE_TTL.MEDIUM);
        return actions;
    }
    // ── Track Activity ────────────────────────────────────────────────────────
    async trackActivity(userId, data) {
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
        await redis_1.cache.del(constants_1.CACHE_KEYS.QUICK_ACTIONS(userId));
    }
    async pinAction(userId, featureKey, isPinned) {
        await dashRepo.pinQuickAction(userId, featureKey, isPinned);
        await redis_1.cache.del(constants_1.CACHE_KEYS.QUICK_ACTIONS(userId));
    }
    // ── Recent Activities ─────────────────────────────────────────────────────
    async getRecentActivities(userId) {
        return dashRepo.getRecentActivities(userId);
    }
    // ── Analytics ─────────────────────────────────────────────────────────────
    async getSpendingInsights(userId) {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const [thisMonth, lastMonth] = await Promise.all([
            database_1.prisma.transaction.aggregate({
                where: { userId, type: 'DEBIT', status: 'COMPLETED', createdAt: { gte: thisMonthStart } },
                _sum: { amount: true },
            }),
            database_1.prisma.transaction.aggregate({
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
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map