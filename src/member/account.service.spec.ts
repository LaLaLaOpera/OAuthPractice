import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MockRepository,
  MockRepositoryFactory,
} from '../utiles/mock.repository';
import { passwordEncryption } from '../utiles/password.encryption';
import { AccountService } from './account.service';
import { Member } from './entities/member.entity';
import { OAuthService } from './oauth.service';
import { MemberRepository } from './repository/member.repository';
import { SocialInfoRepository } from './repository/social.info.repository';
import { AppModule } from '../app.module';
describe('AccountService', () => {
  let service: AccountService;
  let memberRepository: MockRepository<MemberRepository>;
  let socialInfoRepository: MockRepository<SocialInfoRepository>;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AccountService,
        OAuthService,
        JwtService,
        passwordEncryption,
        {
          provide: getRepositoryToken(MemberRepository),
          useValue: MockRepositoryFactory.getMockRepository(MemberRepository),
        },
        {
          provide: SocialInfoRepository,
          useValue:
            MockRepositoryFactory.getMockRepository(SocialInfoRepository),
        },
      ],
    }).compile();
    service = module.get<AccountService>(AccountService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
    socialInfoRepository =
      module.get<SocialInfoRepository>(SocialInfoRepository);
    //oAuthService = module.get<OAuthService>(OAuthService);
  });
  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return member object', async () => {
    const user: Member = await service.loginOrCreate('kakao', '2677174729');
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
  it('shold delete use with given ID', async () => {
    await service.signUp({
      email: 'aaa@aab.com',
      password: '1234qwer!',
    });
    const account = await service.find('aaa@aab.com');
    await service.delete(account.id);
    const aaa = await service.find('aaa@aab.com');
    expect(aaa).toBeUndefined();
  });
  it('should return token with exp, init', async () => {
    const authAccessToken = jest.spyOn(
      OAuthService.prototype,
      'authAccessToken',
    );
    const requestUserData = jest.spyOn(
      OAuthService.prototype,
      'requestUserData',
    );
    authAccessToken.mockImplementation(async (type, code) => 'test_token');
    requestUserData.mockImplementation(async (type, access_token) =>
      Promise.resolve({
        id: '1111',
      }),
    );
    //const account = await service.find('aaa@aaa.com');
    const test = await service.oAuthSignUp('kakao', 'kakao');
    //const result = service.tokenIssue(account);
    // expect(oAuthService.authAccessToken).toHaveBeenCalled();
    // expect(oAuthService.requestUserData).toHaveBeenCalled();

    expect(test).toBeDefined();
  });
});
