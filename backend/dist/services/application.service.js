"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_repository_1 = require("../repositories/application.repository");
const notification_repository_1 = require("../repositories/notification.repository");
const errors_1 = require("../utils/errors");
const constants_1 = require("../constants");
const helpers_1 = require("../utils/helpers");
const appRepo = new application_repository_1.ApplicationRepository();
const notifRepo = new notification_repository_1.NotificationRepository();
class ApplicationService {
    async startApplication(userId, dto) {
        const steps = constants_1.APPLICATION_STEPS[dto.applicationType];
        if (!steps)
            throw new errors_1.BusinessError(`Unknown application type: ${dto.applicationType}`);
        const allFields = steps.flatMap((s) => s.fields);
        return appRepo.create({
            user: { connect: { id: userId } },
            applicationType: dto.applicationType,
            status: 'DRAFT',
            title: dto.title ?? this.getDefaultTitle(dto.applicationType),
            currentStep: 0,
            totalSteps: steps.length,
            completionPercent: 0,
            estimatedMinutes: steps.length * 3,
            formData: JSON.stringify({}),
            completedFields: JSON.stringify([]),
            missingFields: JSON.stringify(allFields),
            steps: JSON.stringify(steps),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
    }
    async saveDraft(userId, dto) {
        const app = await appRepo.findById(dto.applicationId, userId);
        if (!app)
            throw new errors_1.NotFoundError('Application');
        if (!['DRAFT', 'SUBMITTED'].includes(app.status)) {
            throw new errors_1.BusinessError('Cannot modify a completed application');
        }
        const steps = constants_1.APPLICATION_STEPS[app.applicationType] ?? [];
        const stepDef = steps[dto.stepIndex];
        if (!stepDef)
            throw new errors_1.BusinessError('Invalid step index');
        // Parse existing formData (stored as JSON string in SQLite)
        let existingData = {};
        try {
            existingData = JSON.parse(app.formData ?? '{}');
        }
        catch { }
        const updatedData = { ...existingData, ...dto.fieldData };
        const allFields = steps.flatMap((s) => s.fields);
        const completedFields = allFields.filter((f) => updatedData[f] !== undefined && updatedData[f] !== '');
        const missingFields = allFields.filter((f) => !completedFields.includes(f));
        const completionPercent = (0, helpers_1.calcCompletionPercent)(completedFields, allFields);
        await appRepo.saveDraft({
            applicationId: dto.applicationId,
            stepIndex: dto.stepIndex,
            stepName: stepDef.name,
            fieldData: dto.fieldData,
            version: 1,
        });
        return appRepo.update(dto.applicationId, {
            formData: JSON.stringify(updatedData),
            currentStep: Math.max(app.currentStep, dto.stepIndex),
            completionPercent,
            completedFields: JSON.stringify(completedFields),
            missingFields: JSON.stringify(missingFields),
            updatedAt: new Date(),
        });
    }
    async getApplications(userId, pagination, filters) {
        return appRepo.findByUserId(userId, pagination, filters);
    }
    async getApplication(id, userId) {
        const app = await appRepo.findById(id, userId);
        if (!app)
            throw new errors_1.NotFoundError('Application');
        return { ...app, stepDefinitions: constants_1.APPLICATION_STEPS[app.applicationType] ?? [] };
    }
    async submitApplication(id, userId) {
        const app = await appRepo.findById(id, userId);
        if (!app)
            throw new errors_1.NotFoundError('Application');
        if (app.status !== 'DRAFT')
            throw new errors_1.BusinessError('Application already submitted');
        if (app.completionPercent < 80) {
            throw new errors_1.BusinessError(`Application is only ${app.completionPercent}% complete.`);
        }
        const updated = await appRepo.update(id, { status: 'SUBMITTED', submittedAt: new Date() });
        await notifRepo.create({
            user: { connect: { id: userId } },
            type: 'SYSTEM',
            channel: 'IN_APP',
            title: 'Application Submitted',
            body: `Your ${app.title} application has been submitted. Ref: ${id.slice(0, 8).toUpperCase()}`,
            isSent: true,
            sentAt: new Date(),
        });
        return updated;
    }
    async deleteDraft(id, userId) {
        const app = await appRepo.findById(id, userId);
        if (!app)
            throw new errors_1.NotFoundError('Application');
        if (app.status !== 'DRAFT')
            throw new errors_1.BusinessError('Only draft applications can be deleted');
        await appRepo.delete(id, userId);
    }
    async getDraftHistory(applicationId, userId) {
        const app = await appRepo.findById(applicationId, userId);
        if (!app)
            throw new errors_1.NotFoundError('Application');
        return appRepo.getDraftHistory(applicationId);
    }
    getDefaultTitle(type) {
        const titles = {
            LOAN: 'Loan Application', CREDIT_CARD: 'Credit Card Application',
            FIXED_DEPOSIT: 'Fixed Deposit', INSURANCE: 'Insurance Application',
            NOMINEE_UPDATE: 'Nominee Update', ADDRESS_UPDATE: 'Address Update',
            KYC_UPDATE: 'KYC Update', CHEQUE_BOOK: 'Cheque Book Request',
            ACCOUNT_OPENING: 'Account Opening',
        };
        return titles[type] ?? 'Application';
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map