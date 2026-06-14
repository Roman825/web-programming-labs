// task-5.ts — Type Guards та звуження типів
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

// 5.1. Discriminated union — три варіанти стану, об'єднані спільним полем status.
// Поле status грає роль "дискримінатора": перевіривши його значення,
// TypeScript автоматично знає, які ще поля доступні.
type LoadingState = { status: "loading" };
type SuccessState<T> = { status: "success"; data: T; loadedAt: Date };
type ErrorState = { status: "error"; message: string; code: number };

type FetchState<T> = LoadingState | SuccessState<T> | ErrorState;

// 5.2. Type guards — функції, що повертають boolean у спеціальній формі
// "value is Type". Після виклику в if(...) TypeScript "звужує" тип всередині блоку.
function isLoadingState(state: FetchState<unknown>): state is LoadingState {
  return state.status === "loading";
}

function isSuccessState<T>(state: FetchState<T>): state is SuccessState<T> {
  return state.status === "success";
}

function isErrorState(state: FetchState<unknown>): state is ErrorState {
  return state.status === "error";
}

// 5.3. renderState використовує type guards для безпечного доступу до полів,
// які доступні тільки в конкретному варіанті union-а.
function renderState<T>(
  state: FetchState<T>,
  renderData: (data: T) => string,
): string {
  if (isLoadingState(state)) {
    return "⏳ Завантаження...";
  }
  if (isSuccessState(state)) {
    // Тут TypeScript знає, що state.data існує і має тип T
    return `✅ Завантажено о ${state.loadedAt.toLocaleTimeString()}: ${renderData(state.data)}`;
  }
  if (isErrorState(state)) {
    return `❌ Помилка ${state.code}: ${state.message}`;
  }
  // Якщо додамо новий варіант FetchState, тут спрацює exhaustive check
  const _never: never = state;
  return _never;
}

// 5.4. typeof — вбудований type guard для примітивів.
// Перевірка на null/undefined — це звуження через рівність.
function processValue(
  value: string | number | boolean | null | undefined,
): string {
  // Спочатку відсікаємо порожні значення — інакше typeof "object" для null
  if (value === null || value === undefined) {
    return "(порожнє значення)";
  }
  if (typeof value === "string") {
    return `Рядок: '${value}' (${value.length} символів)`;
  }
  if (typeof value === "number") {
    return `Число: ${value} (${value % 2 === 0 ? "парне" : "непарне"})`;
  }
  if (typeof value === "boolean") {
    return `Булеве: ${value ? "так" : "ні"}`;
  }
  // Сюди ніколи не потрапить — це гарантує exhaustive check через never
  const _never: never = value;
  return _never;
}

// 5.5. getStatusLabel з exhaustive check.
// Якщо до Status додадуть новий варіант ("archived"), TypeScript
// видасть помилку в default-блоці — це змусить нас оновити switch.
function getStatusLabel(status: Status): string {
  switch (status) {
    case "todo":
      return "До виконання";
    case "in_progress":
      return "В роботі";
    case "done":
      return "Виконано";
    case "cancelled":
      return "Скасовано";
    default:
      const _never: never = status;
      throw new Error(`Невідомий статус: ${_never}`);
  }
}

// === Демонстрація ===
console.log("=== Завдання 5: Type Guards та звуження типів ===");

const states: FetchState<Task[]>[] = [
  { status: "loading" },
  { status: "success", data: [], loadedAt: new Date() },
  { status: "error", message: "Not found", code: 404 },
];

states.forEach((state) => {
  console.log(renderState(state, (tasks) => `${tasks.length} задач`));
});

console.log("\n--- processValue ---");
const values: (string | number | boolean | null | undefined)[] = [
  "TypeScript",
  42,
  true,
  null,
  undefined,
  0,
  "",
];
values.forEach((v) => console.log(processValue(v)));

console.log("\n--- getStatusLabel ---");
const allStatuses: Status[] = ["todo", "in_progress", "done", "cancelled"];
allStatuses.forEach((s) => console.log(`${s} → ${getStatusLabel(s)}`));
