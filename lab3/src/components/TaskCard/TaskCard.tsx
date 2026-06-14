import clsx from "clsx";
import type { Task, TaskStatus } from "../../types/task";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const PRIORITY_LABELS: Record<Task["priority"], string> = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Нова",
  "in-progress": "В роботі",
  done: "Виконано",
};

// Форматуємо дату у формат дд.мм.рррр
function formatDate(date: Date): string {
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  // clsx об'єднує класи умовно: базовий .card + клас пріоритету
  const cardClass = clsx(styles.card, {
    [styles.cardLow]: task.priority === "low",
    [styles.cardMedium]: task.priority === "medium",
    [styles.cardHigh]: task.priority === "high",
  });

  return (
    <div className={cardClass}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.priorityBadge}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {/* Опис показуємо тільки якщо він непорожній */}
      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.meta}>
        <span>📅 {formatDate(task.createdAt)}</span>
        <span>Статус: {STATUS_LABELS[task.status]}</span>
      </div>

      <div className={styles.actions}>
        {/* e.target.value має тип string — кастуємо до TaskStatus.
            Це безпечно, бо <option> містять лише допустимі значення. */}
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as TaskStatus)
          }
          className={styles.select}
        >
          <option value="todo">Нова</option>
          <option value="in-progress">В роботі</option>
          <option value="done">Виконано</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className={styles.deleteBtn}
        >
          Видалити
        </button>
      </div>
    </div>
  );
}
