import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middlewares/auth';
import * as SkillService from '../services/skill.service';
import { ok, fail } from '../utils/response';

export const publishValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('标题不能为空'),
  body('category').isIn(['productivity', 'coding', 'writing', 'other']).withMessage('分类无效'),
  body('description').optional().isLength({ max: 2000 }),
];

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
    const category = req.query.category as string;
    const sort = req.query.sort as string;
    const result = await SkillService.list({ category, page, limit, sort });
    ok(res, result);
  } catch (e) { next(e); }
}

export async function detail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const skill = await SkillService.detail(parseInt(req.params.id));
    ok(res, skill);
  } catch (e) { next(e); }
}

export async function publish(req: AuthRequest, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, errors.array()[0].msg as string, 422);
  try {
    if (!req.file) return fail(res, '请上传文件', 422);
    const { title, description = '', category } = req.body;
    const result = await SkillService.publish({ userId: req.userId!, title, description, category, file: req.file });
    ok(res, result, '发布成功');
  } catch (e) { next(e); }
}

export async function download(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { filePath, fileName } = await SkillService.download(parseInt(req.params.id));
    res.download(filePath, fileName);
  } catch (e) { next(e); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await SkillService.remove(parseInt(req.params.id), req.userId!);
    ok(res, null, '删除成功');
  } catch (e) { next(e); }
}
