import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class AuthController {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map