import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { passwordEncryption } from '../utiles/password.encryption';
import { AddressService } from './address.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';
import { OAuthService } from './oauth.service';
import { AccountRepository } from './repository/account.repository';
import { SocialInfoRepository } from './repository/social.info.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly addressService: AddressService,
    private readonly jwtService: JwtService,
    private readonly oAuthService: OAuthService,
    private readonly _passwordEncryption: passwordEncryption,
    private repoSo: SocialInfoRepository,
    private repo: AccountRepository,
  ) {}
  async getAddresses(accountId) {
    return await this.addressService.get(accountId);
  }
  async addAddress(id, params) {
    console.log(id);
    const account = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    const address = await this.addressService.put(account, params);
    return address;
  }
  async delete(id) {
    await this.repo.delete(id);
  }
  async find(dto) {
    const result = await this.repo.find({
      where: {
        email: dto.email,
        role: dto.role,
      },
      select: {
        email: true,
        password: true,
        id: true,
        role: true,
      },
    });
    console.log(result);
    if (
      result != null &&
      result[0].email == dto.email &&
      result[0].role == dto.role
    ) {
      return result[0];
    }
    throw new Error('NOT FOUND');
  }
  async signIn(createAccountDto: CreateAccountDto) {
    const account = await this.find(createAccountDto);
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
    let email;
    let info;
    switch (type) {
      case 'google':
        id = data.sub;
        email = data.email;
        info = data;
        break;
      case 'kakao':
        id = data.id;
        email = data.kakao_account.email;
        info = data;
        break;
      case 'naver':
        id = data.response.id;
        email = data.response.email;
        info = data.response;
        break;
      default:
        throw Error('unknow provider');
    }
    const account = await this.loginOrCreate(type, id, email, info);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async loginOrCreate(type: string, snsId: string, email: string, info) {
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
    const newAcc: Account = await this.repo.save({
      email:
        email !== '' || email !== undefined || email !== null
          ? email
          : `${type}social${randomBytes(6).toString('hex')}@test.com`,
      password: await this._passwordEncryption.encryption(
        `${randomBytes(32).toString('hex')}`,
      ),
      isGeneratedEmail:
        email !== '' || email !== undefined || email !== null ? false : true,
      role: 'consumer',
    });
    const social = await this.repoSo.save({
      account: newAcc,
      snsId: snsId,
      type: type,
      sns_email: email,
      info: info,
    });
    //const _account = await this.repo.save(newAcc);
    return newAcc;
  }
  tokenIssue(account: Account) {
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
        expiresIn: '1h',
      },
    );
    return { init, exp, access_token };
  }
  async get(req) {
    console.log(req.user);
    const id = req.user.id;
    console.log(id);
    const Account = await this.repo
      .createQueryBuilder('Account')
      .select(['Account.id', 'Account.email', 'Account.phone'])
      //.leftJoinAndSelect('Account.groupToAccount', 'gtm')
      .leftJoin('Account.groupToAccount', 'gtm')
      //.leftJoinAndSelect('gtm.group', 'group')
      .leftJoin('gtm.group', 'group')
      .addSelect('array_agg(group.id) as group_ids')
      .where('Account.id = :id', { id: id })
      .groupBy('Account.id')
      .getRawMany();

    // const group = Account.groupToAccount.map((s) => {
    //   return s.group.name;
    // });
    // delete Account.groupToAccount;
    // Account['group'] = group;
    return { Account };
  }
}
