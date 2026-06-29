"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const rateLimiter_middleware_1 = require("../middlewares/rateLimiter.middleware");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const transaction_validator_1 = require("../validators/transaction.validator");
const router = (0, express_1.Router)();
const ctrl = new transaction_controller_1.TransactionController();
router.use(auth_middleware_1.authenticate);
router.get('/', ctrl.getAll.bind(ctrl));
router.post('/initiate', rateLimiter_middleware_1.transactionRateLimiter, (0, validate_middleware_1.validate)(transaction_validator_1.initiateTransactionSchema), (0, audit_middleware_1.auditLog)('TRANSFER_INITIATED', 'Transaction'), ctrl.initiate.bind(ctrl));
router.get('/analytics/monthly', ctrl.getMonthlyAnalytics.bind(ctrl));
router.get('/analytics/categories', ctrl.getCategoryBreakdown.bind(ctrl));
router.get('/:id', (0, validate_middleware_1.validate)(transaction_validator_1.transactionIdSchema), ctrl.getById.bind(ctrl));
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map