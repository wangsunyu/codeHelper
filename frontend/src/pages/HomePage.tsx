import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { homeService } from '../services/home';
import { skillService } from '../services/skill';
import type { IHomeData, ISkill } from '../types';

function formatMetric(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString('en-US');
}

function formatMeta(skill: ISkill): string {
  return `by ${skill.author_username} · ${formatMetric(skill.download_count)} 下载 · ${skill.favorite_count} 收藏`;
}

function formatRankLine(skill: ISkill, rank: number): string {
  const category = skill.category.charAt(0).toUpperCase() + skill.category.slice(1);
  return `${String(rank).padStart(2, '0')} ${category} · ${skill.title}`;
}

function getSkillDescription(skill: ISkill): string {
  return skill.description?.trim() || '社区精选技能包，下载后可直接复用到你的 AI 助手工作流中。';
}

export function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<IHomeData | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    homeService.get()
      .then(res => setData(res.data.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    navigate(nextQuery ? `/skills?q=${encodeURIComponent(nextQuery)}` : '/skills');
  }

  function handleSkillAction(id: number) {
    window.location.href = skillService.downloadUrl(id);
  }

  const hotSkills = data?.hotSkills ?? [];
  const rankingItems = data?.rankings ?? [];
  const stats = data?.stats;
  const weeklyTopList = rankingItems.slice(0, 3);
  const downloadMetric = stats ? `${formatMetric(stats.totalDownloads)}+` : '--';
  const authorMetric = stats ? stats.activeAuthors.toLocaleString('en-US') : '--';
  const platformStats = stats
    ? [
        { value: stats.totalSkills.toLocaleString('en-US'), label: '总 Skills 数' },
        { value: formatMetric(stats.totalDownloads), label: '总下载数' },
        { value: stats.totalUsers.toLocaleString('en-US'), label: '总用户数' },
      ]
    : [];

  return (
    <div className="bg-bg-page text-text-primary">
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_376px] lg:px-[72px] lg:py-[72px]">
          <div className="pt-6 lg:pt-12">
            <p className="mb-10 text-[16px] font-medium font-ui text-primary">
              发现高质量 AI 助手技能包
            </p>
            <h1 className="max-w-[760px] text-[42px] leading-[1.28] font-medium font-display text-text-primary sm:text-[54px] lg:text-[64px]">
              让每一个 AI 助手都更懂你的工作流
            </h1>
            <p className="mt-8 max-w-[840px] text-[18px] leading-[1.9] font-ui text-text-secondary sm:text-[20px]">
              上传、发现、下载可复用的 MCP 配置与 Skills，和社区一起把高价值的 AI 助手能力沉淀下来。
            </p>
            <form
              onSubmit={handleSearch}
              className="mt-10 flex w-full max-w-[760px] items-center gap-3 rounded-search border border-border bg-white p-[10px] shadow-[0_2px_10px_rgba(77,69,54,0.03)]"
            >
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="搜索 Skills、作者、分类..."
                className="h-[52px] flex-1 border-none bg-transparent px-4 text-[16px] font-ui text-text-primary outline-none placeholder:text-[#b9b4ad]"
              />
              <button
                type="submit"
                className="inline-flex h-[52px] items-center justify-center rounded-btn bg-primary px-8 text-[16px] font-medium font-ui text-white transition-opacity hover:opacity-90"
              >
                搜索
              </button>
            </form>
          </div>

          <aside className="self-start rounded-card border border-border bg-white p-7 shadow-[0_8px_24px_rgba(77,69,54,0.04)] lg:mt-8">
            <h2 className="text-[28px] leading-[1.35] font-medium font-display text-text-primary">
              本周热门榜单
            </h2>
            <p className="mt-5 text-[16px] leading-[1.8] font-ui text-text-secondary">
              精选最受欢迎的 Productivity、Coding、Writing 类 Skills，下载后即可直接复用。
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-[20px] bg-bg-surface px-6 py-5">
                <div className="text-[22px] font-semibold font-ui text-text-primary">{downloadMetric}</div>
                <div className="mt-2 text-[14px] font-ui text-text-secondary">累计下载</div>
              </div>
              <div className="rounded-[20px] bg-bg-surface px-6 py-5">
                <div className="text-[22px] font-semibold font-ui text-text-primary">{authorMetric}</div>
                <div className="mt-2 text-[14px] font-ui text-text-secondary">活跃作者</div>
              </div>
            </div>
            <div className="mt-7 space-y-3 text-[17px] leading-[1.6] font-ui text-text-primary">
              {weeklyTopList.length > 0 ? (
                weeklyTopList.map((item, index) => (
                  <Link key={item.id} to={`/skills/${item.id}`} className="block hover:text-primary">
                    {formatRankLine(item, index + 1)}
                  </Link>
                ))
              ) : (
                <p className="text-text-secondary">{isLoading ? '正在加载榜单...' : '暂无榜单数据'}</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 lg:px-[72px] lg:py-16">
        <section>
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="text-[34px] leading-[1.3] font-medium font-display text-text-primary">
              热门 Skills
            </h2>
            <Link className="text-[16px] font-medium font-ui text-primary" to="/skills">
              查看全部
            </Link>
          </div>

          {hasError ? (
            <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
              首页数据加载失败，请确认后端服务和数据库已启动。
            </div>
          ) : hotSkills.length > 0 ? (
            <div className="grid gap-18 md:grid-cols-2 xl:grid-cols-3">
              {hotSkills.map(skill => (
                <article
                  key={skill.id}
                  className="min-h-[236px] rounded-card border border-border bg-white px-6 py-5 shadow-[0_4px_16px_rgba(77,69,54,0.03)]"
                >
                  <p className="text-[14px] font-medium font-ui lowercase tracking-[-0.01em] text-primary">
                    {skill.category}
                  </p>
                  <h3 className="mt-4 text-[24px] leading-[1.35] font-medium font-display text-text-primary">
                    {skill.title}
                  </h3>
                  <p className="mt-5 line-clamp-2 text-[16px] leading-[1.85] font-ui text-text-secondary">
                    {getSkillDescription(skill)}
                  </p>
                  <p className="mt-5 text-[15px] font-ui text-text-secondary">
                    {formatMeta(skill)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSkillAction(skill.id)}
                    className="mt-6 inline-flex h-[48px] items-center justify-center rounded-btn bg-primary px-7 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
                  >
                    下载
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
              {isLoading ? '正在加载热门 Skills...' : '暂无已发布的 Skills 数据'}
            </div>
          )}
        </section>

        <section className="mt-18">
          <h2 className="text-[34px] leading-[1.3] font-medium font-display text-text-primary">
            排行榜预览
          </h2>
          <div className="mt-8 space-y-3">
            {rankingItems.length > 0 ? (
              rankingItems.map(item => (
                <Link
                  key={item.id}
                  to={`/skills/${item.id}`}
                  className="flex min-h-[68px] items-center rounded-[22px] border border-border bg-white px-6 text-[16px] font-medium font-ui text-text-primary shadow-[0_2px_10px_rgba(77,69,54,0.02)] transition-colors hover:bg-[#fcfbf8]"
                >
                  <span className="mr-3">#{item.rank}</span>
                  <span>{item.title}</span>
                  <span className="mx-3 text-text-secondary">·</span>
                  <span>{formatMetric(item.download_count)} 下载</span>
                </Link>
              ))
            ) : (
              <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
                {isLoading ? '正在加载排行榜...' : '暂无排行榜数据'}
              </div>
            )}
          </div>
        </section>

        <section className="mt-18">
          <h2 className="text-[34px] leading-[1.3] font-medium font-display text-text-primary">
            平台统计
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {platformStats.length > 0 ? (
              platformStats.map(item => (
                <article
                  key={item.label}
                  className="rounded-card border border-border bg-white px-6 py-7 shadow-[0_4px_16px_rgba(77,69,54,0.03)]"
                >
                  <div className="text-[28px] font-semibold font-ui text-text-primary">{item.value}</div>
                  <div className="mt-3 text-[15px] font-ui text-text-secondary">{item.label}</div>
                </article>
              ))
            ) : (
              <div className="rounded-card border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary md:col-span-3">
                {isLoading ? '正在加载统计数据...' : '暂无平台统计数据'}
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
