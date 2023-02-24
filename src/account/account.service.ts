import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { passwordEncryption } from 'src/utiles/password.encryption';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Member } from './entities/account.entity';
import { GoogleInfo } from './entities/google.info.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { NaverInfo } from './entities/naver.info.entity';
import { OAuthService } from './oauth.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Member) private repo: Repository<Member>,
    @InjectRepository(KakaoInfo) private repoKa: Repository<KakaoInfo>,
    @InjectRepository(GoogleInfo) private repoGo: Repository<GoogleInfo>,
    @InjectRepository(NaverInfo) private repoNa: Repository<NaverInfo>,
    private readonly jwtService: JwtService,
    private readonly oAuthService: OAuthService,
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
    const result = await passwordEncryption.validation(
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
    createAccountDto.password = await passwordEncryption.encryption(
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
  async loginOrCreate(type: string, snsId: string) {
    const account: Member = await this.repo
      .createQueryBuilder('member')
      .leftJoinAndSelect(`member.${type}`, `${type}`)
      .where(`${type}.snsId =:id`, { id: snsId })
      .getOne();
    if (account?.[type][0].snsId == snsId) {
      return account;
    }
    const newAcc = this.repo.create({
      email: `${type}social${randomBytes(6).toString('hex')}@test.com`,
      password: await passwordEncryption.encryption(
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
