import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, JwtPayload } from '../types';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { prisma } from '../config/database';
import { cache, redisClient } from '../config/redis';
import { CACHE_KEYS } from '../constants';
import { logger } from '../utils/logger';

/**
 * Verifies the JWT access token and attaches the decoded payload to req.user.
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.slice(7);
    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError('Token expired');
      }
      throw new AuthenticationError('Invalid token');
    }

    // Verify session is still active (check cache first)
    const cacheKey = CACHE_KEYS.USER_PROFILE(payload.userId);
    let user = await cache.get<{ isActive: boolean; role: string }>(cacheKey);

    if (!user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, isActive: true, role: true, lockedUntil: true },
      });

      if (!dbUser) throw new AuthenticationError('User not found');
      if (!dbUser.isActive) throw new AuthenticationError('Account deactivated');
      if (dbUser.lockedUntil && dbUser.lockedUntil > new Date()) {
        throw new AuthenticationError('Account temporarily locked');
      }

      user = { isActive: dbUser.isActive, role: dbUser.role };
    }

    req.user = { ...payload, role: user.role };
    req.deviceId = req.headers['x-device-id'] as string | undefined;
    req.sessionId = payload.sessionId;

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Role-based access control middleware factory.
 */
export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AuthorizationError(`Role '${req.user.role}' is not allowed`));
      return;
    }
    next();
  };
}

/**
 * Soft-authenticate — sets req.user if token present, does not fail if absent.
 */
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }
  await authenticate(req, res, next);
}
