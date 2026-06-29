import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
/**
 * Verifies the JWT access token and attaches the decoded payload to req.user.
 */
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Role-based access control middleware factory.
 */
export declare function authorize(...roles: string[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
/**
 * Soft-authenticate — sets req.user if token present, does not fail if absent.
 */
export declare function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map