"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("./env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'YONO Smart Companion API',
            version: '1.0.0',
            description: `
## SBI YONO Smart Companion — Production Banking Backend API

This is the complete REST API documentation for YONO Smart Companion backend.

### Key Features
- **Smart Search** — Fuzzy, NLP, synonym-aware feature discovery
- **Resume Anywhere** — Auto-save application drafts with version history
- **Smart Vault** — Automatic document organization with hierarchy
- **Adaptive Dashboard** — Usage-driven shortcut personalization
- **Transaction Engine** — UPI, NEFT, RTGS, IMPS, Card transactions

### Authentication
All protected endpoints require a **Bearer token** in the Authorization header.
Refresh tokens are stored as httpOnly cookies for XSS protection.
      `,
            contact: { name: 'SBI Tech Team', email: 'tech@sbi.co.in' },
        },
        servers: [
            { url: `http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}`, description: 'Development' },
            { url: `https://api.yono.sbi.co.in/v1`, description: 'Production' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter the JWT access token returned by /auth/login',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' },
                        meta: {
                            type: 'object',
                            properties: {
                                total: { type: 'integer' },
                                page: { type: 'integer' },
                                pageSize: { type: 'integer' },
                                totalPages: { type: 'integer' },
                                hasNext: { type: 'boolean' },
                                hasPrev: { type: 'boolean' },
                            },
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        code: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication and user account management' },
            { name: 'Dashboard', description: 'Adaptive dashboard and preferences' },
            { name: 'Accounts', description: 'Bank accounts and beneficiaries' },
            { name: 'Transactions', description: 'Transaction engine' },
            { name: 'Search', description: 'Smart Search' },
            { name: 'Applications', description: 'Resume Anywhere — draft applications' },
            { name: 'Vault', description: 'Smart Vault — document management' },
            { name: 'Notifications', description: 'Notification management' },
        ],
    },
    apis: ['./src/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map