import { Link, useNavigate, useParams } from "react-router";
import type { Task, TaskStatus } from "../../types/task";
import styles from "./TaskDetailPage.module.css";

interface TaskDetailPageProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetailPage({ tasks, onUpdate, onDelete }: TaskDetailPageProps) {
  // useParams витягує динамічний сегмент :id з URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Шукаємо задачу в масиві за id з URL
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className={styles.notFound}>
        <p>❌ Задачу не знайдено.</p>
        <Link to="/tasks">← Назад до списку</Link>
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Іммутабельно оновлюємо задачу через spread — оригінал не мутуємо
    onUpdate({ ...task, status: e.target.value as TaskStatus });
  };

  const handleDelete = () => {
    onDelete(task.id);
    // Після видалення повертаємось на список задач
    navigate("/tasks");
  };

  return (
    <div className={styles.container}>
      <Link to="/tasks" className={styles.back}>
        ← Назад до списку
      </Link>

      <div className={styles.card}>
        <h2 className={styles.title}>{task.title}</h2>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.meta}>
          <div>
            <label>Пріоритет: </label>
            {task.priority === "high"
              ? "🔴 Високий"
              : task.priority === "medium"
                ? "🟡 Середній"
                : "🟢 Низький"}
          </div>
          <div>
            <label>Статус: </label>
            <select
              className={styles.select}
              value={task.status}
              onChange={handleStatusChange}
            >
              <option value="todo">📌 Очікує</option>
              <option value="in-progress">⚙️ В роботі</option>
              <option value="done">✅ Виконано</option>
            </select>
          </div>
          <div>
            <label>Створено: </label>
            {task.createdAt.toLocaleDateString("uk-UA")}
          </div>
        </div>

        <button className={styles.deleteBtn} onClick={handleDelete}>
          🗑️ Видалити задачу
        </button>
      </div>
    </div>
  );
}
