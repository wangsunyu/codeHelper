import api from './api';
import type { ISkill } from '../types';

export const favoriteService = {
  list: () => api.get<{ success: boolean; data: ISkill[] }>('/favorites'),
  add: (skillId: number) => api.post('/favorites', { skillId }),
  remove: (skillId: number) => api.delete(`/favorites/${skillId}`),
};
