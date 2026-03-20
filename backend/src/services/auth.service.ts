import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { redis } from '../config/redis';
import * as UserModel from '../models/user.model';
import { AppError } from '../middlewares/error';

function signAccess(userId: number) {
  return jwt.sign({ userId }, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);
}

function signRefresh(userId: number) {
  return jwt.sign({ userId }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn } as jwt.SignOptions);
}

export async function register(username: string, email: string, password: string) {
  const existing = await UserModel.findByEmail(email);
  if (existing) throw new AppError('邮箱已被注册', 409, 'EMAIL_EXISTS');

  const hash = await bcrypt.hash(password, env.bcryptRounds);
  const id = await UserModel.create(username, email, hash);
  return { id, username, email };
}

export async function login(email: string, password: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new AppError('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError('邮箱或密码错误', 401, 'INVALID_CREDENTIALS');

  const accessToken = signAccess(user.id);
  const refreshToken = signRefresh(user.id);

  await redis.set(`refresh_token:${user.id}`, refreshToken, 'EX', 60 * 60 * 24 * 30);

  return { accessToken, refreshToken, user: { id: user.id, username: user.username, email: user.email } };
}

export async function refresh(token: string) {
  let payload: { userId: number };
  try {
    payload = jwt.verify(token, env.jwt.refreshSecret) as { userId: number };
  } catch {
    throw new AppError('无效的刷新令牌', 401, 'INVALID_REFRESH_TOKEN');
  }

  const stored = await redis.get(`refresh_token:${payload.userId}`);
  if (stored !== token) throw new AppError('刷新令牌已失效', 401, 'REFRESH_TOKEN_EXPIRED');

  const accessToken = signAccess(payload.userId);
  return { accessToken };
}

export async function logout(userId: number) {
  await redis.del(`refresh_token:${userId}`);
}
