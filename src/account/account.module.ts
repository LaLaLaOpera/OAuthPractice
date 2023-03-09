import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { SocialInfo } from './entities/social.info.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from './oauth.service';
import { passwordEncryption } from '../utiles/password.encryption';
import { AccountRepository } from './repository/account.repository';
import { SocialInfoRepository } from './repository/social.info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Account, SocialInfo])],
  controllers: [AccountController],
  providers: [
    AccountService,
    JwtService,
    OAuthService,
    passwordEncryption,
    AccountRepository,
    SocialInfoRepository,
  ],
})
export class AccountModule {}
