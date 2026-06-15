import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // CORS — frontend у Docker буде на порту 80, локально на 5173
  app.enableCors({ origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost'] });
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
