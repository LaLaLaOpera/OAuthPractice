import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { PaymentModule } from './payment/payment.module';
import { FeatureModule } from './feature/feature.module';
import { WhitelistMiddleware } from './middleware/whitelist.middleware';
import { FeatureRepository } from './feature/repository/feature.repository';
import { AuthCheckMiddleWare } from './middleware/AuthCheck';
import { AccountPolicyRepository } from './feature/repository/account.policy.repository';
import { GroupPolicyRepository } from './feature/repository/group.policy.repository';
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
          schema: 'public',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // false가 안전함
        };
      },
    }),
    AccountModule,
    PaymentModule,
    FeatureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FeatureRepository,
    AccountPolicyRepository,
    GroupPolicyRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WhitelistMiddleware, JwtMiddleware, AuthCheckMiddleWare)
      .exclude('google/(.*)')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // consumer
    //   .apply(TenantMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
