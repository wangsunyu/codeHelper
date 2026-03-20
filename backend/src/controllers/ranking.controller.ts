import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as RankingService from '../services/ranking.service';
import { ok } from '../utils/response';

export async function rankings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const category = (req.query.category as string) || 'all';
    const limit = Math.min(50, parseInt(req.query.limit as string) || 10);
    const data = await RankingService.getRankings(category, limit);
    ok(res, data);
  } catch (e) { next(e); }
}
