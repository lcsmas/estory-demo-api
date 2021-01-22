import { NextFunction, Request, Response } from 'express';
import { CreateMediaItemDto } from '../dtos/mediaitems.dto';
import { MediaItem } from '../interfaces/models/MediaItem.interface';
import MediaItemService from '../services/mediaitems.service';
import TimelineService from '../services/timelines.service';
import MediaTimelineService from '../services/mediatimelines.service';
import { createMediaTimelineDto } from '../dtos/mediatimelines.dto';
import { Media_Timeline } from '../interfaces/models/Media_Timeline.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/models/User.interface';
import UserTimelineService from '../services/usertimelines.service';
class MediaItemController {
  public mediaItemService = new MediaItemService();
  public timelineService = new TimelineService();
  public mediaTimelineService = new MediaTimelineService();
  public userTimelineService = new UserTimelineService();

  public getMediaItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllMediaItemsData: MediaItem[] = await this.mediaItemService.findAllMediaItem();
      res.status(200).json({
        data: findAllMediaItemsData,
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };

  public getMediaItemById = async (req: Request, res: Response, next: NextFunction) => {
    const mediaItemId = Number(req.params.id);

    try {
      const findOneMediaItemData: MediaItem = await this.mediaItemService.findMediaItemById(mediaItemId);
      res.status(200).json({
        data: findOneMediaItemData,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public getMediaItemByTimelineId = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findMediaItemData: MediaItem[] = await this.mediaItemService.findMediaItemByTimeline(timelineId);
      res.status(200).json({
        data: findMediaItemData,
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };

  public createMediaItem = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const mediaItemData: CreateMediaItemDto = req.body;
    const userData: User = req.user;

    try {
      // Check if provided timeline id is valid
      await this.timelineService.findTimelineById(req.body.id_timeline);

      // Check if provided timeline id owned by user
      const userTimelineData = {
        id_user: userData.id,
        id_timeline: req.body.id_timeline,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);

      // Create Media
      const createMediaItemData: MediaItem = await this.mediaItemService.createMediaItem(mediaItemData);

      //Create join between Media and Timeline
      const mediaTimelineData: createMediaTimelineDto = {
        id_timeline: req.body.id_timeline,
        id_media: createMediaItemData.id,
      };

      const createMediaTimelineData: Media_Timeline = await this.mediaTimelineService.createMediaTimeline(mediaTimelineData);

      res.status(201).json({
        data: [createMediaItemData, createMediaTimelineData],
        message: 'created',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMediaItem = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const mediaItemId = Number(req.params.id);
    const mediaItemData: MediaItem = req.body;
    const userData: User = req.user;

    try {
      // Check if provided timeline id owned by user
      const mediaTimelineData: Media_Timeline = await this.mediaTimelineService.findMediaTimelineByMediaId(mediaItemId);
      const userTimelineData = {
        id_user: userData.id,
        id_timeline: mediaTimelineData.id_timeline,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);

      const updateMediaItemData: MediaItem = await this.mediaItemService.updateMediaItem(mediaItemId, mediaItemData);
      res.status(200).json({
        data: updateMediaItemData,
        message: 'updated',
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMediaItem = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const mediaItemId = Number(req.params.id);
    const userData: User = req.user;

    try {
      // Check if provided timeline id owned by user
      const mediaTimelineData: Media_Timeline = await this.mediaTimelineService.findMediaTimelineByMediaId(mediaItemId);
      const userTimelineData = {
        id_user: userData.id,
        id_timeline: mediaTimelineData.id_timeline,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);
      // Delete MediaTimeline
      const deleteMediaTimeline: Media_Timeline = await this.mediaTimelineService.deleteMediaItem(Number(mediaTimelineData.id));
      // Delete Media
      const deleteMediaItemData: MediaItem = await this.mediaItemService.deleteMediaItem(mediaItemId);
      res.status(200).json({
        data: [deleteMediaItemData, deleteMediaTimeline],
        message: 'deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MediaItemController;
