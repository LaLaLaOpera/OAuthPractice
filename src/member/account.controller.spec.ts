import { AccountController } from './account.controller';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { passwordEncryption } from '../utiles/password.encryption';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { GoogleInfo } from './entities/google.info.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { Member } from './entities/member.entity';
import { NaverInfo } from './entities/naver.info.entity';
import { OAuthService } from './oauth.service';
describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(KakaoInfo),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(GoogleInfo),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(NaverInfo),
          useClass: Repository,
        },
        JwtService,
        OAuthService,
        passwordEncryption,
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
