import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './member/account.module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiPoint = new DocumentBuilder()
    .setTitle('api')
    .setDescription('Access Through Key')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, apiPoint, {
    include: [AccountModule],
  });

  SwaggerModule.setup('swagger/api', app, document);

  // const servicePoint = new DocumentBuilder()
  //   .setTitle('service')
  //   .setDescription('access through service')
  //   .setVersion('0.0.1')
  //   .build();

  // const document2 = SwaggerModule.createDocument(app, servicePoint, {
  //   include: [ClientModule],
  // });

  // SwaggerModule.setup('swagger/service', app, document2);

  await app.listen(3000);
}
bootstrap();
