import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class VaultController {
    getFolderTree(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    updateFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    deleteFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    uploadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    downloadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    deleteDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    searchDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=vault.controller.d.ts.map