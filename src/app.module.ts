import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { SellerModule } from './seller/seller.module';
import { AccountController } from './account/account.controller';
//import { AccessKeyMiddleware } from './middleware/accesskey.middleware';
import { TenantModule } from './tenant/tenant.module';
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
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // false가 안전함
        };
      },
    }),
    AccountModule,
    PaymentModule,
    SellerModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('account/signup', 'account/signin')
      .forRoutes(AccountController);
  }
}
