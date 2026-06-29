import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class SearchController {
    search(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    autocomplete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getPopular(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    recordClick(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=search.controller.d.ts.map