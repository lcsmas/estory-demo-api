import puppeteer from 'puppeteer';
import { Product } from '../interfaces/models/AmazonScrap.interface';

export default class AmazonScrapService {
  public async findProductsByTitle(url): Promise<Array<Product>> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
    await page.goto(url);
    const productsElements = await page.$$('.s-result-item');
    const products = await Promise.all(
      productsElements.map(async item => {
        const titleElement = await item.$('.a-text-normal');
        const imgElement = await item.$('img');
        let titleText, productURL, imgURL, firstRowHTML: string;
        if (titleElement !== null && imgElement !== null) {
          titleText = (await (await titleElement.getProperty('textContent')).jsonValue()) as string;
          productURL = (await (await titleElement.getProperty('href')).jsonValue()) as string;
          imgURL = (await (await imgElement.getProperty('src')).jsonValue()) as string;
          firstRowHTML = (await item.$eval('.a-row', el => el.innerHTML)) as string;
          titleText = titleText.replace(/(\r\n|\n|\r)/gm, '');
          return { title: titleText, url: productURL, imgURL, firstRowHTML };
        }
      }),
    );
    return products.filter(product => product !== undefined);
  }
}
