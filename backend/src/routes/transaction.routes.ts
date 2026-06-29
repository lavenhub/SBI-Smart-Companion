import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { transactionRateLimiter } from '../middlewares/rateLimiter.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { initiateTransactionSchema, transactionIdSchema } from '../validators/transaction.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new TransactionController();

router.use(authenticate as Handler);

router.get('/', ctrl.getAll.bind(ctrl) as Handler);
router.post('/initiate', transactionRateLimiter, validate(initiateTransactionSchema), auditLog('TRANSFER_INITIATED', 'Transaction') as Handler, ctrl.initiate.bind(ctrl) as Handler);
router.get('/analytics/monthly', ctrl.getMonthlyAnalytics.bind(ctrl) as Handler);
router.get('/analytics/categories', ctrl.getCategoryBreakdown.bind(ctrl) as Handler);
router.get('/:id', validate(transactionIdSchema), ctrl.getById.bind(ctrl) as Handler);

export default router;
