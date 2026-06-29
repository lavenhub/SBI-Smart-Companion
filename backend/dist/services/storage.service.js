"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
const helpers_1 = require("../utils/helpers");
/**
 * Local file storage service.
 * Designed for easy migration to S3 by swapping this implementation.
 * The interface contract (store/retrieve/delete/getUrl) remains stable.
 */
class StorageService {
    constructor() {
        this.baseDir = path_1.default.resolve(env_1.env.UPLOAD_DIR);
    }
    async store(opts) {
        const ext = path_1.default.extname(opts.originalName);
        const baseName = (0, helpers_1.sanitizeFilename)(path_1.default.basename(opts.originalName, ext));
        const timestamp = Date.now();
        const fileName = `${baseName}_${timestamp}${ext}`;
        const categoryDir = opts.category.toLowerCase().replace(/_/g, '-');
        const relativePath = path_1.default.join(opts.userId, categoryDir, fileName);
        const absolutePath = path_1.default.join(this.baseDir, relativePath);
        try {
            await promises_1.default.mkdir(path_1.default.dirname(absolutePath), { recursive: true });
            await promises_1.default.writeFile(absolutePath, opts.buffer);
        }
        catch (err) {
            throw new errors_1.StorageError(`Failed to store file: ${err.message}`);
        }
        const checksum = (0, helpers_1.computeChecksum)(opts.buffer);
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
    async retrieve(fileKey) {
        const absolutePath = path_1.default.join(this.baseDir, fileKey);
        try {
            return await promises_1.default.readFile(absolutePath);
        }
        catch (err) {
            throw new errors_1.StorageError(`File not found: ${fileKey}`);
        }
    }
    async delete(fileKey) {
        const absolutePath = path_1.default.join(this.baseDir, fileKey);
        try {
            await promises_1.default.unlink(absolutePath);
        }
        catch {
            // Ignore missing file errors during delete
        }
    }
    getPublicUrl(fileKey) {
        return `/uploads/${fileKey}`;
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map