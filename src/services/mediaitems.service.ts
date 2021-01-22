import { isEmpty } from 'class-validator';
import DB from '../database';
import { CreateMediaItemDto } from '../dtos/mediaitems.dto';
import HttpException from '../exceptions/HttpException';
import { MediaItem } from '../interfaces/models/MediaItem.interface';
import { Media_Timeline } from '../interfaces/models/Media_Timeline.interface';

class MediaItemService {
  public mediaItem = DB.MediaItem;
  public mediaTimeline = DB.MediaTimeline;

  public async findAllMediaItem(): Promise<MediaItem[]> {
    const allMediaItem: MediaItem[] = await this.mediaItem.findAll();
    return allMediaItem;
  }

  public async findMediaItemById(mediaItemId: number): Promise<MediaItem> {
    if (isEmpty(mediaItemId)) throw new HttpException(400, 'No mediaItem Id');

    const findMediaItem: MediaItem = await this.mediaItem.findByPk(mediaItemId);
    if (!findMediaItem) throw new HttpException(409, `No mediaItem with id ${mediaItemId}`);

    return findMediaItem;
  }

  public async findMediaItemByTimeline(timelineId: number): Promise<MediaItem[]> {
    if (isEmpty(timelineId)) throw new HttpException(400, 'No timeline Id');

    const findMediaTimeline: Media_Timeline[] = await this.mediaTimeline.findAll({
      where: {
        id_timeline: timelineId,
      },
    });
    if (isEmpty(findMediaTimeline)) throw new HttpException(409, `No mediaItem for timeline with id ${timelineId}`);
    const mediaIds = [];
    findMediaTimeline.forEach(mediaT => {
      mediaIds.push(mediaT.id_media);
    });
    const findMediaItem: MediaItem[] = await this.mediaItem.findAll({
      where: {
        id: mediaIds,
      },
    });
    if (isEmpty(findMediaItem)) throw new HttpException(409, `No mediaItem with id ${mediaIds}`);

    return findMediaItem;
  }

  public async createMediaItem(mediaItemData: CreateMediaItemDto): Promise<MediaItem> {
    if (isEmpty(mediaItemData)) throw new HttpException(400, 'No MediaItem Data');

    const createMediaItemData: MediaItem = await this.mediaItem.create({ ...mediaItemData });

    return createMediaItemData;
  }

  public async updateMediaItem(mediaItemId: number, mediaItemData: MediaItem): Promise<MediaItem> {
    if (isEmpty(mediaItemData)) throw new HttpException(400, "You're not mediaItemData");

    const findMediaItem: MediaItem = await this.mediaItem.findByPk(mediaItemId);
    if (!findMediaItem) throw new HttpException(409, `No mediaItem with id ${mediaItemId}`);

    await this.mediaItem.update({ ...mediaItemData }, { where: { id: mediaItemId } });

    const updateMediaItem: MediaItem = await this.mediaItem.findByPk(mediaItemId);
    return updateMediaItem;
  }

  public async deleteMediaItem(mediaItemId: number): Promise<MediaItem> {
    if (isEmpty(mediaItemId)) throw new HttpException(400, 'No userId passed');

    const findMediaItem: MediaItem = await this.mediaItem.findByPk(mediaItemId);
    if (!findMediaItem) throw new HttpException(409, `No mediaItem with id ${mediaItemId}`);

    await this.mediaItem.destroy({ where: { id: mediaItemId } });

    return findMediaItem;
  }

  public async deleteMediaItems(mediaItemIds: number[]): Promise<MediaItem[]> {
    if (isEmpty(mediaItemIds)) return [];

    const findMediaItems: MediaItem[] = await this.mediaItem.findAll({
      where: {
        id: mediaItemIds,
      },
    });
    if (isEmpty(findMediaItems)) throw new HttpException(409, `No media items with ids ${mediaItemIds}`);

    await this.mediaItem.destroy({
      where: {
        id: mediaItemIds,
      },
    });

    return findMediaItems;
  }
}

export default MediaItemService;
