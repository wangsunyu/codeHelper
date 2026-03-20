import { redis } from '../config/redis';
import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

const CATEGORIES = ['all', 'productivity', 'coding', 'writing', 'other'];

export async function getRankings(category: string = 'all', limit: number = 10) {
  const cat = CATEGORIES.includes(category) ? category : 'all';
  const key = `ranking:skills:${cat}`;

  let items: string[] = [];
  try {
    items = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
  } catch (error) {
    console.warn('[rankings] Redis unavailable, fallback to MySQL ranking list');
    return getRankingsFromMySQL(cat, limit);
  }
  if (!items.length) return getRankingsFromMySQL(cat, limit);

  const ids: number[] = [];
  const scores: Record<number, number> = {};
  for (let i = 0; i < items.length; i += 2) {
    const id = parseInt(items[i]);
    ids.push(id);
    scores[id] = parseInt(items[i + 1]);
  }

  if (!ids.length) return [];

  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT s.id, s.title, s.category, s.download_count, s.file_name, u.username AS author_username
     FROM skills s JOIN users u ON s.user_id = u.id
     WHERE s.id IN (${placeholders}) AND s.status = 'active'`,
    ids
  );

  // 按 Redis score 排序
  const map = new Map((rows as RowDataPacket[]).map(r => [r.id, r]));
  return ids
    .filter(id => map.has(id))
    .map((id, index) => ({ rank: index + 1, ...map.get(id), download_count: scores[id] }));
}

async function getRankingsFromMySQL(category: string, limit: number) {
  const where = category === 'all'
    ? `WHERE s.status = 'active'`
    : `WHERE s.status = 'active' AND s.category = ?`;
  const params = category === 'all' ? [limit] : [category, limit];

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT s.id, s.title, s.category, s.download_count, s.file_name, u.username AS author_username
     FROM skills s
     JOIN users u ON s.user_id = u.id
     ${where}
     ORDER BY s.download_count DESC, s.created_at DESC
     LIMIT ?`,
    params
  );

  return (rows as RowDataPacket[]).map((row, index) => ({
    rank: index + 1,
    ...row,
  }));
}

export async function syncToMySQL() {
  try {
    for (const cat of CATEGORIES) {
      const key = `ranking:skills:${cat}`;
      const items = await redis.zrevrange(key, 0, -1, 'WITHSCORES');
      for (let i = 0; i < items.length; i += 2) {
        const id = parseInt(items[i]);
        const score = parseInt(items[i + 1]);
        await pool.query('UPDATE skills SET download_count = ? WHERE id = ?', [score, id]);
      }
    }
  } catch (error) {
    console.warn('[sync-rankings] Redis unavailable, skip sync');
  }
}
