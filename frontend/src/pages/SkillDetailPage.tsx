import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { favoriteService } from '../services/favorite';
import { skillService } from '../services/skill';
import { useAuth } from '../hooks/useAuth';
import type { ISkill } from '../types';
import { formatDate, formatFileSize, formatNumber } from '../utils/format';

function formatDownloadMetric(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function fileTypeLabel(fileName: string) {
  const ext = fileName.split('.').pop()?.toUpperCase();
  return ext ? `${ext} / Skill` : 'Skill';
}

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    skillService
      .detail(Number(id))
      .then(res => setSkill(res.data.data))
      .catch(() => navigate('/skills'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!id || !user) return;
    favoriteService.check(Number(id))
      .then(res => setIsFavorited(res.data.data.isFavorited))
      .catch(() => {});
  }, [id, user]);

  async function handleFavorite() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!skill) return;

    setFavoriteLoading(true);
    setActionError('');
    try {
      if (isFavorited) {
        await favoriteService.remove(skill.id);
        setSkill(current => current ? { ...current, favorite_count: Math.max(0, current.favorite_count - 1) } : current);
        setIsFavorited(false);
      } else {
        await favoriteService.add(skill.id);
        setSkill(current => current ? { ...current, favorite_count: current.favorite_count + 1 } : current);
        setIsFavorited(true);
      }
    } catch {
      setActionError('操作失败，请稍后重试');
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function handleDelete() {
    if (!skill) return;
    if (!window.confirm('确定删除这个 Skill？')) return;

    try {
      await skillService.remove(skill.id);
      navigate('/skills');
    } catch {
      setActionError('删除失败，请稍后重试');
    }
  }

  function handleDownload() {
    if (!skill) return;
    window.location.href = skillService.downloadUrl(skill.id);
  }

  if (loading) {
    return (
      <div className="px-5 py-14 text-center text-[16px] font-ui text-text-secondary sm:px-8 lg:px-[64px]">
        正在加载详情...
      </div>
    );
  }

  if (!skill) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-[64px] lg:py-10">
      <div className="mb-6 flex items-center gap-3 text-[14px] font-medium font-ui text-text-secondary">
        <Link to="/" className="hover:text-text-primary">首页</Link>
        <span>›</span>
        <Link to="/skills" className="hover:text-text-primary">Skills</Link>
        <span>›</span>
        <span className="text-text-primary">{skill.title}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_4px_18px_rgba(77,69,54,0.03)] lg:px-7 lg:py-7">
            <div className="inline-flex rounded-btn bg-bg-surface px-4 py-2 text-[13px] font-medium font-ui lowercase text-primary">
              {skill.category}
            </div>

            <h1 className="mt-6 text-[32px] leading-[1.3] font-medium font-display text-text-primary sm:text-[38px]">
              {skill.title}
            </h1>

            <p className="mt-5 max-w-[820px] text-[16px] leading-[1.85] font-ui text-text-secondary sm:text-[18px]">
              {skill.description || '为当前工作流准备的可复用 Skill 配置，下载后即可直接接入你的 AI 助手环境。'}
            </p>

            <p className="mt-5 text-[15px] font-ui text-text-secondary">
              发布时间：{formatDate(skill.created_at)} · 最近更新：{formatDate(skill.created_at)}
            </p>

            <div className="mt-7">
              <h2 className="text-[18px] font-semibold font-ui text-text-primary">适用场景</h2>
              <ul className="mt-4 space-y-3 text-[16px] leading-[1.8] font-ui text-text-secondary">
                <li>• 用于 {skill.category} 类 AI 助手工作流复用</li>
                <li>• 支持团队共享下载与快速接入</li>
                <li>• 适合与 MCP 配置和提示词模板一起使用</li>
              </ul>
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_4px_18px_rgba(77,69,54,0.03)] lg:px-7 lg:py-7">
            <h2 className="text-[28px] leading-[1.3] font-medium font-display text-text-primary">
              文件信息
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.5fr_0.55fr_0.5fr]">
              <div className="rounded-[18px] bg-bg-surface px-5 py-4">
                <p className="text-[14px] font-medium font-ui text-text-secondary">文件名</p>
                <p className="mt-2 break-all text-[20px] font-semibold font-ui text-text-primary">
                  {skill.file_name}
                </p>
              </div>
              <div className="rounded-[18px] bg-bg-surface px-5 py-4">
                <p className="text-[14px] font-medium font-ui text-text-secondary">大小</p>
                <p className="mt-2 text-[20px] font-semibold font-ui text-text-primary">
                  {formatFileSize(skill.file_size)}
                </p>
              </div>
              <div className="rounded-[18px] bg-bg-surface px-5 py-4">
                <p className="text-[14px] font-medium font-ui text-text-secondary">类型</p>
                <p className="mt-2 text-[20px] font-semibold font-ui text-text-primary">
                  {fileTypeLabel(skill.file_name)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-[18px] font-semibold font-ui text-text-primary">适配说明</h3>
              <p className="mt-3 text-[16px] leading-[1.85] font-ui text-text-secondary">
                支持 Codex / Claude Code / Cursor 等具备 MCP 或可注入 Skills 的 AI 助手环境。建议在团队仓库中搭配代码评审规范一起使用。
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_4px_18px_rgba(77,69,54,0.03)]">
            <h2 className="text-[26px] leading-[1.3] font-medium font-display text-text-primary">
              作者信息
            </h2>
            <p className="mt-5 text-[20px] font-semibold font-ui text-text-primary">
              {skill.author_username} Studio
            </p>
            <p className="mt-4 text-[16px] leading-[1.8] font-ui text-text-secondary">
              专注于工程效率和团队协作型 AI Skills 的独立作者。
            </p>
            <p className="mt-5 text-[15px] font-ui text-text-secondary">
              已发布 1 个 Skills · 累计下载 {formatDownloadMetric(skill.download_count)}
            </p>
          </section>

          <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_4px_18px_rgba(77,69,54,0.03)]">
            <h2 className="text-[26px] leading-[1.3] font-medium font-display text-text-primary">
              立即获取
            </h2>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-6 inline-flex h-[52px] w-full items-center justify-center rounded-btn bg-primary px-6 text-[16px] font-medium font-ui text-white transition-opacity hover:opacity-90"
            >
              下载 Skills
            </button>

            <button
              type="button"
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className="mt-4 inline-flex h-[52px] w-full items-center justify-center rounded-btn bg-bg-surface px-6 text-[16px] font-medium font-ui text-text-primary transition-colors hover:bg-bg-muted disabled:opacity-60"
            >
              {favoriteLoading ? '处理中...' : isFavorited ? '已收藏到我的清单' : '收藏到我的清单'}
            </button>

            {actionError ? (
              <p className="mt-3 text-[13px] font-ui text-red-500">{actionError}</p>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-[18px] bg-bg-surface px-4 py-4">
                <div className="text-[18px] font-semibold font-ui text-text-primary">
                  {formatDownloadMetric(skill.download_count)}
                </div>
                <div className="mt-1 text-[14px] font-ui text-text-secondary">下载数</div>
              </div>
              <div className="rounded-[18px] bg-bg-surface px-4 py-4">
                <div className="text-[18px] font-semibold font-ui text-text-primary">
                  {formatNumber(skill.favorite_count)}
                </div>
                <div className="mt-1 text-[14px] font-ui text-text-secondary">收藏数</div>
              </div>
            </div>

            <p className="mt-5 text-[15px] leading-[1.8] font-ui text-text-secondary">
              下载后包含 Skill 配置、推荐提示词和团队接入说明。
            </p>

            {user && user.id === skill.user_id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="mt-5 inline-flex h-[46px] w-full items-center justify-center rounded-btn bg-[#d65f5f] px-6 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
              >
                删除这个 Skill
              </button>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
