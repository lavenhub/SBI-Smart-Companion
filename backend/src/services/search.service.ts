import { SearchRepository } from '../repositories/search.repository';
import { cache } from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants';
import { SearchResponse, SearchResult } from '../types';
import { fuzzyScore, normalizeQuery } from '../utils/helpers';

const searchRepo = new SearchRepository();

// Synonym map for NLP-style search
const SYNONYMS: Record<string, string[]> = {
  'block card': ['deactivate card', 'freeze card', 'stop card', 'lock card'],
  'upi limit': ['upi transaction limit', 'increase upi', 'upi cap'],
  'open fd': ['create fd', 'new fixed deposit', 'start fd', 'book fd'],
  'statement': ['account statement', 'download statement', 'bank statement', 'transaction history'],
  'loan': ['apply loan', 'personal loan', 'home loan', 'car loan'],
  'cheque book': ['new cheque book', 'order cheque', 'request cheque'],
  'address': ['change address', 'update address', 'address update'],
  'nominee': ['add nominee', 'update nominee', 'change nominee'],
  'kyc': ['verify kyc', 'complete kyc', 'kyc update'],
  'transfer': ['send money', 'pay', 'transfer funds', 'neft', 'imps'],
  'balance': ['check balance', 'account balance', 'available balance'],
  'credit score': ['cibil score', 'credit report'],
};

export class SearchService {
  // ── Full-text + fuzzy search ───────────────────────────────────────────────
  async search(
    query: string,
    userId: string,
    limit = 10,
    sessionId?: string,
    ipAddress?: string,
  ): Promise<SearchResponse> {
    const normalized = normalizeQuery(query);
    const expandedTerms = this.expandQuery(normalized);

    // Load index (cached)
    let index = await cache.get<any[]>(CACHE_KEYS.SEARCH_INDEX);
    if (!index) {
      index = await searchRepo.findAll();
      await cache.set(CACHE_KEYS.SEARCH_INDEX, index, CACHE_TTL.SEARCH_INDEX);
    }

    // Score each item
    const scored: (SearchResult & { rawScore: number })[] = [];

    for (const item of index) {
      let score = 0;

      // Direct match on title
      const titleScore = fuzzyScore(normalized, item.title.toLowerCase());
      score = Math.max(score, titleScore * 1.5);

      // Keyword match
      for (const kw of (item.keywords ?? [])) {
        score = Math.max(score, fuzzyScore(normalized, kw.toLowerCase()));
      }

      // Alias match
      for (const alias of (item.aliases ?? [])) {
        score = Math.max(score, fuzzyScore(normalized, alias.toLowerCase()) * 1.2);
      }

      // Synonym match via expanded terms
      for (const term of expandedTerms) {
        const termScore = fuzzyScore(term, item.title.toLowerCase());
        if (termScore > 0.5) score = Math.max(score, termScore * 1.1);
        for (const kw of (item.keywords ?? [])) {
          score = Math.max(score, fuzzyScore(term, kw.toLowerCase()));
        }
      }

      // Popularity boost (up to +0.2)
      score += Math.min(item.popularity / 1000, 0.2);

      if (score > 0.25) {
        scored.push({
          id: item.id,
          featureKey: item.featureKey,
          title: item.title,
          description: item.description,
          category: item.category,
          module: item.module,
          route: item.route,
          icon: item.icon,
          estimatedTime: item.estimatedTime,
          shortcut: item.shortcut,
          score,
          rawScore: score,
        });
      }
    }

    // Sort by score descending
    scored.sort((a, b) => b.rawScore - a.rawScore);
    const results = scored.slice(0, limit);

    // Generate suggestions from popular searches
    const suggestions = await this.getSuggestions(normalized);

    // Record search history
    const history = await searchRepo.recordSearchHistory({
      userId,
      query,
      normalizedQuery: normalized,
      resultCount: results.length,
      sessionId,
      ipAddress,
    });

    // Increment popularity for top result
    if (results[0]) {
      searchRepo.incrementPopularity(results[0].featureKey).catch(() => {});
    }

    return {
      results: results.map(({ rawScore, ...r }) => r),
      query,
      totalResults: results.length,
      suggestions,
    };
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────
  async autocomplete(q: string, limit = 5): Promise<string[]> {
    const normalized = normalizeQuery(q);
    let index = await cache.get<any[]>(CACHE_KEYS.SEARCH_INDEX);
    if (!index) {
      index = await searchRepo.findAll();
      await cache.set(CACHE_KEYS.SEARCH_INDEX, index, CACHE_TTL.SEARCH_INDEX);
    }

    const matches: { title: string; score: number }[] = [];
    for (const item of index) {
      if (item.title.toLowerCase().startsWith(normalized)) {
        matches.push({ title: item.title, score: 1 });
      } else if (item.title.toLowerCase().includes(normalized)) {
        matches.push({ title: item.title, score: 0.7 });
      } else {
        for (const kw of (item.keywords ?? [])) {
          if (kw.toLowerCase().includes(normalized)) {
            matches.push({ title: item.title, score: 0.5 });
            break;
          }
        }
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((m) => m.title);
  }

  async getRecentSearches(userId: string) {
    return searchRepo.getRecentSearches(userId);
  }

  async getPopularSearches() {
    const cached = await cache.get<any[]>(CACHE_KEYS.SEARCH_POPULAR);
    if (cached) return cached;
    const popular = await searchRepo.getPopularSearches(10);
    await cache.set(CACHE_KEYS.SEARCH_POPULAR, popular, CACHE_TTL.MEDIUM);
    return popular;
  }

  async recordClick(historyId: string, clickedId: string, clickedType: string) {
    await searchRepo.updateClickData(historyId, clickedId, clickedType);
  }

  private expandQuery(query: string): string[] {
    const terms = [query];
    for (const [canonical, synonyms] of Object.entries(SYNONYMS)) {
      if (synonyms.some((s) => query.includes(s)) || query.includes(canonical)) {
        terms.push(canonical, ...synonyms);
      }
    }
    return [...new Set(terms)];
  }

  private async getSuggestions(query: string): Promise<string[]> {
    const popular = await this.getPopularSearches();
    return popular
      .filter((p: any) => p.normalizedQuery.includes(query) || query.includes(p.normalizedQuery))
      .slice(0, 3)
      .map((p: any) => p.normalizedQuery);
  }
}
