# Лабораторна робота №9 — JWT Аутентифікація

## Ендпоінти

| Метод | URL            | Доступ  | Статус      |
| ----- | -------------- | ------- | ----------- |
| POST  | /auth/register | публічний | 201 / 400 / 409 |
| POST  | /auth/login    | публічний | 200 / 401   |
| GET   | /auth/me       | JWT     | 200 / 401   |

## Запуск

```bash
cp .env.example .env  # заповни дані
psql -U postgres -c "CREATE DATABASE lab9_auth;"
npm install
npm run migration:run
npm run start:dev
```
