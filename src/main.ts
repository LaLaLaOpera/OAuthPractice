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
  await app.listen(3000);
}
bootstrap();
