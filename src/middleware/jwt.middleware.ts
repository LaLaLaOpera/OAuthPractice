import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.header['skip-mid'] == true) {
      next();
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          console.log(token);
          const decoded = await this.jwtService.verify(token);
          req['user'] = decoded.payload;
        } catch (err) {
          console.log(err);
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Invalid token' });
        }
      } else {
        return res
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ message: 'token not provided' });
      }
      next();
    }
  }
}
