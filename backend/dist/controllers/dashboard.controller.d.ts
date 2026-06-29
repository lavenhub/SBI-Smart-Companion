import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class DashboardController {
    getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getQuickActions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    trackActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    pinAction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getRecentActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getSpendingInsights(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map