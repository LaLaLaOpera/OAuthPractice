import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/account.entity';
import { KakaoInfo } from './entities/kakao.info.entity';
import { GoogleInfo } from './entities/google.info.entity';
import { NaverInfo } from './entities/naver.info.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from './oauth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, KakaoInfo, GoogleInfo, NaverInfo]),
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtService, OAuthService],
})
export class AccountModule {}
