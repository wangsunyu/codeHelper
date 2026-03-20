import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import * as AuthService from '../services/auth.service';
import * as UserModel from '../models/user.model';
import { ok, fail } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export const registerValidation = [
  body('username').trim().isLength({ min: 2, max: 50 }).withMessage('用户名 2-50 个字符'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').isLength({ min: 6 }).withMessage('密码至少 6 位'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').notEmpty().withMessage('密码不能为空'),
];

export async function register(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, errors.array()[0].msg as string, 422);
  try {
    const { username, email, password } = req.body;
    const user = await AuthService.register(username, email, password);
    ok(res, user, '注册成功');
  } catch (e) { next(e); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, errors.array()[0].msg as string, 422);
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(email, password);
    res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 });
    ok(res, user, '登录成功');
  } catch (e) { next(e); }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (req.userId) await AuthService.logout(req.userId);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    ok(res, null, '已登出');
  } catch (e) { next(e); }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return fail(res, '缺少刷新令牌', 401);
    const { accessToken } = await AuthService.refresh(token);
    res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
    ok(res, null, 'Token 已刷新');
  } catch (e) { next(e); }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.userId!);
    if (!user) return fail(res, '用户不存在', 404);
    ok(res, user);
  } catch (e) { next(e); }
}
