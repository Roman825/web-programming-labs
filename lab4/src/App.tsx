import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import type { Task } from "./types/task";
import { INITIAL_TASKS } from "./data/initialTasks";
import Layout from "./components/Layout/Layout";
import TasksPage from "./pages/TasksPage/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage/TaskDetailPage";
import NewTaskPage from "./pages/NewTaskPage/NewTaskPage";

export default function App() {
  // Варіант А: стан зберігається тут і передається вниз через props
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Іммутабельне додавання нової задачі на початок списку
  const addTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Іммутабельне видалення — filter повертає новий масив
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Іммутабельне оновлення — map зі spread для зміненого об'єкта
  const updateTask = (updated: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout — кореневий маршрут з хедером; Outlet рендерить дочірні маршрути */}
        <Route path="/" element={<Layout />}>
          {/* Кореневий шлях / → перенаправляємо на /tasks */}
          <Route index element={<Navigate to="/tasks" replace />} />

          {/* /tasks — список задач */}
          <Route
            path="tasks"
            element={<TasksPage tasks={tasks} onDelete={deleteTask} />}
          />

          {/* /tasks/new — форма створення (статичний сегмент "new" має вищий пріоритет за :id) */}
          <Route
            path="tasks/new"
            element={<NewTaskPage onAdd={addTask} />}
          />

          {/* /tasks/:id — сторінка деталей конкретної задачі */}
          <Route
            path="tasks/:id"
            element={
              <TaskDetailPage
                tasks={tasks}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
