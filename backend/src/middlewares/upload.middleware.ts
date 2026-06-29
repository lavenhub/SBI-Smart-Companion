import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { env } from '../config/env';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';
import { ValidationError } from '../utils/errors';

// Use memory storage — StorageService handles the write
const storage = multer.memoryStorage();

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type '${file.mimetype}' is not allowed`));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 5,
  },
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 5);
