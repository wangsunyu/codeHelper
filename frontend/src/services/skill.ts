import api from './api';
import type { ISkill, IPageResult } from '../types';

export const skillService = {
  list: (params?: { category?: string; page?: number; limit?: number; sort?: string }) =>
    api.get<{ success: boolean; data: IPageResult<ISkill> }>('/skills', { params }),

  detail: (id: number) =>
    api.get<{ success: boolean; data: ISkill }>(`/skills/${id}`),

  publish: (formData: FormData) =>
    api.post<{ success: boolean; data: { id: number } }>('/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id: number) => api.delete(`/skills/${id}`),

  downloadUrl: (id: number) => `/api/v1/skills/${id}/download`,
};
