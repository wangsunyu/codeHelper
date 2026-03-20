import { Response } from 'express';

export function ok(res: Response, data: unknown, message?: string) {
  res.json({ success: true, data, ...(message && { message }) });
}

export function fail(res: Response, error: string, status = 400, code?: string) {
  res.status(status).json({ success: false, error, ...(code && { code }) });
}
