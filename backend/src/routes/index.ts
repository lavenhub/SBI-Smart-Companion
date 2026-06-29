import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import accountRoutes from './account.routes';
import transactionRoutes from './transaction.routes';
import searchRoutes from './search.routes';
import applicationRoutes from './application.routes';
import vaultRoutes from './vault.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/search', searchRoutes);
router.use('/applications', applicationRoutes);
router.use('/vault', vaultRoutes);
router.use('/notifications', notificationRoutes);

export default router;
