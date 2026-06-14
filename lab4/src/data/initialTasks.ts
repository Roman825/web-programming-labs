import type { Task } from "../types/task";

// Варіант 4 — тематика: розробка програмного забезпечення
export const INITIAL_TASKS: Task[] = [
  {
    id: "task-4-1",
    title: "Налаштувати середовище розробки",
    description: "Встановити Node.js LTS, VS Code та необхідні розширення. Налаштувати ESLint та Prettier для проєкту.",
    status: "done",
    priority: "high",
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "task-4-2",
    title: "Розробити REST API для задач",
    description: "Реалізувати CRUD-ендпоінти на NestJS: GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id.",
    status: "in-progress",
    priority: "high",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "task-4-3",
    title: "Написати unit-тести для сервісів",
    description: "Покрити тестами TaskService та AuthService за допомогою Jest. Мінімальне покриття — 80%.",
    status: "todo",
    priority: "medium",
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "task-4-4",
    title: "Налаштувати CI/CD pipeline",
    description: "Створити GitHub Actions workflow: lint → test → build → deploy на staging-сервер.",
    status: "todo",
    priority: "medium",
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "task-4-5",
    title: "Оновити технічну документацію",
    description: "Описати архітектуру проєкту, API-контракти у Swagger та інструкцію для нових розробників.",
    status: "todo",
    priority: "low",
    createdAt: new Date("2025-01-25"),
  },
];
