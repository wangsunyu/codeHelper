export interface IUser {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface ISkill {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  category: 'productivity' | 'coding' | 'writing' | 'other';
  file_name: string;
  file_size: number;
  download_count: number;
  favorite_count: number;
  status: string;
  created_at: string;
  author_username: string;
}

export interface IFavorite {
  id: number;
  user_id: number;
  skill_id: number;
  created_at: string;
}

export interface IRankingItem extends ISkill {
  rank: number;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface IPageResult<T> {
  rows: T[];
  total: number;
}

export interface IHomeData {
  hotSkills: ISkill[];
  rankings: IRankingItem[];
  stats: {
    totalSkills: number;
    totalDownloads: number;
    totalUsers: number;
  };
}
