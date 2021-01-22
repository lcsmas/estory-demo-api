/*
|===============================================================================
| Model : Event_Timeline
| Sequelize Model for Event_Timeline Table in estory database
|===============================================================================
*/

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Event_Timeline } from '../interfaces/models/Event_Timeline.interface';

export type EventCreationAttributes = Optional<Event_Timeline, 'id' | 'id_event' | 'id_timeline'>;

export class EventTimelineModel extends Model<Event_Timeline, EventCreationAttributes> implements Event_Timeline {
  public id: bigint;
  public id_event: bigint;
  public id_timeline: bigint;

  public readonly eventTimelineCreatedAt!: Date;
  public readonly eventTimelineUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof EventTimelineModel {
  EventTimelineModel.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_event: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          // This is a reference to another model
          model: 'Event',

          // This is the column name of the referenced model
          key: 'id',
        },
      },
      id_timeline: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
      modelName: 'EventTimelineModel', // We need to choose the model name
      tableName: 'Event_Timeline',
      updatedAt: 'eventTimelineUpdatedAt',
      createdAt: 'eventTimelineCreatedAt',
    },
  );

  return EventTimelineModel;
}
