import { CreateTimelineDto } from '../dtos/timelines.dto';
import HttpException from '../exceptions/HttpException';
import { Timeline } from '../interfaces/models/Timeline.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';
import { Op } from 'sequelize';

class TimelineService {
  public timeline = DB.Timeline;

  public async findAllTimeline(): Promise<Timeline[]> {
    const allTimeline: Timeline[] = await this.timeline.findAll();
    return allTimeline;
  }

  public async findTimelines(index: number, num: number): Promise<Timeline[]> {
    const allTimeline: Timeline[] = await this.timeline.findAll({
      offset: index,
      limit: num,
      where: {
        status: {
          [Op.or]: ['published', 'reviewed'],
        },
      },
    });
    // const allTimeline: Timeline[] = await DB.sequelize.query(
    //   `
    //     SELECT
    //       User_Timeline.id_user,
    //       User_Timeline.id_Timeline,
    //       title,
    //       category,
    //       img_background,
    //       step,
    //       status,
    //       lastname,
    //       firstname,
    //       picture,
    //       COUNT(Like_Timeline.id_timeline) as nbLike
    //     FROM Like_Timeline
    //     INNER JOIN Timeline
    //     ON Timeline.id = Like_Timeline.id_timeline
    //     INNER JOIN User_Timeline
    //     ON Timeline.id = User_Timeline.id_timeline
    //     INNER JOIN User
    //     ON User.id = User_Timeline.id_user
    //     GROUP BY Like_Timeline.id_timeline
    //     LIMIT ${index}, ${num};
    //   `,
    //   { type: QueryTypes.SELECT },
    // );
    return allTimeline;
  }

  public async findMax(): Promise<number> {
    const maxTimeline: number = await this.timeline.count({
      where: {
        status: {
          [Op.or]: ['published', 'reviewed'],
        },
      },
    });
    return maxTimeline;
  }

  public async findTimelineById(timelineId: number): Promise<Timeline> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No timeline Id');

    const findTimeline: Timeline = await this.timeline.findByPk(timelineId);
    if (!findTimeline) throw new HttpException(409, `No timeline with id ${timelineId}`);

    return findTimeline;
  }

  public async createTimeline(timelineData: CreateTimelineDto): Promise<Timeline> {
    if (isEmpty(timelineData)) throw new HttpException(400, 'No Timeline Data');

    const createTimelineData: Timeline = await this.timeline.create({ ...timelineData });

    return createTimelineData;
  }

  public async updateTimeline(timelineId: number, timelineData: Timeline): Promise<Timeline> {
    if (isEmpty(timelineData)) throw new HttpException(400, "You're not timelineData");

    const findTimeline: Timeline = await this.timeline.findByPk(timelineId);
    if (!findTimeline) throw new HttpException(409, `No timeline with id ${timelineId}`);

    await this.timeline.update({ ...timelineData }, { where: { id: timelineId } });

    const updateTimeline: Timeline = await this.timeline.findByPk(timelineId);
    return updateTimeline;
  }

  public async deleteTimelineData(timelineId: number): Promise<Timeline> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No userId passed');

    const findTimeline: Timeline = await this.timeline.findByPk(timelineId);
    if (!findTimeline) throw new HttpException(409, `No timeline with id ${timelineId}`);

    await this.timeline.destroy({
      where: {
        id: timelineId,
      },
    });

    return findTimeline;
  }
}

export default TimelineService;
