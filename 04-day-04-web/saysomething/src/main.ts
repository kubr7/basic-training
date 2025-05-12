// src/main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Say Something API')
    .setDescription('The Say Something API description')
    .setVersion('1.0')
    .addTag('say-something')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
