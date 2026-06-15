import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User } from '../api/auth';
import { TOKEN_STORAGE_KEY } from '../api/axios';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // isLoading = true під час початкового завантаження — захищені маршрути
  // не редиректять поки не дізнаємось чи є токен
  const [isLoading, setIsLoading] = useState(true);

  // При монтуванні: якщо є токен у localStorage — завантажуємо поточного користувача
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token } = await authApi.login(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    const me = await authApi.me();
    setUser(me);
  };

  const register = async (email: string, password: string) => {
    return authApi.register(email, password);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
