import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getRepositoryToken,
  getCustomRepositoryToken,
  getEntityManagerToken,
} from '@nestjs/typeorm';
import { passwordEncryption } from '../utiles/password.encryption';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import { GoogleInfo } from './entities/google.info.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { Member } from './entities/member.entity';
import { NaverInfo } from './entities/naver.info.entity';
import { OAuthService } from './oauth.service';

describe('AccountService', () => {
  let service: AccountService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Member) as 'repo',
          useClass: Repository<Member>,
        },
        {
          provide: getRepositoryToken(KakaoInfo) as 'repoKa',
          useClass: Repository<KakaoInfo>,
        },
        {
          provide: getRepositoryToken(GoogleInfo) as 'repoGo',
          useClass: Repository<GoogleInfo>,
        },
        {
          provide: getRepositoryToken(NaverInfo) as 'repoNa',
          useClass: Repository<NaverInfo>,
        },
        JwtService,
        OAuthService,
        passwordEncryption,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    //console.log(service);
    console.log(getRepositoryToken(Member));
    console.log(service);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    //expect(await service.loginOrCreate('google', '2677174729')).toBeDefined();
  });
});
