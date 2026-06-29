import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class ApplicationController {
    start(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    save(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    submit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    deleteDraft(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=application.controller.d.ts.map