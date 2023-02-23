import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { Member } from './account/entities/account.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { UserLog } from './account/entities/user.log.entity';
import { KakaoInfo } from './account/entities/kakao.info.entity';
import { GoogleInfo } from './account/entities/google.info.entity';
import { NaverInfo } from './account/entities/naver.info.entity';
import { JwtMiddleware } from './middleware/jwt.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    JwtModule.register({
      secret: 'TEST',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5555,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //logging: true,
      entities: [Member, UserLog, KakaoInfo, GoogleInfo, NaverInfo],
      synchronize: true, // false가 안전함
    }),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware);
    // consumer.apply(AccessKeyMiddleware).forRoutes('api');
  }
}
