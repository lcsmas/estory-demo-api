import { Router } from 'express';
import LikeTimelineController from '../controllers/liketimelines.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class LikeTimelineRoute implements Route {
  public path = '/liketimelines';
  public router = Router();
  public likeTimelineController = new LikeTimelineController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.likeTimelineController.getLikeTimelines);
    this.router.get(`${this.path}/:id(\\d+)`, this.likeTimelineController.getLikeTimelineById);
    this.router.get(`${this.path}/user/:id(\\d+)`, this.likeTimelineController.getLikeTimelineByUserId);
    this.router.get(`${this.path}/timeline/:id(\\d+)`, this.likeTimelineController.getLikeTimelineByTimelineId);
    this.router.post(`${this.path}`, authMiddleware, this.likeTimelineController.createLikeTimeline);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.likeTimelineController.deleteLikeTimeline);
  }
}

export default LikeTimelineRoute;
