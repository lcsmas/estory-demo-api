import { Router } from 'express';
import AmazonScrapController from '../controllers/amazonscrap.controller';
import Route from '../interfaces/routes.interface';

export default class AmazonScrapRoute implements Route {
  public path = '/amazonscrap';
  public router = Router();
  public amazonScrapController = new AmazonScrapController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.amazonScrapController.getProductsByTitle);
  }
}
