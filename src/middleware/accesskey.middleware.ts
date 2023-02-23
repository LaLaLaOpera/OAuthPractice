import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AccessKeyMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
    const accessKey = req.query.accessKey;
    console.log(accessKey);
    if (accessKey) {
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'accesskey not provided' });
    }
    next();
  }
}
