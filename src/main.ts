import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {ValidationPipe} from "@nestjs/common";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.enableCors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PATCH'],
  });

  app.use(cookieParser());

  const config = app.get(ConfigService);

  await app.listen(config.get<number>('PORT') ?? 3000);
}

bootstrap();