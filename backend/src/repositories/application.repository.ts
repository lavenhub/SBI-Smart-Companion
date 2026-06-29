import { Prisma, Application, ApplicationDraft } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationQuery } from '../types';

export class ApplicationRepository {
  async findById(id: string, userId?: string): Promise<Application | null> {
    return prisma.application.findFirst({
      where: { id, ...(userId ? { userId } : {}) },
      include: { drafts: { where: { isLatest: true }, orderBy: { savedAt: 'desc' }, take: 1 } },
    });
  }

  async findByUserId(
    userId: string,
    pagination: PaginationQuery,
    filters: { status?: string; applicationType?: string },
  ): Promise<{ applications: Application[]; total: number }> {
    const { page, pageSize } = pagination;

    const where: Prisma.ApplicationWhereInput = {
      userId,
      ...(filters.status && { status: filters.status as any }),
      ...(filters.applicationType && { applicationType: filters.applicationType as any }),
    };

    const [applications, total] = await prisma.$transaction([
      prisma.application.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          drafts: { where: { isLatest: true }, take: 1, orderBy: { savedAt: 'desc' } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    return { applications, total };
  }

  async create(data: Prisma.ApplicationCreateInput): Promise<Application> {
    return prisma.application.create({ data });
  }

  async update(id: string, data: Prisma.ApplicationUpdateInput): Promise<Application> {
    return prisma.application.update({ where: { id }, data });
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.application.deleteMany({ where: { id, userId, status: 'DRAFT' } });
  }

  // ── Drafts ─────────────────────────────────────────────────────────────────
  async saveDraft(data: {
    applicationId: string;
    stepIndex: number;
    stepName: string;
    fieldData: Record<string, unknown>;
    version: number;
  }): Promise<ApplicationDraft> {
    await prisma.applicationDraft.updateMany({
      where: { applicationId: data.applicationId, stepIndex: data.stepIndex },
      data: { isLatest: false },
    });
    return prisma.applicationDraft.create({
      data: {
        isLatest: true,
        applicationId: data.applicationId,
        stepIndex: data.stepIndex,
        stepName: data.stepName,
        fieldData: JSON.stringify(data.fieldData),
        version: data.version,
      },
    });
  }

  async getDraftHistory(applicationId: string, stepIndex?: number) {
    return prisma.applicationDraft.findMany({
      where: {
        applicationId,
        ...(stepIndex !== undefined && { stepIndex }),
      },
      orderBy: { savedAt: 'desc' },
    });
  }

  async getLatestDraftByStep(applicationId: string, stepIndex: number) {
    return prisma.applicationDraft.findFirst({
      where: { applicationId, stepIndex, isLatest: true },
      orderBy: { savedAt: 'desc' },
    });
  }

  async countDraftApplications(userId: string): Promise<number> {
    return prisma.application.count({ where: { userId, status: 'DRAFT' } });
  }
}
