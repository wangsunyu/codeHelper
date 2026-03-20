import * as FavoriteModel from '../models/favorite.model';
import * as SkillModel from '../models/skill.model';
import { AppError } from '../middlewares/error';

export async function list(userId: number) {
  return FavoriteModel.findByUser(userId);
}

export async function add(userId: number, skillId: number) {
  const skill = await SkillModel.findById(skillId);
  if (!skill) throw new AppError('资源不存在', 404, 'NOT_FOUND');
  await FavoriteModel.add(userId, skillId);
}

export async function remove(userId: number, skillId: number) {
  const removed = await FavoriteModel.remove(userId, skillId);
  if (!removed) throw new AppError('收藏记录不存在', 404, 'NOT_FOUND');
}
