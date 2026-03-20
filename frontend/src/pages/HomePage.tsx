import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { homeService } from '../services/home';
import { SkillCard } from '../components/common/SkillCard';
import { RankingRow } from '../components/common/RankingRow';
import type { IHomeData } from '../types';
import { formatNumber } from '../utils/format';

export function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState<IHomeData | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    homeService.get().then(res => setData(res.data.data)).catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/skills?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Hero */}
      <section className="px-20 py-20 bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-[48px] font-display font-medium text-text-primary tracking-[-1px] leading-[1.1] max-w-2xl">
            发现和分享最好的<br />AI Skills 配置
          </h1>
          <p className="text-[18px] text-text-secondary font-ui max-w-lg leading-relaxed">
            上传你的 Skills 配置，下载社区精选资源，让 AI 助手更强大。
          </p>
          <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-lg mt-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索 Skills..."
              className="flex-1 h-12 px-5 rounded-search border border-border bg-bg-surface text-sm font-ui
                text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <button type="submit"
              className="h-12 px-6 rounded-btn bg-[#2D2D2D] text-white text-sm font-medium font-ui hover:opacity-80 transition-opacity">
              搜索
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-20">
        {/* 统计数据 */}
        {data?.stats && (
          <section className="py-10 border-b border-border-subtle">
            <div className="flex items-center gap-16">
              {[
                { label: 'Skills 总数', value: data.stats.totalSkills },
                { label: '总下载次数', value: data.stats.totalDownloads },
                { label: '注册用户', value: data.stats.totalUsers },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-[28px] font-semibold font-mono text-text-primary">{formatNumber(stat.value)}</p>
                  <p className="text-sm text-text-secondary font-ui mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 热门 Skills */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-semibold font-display text-text-primary tracking-tight">热门 Skills</h2>
            <Link to="/skills" className="text-sm font-ui text-text-secondary hover:text-text-primary transition-colors">
              查看全部 →
            </Link>
          </div>
          {data?.hotSkills && data.hotSkills.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {data.hotSkills.slice(0, 6).map(skill => <SkillCard key={skill.id} skill={skill} />)}
            </div>
          ) : (
            <div className="py-16 text-center text-text-secondary font-ui text-sm">暂无数据</div>
          )}
        </section>

        {/* 排行榜预览 */}
        <section className="py-12 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-semibold font-display text-text-primary tracking-tight">下载排行榜</h2>
            <Link to="/rankings" className="text-sm font-ui text-text-secondary hover:text-text-primary transition-colors">
              查看完整榜单 →
            </Link>
          </div>
          {data?.rankings && data.rankings.length > 0 ? (
            <div className="flex flex-col gap-3 max-w-2xl">
              {data.rankings.map(item => <RankingRow key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="py-16 text-center text-text-secondary font-ui text-sm">暂无数据</div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-bg-dark text-white mt-12">
        <div className="max-w-[1440px] mx-auto px-20 py-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-icon bg-primary flex items-center justify-center text-white text-xs font-bold font-ui">A</div>
            <span className="text-[18px] font-semibold font-display tracking-tight">AISkills</span>
          </div>
          <p className="text-sm text-white/40 font-ui">© 2026 AISkills Platform. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-ui text-white/60">
            <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
            <Link to="/rankings" className="hover:text-white transition-colors">排行榜</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
