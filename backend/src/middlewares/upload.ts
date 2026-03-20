import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { env } from '../config/env';
import { Request } from 'express';

const ALLOWED_EXTS = ['.json', '.yaml', '.yml', '.zip', '.md'];

if (!fs.existsSync(env.upload.dir)) {
  fs.mkdirSync(env.upload.dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.upload.dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型，仅允许：${ALLOWED_EXTS.join(', ')}`));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxSize },
});
