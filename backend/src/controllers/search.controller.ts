import { Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess } from '../utils/response';

const searchService = new SearchService();

export class SearchController {
  async search(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, limit, sessionId } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] as string) ?? req.ip;

      const results = await searchService.search(
        query,
        req.user.userId,
        limit ?? 10,
        sessionId,
        ipAddress,
      );
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  async autocomplete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query.q as string;
      const suggestions = await searchService.autocomplete(q);
      sendSuccess(res, { suggestions });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await searchService.getRecentSearches(req.user.userId);
      sendSuccess(res, history);
    } catch (err) {
      next(err);
    }
  }

  async getPopular(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const popular = await searchService.getPopularSearches();
      sendSuccess(res, popular);
    } catch (err) {
      next(err);
    }
  }

  async recordClick(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await searchService.recordClick(req.body.historyId, req.body.clickedId, req.body.clickedType);
      sendSuccess(res, null, 'Click recorded');
    } catch (err) {
      next(err);
    }
  }
}
