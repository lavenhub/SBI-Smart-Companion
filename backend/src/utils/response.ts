import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';
import { HTTP_STATUS } from '../constants';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: number = HTTP_STATUS.OK,
  meta?: PaginationMeta,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): void {
  res.status(HTTP_STATUS.NO_CONTENT).end();
}

export function sendError(
  res: Response,
  message: string,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code = 'ERROR',
  errors?: unknown,
): void {
  const response: ApiResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(errors ? { errors: errors as any } : {}),
  };
  res.status(statusCode).json(response);
}

export function buildPaginationMeta(
  total: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / pageSize);
  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
