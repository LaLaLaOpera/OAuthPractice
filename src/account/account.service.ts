import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Member } from './entities/account.entity';
import { GoogleInfo } from './entities/google.info.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { NaverInfo } from './entities/naver.info.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Member) private repo: Repository<Member>,
    @InjectRepository(KakaoInfo) private repoKa: Repository<KakaoInfo>,
    @InjectRepository(GoogleInfo) private repoGo: Repository<GoogleInfo>,
    @InjectRepository(NaverInfo) private repoNa: Repository<NaverInfo>,
    private readonly jwtService: JwtService,
  ) {}
  async naverSignUp(code: string) {
    const info = await this.authAccessToken('naver', code);
    const data = await this.requestUserData('naver', info.data.access_token);
    const account = await this.loginOrCreate('naver', data.response.id);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async googleSignUp(code: string) {
    const info = await this.authAccessToken('google', code);
    const data = await this.requestUserData('google', info.data.access_token);
    const account = await this.loginOrCreate('google', data.sub);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async kakaoSignUp(code: string) {
    const info = await this.authAccessToken('kakao', code);
    const data = await this.requestUserData('kakao', info.data.access_token);
    const account = await this.loginOrCreate('kakao', data.id);
    const payload = this.tokenIssue(account);
    return payload;
  }
  async loginOrCreate(type: string, snsId) {
    const account: Member = await this.repo
      .createQueryBuilder('member')
      .leftJoinAndSelect(`member.${type}`, `${type}`)
      .where(`${type}.snsId =:id`, { id: snsId })
      .getOne();
    if (account?.[type][0].snsId == snsId) {
      return account;
    }
    const newAcc = await this.repo.save({
      email: `${type}social${randomBytes(6).toString('hex')}@test.com`,
      password: `${randomBytes(32).toString('hex')}`,
    });
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
    return newAcc;
  }
  async authAccessToken(type: string, code: string) {
    const body = {
      grant_type: 'authorization_code',
      client_id:
        type === 'naver'
          ? process.env.NAVER_CLIENT_ID
          : type === 'kakao'
          ? process.env.KAKAO_CLIENT_ID
          : process.env.GOOGLE_CLIENT_ID,
      client_secret:
        type === 'naver'
          ? process.env.NAVER_CLIENT_SECRET
          : type === 'kakao'
          ? process.env.KAKAO_CLIENT_SECRET
          : process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      redirect_uri: 'http://localhost:3000/account/signup/' + type,
    };
    const uri =
      type === 'naver'
        ? process.env.NAVER_TOKEN_ISSUE
        : type === 'kakao'
        ? process.env.KAKAO_TOKEN_ISSUE
        : process.env.GOOGLE_TOKEN_ISSUE;
    let info;
    try {
      info = await axios.post(uri, body, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
    } catch (err) {
      console.log(err);
    }
    return info;
  }
  async requestUserData(type: string, access_token: string) {
    const uri =
      type === 'naver'
        ? process.env.NAVER_INFO
        : type === 'kakao'
        ? process.env.KAKAO_INFO
        : process.env.GOOGLE_INFO;
    const { data } = await axios.get(uri, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return data;
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
