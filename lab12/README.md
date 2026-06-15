# Лабораторна робота №12 — Docker контейнеризація

## Структура

```
lab12/
├── backend/      # Nest.js + TypeORM + PostgreSQL
├── frontend/     # React + Vite + Nginx
├── compose.yaml  # Docker Compose — три сервіси
└── .env.example  # Шаблон змінних середовища
```

## Запуск через Docker Compose

```bash
cp .env.example .env
# Заповни .env своїми значеннями

docker compose up --build
```

Після запуску:
- Frontend: http://localhost
- Backend API: http://localhost:3000

## Сервіси

| Сервіс   | Образ             | Порт |
|----------|-------------------|------|
| db       | postgres:16-alpine| —    |
| backend  | Dockerfile (build)| 3000 |
| frontend | Dockerfile (build)| 80   |

## Зупинка

```bash
docker compose down          # зупинити контейнери
docker compose down -v       # + видалити томи (дані БД)
```
