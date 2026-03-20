import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { rankingService } from '../services/ranking';
import { skillService } from '../services/skill';
import type { IRankingItem } from '../types';

const CATEGORIES = [
  { value: 'all', label: '全部' },
  { value: 'productivity', label: 'productivity' },
  { value: 'coding', label: 'coding' },
  { value: 'writing', label: 'writing' },
  { value: 'other', label: 'other' },
];

const RANK_STYLES: Record<number, string> = {
  1: 'border-[#f1d389] bg-[#fff7e8]',
  2: 'border-[#d8e2f1] bg-[#f4f8fd]',
  3: 'border-[#f0d2b6] bg-[#fff3e8]',
};

const BADGE_STYLES: Record<number, string> = {
  1: 'bg-[#d9a53d] text-white',
  2: 'bg-[#a6b6c8] text-white',
  3: 'bg-[#d58a4a] text-white',
};

function formatMetric(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function RankingsPage() {
  const [category, setCategory] = useState('all');
  const [items, setItems] = useState<IRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);

    rankingService
      .list({ category, limit: 20 })
      .then(res => setItems(res.data.data))
      .catch(() => {
        setItems([]);
        setHasError(true);
      })
      .finally(() => setLoading(false));
  }, [category]);

  function handleDownload(id: number) {
    window.location.href = skillService.downloadUrl(id);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-[64px] lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_112px] lg:items-start">
        <div>
          <p className="text-[13px] font-semibold font-ui uppercase tracking-[0.12em] text-[#baac90]">
            Top Skills
          </p>
          <h1 className="mt-3 text-[36px] leading-[1.25] font-medium font-display text-text-primary sm:text-[44px]">
            资源排行榜
          </h1>
          <p className="mt-4 text-[17px] leading-[1.8] font-ui text-text-secondary">
            按下载量查看当前最受欢迎的 Skills、MCP 配置与模板资源。
          </p>
        </div>

        <div className="justify-self-start rounded-[22px] border border-border bg-white px-5 py-5 shadow-[0_4px_16px_rgba(77,69,54,0.03)] lg:justify-self-end">
          <p className="text-[12px] font-semibold font-ui text-[#baac90]">本周新增</p>
          <p className="mt-1 text-[20px] font-semibold font-ui text-text-primary">
            {items.length ? `${items.length} 项` : '--'}
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {CATEGORIES.map(item => {
          const active = item.value === category;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`inline-flex h-[42px] items-center justify-center rounded-btn px-5 text-[15px] font-medium font-ui transition-colors ${
                active ? 'bg-[#1b2234] text-white' : 'bg-bg-surface text-text-secondary hover:bg-bg-muted'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        {hasError ? (
          <div className="rounded-[24px] border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            排行榜加载失败，请稍后重试。
          </div>
        ) : loading ? (
          <div className="rounded-[24px] border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            正在加载排行榜...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            当前分类下暂无排行数据。
          </div>
        ) : (
          items.slice(0, 5).map(item => {
            const rowStyle = RANK_STYLES[item.rank] || 'border-border bg-white';
            const badgeStyle = BADGE_STYLES[item.rank] || 'bg-bg-surface text-text-secondary';

            return (
              <div
                key={item.id}
                className={`flex flex-col gap-4 rounded-[24px] border px-5 py-4 shadow-[0_4px_14px_rgba(77,69,54,0.03)] md:flex-row md:items-center md:justify-between ${rowStyle}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`inline-flex h-[46px] w-[46px] items-center justify-center rounded-[14px] text-[24px] font-semibold font-ui ${badgeStyle}`}>
                    {item.rank}
                  </div>
                  <div>
                    <Link
                      to={`/skills/${item.id}`}
                      className="text-[18px] leading-[1.35] font-semibold font-ui text-text-primary hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] font-ui text-text-secondary">
                      <span>by {item.author_username}</span>
                      <span className="inline-flex rounded-btn bg-bg-surface px-3 py-1 text-[12px] font-medium lowercase text-[#a98a59]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  <span className="text-[18px] font-semibold font-ui text-text-primary">
                    {formatMetric(item.download_count)} 下载
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload(item.id)}
                    className="inline-flex h-[42px] items-center justify-center rounded-btn bg-[#171d2d] px-6 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
                  >
                    下载
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
