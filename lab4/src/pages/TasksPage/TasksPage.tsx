import type { Task } from "../../types/task";
import TaskCard from "../../components/TaskCard/TaskCard";

interface TasksPageProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export default function TasksPage({ tasks, onDelete }: TasksPageProps) {
  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem", fontSize: "1.3rem", fontWeight: 700 }}>
        📋 Задачі ({tasks.length})
      </h2>

      {tasks.length === 0 && (
        <p style={{ color: "#94a3b8", marginTop: "1rem" }}>
          Задач поки немає. Створіть першу!
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
