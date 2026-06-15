import { useState, useEffect } from 'react';
import axios from 'axios';

// У Docker: Nginx проксіює /api/* → backend:3000/*
// Локально: Vite proxy /api/* → localhost:3000/*
const API = '/api';

interface Task { id: number; title: string; status: string; priority: string; createdAt: string; }

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    axios.get<Task[]>(`${API}/tasks`)
      .then(r => setTasks(r.data))
      .catch(() => setError('Не вдалось підключитись до backend'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await axios.post(`${API}/tasks`, { title: title.trim(), priority: 'medium' });
    setTitle('');
    load();
  };

  const remove = async (id: number) => {
    await axios.delete(`${API}/tasks/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>📋 Task Manager</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        🐳 Запущено в Docker контейнері
      </p>

      {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 6, marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={add} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Нова задача..."
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 6 }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          Додати
        </button>
      </form>

      {loading ? <p style={{ color: '#94a3b8' }}>Завантаження...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.length === 0 && <p style={{ color: '#94a3b8' }}>Задач поки немає.</p>}
          {tasks.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <span style={{ flex: 1 }}>{t.title}</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.status}</span>
              <button onClick={() => remove(t.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.3rem 0.5rem', cursor: 'pointer' }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
