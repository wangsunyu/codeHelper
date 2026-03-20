import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { skillService } from '../services/skill';
import type { ISkill } from '../types';

const CATEGORIES = [
  { value: 'all', label: '全部' },
  { value: 'productivity', label: 'productivity' },
  { value: 'coding', label: 'coding' },
  { value: 'writing', label: 'writing' },
  { value: 'other', label: 'other' },
];

const LIMIT = 6;

function formatMetric(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function totalPages(total: number) {
  return Math.max(1, Math.ceil(total / LIMIT));
}

export function SkillsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page') || '1');

  const [skills, setSkills] = useState<ISkill[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);

    skillService
      .list({ category: category === 'all' ? undefined : category, page, limit: LIMIT, sort: 'download_count' })
      .then(res => {
        setSkills(res.data.data.rows);
        setTotal(res.data.data.total);
      })
      .catch(() => {
        setSkills([]);
        setHasError(true);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  function updateParams(nextCategory: string, nextPage: number) {
    setSearchParams({
      category: nextCategory,
      page: String(nextPage),
    });
  }

  function handleDownload(id: number) {
    window.location.href = skillService.downloadUrl(id);
  }

  const pages = Array.from({ length: totalPages(total) }, (_, index) => index + 1);

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-[64px] lg:py-10">
      <div className="flex flex-wrap items-center gap-3">
        {CATEGORIES.map(item => {
          const active = item.value === category;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => updateParams(item.value, 1)}
              className={`inline-flex h-[42px] items-center justify-center rounded-btn px-6 text-[15px] font-medium font-ui transition-colors ${
                active
                  ? 'bg-primary text-white'
                  : 'bg-bg-surface text-text-primary hover:bg-bg-muted'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <h1 className="text-[32px] leading-[1.3] font-medium font-display text-text-primary sm:text-[38px]">
          探索最受欢迎的 Skills
        </h1>
        <p className="mt-5 text-[18px] leading-[1.8] font-ui text-text-secondary">
          按分类筛选并快速找到适合你的 AI 助手能力包。
        </p>
      </div>

      <div className="mt-10">
        {hasError ? (
          <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            Skills 列表加载失败，请稍后重试。
          </div>
        ) : loading ? (
          <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            正在加载 Skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            当前分类下暂无 Skills。
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {skills.map(skill => (
                <article
                  key={skill.id}
                  className="min-h-[198px] rounded-[24px] border border-border bg-white px-5 py-5 shadow-[0_4px_14px_rgba(77,69,54,0.03)]"
                >
                  <Link to={`/skills/${skill.id}`} className="block">
                    <h2 className="text-[22px] leading-[1.35] font-medium font-display text-text-primary">
                      {skill.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-[13px] font-medium font-ui lowercase text-primary">
                    {skill.category}
                  </p>
                  <p className="mt-4 line-clamp-2 text-[16px] leading-[1.8] font-ui text-text-secondary">
                    {skill.description || '社区精选技能包，适合直接下载复用。'}
                  </p>
                  <p className="mt-4 text-[15px] font-ui text-text-secondary">
                    {skill.author_username} · {formatMetric(skill.download_count)} 下载 · {skill.favorite_count} 收藏
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDownload(skill.id)}
                    className="mt-5 inline-flex h-[46px] items-center justify-center rounded-btn bg-primary px-6 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
                  >
                    下载
                  </button>
                </article>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {pages.map(item => {
                const active = item === page;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateParams(category, item)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-medium font-ui transition-colors ${
                      active
                        ? 'bg-primary text-white'
                        : 'bg-bg-surface text-text-primary hover:bg-bg-muted'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
