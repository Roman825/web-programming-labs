import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./TaskForm.module.css";

// Схема Zod описує правила валідації та одночасно генерує TypeScript-тип.
// Порожній рядок у description є валідним — поле необов'язкове.
const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Заголовок має містити щонайменше 3 символи")
    .max(100, "Заголовок не може перевищувати 100 символів"),
  description: z
    .string()
    .max(500, "Опис не може перевищувати 500 символів"),
  priority: z.enum(["low", "medium", "high"], {
    message: "Оберіть пріоритет",
  }),
});

// z.infer витягує TypeScript-тип зі схеми Zod — не треба дублювати вручну
export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
    },
  });

  // handleSubmit від RHF спочатку валідує поля через Zod,
  // і лише при успіху викликає нашу функцію з типізованими даними
  function handleValidSubmit(data: TaskFormData) {
    onSubmit(data);
    reset(); // скидаємо форму після успішного сабміту
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className={styles.form} noValidate>
      <h2 className={styles.formTitle}>Нова задача</h2>

      {/* Поле Заголовок */}
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Заголовок <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Введіть заголовок задачі..."
          className={errors.title ? styles.inputError : styles.input}
          {...register("title")}
        />
        {errors.title && (
          <span className={styles.error}>{errors.title.message}</span>
        )}
      </div>

      {/* Поле Опис (необов'язкове) */}
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Опис
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Необов'язковий опис..."
          className={errors.description ? styles.inputError : styles.input}
          {...register("description")}
        />
        {errors.description && (
          <span className={styles.error}>{errors.description.message}</span>
        )}
      </div>

      {/* Поле Пріоритет */}
      <div className={styles.field}>
        <label htmlFor="priority" className={styles.label}>
          Пріоритет <span className={styles.required}>*</span>
        </label>
        {/* Перша опція value="" потрібна, щоб Zod.enum показав помилку
            при незаповненому полі (порожній рядок не відповідає enum) */}
        <select
          id="priority"
          className={errors.priority ? styles.inputError : styles.input}
          {...register("priority")}
        >
          <option value="">Оберіть пріоритет</option>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
        {errors.priority && (
          <span className={styles.error}>{errors.priority.message}</span>
        )}
      </div>

      <button type="submit" className={styles.submit}>
        Додати задачу
      </button>
    </form>
  );
}
