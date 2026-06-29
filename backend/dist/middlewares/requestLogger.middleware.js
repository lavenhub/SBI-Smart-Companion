"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
exports.requestId = requestId;
const morgan_1 = __importDefault(require("morgan"));
const uuid_1 = require("uuid");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
// Attach a unique request ID to every request
function requestId(req, res, next) {
    const id = req.headers['x-request-id'] ?? (0, uuid_1.v4)();
    req.headers['x-request-id'] = id;
    res.setHeader('X-Request-Id', id);
    next();
}
// Morgan stream pointing to Winston
const stream = {
    write: (message) => {
        logger_1.logger.http(message.trim());
    },
};
// Skip health-check noise
const skip = (req) => req.path === '/health' || req.path === '/ping';
exports.httpLogger = (0, morgan_1.default)(env_1.env.NODE_ENV === 'development'
    ? 'dev'
    : ':remote-addr :method :url :status :res[content-length] - :response-time ms', { stream, skip });
//# sourceMappingURL=requestLogger.middleware.js.map