import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute рендерить дочірні маршрути тільки для аутентифікованих.
// Поки isLoading=true — нічого не рендеримо (чекаємо GET /auth/me).
// Це запобігає хибному редиректу одразу після завантаження сторінки.
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: '2rem' }}>Завантаження...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
