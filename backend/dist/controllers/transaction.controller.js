"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("../services/transaction.service");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const txnService = new transaction_service_1.TransactionService();
class TransactionController {
    async initiate(req, res, next) {
        try {
            const transaction = await txnService.initiate(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, transaction, 'Transaction initiated successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Math.min(Number(req.query.pageSize) || env_1.env.DEFAULT_PAGE_SIZE, env_1.env.MAX_PAGE_SIZE);
            const { transactions, total } = await txnService.getTransactions(req.user.userId, { page, pageSize, sortBy: req.query.sortBy, sortOrder: req.query.sortOrder }, {
                accountId: req.query.accountId,
                type: req.query.type,
                mode: req.query.mode,
                status: req.query.status,
                category: req.query.category,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
                maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
                search: req.query.search,
            });
            (0, response_1.sendSuccess)(res, transactions, 'Transactions retrieved', 200, (0, response_1.buildPaginationMeta)(total, page, pageSize));
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const transaction = await txnService.getById(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, transaction);
        }
        catch (err) {
            next(err);
        }
    }
    async getMonthlyAnalytics(req, res, next) {
        try {
            const data = await txnService.getMonthlyAnalytics(req.user.userId);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getCategoryBreakdown(req, res, next) {
        try {
            const data = await txnService.getCategoryBreakdown(req.user.userId, req.query.month);
            (0, response_1.sendSuccess)(res, data);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map