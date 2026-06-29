"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const notification_validator_1 = require("../validators/notification.validator");
const router = (0, express_1.Router)();
const ctrl = new notification_controller_1.NotificationController();
router.use(auth_middleware_1.authenticate);
router.get('/', (0, validate_middleware_1.validate)(notification_validator_1.getNotificationsSchema), ctrl.getAll.bind(ctrl));
router.get('/unread-count', ctrl.getUnreadCount.bind(ctrl));
router.patch('/read-all', (0, validate_middleware_1.validate)(notification_validator_1.markAllReadSchema), ctrl.markAllRead.bind(ctrl));
router.patch('/:id/read', (0, validate_middleware_1.validate)(notification_validator_1.markReadSchema), ctrl.markRead.bind(ctrl));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map