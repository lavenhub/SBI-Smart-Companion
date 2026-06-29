"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const database_1 = require("../config/database");
class ApplicationRepository {
    async findById(id, userId) {
        return database_1.prisma.application.findFirst({
            where: { id, ...(userId ? { userId } : {}) },
            include: { drafts: { where: { isLatest: true }, orderBy: { savedAt: 'desc' }, take: 1 } },
        });
    }
    async findByUserId(userId, pagination, filters) {
        const { page, pageSize } = pagination;
        const where = {
            userId,
            ...(filters.status && { status: filters.status }),
            ...(filters.applicationType && { applicationType: filters.applicationType }),
        };
        const [applications, total] = await database_1.prisma.$transaction([
            database_1.prisma.application.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { updatedAt: 'desc' },
                include: {
                    drafts: { where: { isLatest: true }, take: 1, orderBy: { savedAt: 'desc' } },
                },
            }),
            database_1.prisma.application.count({ where }),
        ]);
        return { applications, total };
    }
    async create(data) {
        return database_1.prisma.application.create({ data });
    }
    async update(id, data) {
        return database_1.prisma.application.update({ where: { id }, data });
    }
    async delete(id, userId) {
        await database_1.prisma.application.deleteMany({ where: { id, userId, status: 'DRAFT' } });
    }
    // ── Drafts ─────────────────────────────────────────────────────────────────
    async saveDraft(data) {
        await database_1.prisma.applicationDraft.updateMany({
            where: { applicationId: data.applicationId, stepIndex: data.stepIndex },
            data: { isLatest: false },
        });
        return database_1.prisma.applicationDraft.create({
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
    async getDraftHistory(applicationId, stepIndex) {
        return database_1.prisma.applicationDraft.findMany({
            where: {
                applicationId,
                ...(stepIndex !== undefined && { stepIndex }),
            },
            orderBy: { savedAt: 'desc' },
        });
    }
    async getLatestDraftByStep(applicationId, stepIndex) {
        return database_1.prisma.applicationDraft.findFirst({
            where: { applicationId, stepIndex, isLatest: true },
            orderBy: { savedAt: 'desc' },
        });
    }
    async countDraftApplications(userId) {
        return database_1.prisma.application.count({ where: { userId, status: 'DRAFT' } });
    }
}
exports.ApplicationRepository = ApplicationRepository;
//# sourceMappingURL=application.repository.js.map