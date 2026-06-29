import { Response, NextFunction } from 'express';
import { AccountRepository } from '../repositories/account.repository';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';
import { NotFoundError } from '../utils/errors';
import { cache } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants';

const accountRepo = new AccountRepository();

export class AccountController {
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const cacheKey = CACHE_KEYS.USER_ACCOUNTS(req.user.userId);
      let accounts = await cache.get<any[]>(cacheKey);

      if (!accounts) {
        accounts = await accountRepo.findByUserId(req.user.userId);
        await cache.set(cacheKey, accounts, CACHE_TTL.ACCOUNTS);
      }

      sendSuccess(res, accounts);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await accountRepo.findById(req.params.id, req.user.userId);
      if (!account) throw new NotFoundError('Account');
      sendSuccess(res, account);
    } catch (err) {
      next(err);
    }
  }

  async getBeneficiaries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const beneficiaries = await accountRepo.findBeneficiaries(req.user.userId);
      sendSuccess(res, beneficiaries);
    } catch (err) {
      next(err);
    }
  }

  async createBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const beneficiary = await accountRepo.createBeneficiary({
        user: { connect: { id: req.user.userId } },
        ...req.body,
      });
      sendCreated(res, beneficiary, 'Beneficiary added');
    } catch (err) {
      next(err);
    }
  }

  async updateBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await accountRepo.findBeneficiaryById(req.params.id, req.user.userId);
      if (!existing) throw new NotFoundError('Beneficiary');
      const updated = await accountRepo.updateBeneficiary(req.params.id, req.body);
      sendSuccess(res, updated, 'Beneficiary updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteBeneficiary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await accountRepo.deleteBeneficiary(req.params.id, req.user.userId);
      sendSuccess(res, null, 'Beneficiary removed');
    } catch (err) {
      next(err);
    }
  }

  async getTotalBalance(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const total = await accountRepo.getTotalBalance(req.user.userId);
      sendSuccess(res, { totalBalance: total });
    } catch (err) {
      next(err);
    }
  }
}
