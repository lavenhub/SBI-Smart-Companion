import { Prisma, SearchIndex } from '@prisma/client';
export declare class SearchRepository {
    findAll(): Promise<SearchIndex[]>;
    findByKey(featureKey: string): Promise<SearchIndex | null>;
    upsert(data: Prisma.SearchIndexCreateInput): Promise<SearchIndex>;
    incrementPopularity(featureKey: string): Promise<void>;
    recordSearchHistory(data: {
        userId: string;
        query: string;
        normalizedQuery: string;
        resultCount: number;
        sessionId?: string;
        ipAddress?: string;
    }): Promise<{
        query: string;
        id: string;
        userId: string;
        ipAddress: string | null;
        createdAt: Date;
        normalizedQuery: string;
        resultCount: number;
        clickedId: string | null;
        clickedType: string | null;
        sessionId: string | null;
    }>;
    getRecentSearches(userId: string, limit?: number): Promise<{
        query: string;
        id: string;
        createdAt: Date;
        normalizedQuery: string;
        resultCount: number;
    }[]>;
    getPopularSearches(limit?: number): Promise<(Prisma.PickEnumerable<Prisma.SearchHistoryGroupByOutputType, "normalizedQuery"[]> & {
        _count: {
            normalizedQuery: number;
        };
    })[]>;
    updateClickData(historyId: string, clickedId: string, clickedType: string): Promise<void>;
    createManyIndex(items: any[]): Promise<void>;
}
//# sourceMappingURL=search.repository.d.ts.map