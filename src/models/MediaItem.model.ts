/*
|===============================================================================
| Model : MediaItem
| Sequelize Model for MediaItem Table in estory database
|===============================================================================
*/

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { MediaItem } from '../interfaces/models/MediaItem.interface';

export type MediaItemCreationAttributes = Optional<MediaItem, 'id' | 'title' | 'link' | 'img' | 'type' | 'service'>;

export class MediaItemModel extends Model<MediaItem, MediaItemCreationAttributes> implements MediaItem {
  public id: bigint;
  public title: string;
  public link: string;
  public img: string;
  public type: string;
  public service: string;

  public readonly mediaCreatedAt!: Date;
  public readonly mediaUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof MediaItemModel {
  MediaItemModel.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING(8192),
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'MediaItemModel', // We need to choose the model name
      tableName: 'MediaItem',
      updatedAt: 'mediaUpdatedAt',
      createdAt: 'mediaCreatedAt',
    },
  );

  return MediaItemModel;
}
