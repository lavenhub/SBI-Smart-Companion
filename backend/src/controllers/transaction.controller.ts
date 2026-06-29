import { Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/response';
import { env } from '../config/env';

const txnService = new TransactionService();

export class TransactionController {
  async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await txnService.initiate(req.user.userId, req.body);
      sendCreated(res, transaction, 'Transaction initiated successfully');
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(Number(req.query.pageSize) || env.DEFAULT_PAGE_SIZE, env.MAX_PAGE_SIZE);

      const { transactions, total } = await txnService.getTransactions(
        req.user.userId,
        { page, pageSize, sortBy: req.query.sortBy as string, sortOrder: req.query.sortOrder as any },
        {
          accountId: req.query.accountId,
          type: req.query.type,
          mode: req.query.mode,
          status: req.query.status,
          category: req.query.category,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
          minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
          maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
          search: req.query.search as string,
        },
      );

      sendSuccess(res, transactions, 'Transactions retrieved', 200, buildPaginationMeta(total, page, pageSize));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await txnService.getById(req.params.id, req.user.userId);
      sendSuccess(res, transaction);
    } catch (err) {
      next(err);
    }
  }

  async getMonthlyAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await txnService.getMonthlyAnalytics(req.user.userId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getCategoryBreakdown(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await txnService.getCategoryBreakdown(
        req.user.userId,
        req.query.month as string,
      );
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}
