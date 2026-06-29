import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HTTP_STATUS } from '../constants';

/**
 * Generic Zod validation middleware.
 * Pass a schema that validates { body?, query?, params? }.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const fieldErrors = Object.entries(errors).map(([field, messages]) => ({
        field,
        message: (messages as string[])[0] ?? 'Invalid value',
      }));

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Attach parsed values back (safe, coerced values)
    if (result.data.body !== undefined) req.body = result.data.body;
    if (result.data.query !== undefined) req.query = result.data.query as any;
    if (result.data.params !== undefined) req.params = result.data.params as any;

    next();
  };
}
