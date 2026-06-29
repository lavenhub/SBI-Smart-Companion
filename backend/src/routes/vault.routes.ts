import { Router } from 'express';
import { VaultController } from '../controllers/vault.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { createFolderSchema, folderIdSchema, documentIdSchema } from '../validators/vault.validator';
import { Handler } from '../types';

const router = Router();
const ctrl = new VaultController();

router.use(authenticate as Handler);

router.get('/', auditLog('VAULT_ACCESSED') as Handler, ctrl.getFolderTree.bind(ctrl) as Handler);
router.post('/folders', validate(createFolderSchema), ctrl.createFolder.bind(ctrl) as Handler);
router.patch('/folders/:id', validate(folderIdSchema), ctrl.updateFolder.bind(ctrl) as Handler);
router.delete('/folders/:id', validate(folderIdSchema), ctrl.deleteFolder.bind(ctrl) as Handler);
router.get('/documents', ctrl.getDocuments.bind(ctrl) as Handler);
router.get('/documents/search', ctrl.searchDocuments.bind(ctrl) as Handler);
router.post('/documents/upload', uploadSingle, ctrl.uploadDocument.bind(ctrl) as Handler);
router.get('/documents/:id', validate(documentIdSchema), auditLog('DOCUMENT_ACCESSED') as Handler, ctrl.getDocument.bind(ctrl) as Handler);
router.get('/documents/:id/download', validate(documentIdSchema), auditLog('DOCUMENT_DOWNLOADED') as Handler, ctrl.downloadDocument.bind(ctrl) as Handler);
router.delete('/documents/:id', validate(documentIdSchema), ctrl.deleteDocument.bind(ctrl) as Handler);

export default router;
