import { NextFunction, Request, Response } from 'express';
import { CreateTimelineDto } from '../dtos/timelines.dto';
import { CreateUserTimelineDto } from '../dtos/usertimelines.dto';
import { EventInterface } from '../interfaces/models/Event.interface';
import { Event_Timeline } from '../interfaces/models/Event_Timeline.interface';
import { Timeline } from '../interfaces/models/Timeline.interface';
import { User_Timeline } from '../interfaces/models/User_Timeline.interface';
import EventTimelineService from '../services/eventtimelines.service';
import timelineService from '../services/timelines.service';
import UserService from '../services/users.service';
import UserTimelineService from '../services/usertimelines.service';
import EventService from '../services/events.service';
import MediaTimelineService from '../services/mediatimelines.service';
import MediaItemService from '../services/mediaitems.service';
import { Media_Timeline } from '../interfaces/models/Media_Timeline.interface';
import { User } from '../interfaces/models/User.interface';
import { RequestWithUser } from '../interfaces/auth.interface';

class TimelineController {
  public timelineService = new timelineService();
  public userService = new UserService();
  public userTimelineService = new UserTimelineService();
  public eventTimelineService = new EventTimelineService();
  public eventService = new EventService();
  public mediaTimelineService = new MediaTimelineService();
  public mediaItemService = new MediaItemService();

  public getTimelines = async (req: Request, res: Response, next: NextFunction) => {
    const index = req.query.index ? Number(req.query.index) : 0;
    const num = req.query.number ? Number(req.query.number) : 10;

    try {
      const findAllTimelinesData: Timeline[] = await this.timelineService.findTimelines(index, num);
      res.status(200).json({
        data: findAllTimelinesData,
        message: 'findAll',
        lenght: findAllTimelinesData.length,
      });
    } catch (error) {
      next(error);
    }
  };

  public getMax = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findMaxData: number = await this.timelineService.findMax();
      res.status(200).json({
        data: findMaxData,
        message: 'maxTimeline',
      });
    } catch (error) {
      next(error);
    }
  };

  public getTimelineById = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findOneTimelineData: Timeline = await this.timelineService.findTimelineById(timelineId);
      res.status(200).json({
        data: findOneTimelineData,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public getTimelineAuthorById = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findOneUserTimelineData: User_Timeline = await this.userTimelineService.findUserTimelineByTimelineId(timelineId);
      const findOneUserData: User = await this.userService.findUserById(findOneUserTimelineData.id_user);
      res.status(200).json({
        data: `${findOneUserData.firstname} ${findOneUserData.lastname}`,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public getTimelinePeriod = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findAllEventTimeline: Event_Timeline[] = await this.eventTimelineService.findEventTimelineByTimelineId(timelineId);
      const eventIds: number[] = new Array<number>();
      findAllEventTimeline.forEach(eventTimeline => {
        eventIds.push(Number(eventTimeline.id_event));
      });
      const findEvents: EventInterface[] = await this.eventService.findEventByIds(eventIds);
      const min: EventInterface = findEvents.reduce(function (a, b): EventInterface {
        if (a.year == b.year) {
          if (a.month == b.month) {
            a.day <= b.day ? a : b;
          }
          a.month <= b.month ? a : b;
        }
        return a.year <= b.year ? a : b;
      });

      const max: EventInterface = findEvents.reduce(function (a, b): EventInterface {
        if (a.year == b.year) {
          if (a.month == b.month) {
            a.day >= b.day ? a : b;
          }
          a.month >= b.month ? a : b;
        }
        return a.year >= b.year ? a : b;
      });

      res.status(200).json({
        data: `${min.year} - ${max.year}`,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public createTimeline = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const timelineData: CreateTimelineDto = req.body;
    const userData: User = req.user;

    try {
      // Create Timeline
      const createTimelineData: Timeline = await this.timelineService.createTimeline(timelineData);

      // Create Join between User and Timeline
      const userTimelineData: CreateUserTimelineDto = {
        id_timeline: createTimelineData.id,
        id_user: userData.id,
      };

      const createUserTimelineData: User_Timeline = await this.userTimelineService.createUserTimeline(userTimelineData);
      res.status(201).json({
        data: [createTimelineData, createUserTimelineData],
        message: 'created',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateTimeline = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);
    const timelineData: Timeline = req.body;
    const userData: User = req.user;

    try {
      const userOwn: User_Timeline = await this.userTimelineService.findUserTimelineByTimelineId(timelineId);
      if (userOwn.id_user != userData.id) {
        res.status(403).json({
          message: 'This is not your timeline',
        });
      } else {
        const updateTimelineData: Timeline = await this.timelineService.updateTimeline(timelineId, timelineData);
        res.status(200).json({
          data: updateTimelineData,
          message: 'updated',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteTimeline = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);
    const userData: User = req.user;

    try {
      const userOwn: User_Timeline = await this.userTimelineService.findUserTimelineByTimelineId(timelineId);
      if (userOwn.id_user != userData.id) {
        res.status(403).json({
          message: 'This is not your timeline',
        });
      } else {
        // Delete Join between Events and Timelines
        const toDeleteEvents: Event_Timeline[] = await this.eventTimelineService.findEventTimelineByTimelineId(timelineId);
        const toDeleteEventTimelines = [];
        toDeleteEvents.forEach(eventTimelines => {
          toDeleteEventTimelines.push(eventTimelines.id);
        });
        const deleteEventTimenline: Event_Timeline[] = await this.eventTimelineService.deleteEventTimelines(toDeleteEventTimelines);

        // Delete Events
        const eventIds = [];
        toDeleteEvents.forEach(event => {
          eventIds.push(event.id_event);
        });
        const deleteEvents: EventInterface[] = await this.eventService.deleteEvents(eventIds);

        // Delete Join between Media and Timeline
        const toDeleteMediaTimelines: Media_Timeline[] = await this.mediaTimelineService.findMediaTimelineByTimelineId(timelineId);
        const toDeleteMediaTimelineIds: number[] = [];
        toDeleteMediaTimelines.forEach(eventT => {
          toDeleteMediaTimelineIds.push(Number(eventT.id));
        });
        const deleteMediaTimelines = await this.mediaTimelineService.deleteMediaTimelines(toDeleteMediaTimelineIds);

        // Delete Medias
        const toDeleteMediaIds: number[] = [];
        toDeleteMediaTimelines.forEach(eventT => {
          toDeleteMediaIds.push(Number(eventT.id_media));
        });
        const deleteMedias = await this.mediaItemService.deleteMediaItems(toDeleteMediaIds);

        // Delete Join between User and timeline
        const userTimeline: CreateUserTimelineDto = {
          id_timeline: BigInt(timelineId),
          id_user: userData.id,
        };
        const userTimelineData: User_Timeline = await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimeline);
        let deleteuserTimelineData: User_Timeline = null;
        deleteuserTimelineData = await this.userTimelineService.deleteUserTimeline(userTimelineData.id);

        // Delete Timeline
        const deleteTimelineData: Timeline = await this.timelineService.deleteTimelineData(timelineId);

        // Status 200
        res.status(200).json({
          data: [deleteTimelineData, deleteEvents, deleteEventTimenline, deleteuserTimelineData, deleteMediaTimelines, deleteMedias],
          message: 'deleted',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default TimelineController;
