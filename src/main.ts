import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './account/account.module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const modules = require(__dirname + '/**/*.module{.ts,.js}');
  // modules.map((module) => {
  //   const apiPoint = new DocumentBuilder()
  //     .setTitle(module.split('')[0])
  //     .build();
  //   const document = SwaggerModule.createDocument(app, apiPoint, {
  //     include: [require(module)],
  //   });
  //   SwaggerModule.setup(`${module.split('')[1]}`, app, document);
  // });
  const apiPoint = new DocumentBuilder()
    .setTitle('api')
    .setDescription('Access Through Key')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, apiPoint, {
    include: [AccountModule],
  });
  SwaggerModule.setup('swagger/api', app, document);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
