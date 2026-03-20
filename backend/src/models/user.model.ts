import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar_url: string | null;
  created_at: Date;
}

export async function findByEmail(email: string): Promise<IUser | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
  );
  return (rows[0] as IUser) || null;
}

export async function findById(id: number): Promise<IUser | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ? LIMIT 1', [id]
  );
  return (rows[0] as IUser) || null;
}

export async function create(username: string, email: string, password: string): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password]
  );
  return result.insertId;
}
