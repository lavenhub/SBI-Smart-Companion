import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response';

const dashboardService = new DashboardService();

export class DashboardController {
  async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await dashboardService.getSummary(req.user.userId);
      sendSuccess(res, summary);
    } catch (err) {
      next(err);
    }
  }

  async getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefs = await dashboardService.getPreferences(req.user.userId);
      sendSuccess(res, prefs);
    } catch (err) {
      next(err);
    }
  }

  async updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefs = await dashboardService.updatePreferences(req.user.userId, req.body);
      sendSuccess(res, prefs, 'Preferences updated');
    } catch (err) {
      next(err);
    }
  }

  async getQuickActions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const actions = await dashboardService.getQuickActions(req.user.userId);
      sendSuccess(res, actions);
    } catch (err) {
      next(err);
    }
  }

  async trackActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await dashboardService.trackActivity(req.user.userId, req.body);
      sendSuccess(res, null, 'Activity tracked');
    } catch (err) {
      next(err);
    }
  }

  async pinAction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { featureKey, isPinned } = req.body;
      await dashboardService.pinAction(req.user.userId, featureKey, isPinned ?? true);
      sendSuccess(res, null, 'Action pinned');
    } catch (err) {
      next(err);
    }
  }

  async getRecentActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const activities = await dashboardService.getRecentActivities(req.user.userId);
      sendSuccess(res, activities);
    } catch (err) {
      next(err);
    }
  }

  async getSpendingInsights(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const insights = await dashboardService.getSpendingInsights(req.user.userId);
      sendSuccess(res, insights);
    } catch (err) {
      next(err);
    }
  }
}
