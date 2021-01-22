import { NextFunction, Request, Response } from 'express';
import AmazonScrapService from '../services/amazonscrap.service';

class AmazonScrapController {
  amazonScrapService = new AmazonScrapService();
  categoryMap = { book: 'stripbooks-intl-ship', video: 'instant-video' };
  public getProductsByTitle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.query.title || !req.query.category) {
        next();
      }
      const title: string = (req.query.title as string).replace(' ', '+');
      if (!title.match(/[A-z0-9 ]+/)) {
        next();
      }
      const category: string = req.query.category as string;
      if (!Object.keys(this.categoryMap).includes(category)) {
        next();
      }

      const products = await this.amazonScrapService.findProductsByTitle(`https://www.amazon.com/s?k=${title}&i=${this.categoryMap[category]}`);
      await res.status(200).json({
        data: products,
        message: 'scrapeAmazonProductByTitle',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AmazonScrapController;
