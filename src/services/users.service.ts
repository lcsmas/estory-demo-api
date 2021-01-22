import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/models/User.interface';
import DB from '../database';
import { isEmpty } from '../utils/util';

class UserService {
  public user = DB.User;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findAll();
    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.user.findByPk(userId);
    if (!findUser) throw new HttpException(409, `There is no user with id ${userId}`);
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.user.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.user.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.user.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await this.user.update(
      {
        ...userData,
        password: hashedPassword,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    const updateUser: User = await this.user.findByPk(userId);
    return updateUser;
  }

  public async deleteUserData(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.user.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.user.destroy({ where: { id: userId } });

    return findUser;
  }
}

export default UserService;
