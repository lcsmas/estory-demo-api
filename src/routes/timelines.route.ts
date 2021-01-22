import { Router } from 'express';
import TimelinesController from '../controllers/timelines.controller';
import { CreateTimelineDto } from '../dtos/timelines.dto';
import authMiddleware from '../middlewares/auth.middleware';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';

class TimelinesRoute implements Route {
  public path = '/timelines';
  public router = Router();
  public timelinesController = new TimelinesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.timelinesController.getTimelines);
    this.router.get(`${this.path}/:id(\\d+)`, this.timelinesController.getTimelineById);
    this.router.get(`${this.path}/max`, this.timelinesController.getMax);
    this.router.get(`${this.path}/:id/author`, this.timelinesController.getTimelineAuthorById);
    this.router.get(`${this.path}/:id/period`, this.timelinesController.getTimelinePeriod);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateTimelineDto, 'body'), this.timelinesController.createTimeline);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      validationMiddleware(CreateTimelineDto, 'body', true),
      this.timelinesController.updateTimeline,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.timelinesController.deleteTimeline);
  }
}

export default TimelinesRoute;
