import api from './api';
import type { IRankingItem } from '../types';

export const rankingService = {
  list: (params?: { category?: string; limit?: number }) =>
    api.get<{ success: boolean; data: IRankingItem[] }>('/rankings/skills', { params }),
};
