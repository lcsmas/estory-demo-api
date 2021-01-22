import { CreateEventDto } from '../dtos/events.dto';
import HttpException from '../exceptions/HttpException';
import { EventInterface } from '../interfaces/models/Event.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class EventsService {
  public event = DB.Event;

  public async findAllEvent(): Promise<EventInterface[]> {
    const allEvent: EventInterface[] = await this.event.findAll();
    return allEvent;
  }

  public async findEventById(eventId: number): Promise<EventInterface> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No event Id');

    const findEvent: EventInterface = await this.event.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, `No event with id ${eventId}`);

    return findEvent;
  }

  public async findEventByIds(eventId: number[]): Promise<EventInterface[]> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No event Id');

    const findEvent: EventInterface[] = await this.event.findAll({
      where: {
        id: eventId,
      },
    });
    if (isEmpty(findEvent)) throw new HttpException(409, `No events with ids ${eventId}`);

    return findEvent;
  }

  public async createEvent(eventData: CreateEventDto): Promise<EventInterface> {
    if (isEmpty(eventData)) throw new HttpException(400, 'No Event Data');

    const createEventData: EventInterface = await this.event.create({ ...eventData });

    return createEventData;
  }

  public async updateEvent(eventId: number, eventData: EventInterface): Promise<EventInterface> {
    if (isEmpty(eventData)) throw new HttpException(400, "You're not eventData");

    const findEvent: EventInterface = await this.event.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, `No event with id ${eventId}`);

    await this.event.update({ ...eventData }, { where: { id: eventId } });

    const updateEvent: EventInterface = await this.event.findByPk(eventId);
    return updateEvent;
  }

  public async deleteEvent(eventId: number): Promise<EventInterface> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No eventId passed');

    const findEvent: EventInterface = await this.event.findByPk(eventId);
    if (!findEvent) throw new HttpException(409, `No event with id ${eventId}`);

    await this.event.destroy({ where: { id: eventId } });

    return findEvent;
  }

  public async deleteEvents(eventIds: number[]): Promise<EventInterface[]> {
    if (isEmpty(eventIds)) return [];

    const findEvent: EventInterface[] = await this.event.findAll({
      where: {
        id: eventIds,
      },
    });
    if (isEmpty(findEvent)) throw new HttpException(409, `No events with ids ${eventIds}`);

    await this.event.destroy({
      where: {
        id: eventIds,
      },
    });

    return findEvent;
  }
}

export default EventsService;
