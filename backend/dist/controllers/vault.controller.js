"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultController = void 0;
const vault_service_1 = require("../services/vault.service");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const vaultService = new vault_service_1.VaultService();
class VaultController {
    async getFolderTree(req, res, next) {
        try {
            const tree = await vaultService.getFolderTree(req.user.userId);
            (0, response_1.sendSuccess)(res, tree);
        }
        catch (err) {
            next(err);
        }
    }
    async createFolder(req, res, next) {
        try {
            const folder = await vaultService.createFolder(req.user.userId, req.body);
            (0, response_1.sendCreated)(res, folder, 'Folder created');
        }
        catch (err) {
            next(err);
        }
    }
    async updateFolder(req, res, next) {
        try {
            const folder = await vaultService.updateFolder(req.params.id, req.user.userId, req.body);
            (0, response_1.sendSuccess)(res, folder, 'Folder updated');
        }
        catch (err) {
            next(err);
        }
    }
    async deleteFolder(req, res, next) {
        try {
            await vaultService.deleteFolder(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Folder deleted');
        }
        catch (err) {
            next(err);
        }
    }
    async getDocuments(req, res, next) {
        try {
            const result = await vaultService.getDocuments(req.user.userId, req.query.folderId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    }
    async uploadDocument(req, res, next) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file uploaded' });
                return;
            }
            const doc = await vaultService.uploadDocument(req.user.userId, req.file, req.body);
            (0, response_1.sendCreated)(res, doc, 'Document uploaded');
        }
        catch (err) {
            next(err);
        }
    }
    async getDocument(req, res, next) {
        try {
            const doc = await vaultService.getDocument(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, doc);
        }
        catch (err) {
            next(err);
        }
    }
    async downloadDocument(req, res, next) {
        try {
            const { doc, buffer } = await vaultService.downloadDocument(req.params.id, req.user.userId);
            res.setHeader('Content-Type', doc.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName}"`);
            res.setHeader('Content-Length', buffer.length);
            res.send(buffer);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteDocument(req, res, next) {
        try {
            await vaultService.deleteDocument(req.params.id, req.user.userId);
            (0, response_1.sendSuccess)(res, null, 'Document deleted');
        }
        catch (err) {
            next(err);
        }
    }
    async searchDocuments(req, res, next) {
        try {
            const q = req.query.q;
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || env_1.env.DEFAULT_PAGE_SIZE;
            const { documents, total } = await vaultService.searchDocuments(req.user.userId, q, {
                category: req.query.category,
                folderId: req.query.folderId,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
            }, { page, pageSize });
            (0, response_1.sendSuccess)(res, documents, 'Documents found', 200, (0, response_1.buildPaginationMeta)(total, page, pageSize));
        }
        catch (err) {
            next(err);
        }
    }
}
exports.VaultController = VaultController;
//# sourceMappingURL=vault.controller.js.map