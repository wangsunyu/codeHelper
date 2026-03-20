import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillCard } from '../components/common/SkillCard';
import { EmptyState } from '../components/common/EmptyState';
import { favoriteService } from '../services/favorite';
import type { ISkill } from '../types';

export function FavoritesPage() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    favoriteService.list()
      .then(res => setSkills(res.data.data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold font-display text-text-primary tracking-tight mb-1">
          我的收藏
          {skills.length > 0 && (
            <span className="ml-3 text-lg font-normal text-text-secondary">{skills.length} 个</span>
          )}
        </h1>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-secondary font-ui text-sm">加载中...</div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon="♥"
          title="还没有收藏"
          description="去发现你喜欢的 Skills，点击收藏按钮保存到这里"
          action={{ label: '浏览 Skills', onClick: () => navigate('/skills') }}
        />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
        </div>
      )}
    </div>
  );
}
