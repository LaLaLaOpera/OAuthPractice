import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './member/account.module';
import { Member } from './member/entities/member.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserLog } from './member/entities/user.log.entity';
import { KakaoInfo } from './member/entities/kakao.info.entity';
import { GoogleInfo } from './member/entities/google.info.entity';
import { NaverInfo } from './member/entities/naver.info.entity';
import { JwtMiddleware } from './middleware/jwt.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    JwtModule.register({
      secret: 'TEST',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          port: 5555,
          entities: [Member, UserLog, KakaoInfo, GoogleInfo, NaverInfo],
          synchronize: true, // false가 안전함
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5555,
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   entities: [Member, UserLog, KakaoInfo, GoogleInfo, NaverInfo],
    //   synchronize: true, // false가 안전함
    // }),
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
