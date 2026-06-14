// task-2.ts — Generics та Utility Types
import { VARIANT } from "./config";

// Повторно оголошуємо типи в цьому файлі (вимога умови — кожен файл самостійний)
type Status = "todo" | "in_progress" | "done" | "cancelled";
type Priority = "low" | "medium" | "high" | "critical";

interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string | null;
  createdAt: Date;
  dueDate: Date | null;
}

// 2.1. Generic-інтерфейс для типізованої відповіді API.
// T — будь-який тип "корисного навантаження".
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// Generic-функція успіху: data — це тип T, який потім "запам'ятовується"
// у поверненому ApiResponse<T>. Викликаючий бачить точний тип, без any.
function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    status: 200,
    message: "OK",
    timestamp: new Date(),
  };
}

// Для помилки даних нема — повертаємо null, але тип все одно зберігаємо
function createErrorResponse<T>(message: string): ApiResponse<T | null> {
  return {
    data: null,
    status: 500,
    message,
    timestamp: new Date(),
  };
}

// 2.2. Utility types для DTO.
// Omit прибирає вказані ключі з типу; Partial робить усі поля опційними.
type CreateTaskDto = Omit<Task, "id" | "createdAt">;
type UpdateTaskDto = Partial<Omit<Task, "id" | "createdAt">>;

// 2.3. Generic-функція фільтрації.
// K extends keyof Task — K може бути тільки одним з імен полів Task.
// Task[K] — це тип значення цього поля (наприклад, для "status" буде Status).
function filterTasks<K extends keyof Task>(
  tasks: Task[],
  key: K,
  value: Task[K],
): Task[] {
  return tasks.filter((task) => task[key] === value);
}

// Масив задач, де id залежить від варіанту
const tasks: Task[] = [
  {
    id: 1 + VARIANT,
    title: "Розробити API",
    description: "Реалізувати REST API для управління задачами",
    status: "in_progress",
    priority: "high",
    assignee: "Іван Петренко",
    createdAt: new Date("2025-01-10"),
    dueDate: new Date("2025-02-01"),
  },
  {
    id: 2 + VARIANT,
    title: "Написати тести",
    description: "Покрити unit-тестами основну логіку",
    status: "todo",
    priority: "medium",
    assignee: null,
    createdAt: new Date("2025-01-12"),
    dueDate: new Date("2025-02-15"),
  },
  {
    id: 3 + VARIANT,
    title: "Налаштувати БД",
    description: "Підключити PostgreSQL, виконати міграції",
    status: "done",
    priority: "critical",
    assignee: "Олена Коваль",
    createdAt: new Date("2025-01-05"),
    dueDate: new Date("2025-01-20"),
  },
  {
    id: 4 + VARIANT,
    title: "Оновити документацію",
    description: "Описати API у Swagger",
    status: "todo",
    priority: "low",
    assignee: null,
    createdAt: new Date("2025-01-15"),
    dueDate: null,
  },
  {
    id: 5 + VARIANT,
    title: "Code review",
    description: "Перевірити pull request від команди",
    status: "cancelled",
    priority: "medium",
    assignee: "Андрій Лисенко",
    createdAt: new Date("2025-01-18"),
    dueDate: new Date("2025-01-25"),
  },
];

// === Демонстрація ===
console.log("=== Завдання 2: Generics та Utility Types ===");
console.log("Варіант:", VARIANT);

// 2.1 — generic response
const successResp = createSuccessResponse<Task[]>(tasks);
console.log("Success response (тільки кількість):", {
  status: successResp.status,
  message: successResp.message,
  dataCount: successResp.data.length,
});

const errorResp = createErrorResponse<Task[]>("Database connection failed");
console.log("Error response:", errorResp);

// 2.2 — DTO для створення/оновлення
const newTaskDto: CreateTaskDto = {
  title: "Нова задача",
  description: "Опис",
  status: "todo",
  priority: "low",
  assignee: null,
  dueDate: null,
};
console.log("CreateTaskDto:", newTaskDto);

const updateDto: UpdateTaskDto = { status: "in_progress", priority: "high" };
console.log("UpdateTaskDto (часткове оновлення):", updateDto);

// 2.3 — фільтрація з типобезпекою
console.log("\nЗадачі зі статусом 'todo':", filterTasks(tasks, "status", "todo").map((t) => t.title));
console.log("Задачі з пріоритетом 'critical':", filterTasks(tasks, "priority", "critical").map((t) => t.title));
console.log("Задачі без призначення (assignee = null):", filterTasks(tasks, "assignee", null).map((t) => t.title));
