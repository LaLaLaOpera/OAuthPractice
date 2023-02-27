import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { passwordEncryption } from '../utiles/password.encryption';
import { CreateAccountDto } from './dto/create-account.dto';
import { Member } from './entities/member.entity';
import { OAuthService } from './oauth.service';
import { MemberRepository } from './repository/member.repository';
import { KakaoInfoRepository } from './repository/kakao.info.repository';
import { GoogleInfoRepository } from './repository/google.info.repository';
import { NaverInfoRepository } from './repository/naver.info.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly oAuthService: OAuthService,
    private readonly _passwordEncryption: passwordEncryption,
    private repoKa: KakaoInfoRepository,
    private repoGo: GoogleInfoRepository,
    private repoNa: NaverInfoRepository,
    private repo: MemberRepository,
  ) {}
  async signIn(createAccountDto: CreateAccountDto) {
    const account = await this.repo.findOne({
      where: {
        email: createAccountDto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    const result = await this._passwordEncryption.validation(
      createAccountDto.password,
      account,
    );
    if (!result) {
      throw new Error('Credential Fail');
    }
    return this.tokenIssue(account);
  }
  async signUp(createAccountDto: CreateAccountDto) {
    const dupCheck = await this.repo.countBy({
      email: createAccountDto.email,
    });
    if (dupCheck >= 0) {
      throw new Error('Dup Email');
    }
    createAccountDto.password = await this._passwordEncryption.encryption(
      createAccountDto.password,
    );
    const account = await this.repo.save(createAccountDto);
    return this.tokenIssue(account);
  }
  async naverSignUp(code: string) {
    const info = await this.oAuthService.authAccessToken('naver', code);
    const data = await this.oAuthService.requestUserData(
      'naver',
      info.data.access_token,
    );
    console.log(data);

    const account = await this.loginOrCreate('naver', data.response.id);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async googleSignUp(code: string) {
    const info = await this.oAuthService.authAccessToken('google', code);
    const decode = this.jwtService.decode(info.data.id_token);
    // const data = await this.oAuthService.requestUserData(
    //   'google',
    //   info.data.access_token,
    // );
    const account = await this.loginOrCreate('google', decode.sub);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async kakaoSignUp(code: string) {
    const info = await this.oAuthService.authAccessToken('kakao', code);
    const data = await this.oAuthService.requestUserData(
      'kakao',
      info.data.access_token,
    );
    const account = await this.loginOrCreate('kakao', data.id);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async loginOrCreate(type: string, snsId: string): Promise<Member> {
    console.log('here');
    const account: Member = await this.repo.findByTypeAndId(type, snsId);
    if (account?.[type][0].snsId == snsId) {
      return account;
    }
    const newAcc = this.repo.create({
      email: `${type}social${randomBytes(6).toString('hex')}@test.com`,
      password: await this._passwordEncryption.encryption(
        `${randomBytes(32).toString('hex')}`,
      ),
    });

    // if (snsId?.email != null) {
    //   newAcc.email = snsId?.email;
    // }
    const _account = await this.repo.save(newAcc);
    switch (type) {
      case 'kakao':
        await this.repoKa.save({
          snsId: snsId,
          account: newAcc,
        });
        break;
      case 'naver':
        await this.repoNa.save({
          snsId: snsId,
          account: newAcc,
        });
        break;
      case 'google':
        await this.repoGo.save({
          snsId: snsId,
          account: newAcc,
        });
        break;
      default:
        throw new Error('invalid social login');
    }
    return _account;
  }
  tokenIssue(account: Member) {
    const init = new Date().getTime();
    const exp = new Date().getTime() + 3600;
    const access_token = this.jwtService.sign(
      {
        payload: {
          id: account.id,
        },
      },
      {
        secret: 'TEST',
        expiresIn: '3600',
      },
    );
    return { init, exp, access_token };
  }
}
