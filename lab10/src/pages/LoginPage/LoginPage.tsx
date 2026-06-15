import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(8, 'Мінімум 8 символів'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/profile');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setServerError('Невірний email або пароль');
      } else {
        setServerError('Помилка сервера. Спробуйте пізніше.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Вхід</h2>
      {serverError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 6, marginBottom: '1rem' }}>{serverError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Email</label>
          <input {...register('email')} type="email" placeholder="user@example.com" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '0.95rem' }} />
          {errors.email && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{errors.email.message}</span>}
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Пароль</label>
          <input {...register('password')} type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: '0.95rem' }} />
          {errors.password && <span style={{ color: '#dc2626', fontSize: '0.8rem' }}>{errors.password.message}</span>}
        </div>
        <button type="submit" disabled={isSubmitting} style={{ padding: '0.6rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
        Немає акаунта? <Link to="/register" style={{ color: '#3b82f6' }}>Зареєструватися</Link>
      </p>
    </div>
  );
}
