import { Response } from 'express';
import { PaginationMeta } from '../types';
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta): void;
export declare function sendCreated<T>(res: Response, data: T, message?: string): void;
export declare function sendNoContent(res: Response): void;
export declare function sendError(res: Response, message: string, statusCode?: 500, code?: string, errors?: unknown): void;
export declare function buildPaginationMeta(total: number, page: number, pageSize: number): PaginationMeta;
//# sourceMappingURL=response.d.ts.map