import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { Task } from './tasks/task.entity';
import { Tag } from './tags/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // forRootAsync дозволяє використовувати ConfigService для читання .env
    // synchronize: false — схему керуємо через міграції, а не автоматично
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'lab8_tasks'),
        entities: [Task, Tag],
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        logging: true,
      }),
    }),

    TasksModule,
    TagsModule,
  ],
})
export class AppModule {}
