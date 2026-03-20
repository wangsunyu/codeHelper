import { useState, useEffect } from 'react';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { RankingRow } from '../components/common/RankingRow';
import { EmptyState } from '../components/common/EmptyState';
import { rankingService } from '../services/ranking';
import type { IRankingItem } from '../types';
import { CATEGORY_LABELS } from '../utils/format';

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export function RankingsPage() {
  const [category, setCategory] = useState('all');
  const [items, setItems] = useState<IRankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    rankingService.list({ category, limit: 20 })
      .then(res => setItems(res.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold font-display text-text-primary tracking-tight mb-1">排行榜</h1>
        <p className="text-sm text-text-secondary font-ui">按下载量排序的热门 Skills</p>
      </div>

      <div className="mb-6">
        <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-secondary font-ui text-sm">加载中...</div>
      ) : items.length === 0 ? (
        <EmptyState title="暂无数据" description="该分类下还没有 Skills" />
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {items.map(item => <RankingRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
