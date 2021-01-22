import { NextFunction, Request, Response } from 'express';
import { CreateEventDto } from '../dtos/events.dto';
import { CreateEventTimelineDto } from '../dtos/eventtimelines.dto';
import { EventInterface } from '../interfaces/models/Event.interface';
import { Event_Timeline } from '../interfaces/models/Event_Timeline.interface';
import eventsService from '../services/events.service';
import eventsTimelineService from '../services/eventtimelines.service';
import timelineService from '../services/timelines.service';
import userTimelineService from '../services/usertimelines.service';
import { User } from '../interfaces/models/User.interface';
import { CreateUserTimelineDto } from '../dtos/usertimelines.dto';
import { RequestWithUser } from '../interfaces/auth.interface';

class EventController {
  public eventService = new eventsService();
  public eventTimelineService = new eventsTimelineService();
  public timelineService = new timelineService();
  public userTimelineService = new userTimelineService();

  public getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllEventsData: EventInterface[] = await this.eventService.findAllEvent();
      res.status(200).json({
        data: findAllEventsData,
        message: 'findAll',
      });
    } catch (error) {
      next(error);
    }
  };

  public getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = Number(req.params.id);

    try {
      const findOneEventData: EventInterface = await this.eventService.findEventById(eventId);
      res.status(200).json({
        data: findOneEventData,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public getEventByTimelineId = async (req: Request, res: Response, next: NextFunction) => {
    const timelineId = Number(req.params.id);

    try {
      const findEventTimelineData: Event_Timeline[] = await this.eventTimelineService.findEventTimelineByTimelineId(timelineId);
      const timelineIds = [];
      findEventTimelineData.forEach(item => {
        timelineIds.push(item.id_event);
      });

      const findEvents: EventInterface[] = await this.eventService.findEventByIds(timelineIds);
      res.status(200).json({
        data: findEvents,
        message: 'findOne',
      });
    } catch (error) {
      next(error);
    }
  };

  public createEvent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventData: CreateEventDto = req.body;
    const userData: User = req.user;

    try {
      // Check if provided timeline id is valid
      await this.timelineService.findTimelineById(req.body.id_timeline);

      // Check if provided timeline is owned by user
      const userTimelineData: CreateUserTimelineDto = {
        id_timeline: req.body.id_timeline,
        id_user: userData.id,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);

      // Create Event
      const createEventData: EventInterface = await this.eventService.createEvent(eventData);

      // Create Join between Timeline and created event
      const eventTimelineData: CreateEventTimelineDto = {
        id_timeline: req.body.id_timeline,
        id_event: createEventData.id,
      };

      const createEventTimelineData: Event_Timeline = await this.eventTimelineService.createEventTimeline(eventTimelineData);

      res.status(201).json({
        data: [createEventData, createEventTimelineData],
        message: 'created',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateEvent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventId = Number(req.params.id);
    const eventData: EventInterface = req.body;
    const userData: User = req.user;

    try {
      // Check that Event is owned by user
      const eventTimelineData: Event_Timeline = await this.eventTimelineService.findEventTimelineByEventId(eventId);
      const userTimelineData: CreateUserTimelineDto = {
        id_timeline: eventTimelineData.id_timeline,
        id_user: userData.id,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);

      // Update Event
      const updateEventData: EventInterface = await this.eventService.updateEvent(eventId, eventData);
      res.status(200).json({
        data: updateEventData,
        message: 'updated',
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteEvent = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eventId = Number(req.params.id);
    const userData: User = req.user;

    try {
      // Check that Event is owned by user
      const eventTimelineData: Event_Timeline = await this.eventTimelineService.findEventTimelineByEventId(eventId);
      const userTimelineData: CreateUserTimelineDto = {
        id_timeline: eventTimelineData.id_timeline,
        id_user: userData.id,
      };
      await this.userTimelineService.findUserTimelineByTimelineIdAndUserId(userTimelineData);

      // Delete Event
      const deleteEventTimelineData: Event_Timeline = await this.eventTimelineService.deleteEventTimeline(Number(eventTimelineData.id));
      const deleteEventData: EventInterface = await this.eventService.deleteEvent(eventId);
      res.status(200).json({
        data: [deleteEventData, deleteEventTimelineData],
        message: 'deleted',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default EventController;
