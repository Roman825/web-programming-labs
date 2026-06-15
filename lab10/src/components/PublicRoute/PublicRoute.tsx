import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

// PublicRoute рендерить /login та /register тільки для НЕ-аутентифікованих.
// Аутентифікований користувач перенаправляється на /profile.
export default function PublicRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: '2rem' }}>Завантаження...</div>;
  return user ? <Navigate to="/profile" replace /> : <Outlet />;
}
