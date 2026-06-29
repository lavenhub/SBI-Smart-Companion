import { Request, Response, NextFunction } from 'express';
export declare function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void;
/** Handle 404 — no route matched */
export declare function notFoundHandler(req: Request, res: Response): void;
//# sourceMappingURL=errorHandler.middleware.d.ts.map