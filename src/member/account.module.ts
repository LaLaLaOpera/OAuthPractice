import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { GoogleInfo } from './entities/google.info.entity';
import { NaverInfo } from './entities/naver.info.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from './oauth.service';
import { passwordEncryption } from '../utiles/password.encryption';
import { MemberRepository } from './repository/member.repository';
import { KakaoInfoRepository } from './repository/kakao.info.repository';
import { GoogleInfoRepository } from './repository/google.info.repository';
import { NaverInfoRepository } from './repository/naver.info.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, KakaoInfo, GoogleInfo, NaverInfo]),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    JwtService,
    OAuthService,
    passwordEncryption,
    MemberRepository,
    KakaoInfoRepository,
    GoogleInfoRepository,
    NaverInfoRepository,
  ],
})
export class AccountModule {}
