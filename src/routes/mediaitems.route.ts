import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import MediaItemController from '../controllers/mediaitems.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { CreateMediaItemDto } from '../dtos/mediaitems.dto';
import validationMiddleware from '../middlewares/validation.middleware';

class MediaItemRoute implements Route {
  public path = '/mediaitems';
  public router = Router();
  public mediaItemController = new MediaItemController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.mediaItemController.getMediaItems);
    this.router.get(`${this.path}/:id(\\d+)`, this.mediaItemController.getMediaItemById);
    this.router.get(`${this.path}/timeline/:id(\\d+)`, this.mediaItemController.getMediaItemByTimelineId);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateMediaItemDto, 'body'), this.mediaItemController.createMediaItem);
    this.router.put(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      validationMiddleware(CreateMediaItemDto, 'body', true),
      this.mediaItemController.updateMediaItem,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.mediaItemController.deleteMediaItem);
  }
}

export default MediaItemRoute;
