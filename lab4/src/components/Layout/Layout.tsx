import { NavLink, Outlet } from "react-router";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>📋 Task Manager</span>
        <nav className={styles.nav}>
          {/* end — щоб посилання не залишалось активним на /tasks/new або /tasks/:id */}
          <NavLink
            to="/tasks"
            end
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Всі задачі
          </NavLink>

          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            + Нова задача
          </NavLink>
        </nav>
      </header>

      {/* Outlet — місце, де рендерується активний дочірній маршрут */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
