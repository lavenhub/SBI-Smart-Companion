import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { startApplicationSchema, saveDraftSchema, applicationIdSchema, getApplicationsSchema, submitApplicationSchema } from '../validators/application.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new ApplicationController();

router.use(authenticate as Handler);

router.get('/', validate(getApplicationsSchema), ctrl.getAll.bind(ctrl) as Handler);
router.post('/start', validate(startApplicationSchema), ctrl.start.bind(ctrl) as Handler);
router.get('/:id', validate(applicationIdSchema), ctrl.getById.bind(ctrl) as Handler);
router.patch('/:id/save', validate(saveDraftSchema), ctrl.save.bind(ctrl) as Handler);
router.post('/:id/submit', validate(submitApplicationSchema), ctrl.submit.bind(ctrl) as Handler);
router.delete('/:id', validate(applicationIdSchema), ctrl.deleteDraft.bind(ctrl) as Handler);
router.get('/:id/history', validate(applicationIdSchema), ctrl.getHistory.bind(ctrl) as Handler);

export default router;
