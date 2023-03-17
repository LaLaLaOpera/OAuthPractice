import { AccountPolicyRepository } from '@/feature/repository/account.policy.repository';
import { GroupPolicyRepository } from '@/feature/repository/group.policy.repository';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthCheckMiddleWare implements NestMiddleware {
  constructor(
    private aprepo: AccountPolicyRepository,
    private gprepo: GroupPolicyRepository,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.header['skip-mid'] == true) {
      next();
    } else {
      const url = req.url.split('?')[0];
      const method = req.method;
      const policy = await this.aprepo.find({
        where: {
          feature: {
            url: url,
          },
          account: {
            id: req['user'].payload.id,
          },
        },
      });
      const gPolicy = await this.gprepo.find({
        where: {
          feature: {
            url: url,
          },
          group: {
            accounts: {
              id: req['user'].payload.id,
            },
          },
        },
      });

      const policies = [...policy, ...gPolicy];
      let validation = false;
      let repeat = 0;
      while (validation == false || repeat == policies.length) {
        switch (method) {
          case 'POST':
            if (policies[repeat++].authorization['C'].isAllowed == true) {
              validation = true;
            }
            break;
          case 'GET':
            if (policies[repeat++].authorization['R'].isAllowed == true) {
              validation = true;
            }
            break;
          case 'UPDATE':
            if (policies[repeat++].authorization['U'].isAllowed == true) {
              validation = true;
            }
            break;
          case 'DELETE':
            if (policies[repeat++].authorization['D'].isAllowed == true) {
              validation = true;
            }
            break;
          case 'PUT':
            if (policies[repeat++].authorization['U'].isAllowed == true) {
              validation = true;
            }
            break;
          default:
            break;
        }
      }
      if (!validation) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'UnAuthorized Access' });
      }
      next();
    }
  }
}
