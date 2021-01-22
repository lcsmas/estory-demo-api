import 'dotenv/config';
import App from './app';
import AuthRoute from './routes/auth.route';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';
import TimelineRoute from './routes/timelines.route';
import MediaItemRoute from './routes/mediaitems.route';
import validateEnv from './utils/validateEnv';
import EventRoute from './routes/events.route';
import LikeTimelineRoute from './routes/liketimeline.route';
import AmazonScrapRoute from './routes/amazonscrap.route';

validateEnv();

const app = new App([
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new TimelineRoute(),
  new MediaItemRoute(),
  new EventRoute(),
  new LikeTimelineRoute(),
  new AmazonScrapRoute(),
]);

app.listen();
