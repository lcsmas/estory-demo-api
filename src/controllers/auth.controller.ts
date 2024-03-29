import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, CreateLoginDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';
import { User } from '../interfaces/models/User.interface';
import { RequestWithUser } from '../interfaces/auth.interface';
import { random } from '../utils/util';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      ch_rand: random(32),
      validated: false,
      oauth_provider: null,
      oauth_uid: null,
      picture: null,
      description: null,
      validation_date: null,
      last_logged_date: null,
    };

    try {
      const signUpUserData: User = await this.authService.signup(userData);
      res.status(201).json({
        data: signUpUserData,
        message: 'signup',
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateLoginDto = req.body;

    try {
      const { cookie, findUser } = await this.authService.login(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({
        data: findUser,
        message: 'login',
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;

    try {
      const logOutUserData: User = await this.authService.logout(userData);
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({
        data: logOutUserData,
        message: 'logout',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
