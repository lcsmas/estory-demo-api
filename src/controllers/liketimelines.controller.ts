import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/models/User.interface';
import { User_Timeline } from '../interfaces/models/User_Timeline.interface';
import likeTimelineService from '../services/liketimelines.service';
import { isEmpty } from '../utils/util';

class LikeTimelineController {
  public likeTimelineService = new likeTimelineService();

  public getLikeTimelines = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllLikeTimelineData: User_Timeline[] = await this.likeTimelineService.findAllLikeTimeline();
      res.status(200).json({
        data: findAllLikeTimelineData,
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };

  public getLikeTimelineById = async (req: Request, res: Response, next: NextFunction) => {
    const likeTimelineId = Number(req.params.id);

    try {
      const findOneLikeTimelineData: User_Timeline = await this.likeTimelineService.findLikeTimelineById(likeTimelineId);
      res.status(200).json({
        data: findOneLikeTimelineData,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public getLikeTimelineByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);

    try {
      const findLikeTimelineData: User_Timeline[] = await this.likeTimelineService.findLikeTimelineByUserId(userId);
      res.status(200).json({
        data: findLikeTimelineData,
        message: 'find',
      });
    } catch (error) {
      next(error);
    }
  };

  public getLikeTimelineByTimelineId = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findLikeTimelineData: User_Timeline[] = await this.likeTimelineService.findLikeTimelineByTimelineId(timelineId);
      res.status(200).json({
        data: findLikeTimelineData,
        message: 'find',
      });
    } catch (error) {
      next(error);
    }
  };

  public createLikeTimeline = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;

    try {
      if (isEmpty(req.body.id_timeline)) {
        res.status(400).json({
          message: 'id_timeline is missing',
        });
      }
      // Check if user did not already liked
      const likeTimeline: User_Timeline = await this.likeTimelineService.findLikeTimelineByTimelineIdAndUserId(
        Number(req.body.id_timeline),
        userData.id,
      );

      const likeTimelineData = {
        id_timeline: req.body.id_timeline,
        id_user: userData.id,
      };
      if (likeTimeline == null) {
        const createLikeTimelineData: User_Timeline = await this.likeTimelineService.createLikeTimeline(likeTimelineData);
        res.status(201).json({
          data: createLikeTimelineData,
          message: 'created',
        });
      } else {
        res.status(409).json({
          message: 'You already liked this timeline',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteLikeTimeline = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const timelineId = BigInt(req.params.id);
    const userData: User = req.user;

    try {
      // Check if likeTimeline exist
      const toDelete: User_Timeline = await this.likeTimelineService.findLikeTimelineByTimelineIdAndUserId(Number(timelineId), userData.id);
      if (toDelete) {
        res.status(409).json({
          message: `You didn't like timeline with is ${timelineId}`,
        });
      } else {
        // Delete it
        const deleteLikeTimelineData: User_Timeline = await this.likeTimelineService.deleteLikeTimeline(toDelete.id);
        res.status(200).json({
          data: deleteLikeTimelineData,
          message: 'deleted',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default LikeTimelineController;
