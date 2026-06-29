import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env';
import { StorageError } from '../utils/errors';
import { computeChecksum, sanitizeFilename } from '../utils/helpers';
import { StoredFile, UploadOptions } from '../types';

/**
 * Local file storage service.
 * Designed for easy migration to S3 by swapping this implementation.
 * The interface contract (store/retrieve/delete/getUrl) remains stable.
 */
export class StorageService {
  private readonly baseDir: string;

  constructor() {
    this.baseDir = path.resolve(env.UPLOAD_DIR);
  }

  async store(opts: UploadOptions): Promise<StoredFile> {
    const ext = path.extname(opts.originalName);
    const baseName = sanitizeFilename(path.basename(opts.originalName, ext));
    const timestamp = Date.now();
    const fileName = `${baseName}_${timestamp}${ext}`;
    const categoryDir = opts.category.toLowerCase().replace(/_/g, '-');
    const relativePath = path.join(opts.userId, categoryDir, fileName);
    const absolutePath = path.join(this.baseDir, relativePath);

    try {
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, opts.buffer);
    } catch (err) {
      throw new StorageError(`Failed to store file: ${(err as Error).message}`);
    }

    const checksum = computeChecksum(opts.buffer);
    const fileKey = relativePath.replace(/\\/g, '/');
    const fileUrl = `/uploads/${fileKey}`;

    return {
      fileKey,
      fileName,
      mimeType: opts.mimeType,
      fileSizeBytes: opts.buffer.length,
      fileUrl,
      checksum,
    };
  }

  async retrieve(fileKey: string): Promise<Buffer> {
    const absolutePath = path.join(this.baseDir, fileKey);
    try {
      return await fs.readFile(absolutePath);
    } catch (err) {
      throw new StorageError(`File not found: ${fileKey}`);
    }
  }

  async delete(fileKey: string): Promise<void> {
    const absolutePath = path.join(this.baseDir, fileKey);
    try {
      await fs.unlink(absolutePath);
    } catch {
      // Ignore missing file errors during delete
    }
  }

  getPublicUrl(fileKey: string): string {
    return `/uploads/${fileKey}`;
  }

  /**
   * Future S3 migration point:
   * - Replace fs.writeFile with S3.putObject
   * - Replace fs.readFile with S3.getObject
   * - Replace fs.unlink with S3.deleteObject
   * - getPublicUrl returns CloudFront/S3 URL
   */
}
