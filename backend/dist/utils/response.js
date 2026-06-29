"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendNoContent = sendNoContent;
exports.sendError = sendError;
exports.buildPaginationMeta = buildPaginationMeta;
const constants_1 = require("../constants");
function sendSuccess(res, data, message = 'Success', statusCode = constants_1.HTTP_STATUS.OK, meta) {
    const response = {
        success: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
}
function sendCreated(res, data, message = 'Created successfully') {
    sendSuccess(res, data, message, 201);
}
function sendNoContent(res) {
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).end();
}
function sendError(res, message, statusCode = constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'ERROR', errors) {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
        ...(errors ? { errors: errors } : {}),
    };
    res.status(statusCode).json(response);
}
function buildPaginationMeta(total, page, pageSize) {
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
//# sourceMappingURL=response.js.map