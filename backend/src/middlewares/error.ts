import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export function errorHandler(
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof AppError ? err.status : 500;
  const code = err instanceof AppError ? err.code : undefined;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(code && { code }),
  });
}
