import request from 'supertest';
import App from '../app';
import { User } from '../interfaces/models/User.interface';
import DB from '../database';
import UserRoute from '../routes/users.route';
import { CreateUserDto } from '../dtos/users.dto';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const allUser: User[] = await DB.User.findAll();

      return request(app.getServer()).get(`${usersRoute.path}`).expect(200, { data: allUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);
      const userId = 30;
      const findUser: User = await DB.User.findByPk(userId);

      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
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
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const userId = 1;
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
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', async () => {
      const userId = 1;
      const deleteUser = await DB.User.destroy({ where: { id: userId } });
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200, { data: deleteUser, message: 'deleted' });
    });
  });
});
