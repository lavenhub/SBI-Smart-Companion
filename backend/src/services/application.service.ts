import { ApplicationRepository } from '../repositories/application.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotFoundError, BusinessError } from '../utils/errors';
import { APPLICATION_STEPS } from '../constants';
import { calcCompletionPercent } from '../utils/helpers';
import { PaginationQuery } from '../types';

const appRepo = new ApplicationRepository();
const notifRepo = new NotificationRepository();

export class ApplicationService {
  async startApplication(userId: string, dto: { applicationType: string; title?: string }) {
    const steps = APPLICATION_STEPS[dto.applicationType];
    if (!steps) throw new BusinessError(`Unknown application type: ${dto.applicationType}`);
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
    } as any);
  }

  async saveDraft(userId: string, dto: {
    applicationId: string;
    stepIndex: number;
    fieldData: Record<string, unknown>;
  }) {
    const app = await appRepo.findById(dto.applicationId, userId);
    if (!app) throw new NotFoundError('Application');
    if (!['DRAFT', 'SUBMITTED'].includes(app.status)) {
      throw new BusinessError('Cannot modify a completed application');
    }

    const steps = APPLICATION_STEPS[app.applicationType] ?? [];
    const stepDef = steps[dto.stepIndex];
    if (!stepDef) throw new BusinessError('Invalid step index');

    // Parse existing formData (stored as JSON string in SQLite)
    let existingData: Record<string, unknown> = {};
    try { existingData = JSON.parse(app.formData as string ?? '{}'); } catch {}
    const updatedData = { ...existingData, ...dto.fieldData };

    const allFields = steps.flatMap((s) => s.fields);
    const completedFields = allFields.filter((f) => updatedData[f] !== undefined && updatedData[f] !== '');
    const missingFields = allFields.filter((f) => !completedFields.includes(f));
    const completionPercent = calcCompletionPercent(completedFields, allFields);

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
    } as any);
  }

  async getApplications(userId: string, pagination: PaginationQuery, filters: {
    status?: string; applicationType?: string;
  }) {
    return appRepo.findByUserId(userId, pagination, filters);
  }

  async getApplication(id: string, userId: string) {
    const app = await appRepo.findById(id, userId);
    if (!app) throw new NotFoundError('Application');
    return { ...app, stepDefinitions: APPLICATION_STEPS[app.applicationType] ?? [] };
  }

  async submitApplication(id: string, userId: string) {
    const app = await appRepo.findById(id, userId);
    if (!app) throw new NotFoundError('Application');
    if (app.status !== 'DRAFT') throw new BusinessError('Application already submitted');
    if (app.completionPercent < 80) {
      throw new BusinessError(`Application is only ${app.completionPercent}% complete.`);
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

  async deleteDraft(id: string, userId: string): Promise<void> {
    const app = await appRepo.findById(id, userId);
    if (!app) throw new NotFoundError('Application');
    if (app.status !== 'DRAFT') throw new BusinessError('Only draft applications can be deleted');
    await appRepo.delete(id, userId);
  }

  async getDraftHistory(applicationId: string, userId: string) {
    const app = await appRepo.findById(applicationId, userId);
    if (!app) throw new NotFoundError('Application');
    return appRepo.getDraftHistory(applicationId);
  }

  private getDefaultTitle(type: string): string {
    const titles: Record<string, string> = {
      LOAN: 'Loan Application', CREDIT_CARD: 'Credit Card Application',
      FIXED_DEPOSIT: 'Fixed Deposit', INSURANCE: 'Insurance Application',
      NOMINEE_UPDATE: 'Nominee Update', ADDRESS_UPDATE: 'Address Update',
      KYC_UPDATE: 'KYC Update', CHEQUE_BOOK: 'Cheque Book Request',
      ACCOUNT_OPENING: 'Account Opening',
    };
    return titles[type] ?? 'Application';
  }
}
