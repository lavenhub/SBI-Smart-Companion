import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated } from '../utils/response';
import { HTTP_STATUS } from '../constants';
import { env } from '../config/env';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(req.body);
      sendCreated(res, user, 'Account created successfully');
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = (req.headers['x-forwarded-for'] as string) ?? req.ip;
      const result = await authService.login({
        ...req.body,
        ipAddress,
        userAgent: req.headers['user-agent'],
      });

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });

      sendSuccess(res, {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
        sessionId: result.sessionId,
      }, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken;
      await authService.logout(req.user.userId, req.user.sessionId, refreshToken);

      res.clearCookie('refreshToken', { path: '/api/v1/auth' });
      sendSuccess(res, null, 'Logged out successfully');
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
      if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: 'Refresh token required' });
        return;
      }

      const tokens = await authService.refreshTokens(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });

      sendSuccess(res, {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.changePassword(
        req.user.userId,
        req.body.currentPassword,
        req.body.newPassword,
      );
      sendSuccess(res, null, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.sendOtp(req.body.identifier, req.body.purpose);
      sendSuccess(res, { expiresInMinutes: env.OTP_EXPIRY_MINUTES }, 'OTP sent successfully');
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await authService.verifyOtp(req.body.identifier, req.body.otp, req.body.purpose);
      sendSuccess(res, { verified: true }, 'OTP verified successfully');
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { UserRepository } = await import('../repositories/user.repository');
      const userRepo = new UserRepository();
      const user = await userRepo.getSafeProfile(req.user.userId);
      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
        return;
      }
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { UserRepository } = await import('../repositories/user.repository');
      const userRepo = new UserRepository();
      const allowedFields = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'occupation',
        'addressLine1', 'addressLine2', 'city', 'state', 'pincode',
      ];
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([k]) => allowedFields.includes(k)),
      );
      const updated = await userRepo.update(req.user.userId, updateData);
      sendSuccess(res, authService.toSafeUser(updated), 'Profile updated');
    } catch (err) {
      next(err);
    }
  }
}
