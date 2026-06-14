// task-1.ts — Базові типи, інтерфейси та type aliases
export {};

// 1.1. Type alias для допустимих статусів задачі.
// Union string-літералів дає компілятору обмежений набір значень —
// будь-який інший рядок ("hello") видасть помилку на етапі компіляції.
type Status = "todo" | "in_progress" | "done" | "cancelled";

// 1.2. Type alias для пріоритету
type Priority = "low" | "medium" | "high" | "critical";

// 1.3. Інтерфейс задачі.
// assignee може бути null (задача не призначена), dueDate теж опційно null.
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

// 1.4. Базовий інтерфейс HasId і Project, що його розширює через extends.
interface HasId {
  id: number;
}

interface Project extends HasId {
  name: string;
  description: string;
  tasks: Task[];
  ownerId: number;
}

// 1.5. Функція статистики. Record<Status, number> — utility-тип,
// що створює об'єкт, де ключі — це всі значення Status, а значення — числа.
function getTaskStats(tasks: Task[]): {
  total: number;
  byStatus: Record<Status, number>;
  overdue: number;
} {
  // Стартовий стан лічильника: всі статуси нульові
  const byStatus: Record<Status, number> = {
    todo: 0,
    in_progress: 0,
    done: 0,
    cancelled: 0,
  };

  const now = new Date();
  let overdue = 0;

  for (const task of tasks) {
    byStatus[task.status]++;
    // Прострочена = є дата дедлайну, вона в минулому,
    // і задача ще не закрита (не done і не cancelled)
    if (
      task.dueDate &&
      task.dueDate < now &&
      task.status !== "done" &&
      task.status !== "cancelled"
    ) {
      overdue++;
    }
  }

  return { total: tasks.length, byStatus, overdue };
}

// 1.6. Форматування задачі у рядок
function formatTask(task: Task): string {
  return `[#${task.id}] ${task.title} (${task.priority}, ${task.status})`;
}

// === Демонстрація ===
const tasks: Task[] = [
  {
    id: 1,
    title: "Налаштувати CI/CD",
    description: "GitHub Actions для автоматичного деплою",
    status: "in_progress",
    priority: "high",
    assignee: "Іван",
    createdAt: new Date("2025-01-10"),
    dueDate: new Date("2025-02-01"),
  },
  {
    id: 2,
    title: "Написати документацію",
    description: "API docs у Swagger",
    status: "todo",
    priority: "low",
    assignee: null,
    createdAt: new Date("2025-01-12"),
    dueDate: new Date("2024-12-01"), // прострочена
  },
  {
    id: 3,
    title: "Виправити баг авторизації",
    description: "JWT token expires too fast",
    status: "done",
    priority: "critical",
    assignee: "Олена",
    createdAt: new Date("2025-01-05"),
    dueDate: new Date("2025-01-20"),
  },
  {
    id: 4,
    title: "Рефакторинг сервісу",
    description: "Винести бізнес-логіку",
    status: "todo",
    priority: "medium",
    assignee: "Андрій",
    createdAt: new Date("2025-01-15"),
    dueDate: null,
  },
  {
    id: 5,
    title: "Code review",
    description: "Перевірити PR команди",
    status: "cancelled",
    priority: "medium",
    assignee: "Андрій",
    createdAt: new Date("2025-01-18"),
    dueDate: new Date("2025-01-25"),
  },
];

console.log("=== Завдання 1: Базові типи, інтерфейси та type aliases ===");
console.log("Статистика:", getTaskStats(tasks));
console.log("\nФорматовані задачі:");
tasks.forEach((t) => console.log(formatTask(t)));
