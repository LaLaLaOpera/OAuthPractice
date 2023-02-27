import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { passwordEncryption } from '../utiles/password.encryption';
import { AccountService } from './account.service';
import { Member } from './entities/member.entity';
import { OAuthService } from './oauth.service';
import { GoogleInfoRepository } from './repository/google.info.repository';
import { KakaoInfoRepository } from './repository/kakao.info.repository';
import { MemberRepository } from './repository/member.repository';
import { NaverInfoRepository } from './repository/naver.info.repository';

describe('AccountService', () => {
  let service: AccountService;
  let memberRepository: Partial<MemberRepository>;
  let kakaoInfoRepository: Partial<KakaoInfoRepository>;
  let googleInfoRepository: Partial<GoogleInfoRepository>;
  let naverInfoRepository: Partial<NaverInfoRepository>;

  beforeEach(async () => {
    memberRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      findByTypeAndId: async (type, id) => {
        return Promise.resolve({
          id: '',
          email: '',
          kakao: [
            {
              snsId: '2677174729',
            },
          ],
          google: [],
          naver: [],
        } as Member);
      },
    };
    kakaoInfoRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    googleInfoRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    naverInfoRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        JwtService,
        OAuthService,
        passwordEncryption,
        {
          provide: MemberRepository,
          useValue: memberRepository,
        },
        {
          provide: KakaoInfoRepository,
          useValue: kakaoInfoRepository,
        },
        {
          provide: NaverInfoRepository,
          useValue: naverInfoRepository,
        },
        {
          provide: GoogleInfoRepository,
          useValue: googleInfoRepository,
        },
      ],
    }).compile();
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  it('should return member object', async () => {
    const user: Member = await service.loginOrCreate('kakao', '2677174729');
    expect(user).toEqual({
      id: '',
      email: '',
      kakao: [
        {
          snsId: '2677174729',
        },
      ],
      google: [],
      naver: [],
    });
  });
});
