import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { accountIdSchema, createBeneficiarySchema } from '../validators/account.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new AccountController();

const a = authenticate as Handler;
router.use(a);

router.get('/', ctrl.getAll.bind(ctrl) as Handler);
router.get('/balance', ctrl.getTotalBalance.bind(ctrl) as Handler);
router.get('/beneficiaries', ctrl.getBeneficiaries.bind(ctrl) as Handler);
router.post('/beneficiaries', validate(createBeneficiarySchema), ctrl.createBeneficiary.bind(ctrl) as Handler);
router.patch('/beneficiaries/:id', ctrl.updateBeneficiary.bind(ctrl) as Handler);
router.delete('/beneficiaries/:id', ctrl.deleteBeneficiary.bind(ctrl) as Handler);
router.get('/:id', validate(accountIdSchema), ctrl.getById.bind(ctrl) as Handler);

export default router;
