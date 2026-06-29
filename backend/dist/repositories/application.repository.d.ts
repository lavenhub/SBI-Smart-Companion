import { Prisma, Application, ApplicationDraft } from '@prisma/client';
import { PaginationQuery } from '../types';
export declare class ApplicationRepository {
    findById(id: string, userId?: string): Promise<Application | null>;
    findByUserId(userId: string, pagination: PaginationQuery, filters: {
        status?: string;
        applicationType?: string;
    }): Promise<{
        applications: Application[];
        total: number;
    }>;
    create(data: Prisma.ApplicationCreateInput): Promise<Application>;
    update(id: string, data: Prisma.ApplicationUpdateInput): Promise<Application>;
    delete(id: string, userId: string): Promise<void>;
    saveDraft(data: {
        applicationId: string;
        stepIndex: number;
        stepName: string;
        fieldData: Record<string, unknown>;
        version: number;
    }): Promise<ApplicationDraft>;
    getDraftHistory(applicationId: string, stepIndex?: number): Promise<{
        id: string;
        version: number;
        isLatest: boolean;
        savedAt: Date;
        applicationId: string;
        stepIndex: number;
        stepName: string;
        fieldData: string;
    }[]>;
    getLatestDraftByStep(applicationId: string, stepIndex: number): Promise<{
        id: string;
        version: number;
        isLatest: boolean;
        savedAt: Date;
        applicationId: string;
        stepIndex: number;
        stepName: string;
        fieldData: string;
    } | null>;
    countDraftApplications(userId: string): Promise<number>;
}
//# sourceMappingURL=application.repository.d.ts.map