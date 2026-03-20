import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { skillService } from '../services/skill';
import { favoriteService } from '../services/favorite';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import type { ISkill } from '../types';
import { formatFileSize, formatDate, formatNumber, CATEGORY_LABELS } from '../utils/format';

export function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<ISkill | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    skillService.detail(parseInt(id))
      .then(res => setSkill(res.data.data))
      .catch(() => navigate('/skills'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleFavorite() {
    if (!user) return navigate('/login');
    if (!skill) return;
    setFavLoading(true);
    try {
      if (isFavorited) {
        await favoriteService.remove(skill.id);
        setIsFavorited(false);
        setSkill(s => s ? { ...s, favorite_count: s.favorite_count - 1 } : s);
      } else {
        await favoriteService.add(skill.id);
        setIsFavorited(true);
        setSkill(s => s ? { ...s, favorite_count: s.favorite_count + 1 } : s);
      }
    } finally {
      setFavLoading(false);
    }
  }

  function handleDownload() {
    if (!skill) return;
    window.location.href = skillService.downloadUrl(skill.id);
  }

  if (loading) return <div className="py-20 text-center text-text-secondary font-ui text-sm">加载中...</div>;
  if (!skill) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-20 py-10">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm font-ui text-text-secondary mb-8">
        <Link to="/" className="hover:text-text-primary transition-colors">首页</Link>
        <span>/</span>
        <Link to="/skills" className="hover:text-text-primary transition-colors">Skills</Link>
        <span>/</span>
        <span className="text-text-primary truncate max-w-xs">{skill.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* 主内容区 */}
        <div className="col-span-2 flex flex-col gap-6">
          <div>
            <span className="text-[11px] font-medium font-ui px-3 py-1 rounded-badge bg-primary-tint text-primary inline-block mb-3">
              {CATEGORY_LABELS[skill.category]}
            </span>
            <h1 className="text-[28px] font-semibold font-display text-text-primary tracking-tight leading-tight mb-3">
              {skill.title}
            </h1>
            {skill.description && (
              <p className="text-[15px] text-text-body font-ui leading-relaxed">{skill.description}</p>
            )}
          </div>

          {/* 文件信息 */}
          <div className="bg-white rounded-card border border-border p-6">
            <h3 className="text-sm font-semibold font-ui text-text-primary mb-4">文件信息</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-ui">
              <div><span className="text-text-secondary">文件名</span><p className="text-text-primary mt-1 font-mono text-xs">{skill.file_name}</p></div>
              <div><span className="text-text-secondary">文件大小</span><p className="text-text-primary mt-1">{formatFileSize(skill.file_size)}</p></div>
              <div><span className="text-text-secondary">下载次数</span><p className="text-text-primary mt-1">{formatNumber(skill.download_count)}</p></div>
              <div><span className="text-text-secondary">发布时间</span><p className="text-text-primary mt-1">{formatDate(skill.created_at)}</p></div>
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="flex flex-col gap-4">
          {/* 操作区 */}
          <div className="bg-white rounded-card border border-border p-6 flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={handleDownload}>
              ↓ 下载文件
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              loading={favLoading}
              onClick={handleFavorite}
            >
              {isFavorited ? '♥ 已收藏' : '♡ 收藏'}
            </Button>
            <div className="flex justify-between text-xs text-text-secondary font-ui pt-2 border-t border-border-subtle">
              <span>↓ {formatNumber(skill.download_count)} 次下载</span>
              <span>♥ {formatNumber(skill.favorite_count)} 次收藏</span>
            </div>
          </div>

          {/* 作者卡片 */}
          <div className="bg-white rounded-card border border-border p-6">
            <h3 className="text-sm font-semibold font-ui text-text-primary mb-3">作者</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center text-sm font-semibold font-ui text-text-primary">
                {skill.author_username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium font-ui text-text-primary">{skill.author_username}</span>
            </div>
          </div>

          {/* 作者删除 */}
          {user && user.id === skill.user_id && (
            <Button variant="danger" size="md" className="w-full" onClick={async () => {
              if (!confirm('确定删除这个 Skill？')) return;
              await skillService.remove(skill.id);
              navigate('/skills');
            }}>
              删除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
