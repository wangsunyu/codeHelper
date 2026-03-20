import api from './api';
import type { IUser } from '../types';

export const authService = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<{ success: boolean; data: IUser }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: IUser }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ success: boolean; data: IUser }>('/auth/me'),

  refresh: () => api.post('/auth/refresh'),
};
