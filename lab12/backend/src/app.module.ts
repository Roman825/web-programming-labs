import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        // У Docker контейнері DB_HOST=db (ім'я сервісу в compose.yaml)
        // Локально DB_HOST=localhost
        host: c.get('DB_HOST', 'localhost'),
        port: c.get<number>('DB_PORT', 5432),
        username: c.get('DB_USER', 'postgres'),
        password: c.get('DB_PASSWORD'),
        database: c.get('DB_NAME', 'lab12'),
        entities: [User, Task],
        migrations: ['dist/migrations/*.js'],
        synchronize: false,
        migrationsRun: true, // автозапуск міграцій при старті
      }),
    }),
    UsersModule, AuthModule, TasksModule,
  ],
})
export class AppModule {}
