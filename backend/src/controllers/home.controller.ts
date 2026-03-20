import { Request, Response, NextFunction } from 'express';
import * as HomeService from '../services/home.service';
import { ok } from '../utils/response';

export async function home(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await HomeService.getHomeData();
    ok(res, data);
  } catch (e) { next(e); }
}
