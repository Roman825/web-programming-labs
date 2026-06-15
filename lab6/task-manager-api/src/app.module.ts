import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // isGlobal: true — ConfigModule доступний у всіх модулях без повторного імпорту
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
  ],
})
export class AppModule {}
