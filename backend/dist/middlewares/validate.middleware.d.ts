import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Generic Zod validation middleware.
 * Pass a schema that validates { body?, query?, params? }.
 */
export declare function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map