// task-3.ts — Класи та модифікатори доступу
export {};

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

// 3.1. Менеджер задач.
// #tasks та #nextId — приватні поля (синтаксис ES2022 з решіткою).
// До них немає доступу ззовні класу — це справжня інкапсуляція в runtime.
class TaskManager {
  #tasks: Task[];
  #nextId: number = 1;

  constructor(initialTasks: Task[] = []) {
    // Копіюємо масив через spread, щоб мутації ззовні не впливали на наш стан
    this.#tasks = [...initialTasks];
    // Якщо передали початкові задачі, наступний id має бути більший за максимальний
    if (initialTasks.length > 0) {
      this.#nextId = Math.max(...initialTasks.map((t) => t.id)) + 1;
    }
  }

  // Додає задачу — генерує id і createdAt автоматично
  addTask(dto: Omit<Task, "id" | "createdAt">): Task {
    const task: Task = {
      ...dto,
      id: this.#nextId++,
      createdAt: new Date(),
    };
    this.#tasks.push(task);
    return task;
  }

  // Шукає задачу за id, якщо знайшов — оновлює поля (через spread)
  updateTask(
    id: number,
    updates: Partial<Omit<Task, "id" | "createdAt">>,
  ): Task | null {
    const index = this.#tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    // Перезаписуємо лише ті поля, які передали в updates
    this.#tasks[index] = { ...this.#tasks[index], ...updates };
    return this.#tasks[index];
  }

  // Видаляє задачу за id; повертає true якщо щось видалили
  deleteTask(id: number): boolean {
    const initialLength = this.#tasks.length;
    this.#tasks = this.#tasks.filter((t) => t.id !== id);
    return this.#tasks.length < initialLength;
  }

  // Getter повертає КОПІЮ — щоб зовнішній код не міг мутувати наш приватний масив
  get tasks(): Task[] {
    return [...this.#tasks];
  }

  get count(): number {
    return this.#tasks.length;
  }

  getById(id: number): Task | undefined {
    return this.#tasks.find((t) => t.id === id);
  }
}

// 3.2. Розширений менеджер з методами фільтрації.
// extends дає доступ до всіх публічних методів батька (addTask, updateTask і т.д.)
class FilteredTaskManager extends TaskManager {
  getByStatus(status: Status): Task[] {
    return this.tasks.filter((t) => t.status === status);
  }

  getByPriority(priority: Priority): Task[] {
    return this.tasks.filter((t) => t.priority === priority);
  }

  getByAssignee(assignee: string): Task[] {
    return this.tasks.filter((t) => t.assignee === assignee);
  }

  getOverdue(): Task[] {
    const now = new Date();
    return this.tasks.filter(
      (t) =>
        t.dueDate !== null &&
        t.dueDate < now &&
        t.status !== "done" &&
        t.status !== "cancelled",
    );
  }
}

// === Демонстрація ===
console.log("=== Завдання 3: Класи та модифікатори доступу ===");

const manager = new FilteredTaskManager();

const task1 = manager.addTask({
  title: "Розробити API",
  description: "REST API для задач",
  status: "in_progress",
  priority: "high",
  assignee: "Іван",
  dueDate: new Date("2025-02-01"),
});
console.log("Додано:", task1);

manager.addTask({
  title: "Написати тести",
  description: "Unit-тести",
  status: "todo",
  priority: "medium",
  assignee: null,
  dueDate: new Date("2024-12-01"), // прострочена
});
manager.addTask({
  title: "Деплой",
  description: "Виставити на прод",
  status: "done",
  priority: "critical",
  assignee: "Олена",
  dueDate: new Date("2025-01-20"),
});
manager.addTask({
  title: "Документація",
  description: "Swagger",
  status: "todo",
  priority: "low",
  assignee: "Іван",
  dueDate: null,
});

console.log("\nКількість задач:", manager.count);

console.log("\nЗадачі зі статусом 'todo':", manager.getByStatus("todo").map((t) => t.title));
console.log("Критичні задачі:", manager.getByPriority("critical").map((t) => t.title));
console.log("Задачі Івана:", manager.getByAssignee("Іван").map((t) => t.title));
console.log("Прострочені задачі:", manager.getOverdue().map((t) => t.title));

// Оновлення
const updated = manager.updateTask(1, { status: "done" });
console.log("\nПісля оновлення задачі #1:", updated?.status);

// Видалення
console.log("Видалено задачу #2:", manager.deleteTask(2));
console.log("Кількість задач після видалення:", manager.count);
