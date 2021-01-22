import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/models/User.interface';
import userService from '../services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;
    try {
      if (userData.id != Number(process.env.ADMIN_ID)) {
        res.status(403).json({
          message: 'You are not Admin',
        });
      } else {
        const findAllUsersData: User[] = await this.userService.findAllUser();
        res.status(200).json({
          data: findAllUsersData,
          message: 'findAll',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const userData: User = req.user;

    try {
      if (userData.id != Number(process.env.ADMIN_ID) && userData.id != userId) {
        res.status(403).json({
          message: `You can't access data from user with id ${userId}`,
        });
      } else {
        const findOneUserData: User = await this.userService.findUserById(userId);
        res.status(200).json({
          data: findOneUserData,
          message: 'findOne',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201).json({
        data: createUserData,
        message: 'created',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const userData: User = req.user;
    const newUserData: User = req.body;
    newUserData.old_user = false;

    try {
      if (userData.id != userId) {
        res.status(403).json({
          message: `You are not logged with id ${userId}`,
        });
      } else {
        const updateUserData: User = await this.userService.updateUser(userId, newUserData);
        res.status(200).json({
          data: updateUserData,
          message: 'updated',
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id);
    const userData: User = req.user;

    try {
      if (userData.id != userId) {
        res.status(403).json({
          message: `You are not logged with id ${userId}`,
        });
      } else {
        const deleteUserData: User = await this.userService.deleteUserData(userId);
        res.status(200).json({
          data: deleteUserData,
          message: 'deleted',
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
