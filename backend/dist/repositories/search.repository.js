"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchRepository = void 0;
const database_1 = require("../config/database");
class SearchRepository {
    async findAll() {
        return database_1.prisma.searchIndex.findMany({
            where: { isActive: true },
            orderBy: { popularity: 'desc' },
        });
    }
    async findByKey(featureKey) {
        return database_1.prisma.searchIndex.findUnique({ where: { featureKey } });
    }
    async upsert(data) {
        return database_1.prisma.searchIndex.upsert({
            where: { featureKey: data.featureKey },
            create: data,
            update: data,
        });
    }
    async incrementPopularity(featureKey) {
        await database_1.prisma.searchIndex.update({
            where: { featureKey },
            data: { popularity: { increment: 1 } },
        });
    }
    async recordSearchHistory(data) {
        return database_1.prisma.searchHistory.create({ data });
    }
    async getRecentSearches(userId, limit = 10) {
        const rows = await database_1.prisma.searchHistory.findMany({
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
        return database_1.prisma.searchHistory.groupBy({
            by: ['normalizedQuery'],
            _count: { normalizedQuery: true },
            orderBy: { _count: { normalizedQuery: 'desc' } },
            take: limit,
        });
    }
    async updateClickData(historyId, clickedId, clickedType) {
        await database_1.prisma.searchHistory.update({
            where: { id: historyId },
            data: { clickedId, clickedType },
        });
    }
    async createManyIndex(items) {
        await database_1.prisma.searchIndex.createMany({ data: items });
    }
}
exports.SearchRepository = SearchRepository;
//# sourceMappingURL=search.repository.js.map