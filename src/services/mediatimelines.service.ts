import { isEmpty } from 'class-validator';
import DB from '../database';
import { createMediaTimelineDto } from '../dtos/mediatimelines.dto';
import HttpException from '../exceptions/HttpException';
import { Media_Timeline } from '../interfaces/models/Media_Timeline.interface';

class MediaTimelineService {
  public mediaTimeline = DB.MediaTimeline;

  public async findAllMediaTimeline(): Promise<Media_Timeline[]> {
    const allMediaTimeline: Media_Timeline[] = await this.mediaTimeline.findAll();
    return allMediaTimeline;
  }

  public async findMediaTimelineById(mediaTimelineId: number): Promise<Media_Timeline> {
    if (isEmpty(mediaTimelineId)) throw new HttpException(400, 'No mediaTimeline Id');

    const findMediaTimeline: Media_Timeline = await this.mediaTimeline.findByPk(mediaTimelineId);
    if (!findMediaTimeline) throw new HttpException(409, `No mediaTimeline with id ${mediaTimelineId}`);

    return findMediaTimeline;
  }

  public async findMediaTimelineByTimelineId(timelineId: number): Promise<Media_Timeline[]> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No timeline Id');

    const findMediaTimeline: Media_Timeline[] = await this.mediaTimeline.findAll({
      where: {
        id_timeline: timelineId,
      },
    });
    if (isEmpty(findMediaTimeline)) throw new HttpException(409, `No mediaTimeline linked with timeline id ${timelineId}`);

    return findMediaTimeline;
  }

  public async findMediaTimelineByMediaId(mediaId: number): Promise<Media_Timeline> {
    if (isEmpty(mediaId)) throw new HttpException(400, 'No media Id');

    const findMediaTimeline: Media_Timeline = await this.mediaTimeline.findOne({
      where: {
        id_media: mediaId,
      },
    });
    if (isEmpty(findMediaTimeline)) throw new HttpException(409, `No mediaTimeline linked with media id ${mediaId}`);

    return findMediaTimeline;
  }

  public async createMediaTimeline(mediaTimelineData: createMediaTimelineDto): Promise<Media_Timeline> {
    if (isEmpty(mediaTimelineData)) throw new HttpException(400, 'No Media_Timeline Data');

    const createMediaItemData: Media_Timeline = await this.mediaTimeline.create({ ...mediaTimelineData });

    return createMediaItemData;
  }

  public async updateMediaTimeline(mediaTimelineId: number, mediaTimelineData: Media_Timeline): Promise<Media_Timeline> {
    if (isEmpty(mediaTimelineData)) throw new HttpException(400, "You're not mediaTimelineData");

    const findMediaTimeline: Media_Timeline = await this.mediaTimeline.findByPk(mediaTimelineId);
    if (!findMediaTimeline) throw new HttpException(409, `No mediaTimeline with id ${mediaTimelineId}`);

    await this.mediaTimeline.update({ ...mediaTimelineData }, { where: { id: mediaTimelineId } });

    const updateMediaItem: Media_Timeline = await this.mediaTimeline.findByPk(mediaTimelineId);
    return updateMediaItem;
  }

  public async deleteMediaItem(mediaTimelineId: number): Promise<Media_Timeline> {
    if (isEmpty(mediaTimelineId)) throw new HttpException(400, 'No userId passed');

    const findMediaTimeline: Media_Timeline = await this.mediaTimeline.findByPk(mediaTimelineId);
    if (!findMediaTimeline) throw new HttpException(409, `No mediaTimeline with id ${mediaTimelineId}`);

    await this.mediaTimeline.destroy({ where: { id: mediaTimelineId } });

    return findMediaTimeline;
  }

  public async deleteMediaTimelines(mediaTimelineIds: number[]): Promise<Media_Timeline[]> {
    if (isEmpty(mediaTimelineIds)) return [];

    const findMediaTimelines: Media_Timeline[] = await this.mediaTimeline.findAll({
      where: {
        id: mediaTimelineIds,
      },
    });
    if (isEmpty(findMediaTimelines)) throw new HttpException(409, `No eventTimelines with id ${findMediaTimelines}`);

    await this.mediaTimeline.destroy({
      where: {
        id: mediaTimelineIds,
      },
    });

    return findMediaTimelines;
  }
}

export default MediaTimelineService;
