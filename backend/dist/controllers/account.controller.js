"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const account_repository_1 = require("../repositories/account.repository");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
const redis_1 = require("../config/redis");
const constants_1 = require("../constants");
const accountRepo = new account_repository_1.AccountRepository();
class AccountController {
    async getAll(req, res, next) {
        try {
            const cacheKey = constants_1.CACHE_KEYS.USER_ACCOUNTS(req.user.userId);
            let accounts = await redis_1.cache.get(cacheKey);
            if (!accounts) {
                accounts = await accountRepo.findByUserId(req.user.userId);
                await redis_1.cache.set(cacheKey, accounts, constants_1.CACHE_TTL.ACCOUNTS);
            }
            (0, response_1.sendSuccess)(res, accounts);
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const account = await accountRepo.findById(req.params.id, req.user.userId);
            if (!account)
                throw new errors_1.NotFoundError('Account');
            (0, response_1.sendSuccess)(res, account);
        }
        catch (err) {
            next(err);
        }
    }
    async getBeneficiaries(req, res, next) {
        try {
            const beneficiaries = await accountRepo.findBeneficiaries(req.user.userId);
            (0, response_1.sendSuccess)(res, beneficiaries);
        }
        catch (err) {
            next(err);
        }
    }
    async createBeneficiary(req, res, next) {
        try {
            const beneficiary = await accountRepo.createBeneficiary({
                user: { connect: { id: req.user.userId } },
                ...req.body,
            });
            (0, response_1.sendCreated)(res, beneficiary, 'Beneficiary added');
        }
        catch (err) {
            next(err);
        }
    }
    async updateBeneficiary(req, res, next) {
        try {
            const existing = await accountRepo.findBeneficiaryById(req.params.id, req.user.userId);
            if (!existing)
                throw new errors_1.NotFoundError('Beneficiary');
            const updated = await accountRepo.updateBeneficiary(req.params.id, req.body);
            (0, response_1.sendSuccess)(res, updated, 'Beneficiary updated');
        }
        catch (err) {
            next(err);
        }
    }
    async deleteBeneficiary(req, res, next) {
        try {
            await accountRepo.deleteBeneficiary(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Beneficiary removed');
        }
        catch (err) {
            next(err);
        }
    }
    async getTotalBalance(req, res, next) {
        try {
            const total = await accountRepo.getTotalBalance(req.user.userId);
            (0, response_1.sendSuccess)(res, { totalBalance: total });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map