// Основний інтерфейс Todo — відображає об'єкт із JSON Server
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// DTO для створення: id генерується сервером, тому його немає
export type CreateTodoDto = Omit<Todo, "id">;

// DTO для оновлення: всі поля опціональні, id передається в URL
export type UpdateTodoDto = Partial<Omit<Todo, "id">>;
