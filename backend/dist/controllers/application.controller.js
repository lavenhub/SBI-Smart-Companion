"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("../services/application.service");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const appService = new application_service_1.ApplicationService();
class ApplicationController {
    async start(req, res, next) {
        try {
            const application = await appService.startApplication(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, application, 'Application started');
        }
        catch (err) {
            next(err);
        }
    }
    async save(req, res, next) {
        try {
            const updated = await appService.saveDraft(req.user.userId, {
                applicationId: req.params.id,
                stepIndex: req.body.stepIndex,
                fieldData: req.body.fieldData,
            });
            (0, response_1.sendSuccess)(res, updated, 'Draft saved');
        }
        catch (err) {
            next(err);
        }
    }
    async getAll(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || env_1.env.DEFAULT_PAGE_SIZE;
            const { applications, total } = await appService.getApplications(req.user.userId, { page, pageSize }, { status: req.query.status, applicationType: req.query.applicationType });
            (0, response_1.sendSuccess)(res, applications, 'Applications retrieved', 200, (0, response_1.buildPaginationMeta)(total, page, pageSize));
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const app = await appService.getApplication(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, app);
        }
        catch (err) {
            next(err);
        }
    }
    async submit(req, res, next) {
        try {
            const updated = await appService.submitApplication(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, updated, 'Application submitted successfully');
        }
        catch (err) {
            next(err);
        }
    }
    async deleteDraft(req, res, next) {
        try {
            await appService.deleteDraft(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Draft deleted');
        }
        catch (err) {
            next(err);
        }
    }
    async getHistory(req, res, next) {
        try {
            const history = await appService.getDraftHistory(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, history);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map