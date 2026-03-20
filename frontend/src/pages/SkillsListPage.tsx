import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SkillCard } from '../components/common/SkillCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { skillService } from '../services/skill';
import type { ISkill } from '../types';
import { CATEGORY_LABELS } from '../utils/format';

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
const LIMIT = 12;

export function SkillsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1');

  const [skills, setSkills] = useState<ISkill[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    skillService.list({ category: category === 'all' ? undefined : category, page, limit: LIMIT })
      .then(res => {
        setSkills(res.data.data.rows);
        setTotal(res.data.data.total);
      })
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  function handleCategoryChange(val: string) {
    setSearchParams({ category: val, page: '1' });
  }

  function handlePageChange(p: number) {
    setSearchParams({ category, page: String(p) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold font-display text-text-primary tracking-tight mb-1">Skills 资源库</h1>
        <p className="text-sm text-text-secondary font-ui">发现社区分享的 AI 技能配置</p>
      </div>

      <div className="mb-6">
        <CategoryTabs categories={CATEGORIES} active={category} onChange={handleCategoryChange} />
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-secondary font-ui text-sm">加载中...</div>
      ) : skills.length === 0 ? (
        <EmptyState title="暂无资源" description="该分类下还没有 Skills，来发布第一个吧" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-5 mb-10">
            {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
          </div>
          <Pagination page={page} total={total} limit={LIMIT} onChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
