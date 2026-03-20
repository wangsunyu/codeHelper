import path from 'path';
import fs from 'fs';
import { redis } from '../config/redis';
import * as SkillModel from '../models/skill.model';
import { AppError } from '../middlewares/error';

export async function list(opts: { category?: string; page: number; limit: number; sort?: string }) {
  return SkillModel.findAll(opts);
}

export async function detail(id: number) {
  const skill = await SkillModel.findById(id);
  if (!skill) throw new AppError('资源不存在', 404, 'NOT_FOUND');
  return skill;
}

export async function publish(data: {
  userId: number; title: string; description: string;
  category: string; file: Express.Multer.File;
}) {
  const id = await SkillModel.create({
    userId: data.userId,
    title: data.title,
    description: data.description,
    category: data.category,
    filePath: data.file.path,
    fileName: data.file.originalname,
    fileSize: data.file.size,
  });
  // 同步到 Redis 排行榜
  await redis.zadd('ranking:skills:all', 0, String(id));
  await redis.zadd(`ranking:skills:${data.category}`, 0, String(id));
  return { id };
}

export async function remove(id: number, userId: number) {
  const skill = await SkillModel.findById(id);
  if (!skill) throw new AppError('资源不存在', 404, 'NOT_FOUND');
  if (skill.user_id !== userId) throw new AppError('无权删除', 403, 'FORBIDDEN');
  const ok = await SkillModel.softDelete(id, userId);
  if (!ok) throw new AppError('删除失败', 500);
}

export async function download(id: number) {
  const skill = await SkillModel.findById(id);
  if (!skill) throw new AppError('资源不存在', 404, 'NOT_FOUND');
  if (!fs.existsSync(skill.file_path)) throw new AppError('文件不存在', 404, 'FILE_NOT_FOUND');

  // 异步计数，不阻塞下载
  SkillModel.incrementDownload(id).catch(() => {});
  redis.zincrby('ranking:skills:all', 1, String(id)).catch(() => {});
  redis.zincrby(`ranking:skills:${skill.category}`, 1, String(id)).catch(() => {});

  return { filePath: skill.file_path, fileName: skill.file_name };
}
