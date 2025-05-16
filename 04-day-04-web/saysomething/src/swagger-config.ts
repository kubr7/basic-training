import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Saysomething API')
  .setDescription('API for Saysomething')
  .setVersion('1.0')
  .build();
