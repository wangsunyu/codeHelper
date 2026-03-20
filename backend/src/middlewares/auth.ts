import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authRequired(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) return next(new AppError('请先登录', 401, 'UNAUTHORIZED'));
  try {
    const payload = jwt.verify(token, env.jwt.secret) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError('登录已过期', 401, 'TOKEN_EXPIRED'));
  }
}

export function authOptional(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwt.secret) as { userId: number };
      req.userId = payload.userId;
    } catch {
      // 忽略无效 token
    }
  }
  next();
}
