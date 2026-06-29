import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { searchSchema, recordClickSchema } from '../validators/search.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new SearchController();

router.use(authenticate as Handler);

router.post('/', validate(searchSchema), auditLog('SEARCH_PERFORMED') as Handler, ctrl.search.bind(ctrl) as Handler);
router.get('/autocomplete', ctrl.autocomplete.bind(ctrl) as Handler);
router.get('/history', ctrl.getHistory.bind(ctrl) as Handler);
router.get('/popular', ctrl.getPopular.bind(ctrl) as Handler);
router.post('/click', validate(recordClickSchema), ctrl.recordClick.bind(ctrl) as Handler);

export default router;
