/*
|===============================================================================
| Model : Media_Timeline
| Sequelize Model for Media_Timeline Table in estory database
|===============================================================================
*/

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Media_Timeline } from '../interfaces/models/Media_Timeline.interface';

export type MediaTimelineCreationAttributes = Optional<Media_Timeline, 'id' | 'id_media' | 'id_timeline'>;

export class MediaTimelineModel extends Model<Media_Timeline, MediaTimelineCreationAttributes> implements Media_Timeline {
  public id: bigint;
  public id_timeline: bigint;
  public id_media: bigint;

  public readonly mediaTimelineCreatedAt!: Date;
  public readonly mediaTimelineUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof MediaTimelineModel {
  MediaTimelineModel.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_timeline: {
        type: DataTypes.BIGINT,
        references: {
          // This is a reference to another model
          model: 'Timeline',

          // This is the column name of the referenced model
          key: 'id',
        },
      },
      id_media: {
        type: DataTypes.BIGINT,
        references: {
          // This is a reference to another model
          model: 'MediaItem',

          // This is the column name of the referenced model
          key: 'id',
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'MediaTimelineModel', // We need to choose the model name
      tableName: 'Media_Timeline',
      updatedAt: 'mediaTimelineUpdatedAt',
      createdAt: 'mediaTimelineCreatedAt',
    },
  );

  return MediaTimelineModel;
}
