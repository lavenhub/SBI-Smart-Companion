import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updatePreferencesSchema, trackActivitySchema, pinActionSchema } from '../validators/dashboard.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new DashboardController();

router.use(authenticate as Handler);

router.get('/', ctrl.getSummary.bind(ctrl) as Handler);
router.get('/preferences', ctrl.getPreferences.bind(ctrl) as Handler);
router.patch('/preferences', validate(updatePreferencesSchema), ctrl.updatePreferences.bind(ctrl) as Handler);
router.get('/quick-actions', ctrl.getQuickActions.bind(ctrl) as Handler);
router.post('/quick-actions/pin', validate(pinActionSchema), ctrl.pinAction.bind(ctrl) as Handler);
router.post('/activity', validate(trackActivitySchema), ctrl.trackActivity.bind(ctrl) as Handler);
router.get('/recent-activities', ctrl.getRecentActivities.bind(ctrl) as Handler);
router.get('/insights/spending', ctrl.getSpendingInsights.bind(ctrl) as Handler);

export default router;
