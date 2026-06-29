import { Prisma, SearchIndex } from '@prisma/client';
import { prisma } from '../config/database';

export class SearchRepository {
  async findAll(): Promise<SearchIndex[]> {
    return prisma.searchIndex.findMany({
      where: { isActive: true },
      orderBy: { popularity: 'desc' },
    });
  }

  async findByKey(featureKey: string): Promise<SearchIndex | null> {
    return prisma.searchIndex.findUnique({ where: { featureKey } });
  }

  async upsert(data: Prisma.SearchIndexCreateInput): Promise<SearchIndex> {
    return prisma.searchIndex.upsert({
      where: { featureKey: data.featureKey },
      create: data,
      update: data,
    });
  }

  async incrementPopularity(featureKey: string): Promise<void> {
    await prisma.searchIndex.update({
      where: { featureKey },
      data: { popularity: { increment: 1 } },
    });
  }

  async recordSearchHistory(data: {
    userId: string;
    query: string;
    normalizedQuery: string;
    resultCount: number;
    sessionId?: string;
    ipAddress?: string;
  }) {
    return prisma.searchHistory.create({ data });
  }

  async getRecentSearches(userId: string, limit = 10) {
    const rows = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      distinct: ['normalizedQuery'],
      select: {
        id: true, query: true, normalizedQuery: true, createdAt: true, resultCount: true,
      },
    });
    return rows;
  }

  async getPopularSearches(limit = 10) {
    return prisma.searchHistory.groupBy({
      by: ['normalizedQuery'],
      _count: { normalizedQuery: true },
      orderBy: { _count: { normalizedQuery: 'desc' } },
      take: limit,
    });
  }

  async updateClickData(historyId: string, clickedId: string, clickedType: string) {
    await prisma.searchHistory.update({
      where: { id: historyId },
      data: { clickedId, clickedType },
    });
  }

  async createManyIndex(items: any[]): Promise<void> {
    await prisma.searchIndex.createMany({ data: items } as any);
  }
}
