import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import eventsController from '../controllers/events.controller';
import { CreateEventDto } from '../dtos/events.dto';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
class EventRoute implements Route {
  public path = '/events';
  public router = Router();
  public eventsController = new eventsController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.eventsController.getEvents);
    this.router.get(`${this.path}/:id(\\d+)`, this.eventsController.getEventById);
    this.router.get(`${this.path}/timeline/:id(\\d+)`, this.eventsController.getEventByTimelineId);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateEventDto, 'body'), this.eventsController.createEvent);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateEventDto, 'body', true), this.eventsController.updateEvent);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.eventsController.deleteEvent);
  }
}

export default EventRoute;
