/*
|===============================================================================
| Model : Event
| Sequelize Model for Event Table in estory database
|===============================================================================
*/
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { EventInterface } from '../interfaces/models/Event.interface';

// TODO : add min/max

export type EventCreationAttributes = Optional<EventInterface, 'id' | 'title' | 'description' | 'day' | 'month' | 'year' | 'img' | 'img_offset'>;

export class EventModel extends Model<EventInterface, EventCreationAttributes> implements EventInterface {
  public id: bigint;
  public title: string;
  public description: string;
  public day: number;
  public month: number;
  public year: bigint;
  public img: string;
  public img_offset: string;

  public readonly eventCreatedAt!: Date;
  public readonly eventUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof EventModel {
  EventModel.init(
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
      description: {
        type: DataTypes.STRING(5000),
        allowNull: true,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      img_offset: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'EventModel', // We need to choose the model name
      tableName: 'Event',
      updatedAt: 'eventUpdatedAt',
      createdAt: 'eventCreatedAt',
    },
  );

  return EventModel;
}
