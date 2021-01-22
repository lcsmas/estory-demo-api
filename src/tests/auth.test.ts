import request from 'supertest';
import App from '../app';
import AuthRoute from '../routes/auth.route';
import { CreateUserDto } from '../dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', () => {
      const userData: CreateUserDto = {
        lastname: 'pepito',
        firstname: 'pepito',
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        ch_rand: 'zeefzefrsfgrdsesfesfgfesefsesffesefsefs',
        validated: true,
        oauth_provider: 'google',
        oauth_uid: '635464385435454',
        gender: 'None',
        picture: 'http://www.picture.fr',
        description: 'My description',
        validation_date: '2020-07-05 11:11:11',
        last_logged_date: '2020-07-05 11:11:11',
      };
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return request(app.getServer()).post('/signup').send(userData);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        lastname: 'pepito',
        firstname: 'pepito',
        email: 'test@email.com',
        password: 'q1w2e3r4!',
        ch_rand: 'zeefzefrsfgrdsesfesfgfesefsesffesefsefs',
        validated: true,
        oauth_provider: 'google',
        oauth_uid: '635464385435454',
        gender: 'None',
        picture: 'http://www.picture.fr',
        description: 'My description',
        validation_date: '2020-07-05 11:11:11',
        last_logged_date: '2020-07-05 11:11:11',
      };
      process.env.JWT_SECRET = 'jwt_secret';
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', () => {
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return request(app.getServer())
        .post('/logout')
        .expect('Set-Cookie', /^Authorization=\;/);
    });
  });
});
