import { api } from './axios';

export interface User {
  id: number;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
}

export const authApi = {
  register: (email: string, password: string) =>
    api.post<User>('/auth/register', { email, password }).then(r => r.data),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data),

  me: () =>
    api.get<User>('/auth/me').then(r => r.data),
};
