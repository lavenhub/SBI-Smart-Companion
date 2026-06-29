import { SearchResponse } from '../types';
export declare class SearchService {
    search(query: string, userId: string, limit?: number, sessionId?: string, ipAddress?: string): Promise<SearchResponse>;
    autocomplete(q: string, limit?: number): Promise<string[]>;
    getRecentSearches(userId: string): Promise<{
        query: string;
        id: string;
        createdAt: Date;
        normalizedQuery: string;
        resultCount: number;
    }[]>;
    getPopularSearches(): Promise<any[]>;
    recordClick(historyId: string, clickedId: string, clickedType: string): Promise<void>;
    private expandQuery;
    private getSuggestions;
}
//# sourceMappingURL=search.service.d.ts.map