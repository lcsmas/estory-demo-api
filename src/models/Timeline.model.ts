/*
|===============================================================================
| Model : Timeline
| Sequelize Model for Timeline Table in estory database
|===============================================================================
*/
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Timeline } from '../interfaces/models/Timeline.interface';

export type TimelineCreationAttributes = Optional<Timeline, 'id' | 'title' | 'category' | 'img_background'>;

export class TimelineModel extends Model<Timeline, TimelineCreationAttributes> implements Timeline {
  public id: bigint;
  public title: string;
  public category: string;
  public img_background: string;
  public step: number;
  public status: string;

  public readonly timelineCreatedAt!: Date;
  public readonly timelineUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TimelineModel {
  TimelineModel.init(
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
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img_background: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      step: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'TimelineModel', // We need to choose the model name
      tableName: 'Timeline',
      updatedAt: 'timelineUpdatedAt',
      createdAt: 'timelineCreatedAt',
    },
  );

  return TimelineModel;
}
