import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header style={{ background: '#1e293b', padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ color: '#f1f5f9', fontWeight: 700, textDecoration: 'none' }}>
          🔐 Auth App
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{user.email}</span>
              <button onClick={handleLogout} style={{ padding: '0.4rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Увійти</Link>
              <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Зареєструватися</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ maxWidth: 480, margin: '3rem auto', padding: '0 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
