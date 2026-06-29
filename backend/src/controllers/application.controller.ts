import { Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';
import { AuthenticatedRequest } from '../types';
import { sendSuccess, sendCreated, buildPaginationMeta } from '../utils/response';
import { env } from '../config/env';

const appService = new ApplicationService();

export class ApplicationController {
  async start(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const application = await appService.startApplication(req.user.userId, req.body);
      sendCreated(res, application, 'Application started');
    } catch (err) {
      next(err);
    }
  }

  async save(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await appService.saveDraft(req.user.userId, {
        applicationId: req.params.id,
        stepIndex: req.body.stepIndex,
        fieldData: req.body.fieldData,
      });
      sendSuccess(res, updated, 'Draft saved');
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || env.DEFAULT_PAGE_SIZE;

      const { applications, total } = await appService.getApplications(
        req.user.userId,
        { page, pageSize },
        { status: req.query.status as string, applicationType: req.query.applicationType as string },
      );

      sendSuccess(res, applications, 'Applications retrieved', 200, buildPaginationMeta(total, page, pageSize));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const app = await appService.getApplication(req.params.id, req.user.userId);
      sendSuccess(res, app);
    } catch (err) {
      next(err);
    }
  }

  async submit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await appService.submitApplication(req.params.id, req.user.userId);
      sendSuccess(res, updated, 'Application submitted successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteDraft(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await appService.deleteDraft(req.params.id, req.user.userId);
      sendSuccess(res, null, 'Draft deleted');
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await appService.getDraftHistory(req.params.id, req.user.userId);
      sendSuccess(res, history);
    } catch (err) {
      next(err);
    }
  }
}
