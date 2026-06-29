"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_controller_1 = require("../controllers/application.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const application_validator_1 = require("../validators/application.validator");
const router = (0, express_1.Router)();
const ctrl = new application_controller_1.ApplicationController();
router.use(auth_middleware_1.authenticate);
router.get('/', (0, validate_middleware_1.validate)(application_validator_1.getApplicationsSchema), ctrl.getAll.bind(ctrl));
router.post('/start', (0, validate_middleware_1.validate)(application_validator_1.startApplicationSchema), ctrl.start.bind(ctrl));
router.get('/:id', (0, validate_middleware_1.validate)(application_validator_1.applicationIdSchema), ctrl.getById.bind(ctrl));
router.patch('/:id/save', (0, validate_middleware_1.validate)(application_validator_1.saveDraftSchema), ctrl.save.bind(ctrl));
router.post('/:id/submit', (0, validate_middleware_1.validate)(application_validator_1.submitApplicationSchema), ctrl.submit.bind(ctrl));
router.delete('/:id', (0, validate_middleware_1.validate)(application_validator_1.applicationIdSchema), ctrl.deleteDraft.bind(ctrl));
router.get('/:id/history', (0, validate_middleware_1.validate)(application_validator_1.applicationIdSchema), ctrl.getHistory.bind(ctrl));
exports.default = router;
//# sourceMappingURL=application.routes.js.map