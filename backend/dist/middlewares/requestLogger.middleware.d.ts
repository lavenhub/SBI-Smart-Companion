import { Request, Response, NextFunction } from 'express';
export declare function requestId(req: Request, res: Response, next: NextFunction): void;
export declare const httpLogger: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;
//# sourceMappingURL=requestLogger.middleware.d.ts.map