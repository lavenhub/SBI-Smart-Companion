import { StoredFile, UploadOptions } from '../types';
/**
 * Local file storage service.
 * Designed for easy migration to S3 by swapping this implementation.
 * The interface contract (store/retrieve/delete/getUrl) remains stable.
 */
export declare class StorageService {
    private readonly baseDir;
    constructor();
    store(opts: UploadOptions): Promise<StoredFile>;
    retrieve(fileKey: string): Promise<Buffer>;
    delete(fileKey: string): Promise<void>;
    getPublicUrl(fileKey: string): string;
}
//# sourceMappingURL=storage.service.d.ts.map