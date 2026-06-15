import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { todosApi } from "./api/todos";
import type { Todo } from "./types/todo";
import "./App.css";

export default function App() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");

  // useQuery — читаємо дані з сервера.
  // queryKey: ["todos"] — унікальний ключ кешу для цього запиту.
  // При invalidateQueries({ queryKey: ["todos"] }) TanStack Query
  // повторно запустить queryFn і оновить кеш.
  const { data: todos, isLoading, isError, error } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });

  // useMutation — операція POST. Не запускається автоматично,
  // тільки при явному виклику createMutation.mutate(...)
  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      // Після успішного POST говоримо TanStack Query що кеш ["todos"] застарів —
      // він автоматично зробить GET-запит і оновить список
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTitle("");
    },
  });

  // useMutation для PATCH — часткове оновлення поля completed
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      todosApi.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // useMutation для DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: number) => todosApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    createMutation.mutate({ title: trimmed, completed: false });
  };

  // === Три стани HTTP-запиту ===
  // 1. Loading — дані ще не отримані
  if (isLoading) {
    return (
      <div className="app">
        <h1 className="app-title">📋 Todo List</h1>
        <div className="status loading">⏳ Завантаження задач...</div>
      </div>
    );
  }

  // 2. Error — запит завершився помилкою
  if (isError) {
    return (
      <div className="app">
        <h1 className="app-title">📋 Todo List</h1>
        <div className="status error">
          ❌ Помилка: {error instanceof Error ? error.message : "Невідома помилка"}
          <br />
          <small>Переконайтесь що JSON Server запущено: npm run server</small>
        </div>
      </div>
    );
  }

  // 3. Success — дані отримані
  return (
    <div className="app">
      <h1 className="app-title">📋 Todo List</h1>
      <p className="app-subtitle">
        Всього: {todos?.length ?? 0} | Виконано:{" "}
        {todos?.filter((t) => t.completed).length ?? 0}
      </p>

      {/* Форма додавання нового todo */}
      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="add-input"
          type="text"
          placeholder="Нове завдання..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        {/* Під час виконання мутації кнопка заблокована */}
        <button
          className="add-btn"
          type="submit"
          disabled={createMutation.isPending || !newTitle.trim()}
        >
          {createMutation.isPending ? "Додаємо..." : "Додати"}
        </button>
      </form>

      {createMutation.isError && (
        <p className="mutation-error">
          ❌ Помилка при створенні: {String(createMutation.error)}
        </p>
      )}

      {/* Список todos */}
      <ul className="todo-list">
        {todos?.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {/* Чекбокс — PATCH запит для зміни completed */}
            <input
              type="checkbox"
              className="todo-check"
              checked={todo.completed}
              onChange={() =>
                toggleMutation.mutate({ id: todo.id, completed: !todo.completed })
              }
            />
            {/* Якщо completed — закреслений текст (через CSS клас .completed) */}
            <span className="todo-title">{todo.title}</span>
            {/* DELETE запит */}
            <button
              className="todo-delete"
              onClick={() => deleteMutation.mutate(todo.id)}
              disabled={deleteMutation.isPending}
              title="Видалити"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {todos?.length === 0 && (
        <p className="empty">Список порожній. Додайте перше завдання!</p>
      )}
    </div>
  );
}
