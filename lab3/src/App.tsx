import { useState } from "react";
import type { Task, TaskStatus } from "./types/task";
import type { TaskFormData } from "./components/TaskForm/TaskForm";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import styles from "./App.module.css";

// VARIANT = 4, визначений поза компонентом — не залежить від стану/рендеру
const VARIANT = 4;

const INITIAL_TASKS: Task[] = [
  {
    id: `task-${VARIANT}-1`,
    title: `Задача А-${VARIANT}: налаштування середовища`,
    description: "Встановити Node.js, VS Code та необхідні розширення",
    status: "done",
    priority: "high",
    createdAt: new Date(2025, 0, (VARIANT % 28) + 1),
  },
  {
    id: `task-${VARIANT}-2`,
    title: `Задача Б-${VARIANT}: вивчення документації`,
    description: "Ознайомитись з офіційною документацією React",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(2025, 1, (VARIANT % 28) + 1),
  },
  {
    id: `task-${VARIANT}-3`,
    title: `Задача В-${VARIANT}: написати компонент`,
    description: "",
    status: "todo",
    priority: "low",
    createdAt: new Date(2025, 2, (VARIANT % 28) + 1),
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  // Приймає дані форми (без id, status, createdAt) і формує повний Task
  function handleAddTask(data: TaskFormData) {
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      status: "todo",
      createdAt: new Date(),
    };
    // Іммутабельне оновлення: передаємо новий масив, а не мутований
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleDeleteTask(id: string) {
    // filter повертає новий масив — оригінал не мутується
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    // map повертає новий масив; змінений об'єкт створюється через spread
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  // Обчислюємо відфільтрований список перед рендером
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Manager</h1>
        <p className={styles.stats}>
          Всього: {tasks.length} | Нові:{" "}
          {tasks.filter((t) => t.status === "todo").length} | В роботі:{" "}
          {tasks.filter((t) => t.status === "in-progress").length} | Виконані:{" "}
          {tasks.filter((t) => t.status === "done").length}
        </p>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <TaskForm onSubmit={handleAddTask} />
        </aside>

        <section className={styles.content}>
          <div className={styles.filters}>
            <label htmlFor="filter" className={styles.filterLabel}>
              Фільтр:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as TaskStatus | "all")
              }
              className={styles.filterSelect}
            >
              <option value="all">Усі</option>
              <option value="todo">Нові</option>
              <option value="in-progress">В роботі</option>
              <option value="done">Виконані</option>
            </select>
          </div>

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        </section>
      </main>
    </div>
  );
}
