import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальний ValidationPipe — застосовується до всіх ендпоінтів
  // whitelist: true — видаляє поля яких немає в DTO (захист від mass assignment)
  // transform: true — автоматично перетворює типи (string → number тощо)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}

bootstrap();
