import { Document, VaultFolder } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationQuery } from '../types';

export class VaultRepository {
  // ── Folders ───────────────────────────────────────────────────────────────
  async findFolderById(id: string, userId: string): Promise<VaultFolder | null> {
    return prisma.vaultFolder.findFirst({ where: { id, userId } });
  }

  async findFolderBySlug(slug: string, userId: string, parentId?: string | null) {
    return prisma.vaultFolder.findFirst({ where: { slug, userId, parentId: parentId ?? null } });
  }

  async findFoldersByUserId(userId: string): Promise<VaultFolder[]> {
    return prisma.vaultFolder.findMany({
      where: { userId },
      orderBy: [{ isSystem: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createFolder(data: any): Promise<VaultFolder> {
    return prisma.vaultFolder.create({ data });
  }

  async updateFolder(id: string, data: any) {
    return prisma.vaultFolder.update({ where: { id }, data });
  }

  async deleteFolder(id: string, userId: string): Promise<void> {
    await prisma.vaultFolder.deleteMany({ where: { id, userId, isSystem: false } });
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  async findDocumentById(id: string, userId: string): Promise<Document | null> {
    return prisma.document.findFirst({ where: { id, userId, status: 'ACTIVE' } });
  }

  async findDocumentsByFolder(folderId: string, userId: string): Promise<Document[]> {
    return prisma.document.findMany({
      where: { folderId, userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDocument(data: any): Promise<Document> {
    return prisma.document.create({ data });
  }

  async updateDocument(id: string, data: any) {
    return prisma.document.update({ where: { id }, data });
  }

  async softDeleteDocument(id: string, userId: string): Promise<void> {
    await prisma.document.updateMany({ where: { id, userId }, data: { status: 'DELETED' } });
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 }, lastAccessedAt: new Date() },
    });
  }

  async searchDocuments(
    userId: string,
    query: string,
    filters: { category?: string; folderId?: string; startDate?: Date; endDate?: Date },
    pagination: PaginationQuery,
  ): Promise<{ documents: any[]; total: number }> {
    const { page, pageSize } = pagination;

    // SQLite: no mode:'insensitive', use plain contains
    const where: any = {
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

    const [documents, total] = await prisma.$transaction([
      prisma.document.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.document.count({ where }),
    ]);

    return { documents, total };
  }

  async getDocumentCountByFolder(userId: string): Promise<Record<string, number>> {
    const counts = await prisma.document.groupBy({
      by: ['folderId'],
      where: { userId, status: 'ACTIVE', folderId: { not: null } },
      _count: true,
    });
    return Object.fromEntries(counts.map((c) => [c.folderId!, c._count]));
  }
}
