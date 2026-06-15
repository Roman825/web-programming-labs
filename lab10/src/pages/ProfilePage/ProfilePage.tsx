import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <div>Завантаження...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>👤 Профіль</h2>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div><strong>ID:</strong> {user.id}</div>
        <div><strong>Email:</strong> {user.email}</div>
        {user.createdAt && (
          <div><strong>Зареєстровано:</strong> {new Date(user.createdAt).toLocaleString('uk-UA')}</div>
        )}
      </div>
    </div>
  );
}
