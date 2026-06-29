import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class TransactionController {
    initiate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getMonthlyAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getCategoryBreakdown(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=transaction.controller.d.ts.map