import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "../TaskCard/TaskCard";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskList({ tasks, onDelete, onStatusChange }: TaskListProps) {
  // Стан "порожнього" списку — окреме повідомлення замість пустого <ul>
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Задач немає. Додайте першу задачу!</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        // key має бути стабільним унікальним id, а не індексом масиву —
        // інакше React не зможе коректно оновлювати DOM при видаленні/сортуванні
        <li key={task.id} className={styles.item}>
          <TaskCard
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </li>
      ))}
    </ul>
  );
}
