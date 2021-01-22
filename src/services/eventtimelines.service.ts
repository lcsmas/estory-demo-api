import { CreateEventTimelineDto } from '../dtos/eventtimelines.dto';
import HttpException from '../exceptions/HttpException';
import { Event_Timeline } from '../interfaces/models/Event_Timeline.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class EventTimelineService {
  public eventTimeline = DB.EventTimeline;

  public async findAllEventTimeline(): Promise<Event_Timeline[]> {
    const allEventTimeline: Event_Timeline[] = await this.eventTimeline.findAll();
    return allEventTimeline;
  }

  public async findEventTimelineById(eventTimelineId: number): Promise<Event_Timeline> {
    if (isEmpty(eventTimelineId)) throw new HttpException(400, 'No eventTimeline Id');

    const findEventTimeline: Event_Timeline = await this.eventTimeline.findByPk(eventTimelineId);
    if (!findEventTimeline) throw new HttpException(409, `No eventTimeline with id ${eventTimelineId}`);

    return findEventTimeline;
  }

  public async findEventTimelineByEventId(eventId: number): Promise<Event_Timeline> {
    if (isEmpty(eventId)) throw new HttpException(400, 'No event Id');

    const findEventTimeline: Event_Timeline = await this.eventTimeline.findOne({
      where: {
        id_event: eventId,
      },
    });
    if (!findEventTimeline) throw new HttpException(409, `No eventTimeline with idEvent ${eventId}`);

    return findEventTimeline;
  }

  public async findEventTimelineByTimelineId(timelineId: number): Promise<Event_Timeline[]> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No timeline Id');

    const findEventTimeline: Event_Timeline[] = await this.eventTimeline.findAll({
      where: {
        id_timeline: timelineId,
      },
    });
    if (isEmpty(findEventTimeline)) return [];

    return findEventTimeline;
  }

  public async createEventTimeline(eventTimelineData: CreateEventTimelineDto): Promise<Event_Timeline> {
    if (isEmpty(eventTimelineData)) throw new HttpException(400, 'No Event_Timeline Data');

    const createTimelineData: Event_Timeline = await this.eventTimeline.create({ ...eventTimelineData });

    return createTimelineData;
  }

  public async deleteEventTimeline(eventTimelineId: number): Promise<Event_Timeline> {
    if (isEmpty(eventTimelineId)) throw new HttpException(400, 'No eventTimeline Id passed');

    const findEventTimeline: Event_Timeline = await this.eventTimeline.findByPk(eventTimelineId);
    if (!findEventTimeline) throw new HttpException(409, `No eventTimeline with id ${eventTimelineId}`);

    await this.eventTimeline.destroy({
      where: {
        id: eventTimelineId,
      },
    });

    return findEventTimeline;
  }

  public async deleteEventTimelines(eventTimelineIds: number[]): Promise<Event_Timeline[]> {
    if (isEmpty(eventTimelineIds)) return [];

    const findEventTimelines: Event_Timeline[] = await this.eventTimeline.findAll({
      where: {
        id: eventTimelineIds,
      },
    });
    if (isEmpty(findEventTimelines)) throw new HttpException(409, `No eventTimelines with id ${findEventTimelines}`);

    await this.eventTimeline.destroy({
      where: {
        id: eventTimelineIds,
      },
    });

    return findEventTimelines;
  }
}

export default EventTimelineService;
