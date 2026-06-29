import { Response, NextFunction } from 'express';
import { VaultService } from '../services/vault.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/response';
import { env } from '../config/env';

const vaultService = new VaultService();

export class VaultController {
  async getFolderTree(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tree = await vaultService.getFolderTree(req.user.userId);
      sendSuccess(res, tree);
    } catch (err) {
      next(err);
    }
  }

  async createFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const folder = await vaultService.createFolder(req.user.userId, req.body);
      sendCreated(res, folder, 'Folder created');
    } catch (err) {
      next(err);
    }
  }

  async updateFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const folder = await vaultService.updateFolder(req.params.id, req.user.userId, req.body);
      sendSuccess(res, folder, 'Folder updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteFolder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await vaultService.deleteFolder(req.params.id, req.user.userId);
      sendSuccess(res, null, 'Folder deleted');
    } catch (err) {
      next(err);
    }
  }

  async getDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await vaultService.getDocuments(req.user.userId, req.query.folderId as string);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async uploadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const doc = await vaultService.uploadDocument(req.user.userId, req.file, req.body);
      sendCreated(res, doc, 'Document uploaded');
    } catch (err) {
      next(err);
    }
  }

  async getDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await vaultService.getDocument(req.params.id, req.user.userId);
      sendSuccess(res, doc);
    } catch (err) {
      next(err);
    }
  }

  async downloadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doc, buffer } = await vaultService.downloadDocument(req.params.id, req.user.userId);
      res.setHeader('Content-Type', doc.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  }

  async deleteDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await vaultService.deleteDocument(req.params.id, req.user.userId);
      sendSuccess(res, null, 'Document deleted');
    } catch (err) {
      next(err);
    }
  }

  async searchDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string;
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || env.DEFAULT_PAGE_SIZE;

      const { documents, total } = await vaultService.searchDocuments(
        req.user.userId,
        q,
        {
          category: req.query.category as string,
          folderId: req.query.folderId as string,
          startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
          endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        },
        { page, pageSize },
      );

      sendSuccess(res, documents, 'Documents found', 200, buildPaginationMeta(total, page, pageSize));
    } catch (err) {
      next(err);
    }
  }
}
