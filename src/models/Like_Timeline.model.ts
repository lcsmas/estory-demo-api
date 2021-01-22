/*
|===============================================================================
| Model : Like_Timeline
| Sequelize Model for Like_Timeline Table in estory database
|===============================================================================
*/

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User_Timeline } from '../interfaces/models/User_Timeline.interface';

export type LikeTimelineCreationAttributes = Optional<User_Timeline, 'id' | 'id_user' | 'id_timeline'>;

export class LikeTimelineModel extends Model<User_Timeline, LikeTimelineCreationAttributes> implements User_Timeline {
  public id: number;
  public id_user: number;
  public id_timeline: bigint;

  public readonly likeTimelineCreatedAt!: Date;
  public readonly likeTimelineUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof LikeTimelineModel {
  LikeTimelineModel.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        references: {
          // This is a reference to another model
          model: 'User',

          // This is the column name of the referenced model
          key: 'id',
        },
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
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'LikeTimelineModel', // We need to choose the model name
      tableName: 'Like_Timeline',
      updatedAt: 'likeTimelineUpdatedAt',
      createdAt: 'likeTimelineCreatedAt',
    },
  );

  return LikeTimelineModel;
}
