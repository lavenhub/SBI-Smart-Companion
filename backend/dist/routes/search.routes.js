"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const search_validator_1 = require("../validators/search.validator");
const router = (0, express_1.Router)();
const ctrl = new search_controller_1.SearchController();
router.use(auth_middleware_1.authenticate);
router.post('/', (0, validate_middleware_1.validate)(search_validator_1.searchSchema), (0, audit_middleware_1.auditLog)('SEARCH_PERFORMED'), ctrl.search.bind(ctrl));
router.get('/autocomplete', ctrl.autocomplete.bind(ctrl));
router.get('/history', ctrl.getHistory.bind(ctrl));
router.get('/popular', ctrl.getPopular.bind(ctrl));
router.post('/click', (0, validate_middleware_1.validate)(search_validator_1.recordClickSchema), ctrl.recordClick.bind(ctrl));
exports.default = router;
//# sourceMappingURL=search.routes.js.map