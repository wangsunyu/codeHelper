import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ISkill } from './skill.model';

export async function findByUser(userId: number): Promise<ISkill[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT s.*, u.username AS author_username FROM favorites f
     JOIN skills s ON f.skill_id = s.id
     JOIN users u ON s.user_id = u.id
     WHERE f.user_id = ? AND s.status = 'active'
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows as ISkill[];
}

export async function add(userId: number, skillId: number): Promise<void> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT IGNORE INTO favorites (user_id, skill_id) VALUES (?, ?)', [userId, skillId]
  );
  if (result.affectedRows > 0) {
    await pool.query('UPDATE skills SET favorite_count = favorite_count + 1 WHERE id = ?', [skillId]);
  }
}

export async function remove(userId: number, skillId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM favorites WHERE user_id = ? AND skill_id = ?', [userId, skillId]
  );
  if (result.affectedRows > 0) {
    await pool.query('UPDATE skills SET favorite_count = GREATEST(0, favorite_count - 1) WHERE id = ?', [skillId]);
  }
  return result.affectedRows > 0;
}

export async function checkExists(userId: number, skillId: number): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT 1 FROM favorites WHERE user_id = ? AND skill_id = ? LIMIT 1', [userId, skillId]
  );
  return rows.length > 0;
}
