import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { SocialInfo } from './entities/social.info.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from './oauth.service';
import { passwordEncryption } from '../utiles/password.encryption';
import { MemberRepository } from './repository/member.repository';
import { SocialInfoRepository } from './repository/social.info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SocialInfo])],
  controllers: [AccountController],
  providers: [
    AccountService,
    JwtService,
    OAuthService,
    passwordEncryption,
    MemberRepository,
    SocialInfoRepository,
  ],
})
export class AccountModule {}
