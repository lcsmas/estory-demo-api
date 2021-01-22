import { CreateUserTimelineDto } from '../dtos/usertimelines.dto';
import HttpException from '../exceptions/HttpException';
import { User_Timeline } from '../interfaces/models/User_Timeline.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class LikeTimelineService {
  public likeTimeline = DB.LikeTimeline;

  public async findAllLikeTimeline(): Promise<User_Timeline[]> {
    const allLikeTimeline: User_Timeline[] = await this.likeTimeline.findAll();
    return allLikeTimeline;
  }

  public async findLikeTimelineById(likeTimelineId: number): Promise<User_Timeline> {
    if (isEmpty(likeTimelineId)) throw new HttpException(400, 'No likeTimeline Id');

    const findLikeTimeline: User_Timeline = await this.likeTimeline.findByPk(likeTimelineId);
    if (!findLikeTimeline) throw new HttpException(409, `No likeTimeline with id ${likeTimelineId}`);

    return findLikeTimeline;
  }

  public async findLikeTimelineByUserId(userId: number): Promise<User_Timeline[]> {
    if (isEmpty(userId)) throw new HttpException(400, 'No user Id');

    const findLikeTimeline: User_Timeline[] = await this.likeTimeline.findAll({
      where: {
        id_user: userId,
      },
    });
    if (isEmpty(findLikeTimeline)) throw new HttpException(409, `No likeTimeline found user with id ${userId}`);

    return findLikeTimeline;
  }

  public async findLikeTimelineByTimelineId(timelineId: number): Promise<User_Timeline[]> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No likeTimeline Id');

    const findLikeTimeline: User_Timeline[] = await this.likeTimeline.findAll({
      where: {
        id_timeline: timelineId,
      },
    });
    if (isEmpty(findLikeTimeline)) return [];

    return findLikeTimeline;
  }

  public async findLikeTimelineByTimelineIdAndUserId(id_timeline: number, id_user: number): Promise<User_Timeline> {
    if (isEmpty(id_timeline) || isEmpty(id_user)) throw new HttpException(400, 'No likeTimeline Data');

    const findLikeTimeline: User_Timeline = await this.likeTimeline.findOne({
      where: {
        id_timeline: id_timeline,
        id_user: id_user,
      },
    });
    if (!findLikeTimeline) return null;

    return findLikeTimeline;
  }

  public async createLikeTimeline(likeTimelineData: CreateUserTimelineDto): Promise<User_Timeline> {
    if (isEmpty(likeTimelineData)) throw new HttpException(400, 'No Like_Timeline Data');
    const findLikeTimeline: User_Timeline = await this.likeTimeline.findOne({
      where: {
        id_user: likeTimelineData.id_user,
        id_timeline: Number(likeTimelineData.id_timeline),
      },
    });
    if (findLikeTimeline)
      throw new HttpException(409, `User with id ${likeTimelineData.id_user} already liked timeline with id ${likeTimelineData.id_timeline}`);
    const createTimelineData: User_Timeline = await this.likeTimeline.create({ ...likeTimelineData });

    return createTimelineData;
  }

  public async deleteLikeTimeline(likeTimelineId: number): Promise<User_Timeline> {
    if (isEmpty(likeTimelineId)) throw new HttpException(400, 'No likeTimelineId passed');

    const findLikeTimeline: User_Timeline = await this.likeTimeline.findByPk(likeTimelineId);
    if (!findLikeTimeline) throw new HttpException(409, `No likeTimeline with id ${likeTimelineId}`);

    await this.likeTimeline.destroy({
      where: {
        id: likeTimelineId,
      },
    });

    return findLikeTimeline;
  }
}

export default LikeTimelineService;
