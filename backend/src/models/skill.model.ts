import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface ISkill {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  file_size: number;
  download_count: number;
  favorite_count: number;
  status: string;
  created_at: Date;
  author_username?: string;
}

export async function findAll(opts: {
  category?: string; page: number; limit: number; sort?: string;
}): Promise<{ rows: ISkill[]; total: number }> {
  const { category, page, limit, sort = 'created_at' } = opts;
  const offset = (page - 1) * limit;
  const where = category && category !== 'all'
    ? "WHERE s.status='active' AND s.category=?" : "WHERE s.status='active'";
  const params: unknown[] = category && category !== 'all' ? [category] : [];
  const orderCol = sort === 'download_count' ? 'download_count' : 'created_at';

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT s.*, u.username AS author_username FROM skills s
     JOIN users u ON s.user_id = u.id
     ${where} ORDER BY s.${orderCol} DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM skills s ${where}`, params
  );
  return { rows: rows as ISkill[], total: (countRows[0] as { total: number }).total };
}

export async function findById(id: number): Promise<ISkill | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT s.*, u.username AS author_username FROM skills s
     JOIN users u ON s.user_id = u.id
     WHERE s.id = ? AND s.status = 'active' LIMIT 1`, [id]
  );
  return (rows[0] as ISkill) || null;
}

export async function create(data: {
  userId: number; title: string; description: string;
  category: string; filePath: string; fileName: string; fileSize: number;
}): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO skills (user_id, title, description, category, file_path, file_name, file_size)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.userId, data.title, data.description, data.category, data.filePath, data.fileName, data.fileSize]
  );
  return result.insertId;
}

export async function softDelete(id: number, userId: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE skills SET status='deleted' WHERE id=? AND user_id=? AND status='active'", [id, userId]
  );
  return result.affectedRows > 0;
}

export async function incrementDownload(id: number): Promise<void> {
  await pool.query('UPDATE skills SET download_count = download_count + 1 WHERE id = ?', [id]);
}

export async function getStats(): Promise<{
  totalSkills: number;
  totalDownloads: number;
  totalUsers: number;
  activeAuthors: number;
}> {
  const [s] = await pool.query<RowDataPacket[]>(
    `SELECT
      COUNT(*) AS totalSkills,
      SUM(download_count) AS totalDownloads,
      COUNT(DISTINCT user_id) AS activeAuthors
     FROM skills
     WHERE status='active'`
  );
  const [u] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS totalUsers FROM users');
  return {
    totalSkills: (s[0] as { totalSkills: number }).totalSkills,
    totalDownloads: (s[0] as { totalDownloads: number }).totalDownloads || 0,
    totalUsers: (u[0] as { totalUsers: number }).totalUsers,
    activeAuthors: (s[0] as { activeAuthors: number }).activeAuthors || 0,
  };
}
