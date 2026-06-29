import { PaginationQuery } from '../types';
export declare class ApplicationService {
    startApplication(userId: string, dto: {
        applicationType: string;
        title?: string;
    }): Promise<{
        status: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        applicationType: string;
        title: string;
        currentStep: number;
        totalSteps: number;
        completionPercent: number;
        estimatedMinutes: number;
        formData: string;
        completedFields: string;
        missingFields: string;
        steps: string;
        submittedAt: Date | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
    }>;
    saveDraft(userId: string, dto: {
        applicationId: string;
        stepIndex: number;
        fieldData: Record<string, unknown>;
    }): Promise<{
        status: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        applicationType: string;
        title: string;
        currentStep: number;
        totalSteps: number;
        completionPercent: number;
        estimatedMinutes: number;
        formData: string;
        completedFields: string;
        missingFields: string;
        steps: string;
        submittedAt: Date | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
    }>;
    getApplications(userId: string, pagination: PaginationQuery, filters: {
        status?: string;
        applicationType?: string;
    }): Promise<{
        applications: import(".prisma/client").Application[];
        total: number;
    }>;
    getApplication(id: string, userId: string): Promise<{
        stepDefinitions: {
            name: string;
            fields: string[];
        }[];
        status: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        applicationType: string;
        title: string;
        currentStep: number;
        totalSteps: number;
        completionPercent: number;
        estimatedMinutes: number;
        formData: string;
        completedFields: string;
        missingFields: string;
        steps: string;
        submittedAt: Date | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
    }>;
    submitApplication(id: string, userId: string): Promise<{
        status: string;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        applicationType: string;
        title: string;
        currentStep: number;
        totalSteps: number;
        completionPercent: number;
        estimatedMinutes: number;
        formData: string;
        completedFields: string;
        missingFields: string;
        steps: string;
        submittedAt: Date | null;
        approvedAt: Date | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
    }>;
    deleteDraft(id: string, userId: string): Promise<void>;
    getDraftHistory(applicationId: string, userId: string): Promise<{
        id: string;
        version: number;
        isLatest: boolean;
        savedAt: Date;
        applicationId: string;
        stepIndex: number;
        stepName: string;
        fieldData: string;
    }[]>;
    private getDefaultTitle;
}
//# sourceMappingURL=application.service.d.ts.map