import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as FavoriteService from '../services/favorite.service';
import { ok } from '../utils/response';

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await FavoriteService.list(req.userId!);
    ok(res, items);
  } catch (e) { next(e); }
}

export async function add(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await FavoriteService.add(req.userId!, parseInt(req.body.skillId));
    ok(res, null, '收藏成功');
  } catch (e) { next(e); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await FavoriteService.remove(req.userId!, parseInt(req.params.skillId));
    ok(res, null, '已取消收藏');
  } catch (e) { next(e); }
}
