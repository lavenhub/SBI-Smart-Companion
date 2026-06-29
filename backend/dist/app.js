"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const hpp_1 = __importDefault(require("hpp"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const requestLogger_middleware_1 = require("./middlewares/requestLogger.middleware");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const routes_1 = __importDefault(require("./routes"));
function createApp() {
    const app = (0, express_1.default)();
    // ── Security ──────────────────────────────────────────────────────────────
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: env_1.env.NODE_ENV === 'production',
        crossOriginEmbedderPolicy: false,
    }));
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN.split(',').map((o) => o.trim()),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Device-Id'],
    }));
    // HTTP Parameter Pollution protection
    app.use((0, hpp_1.default)());
    // ── Parsing ───────────────────────────────────────────────────────────────
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use((0, cookie_parser_1.default)());
    // ── Compression ───────────────────────────────────────────────────────────
    app.use((0, compression_1.default)());
    // ── Request Tracing ───────────────────────────────────────────────────────
    app.use(requestLogger_middleware_1.requestId);
    app.use(requestLogger_middleware_1.httpLogger);
    // ── Rate Limiting ─────────────────────────────────────────────────────────
    app.use(rateLimiter_middleware_1.globalRateLimiter);
    // ── Static Uploads ────────────────────────────────────────────────────────
    app.use('/uploads', express_1.default.static(path_1.default.resolve(env_1.env.UPLOAD_DIR)));
    // ── Health Check ──────────────────────────────────────────────────────────
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            service: 'yono-smart-companion-backend',
            version: '1.0.0',
            environment: env_1.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    // ── Swagger Documentation ─────────────────────────────────────────────────
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
        customSiteTitle: 'YONO Smart Companion API',
        customCss: '.swagger-ui .topbar { background: #003399; }',
        swaggerOptions: { persistAuthorization: true },
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_1.swaggerSpec);
    });
    // ── API Routes ────────────────────────────────────────────────────────────
    app.use(env_1.env.API_PREFIX, routes_1.default);
    // ── Not Found ─────────────────────────────────────────────────────────────
    app.use(errorHandler_middleware_1.notFoundHandler);
    // ── Error Handler ─────────────────────────────────────────────────────────
    app.use(errorHandler_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map