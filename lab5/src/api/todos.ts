import type { CreateTodoDto, Todo, UpdateTodoDto } from "../types/todo";

const BASE_URL = "http://localhost:3001";

// Допоміжна функція: fetch не кидає помилку при 4xx/5xx,
// тому перевіряємо response.ok вручну
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP помилка ${response.status}: ${response.statusText}`);
  }

  // DELETE повертає порожнє тіло — не намагаємось парсити JSON
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const todosApi = {
  // GET /todos — отримати всі todos
  getAll: () => request<Todo[]>("/todos"),

  // POST /todos — створити новий todo
  create: (dto: CreateTodoDto) =>
    request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  // PATCH /todos/:id — часткове оновлення (не замінює весь об'єкт як PUT)
  update: (id: number, dto: UpdateTodoDto) =>
    request<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    }),

  // DELETE /todos/:id — видалити todo
  remove: (id: number) =>
    request<void>(`/todos/${id}`, { method: "DELETE" }),
};
