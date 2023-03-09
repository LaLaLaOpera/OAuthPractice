import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async use(req: Request, res: Response, next: Function) {
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
