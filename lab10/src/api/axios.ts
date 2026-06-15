import axios from 'axios';

const TOKEN_KEY = 'access_token';

// Axios-екземпляр з базовим URL з .env
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Інтерсептор запиту: автоматично додає Authorization до кожного запиту
// Зчитує токен зі localStorage при кожному запиті — не при ініціалізації
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Інтерсептор відповіді: при 401 очищуємо токен (прострочений)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export const TOKEN_STORAGE_KEY = TOKEN_KEY;
