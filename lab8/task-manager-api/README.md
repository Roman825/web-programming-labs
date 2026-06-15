# Лабораторна робота №8 — TypeORM + PostgreSQL

## Опис

Task Manager API з підключенням PostgreSQL через TypeORM. Підтримує теги та зв'язок ManyToMany між задачами і тегами.

## Змінні середовища

| Змінна      | Опис                  | Приклад      |
| ----------- | --------------------- | ------------ |
| PORT        | Порт сервера          | 3000         |
| DB_HOST     | Хост PostgreSQL       | localhost    |
| DB_PORT     | Порт PostgreSQL       | 5432         |
| DB_USER     | Користувач PostgreSQL | postgres     |
| DB_PASSWORD | Пароль PostgreSQL     | (ваш пароль) |
| DB_NAME     | Назва бази даних      | lab8_tasks   |

## Запуск

```bash
# 1. Скопіювати .env.example у .env та заповнити дані БД
cp .env.example .env

# 2. Створити базу даних у PostgreSQL
# psql -U postgres -c "CREATE DATABASE lab8_tasks;"

# 3. Встановити залежності
npm install

# 4. Виконати міграції (створення таблиць)
npm run migration:run

# 5. Запустити сервер
npm run start:dev
```

## Ендпоінти

| Метод  | URL                      | Статус          |
| ------ | ------------------------ | --------------- |
| GET    | /tasks                   | 200             |
| GET    | /tasks/search?status=... | 200             |
| GET    | /tasks/:id               | 200 / 404       |
| POST   | /tasks                   | 201 / 400       |
| PATCH  | /tasks/:id               | 200 / 400 / 404 |
| DELETE | /tasks/:id               | 204 / 404       |
| GET    | /tags                    | 200             |
| POST   | /tags                    | 201 / 400       |
| PATCH  | /tags/:id                | 200 / 400 / 404 |
| DELETE | /tags/:id                | 204 / 404       |
