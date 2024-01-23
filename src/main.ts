import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Prefix, siempre se usara el appi/v1 antes de cada ruta
  app.setGlobalPrefix('appi/v1',);// { exclude: ['pokemon'] }


  //configuracion de los pipe validadores

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  await app.listen(3000);
}
bootstrap();
