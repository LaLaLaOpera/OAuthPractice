import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { passwordEncryption } from '../utiles/password.encryption';
import { AccountService } from './account.service';
import { Member } from './entities/member.entity';
import { OAuthService } from './oauth.service';
import { MemberRepository } from './repository/member.repository';
import { SocialInfoRepository } from './repository/social.info.repository';

describe('AccountService', () => {
  let service: AccountService;
  let memberRepository: Partial<MemberRepository>;
  let socialInfoRepository: Partial<SocialInfoRepository>;
  beforeEach(async () => {
    const accounts: Member[] = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        OAuthService,
        JwtService,
        passwordEncryption,
        {
          provide: MemberRepository,
          useValue: {},
        },
        {
          provide: SocialInfoRepository,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<AccountService>(AccountService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    socialInfoRepository =
      module.get<SocialInfoRepository>(SocialInfoRepository);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return member object', async () => {
    spyOn(memberRepository, 'find');
    const user: Member = await service.loginOrCreate(
      'naver',
      'e26dfe11-3479-4f1d-801c-e181765f9c30',
    );
    expect(user).toBeDefined();
  });

  it('test for others', async () => {
    type Token = {
      init: number;
      exp: number;
      access_token: string;
    };
    const _account = await service.find('aaa@aaa.com');
    if (_account != null) {
      await service.delete(_account.id);
    }
    await service.signUp({
      email: 'aaa@aaa.com',
      password: '1234qwer!',
    });
    const token: Token = await service.signIn({
      email: 'aaa@aaa.com',
      password: '1234qwer!',
    });
    expect(token).toBeDefined();
  });
});
