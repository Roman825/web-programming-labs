# Лабораторна робота №7 — CRUD API на Nest.js

## Опис

Task Manager CRUD API — серверний застосунок на Nest.js з повним набором операцій над задачами, ValidationPipe та розподілом відповідальностей між сервісом і контролером.

## Технології

- Nest.js + TypeScript
- @nestjs/config
- class-validator + class-transformer

## Ендпоінти

| Метод  | URL                      | Статус              |
| ------ | ------------------------ | ------------------- |
| GET    | /tasks                   | 200                 |
| GET    | /tasks/search?status=... | 200                 |
| GET    | /tasks/:id               | 200 / 404           |
| POST   | /tasks                   | 201 / 400           |
| PATCH  | /tasks/:id               | 200 / 400 / 404     |
| DELETE | /tasks/:id               | 204 / 404           |

## Запуск

1. Скопіюйте `.env.example` у `.env`
2. `npm install`
3. `npm run start:dev`
