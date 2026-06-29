"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const account_routes_1 = __importDefault(require("./account.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const search_routes_1 = __importDefault(require("./search.routes"));
const application_routes_1 = __importDefault(require("./application.routes"));
const vault_routes_1 = __importDefault(require("./vault.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/accounts', account_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/search', search_routes_1.default);
router.use('/applications', application_routes_1.default);
router.use('/vault', vault_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map