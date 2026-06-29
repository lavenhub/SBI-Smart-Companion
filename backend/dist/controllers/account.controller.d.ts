import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class AccountController {
    getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getBeneficiaries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    updateBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    deleteBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getTotalBalance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=account.controller.d.ts.map