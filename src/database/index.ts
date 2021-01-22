import Sequelize from 'sequelize';
import config from '../config';
import { logger } from '../utils/logger';
import UserModel from '../models/User.model';
import TimelineModel from '../models/Timeline.model';
import MediaItemModel from '../models/MediaItem.model';
import EventModel from '../models/Event.model';
import User_TimelineModel from '../models/User_Timeline.model';
import Like_TimelineModel from '../models/Like_Timeline.model';
import Media_TimelineModel from '../models/Media_Timeline.model';
import Event_TimelineModel from '../models/Event_Timeline.model';

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize.Sequelize(config[env].database, config[env].username, config[env].password == '' ? null : config[env].password, {
  host: config[env].host,
  dialect: config[env].dialect,
  timezone: '+01:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: config[env].pool,
  logQueryParameters: env === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query + '\n');
  },
  benchmark: true,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('🟢 The database is connected.');
  })
  .catch((error: Error) => {
    logger.error(`🔴 Unable to connect to the database: ${error}.`);
  });

const DB = {
  User: UserModel(sequelize),
  Timeline: TimelineModel(sequelize),
  UserTimeline: User_TimelineModel(sequelize),
  LikeTimeline: Like_TimelineModel(sequelize),
  MediaItem: MediaItemModel(sequelize),
  MediaTimeline: Media_TimelineModel(sequelize),
  Event: EventModel(sequelize),
  EventTimeline: Event_TimelineModel(sequelize),

  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
