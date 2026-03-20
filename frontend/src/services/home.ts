import api from './api';
import type { IHomeData } from '../types';

export const homeService = {
  get: () => api.get<{ success: boolean; data: IHomeData }>('/home'),
};
