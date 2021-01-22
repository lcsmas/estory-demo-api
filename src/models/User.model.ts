/*
|===============================================================================
| Model : User
| Sequelize Model for User Table in estory database
|===============================================================================
*/

import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '../interfaces/models/User.interface';

export type UserCreationAttributes = Optional<
  User,
  | 'id'
  | 'lastname'
  | 'firstname'
  | 'email'
  | 'password'
  | 'ch_rand'
  | 'validated'
  | 'oauth_provider'
  | 'oauth_uid'
  | 'gender'
  | 'picture'
  | 'description'
  | 'old_user'
  | 'validation_date'
  | 'last_logged_date'
>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id: number;
  public lastname: string;
  public firstname: string;
  public email: string;
  public password: string;
  public ch_rand: string;
  public validated: boolean;
  public oauth_provider: string;
  public oauth_uid: string;
  public gender: string;
  public picture: string;
  public description: string;
  public old_user: boolean;
  public validation_date: string;
  public last_logged_date: string;

  public readonly userCreatedAt!: Date;
  public readonly userUpdatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      lastname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ch_rand: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      oauth_provider: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      oauth_uid: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      old_user: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      validation_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_logged_date: {
        type: DataTypes.STRING,
        //defaultValue: Sequelize.fn('now'),
        allowNull: true,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'UserModel', // We need to choose the model name
      tableName: 'User',
      updatedAt: 'userUpdatedAt',
      createdAt: 'userCreatedAt',
    },
  );

  return UserModel;
}
