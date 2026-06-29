"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultRepository = void 0;
const database_1 = require("../config/database");
class VaultRepository {
    // ── Folders ───────────────────────────────────────────────────────────────
    async findFolderById(id, userId) {
        return database_1.prisma.vaultFolder.findFirst({ where: { id, userId } });
    }
    async findFolderBySlug(slug, userId, parentId) {
        return database_1.prisma.vaultFolder.findFirst({ where: { slug, userId, parentId: parentId ?? null } });
    }
    async findFoldersByUserId(userId) {
        return database_1.prisma.vaultFolder.findMany({
            where: { userId },
            orderBy: [{ isSystem: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        });
    }
    async createFolder(data) {
        return database_1.prisma.vaultFolder.create({ data });
    }
    async updateFolder(id, data) {
        return database_1.prisma.vaultFolder.update({ where: { id }, data });
    }
    async deleteFolder(id, userId) {
        await database_1.prisma.vaultFolder.deleteMany({ where: { id, userId, isSystem: false } });
    }
    // ── Documents ─────────────────────────────────────────────────────────────
    async findDocumentById(id, userId) {
        return database_1.prisma.document.findFirst({ where: { id, userId, status: 'ACTIVE' } });
    }
    async findDocumentsByFolder(folderId, userId) {
        return database_1.prisma.document.findMany({
            where: { folderId, userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDocument(data) {
        return database_1.prisma.document.create({ data });
    }
    async updateDocument(id, data) {
        return database_1.prisma.document.update({ where: { id }, data });
    }
    async softDeleteDocument(id, userId) {
        await database_1.prisma.document.updateMany({ where: { id, userId }, data: { status: 'DELETED' } });
    }
    async incrementDownloadCount(id) {
        await database_1.prisma.document.update({
            where: { id },
            data: { downloadCount: { increment: 1 }, lastAccessedAt: new Date() },
        });
    }
    async searchDocuments(userId, query, filters, pagination) {
        const { page, pageSize } = pagination;
        // SQLite: no mode:'insensitive', use plain contains
        const where = {
            userId,
            status: 'ACTIVE',
            ...(query ? {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { tags: { contains: query.toLowerCase() } },
                ],
            } : {}),
            ...(filters.category && { category: filters.category }),
            ...(filters.folderId && { folderId: filters.folderId }),
            ...(filters.startDate ? { createdAt: { gte: filters.startDate } } : {}),
            ...(filters.endDate ? { createdAt: { lte: filters.endDate } } : {}),
        };
        const [documents, total] = await database_1.prisma.$transaction([
            database_1.prisma.document.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.document.count({ where }),
        ]);
        return { documents, total };
    }
    async getDocumentCountByFolder(userId) {
        const counts = await database_1.prisma.document.groupBy({
            by: ['folderId'],
            where: { userId, status: 'ACTIVE', folderId: { not: null } },
            _count: true,
        });
        return Object.fromEntries(counts.map((c) => [c.folderId, c._count]));
    }
}
exports.VaultRepository = VaultRepository;
//# sourceMappingURL=vault.repository.js.map