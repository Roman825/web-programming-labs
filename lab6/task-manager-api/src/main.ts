import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Порт читається зі змінної середовища PORT (з .env файлу)
  // Якщо не задано — використовуємо 3000
  const port = parseInt(process.env.PORT ?? '3000', 10);

  await app.listen(port);
  console.log(`Server started on port ${port}`);
}

bootstrap();
