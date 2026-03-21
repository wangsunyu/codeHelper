import api from './api';
import type { ISkill } from '../types';

export const favoriteService = {
  list: () => api.get<{ success: boolean; data: ISkill[] }>('/favorites'),
  check: (skillId: number) => api.get<{ success: boolean; data: { isFavorited: boolean } }>(`/favorites/${skillId}/status`),
  add: (skillId: number) => api.post('/favorites', { skillId }),
  remove: (skillId: number) => api.delete(`/favorites/${skillId}`),
};
