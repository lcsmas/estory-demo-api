import { CreateUserTimelineDto } from '../dtos/usertimelines.dto';
import HttpException from '../exceptions/HttpException';
import { User_Timeline } from '../interfaces/models/User_Timeline.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class UserTimelineService {
  public userTimeline = DB.UserTimeline;

  public async findAllUserTimeline(): Promise<User_Timeline[]> {
    const allUserTimeline: User_Timeline[] = await this.userTimeline.findAll();
    return allUserTimeline;
  }

  public async findUserTimelineById(userTimelineId: number): Promise<User_Timeline> {
    if (isEmpty(userTimelineId)) throw new HttpException(400, 'No userTimeline Id');

    const findUserTimeline: User_Timeline = await this.userTimeline.findByPk(userTimelineId);
    if (!findUserTimeline) throw new HttpException(409, `No userTimeline with id ${userTimelineId}`);

    return findUserTimeline;
  }

  public async findUserTimelineByUserId(userId: number): Promise<User_Timeline[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'No user Id');

    const findUserTimeline: User_Timeline[] = await this.userTimeline.findAll({
      where: {
        id_user: userId,
      },
    });
    if (isEmpty(findUserTimeline)) throw new HttpException(409, `No userTimeline fou user with id ${userId}`);

    return findUserTimeline;
  }

  public async findUserTimelineByTimelineId(timelineId: number): Promise<User_Timeline> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No userTimeline Id');

    const findUserTimeline: User_Timeline = await this.userTimeline.findOne({
      where: {
        id_timeline: timelineId,
      },
    });
    if (isEmpty(findUserTimeline)) throw new HttpException(409, `No userTimeline for timeline with id ${timelineId}`);

    return findUserTimeline;
  }

  public async findUserTimelineByTimelineIdAndUserId(userTimelineData: CreateUserTimelineDto): Promise<User_Timeline> {
    if (isEmpty(userTimelineData)) throw new HttpException(400, 'No userTimeline Data');

    const findUserTimeline: User_Timeline = await this.userTimeline.findOne({
      where: {
        id_timeline: Number(userTimelineData.id_timeline),
        id_user: userTimelineData.id_user,
      },
    });
    if (!findUserTimeline)
      throw new HttpException(409, `No userTimeline for timeline with id ${userTimelineData.id_timeline} and user ${userTimelineData.id_user}`);

    return findUserTimeline;
  }

  public async createUserTimeline(userTimelineData: CreateUserTimelineDto): Promise<User_Timeline> {
    if (isEmpty(userTimelineData)) throw new HttpException(400, 'No User_Timeline Data');
    const findUserTimeline: User_Timeline = await this.userTimeline.findOne({
      where: {
        id_user: userTimelineData.id_user,
        id_timeline: Number(userTimelineData.id_timeline),
      },
    });
    if (findUserTimeline)
      throw new HttpException(409, `User with id ${userTimelineData.id_user} already own timeline with id ${userTimelineData.id_timeline}`);
    const createTimelineData: User_Timeline = await this.userTimeline.create({ ...userTimelineData });

    return createTimelineData;
  }

  public async deleteUserTimeline(userTimelineId: number): Promise<User_Timeline> {
    if (isEmpty(userTimelineId)) throw new HttpException(400, 'No userTimelineId passed');

    const findUserTimeline: User_Timeline = await this.userTimeline.findByPk(userTimelineId);
    if (!findUserTimeline) throw new HttpException(409, `No userTimeline with id ${userTimelineId}`);

    await this.userTimeline.destroy({
      where: {
        id: userTimelineId,
      },
    });

    return findUserTimeline;
  }
}

export default UserTimelineService;
