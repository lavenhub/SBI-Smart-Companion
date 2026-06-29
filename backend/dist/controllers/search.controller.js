"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("../services/search.service");
const response_1 = require("../utils/response");
const searchService = new search_service_1.SearchService();
class SearchController {
    async search(req, res, next) {
        try {
            const { query, limit, sessionId } = req.body;
            const ipAddress = req.headers['x-forwarded-for'] ?? req.ip;
            const results = await searchService.search(query, req.user.userId, limit ?? 10, sessionId, ipAddress);
            (0, response_1.sendSuccess)(res, results);
        }
        catch (err) {
            next(err);
        }
    }
    async autocomplete(req, res, next) {
        try {
            const q = req.query.q;
            const suggestions = await searchService.autocomplete(q);
            (0, response_1.sendSuccess)(res, { suggestions });
        }
        catch (err) {
            next(err);
        }
    }
    async getHistory(req, res, next) {
        try {
            const history = await searchService.getRecentSearches(req.user.userId);
            (0, response_1.sendSuccess)(res, history);
        }
        catch (err) {
            next(err);
        }
    }
    async getPopular(req, res, next) {
        try {
            const popular = await searchService.getPopularSearches();
            (0, response_1.sendSuccess)(res, popular);
        }
        catch (err) {
            next(err);
        }
    }
    async recordClick(req, res, next) {
        try {
            await searchService.recordClick(req.body.historyId, req.body.clickedId, req.body.clickedType);
            (0, response_1.sendSuccess)(res, null, 'Click recorded');
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SearchController = SearchController;
//# sourceMappingURL=search.controller.js.map