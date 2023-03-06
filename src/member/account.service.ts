import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { passwordEncryption } from '../utiles/password.encryption';
import { CreateAccountDto } from './dto/create-account.dto';
import { Member } from './entities/member.entity';
import { OAuthService } from './oauth.service';
import { MemberRepository } from './repository/member.repository';
import { SocialInfoRepository } from './repository/social.info.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly oAuthService: OAuthService,
    private readonly _passwordEncryption: passwordEncryption,
    private repoSo: SocialInfoRepository,
    private repo: MemberRepository,
  ) {}
  async delete(id) {
    await this.repo.delete(id);
  }
  async find(email) {
    const result = await this.repo.find({
      where: {
        email: email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });
    if (result != null) {
      return result[0];
    }
  }
  async signIn(createAccountDto: CreateAccountDto) {
    const account = await this.find(createAccountDto.email);
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
    if (dupCheck > 0) {
      throw new Error('Dup Email');
    }
    createAccountDto.password = await this._passwordEncryption.encryption(
      createAccountDto.password,
    );
    const account = await this.repo.save(createAccountDto);
    return this.tokenIssue(account);
  }

  async oAuthSignUp(code: string, type: string) {
    const access_token = await this.oAuthService.authAccessToken(type, code);
    const data = await this.oAuthService.requestUserData(type, access_token);
    let id;
    switch (type) {
      case 'google':
        id = data.sub;
        break;
      case 'kakao':
        id = data.id;
        break;
      case 'naver':
        id = data.response.id;
        break;
      default:
        throw Error('unknow provider');
    }
    const account = await this.loginOrCreate(type, id);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async loginOrCreate(type: string, snsId: string) {
    const account = await this.repo.findOne({
      where: {
        socialInfo: {
          snsId: snsId,
          type: type,
        },
      },
    });
    if (account != null) {
      return account;
    }
    const newAcc: Member = await this.repo.save({
      email: `${type}social${randomBytes(6).toString('hex')}@test.com`,
      password: await this._passwordEncryption.encryption(
        `${randomBytes(32).toString('hex')}`,
      ),
    });
    const social = await this.repoSo.save({
      account: newAcc,
      snsId: snsId,
      type: type,
    });
    //const _account = await this.repo.save(newAcc);
    return newAcc;
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
  async get(id: string) {
    const member = await this.repo
      .createQueryBuilder('member')
      .select(['member.id', 'member.email', 'member.phone'])
      //.leftJoinAndSelect('member.groupToMember', 'gtm')
      .leftJoin('member.groupToMember', 'gtm')
      //.leftJoinAndSelect('gtm.group', 'group')
      .leftJoin('gtm.group', 'group')
      .addSelect('array_agg(group.name) as group_names')
      .where('member.id = :id', { id: id })
      .groupBy('member.id')
      .getRawMany();

    // const group = member.groupToMember.map((s) => {
    //   return s.group.name;
    // });
    // delete member.groupToMember;
    // member['group'] = group;
    return { member };
  }
}
