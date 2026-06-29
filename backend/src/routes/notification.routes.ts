import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { getNotificationsSchema, markReadSchema, markAllReadSchema } from '../validators/notification.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new NotificationController();

router.use(authenticate as Handler);

router.get('/', validate(getNotificationsSchema), ctrl.getAll.bind(ctrl) as Handler);
router.get('/unread-count', ctrl.getUnreadCount.bind(ctrl) as Handler);
router.patch('/read-all', validate(markAllReadSchema), ctrl.markAllRead.bind(ctrl) as Handler);
router.patch('/:id/read', validate(markReadSchema), ctrl.markRead.bind(ctrl) as Handler);

export default router;
