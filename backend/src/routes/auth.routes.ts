import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter, otpRateLimiter } from '../middlewares/rateLimiter.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { registerSchema, loginSchema, changePasswordSchema, verifyOtpSchema, sendOtpSchema } from '../validators/auth.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new AuthController();

router.post('/register', validate(registerSchema), ctrl.register.bind(ctrl));
router.post('/login', authRateLimiter, validate(loginSchema), ctrl.login.bind(ctrl));
router.post('/logout', authenticate as Handler, ctrl.logout.bind(ctrl) as Handler);
router.post('/refresh', ctrl.refreshToken.bind(ctrl));
router.post('/otp/send', otpRateLimiter, validate(sendOtpSchema), ctrl.sendOtp.bind(ctrl));
router.post('/otp/verify', validate(verifyOtpSchema), ctrl.verifyOtp.bind(ctrl));
router.get('/profile', authenticate as Handler, ctrl.getProfile.bind(ctrl) as Handler);
router.patch('/profile', authenticate as Handler, auditLog('PROFILE_UPDATED') as Handler, ctrl.updateProfile.bind(ctrl) as Handler);
router.post('/change-password', authenticate as Handler, validate(changePasswordSchema), ctrl.changePassword.bind(ctrl) as Handler);

export default router;
