import { FeatureRepository } from '@/feature/repository/feature.repository';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class WhitelistMiddleware implements NestMiddleware {
  constructor(private repo: FeatureRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const urls = await this.repo.find({
      where: {
        reqAuth: false,
      },
    });
    const url = req.url.split('?')[0];
    let boo = false;
    for (const _url of urls) {
      if (url == _url.url) {
        boo = true;
        break;
      }
    }
    if (boo) {
      req.header['skip-mid'] = true;
    }
    next();
  }
}
