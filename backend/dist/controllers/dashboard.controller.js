"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_1 = require("../utils/response");
const dashboardService = new dashboard_service_1.DashboardService();
class DashboardController {
    async getSummary(req, res, next) {
        try {
            const summary = await dashboardService.getSummary(req.user.userId);
            (0, response_1.sendSuccess)(res, summary);
        }
        catch (err) {
            next(err);
        }
    }
    async getPreferences(req, res, next) {
        try {
            const prefs = await dashboardService.getPreferences(req.user.userId);
            (0, response_1.sendSuccess)(res, prefs);
        }
        catch (err) {
            next(err);
        }
    }
    async updatePreferences(req, res, next) {
        try {
            const prefs = await dashboardService.updatePreferences(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, prefs, 'Preferences updated');
        }
        catch (err) {
            next(err);
        }
    }
    async getQuickActions(req, res, next) {
        try {
            const actions = await dashboardService.getQuickActions(req.user.userId);
            (0, response_1.sendSuccess)(res, actions);
        }
        catch (err) {
            next(err);
        }
    }
    async trackActivity(req, res, next) {
        try {
            await dashboardService.trackActivity(req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, null, 'Activity tracked');
        }
        catch (err) {
            next(err);
        }
    }
    async pinAction(req, res, next) {
        try {
            const { featureKey, isPinned } = req.body;
            await dashboardService.pinAction(req.user.userId, featureKey, isPinned ?? true);
            (0, response_1.sendSuccess)(res, null, 'Action pinned');
        }
        catch (err) {
            next(err);
        }
    }
    async getRecentActivities(req, res, next) {
        try {
            const activities = await dashboardService.getRecentActivities(req.user.userId);
            (0, response_1.sendSuccess)(res, activities);
        }
        catch (err) {
            next(err);
        }
    }
    async getSpendingInsights(req, res, next) {
        try {
            const insights = await dashboardService.getSpendingInsights(req.user.userId);
            (0, response_1.sendSuccess)(res, insights);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map