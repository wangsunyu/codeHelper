import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/favorite';
import { skillService } from '../services/skill';
import type { ISkill } from '../types';

const HERO_GRADIENTS = [
  'from-[#f0e8cf] via-[#edf2e9] to-[#d7e5dd]',
  'from-[#dceaf3] via-[#f1eee7] to-[#ebe3d4]',
  'from-[#ebe1c8] via-[#eef2db] to-[#dce6cf]',
];

function formatMetric(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function cardMeta(skill: ISkill) {
  if (skill.download_count >= skill.favorite_count) {
    return `${formatMetric(skill.download_count)} 下载`;
  }

  return `${formatMetric(skill.favorite_count)} 收藏`;
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setHasError(false);

    favoriteService
      .list()
      .then(res => setSkills(res.data.data))
      .catch(() => {
        setSkills([]);
        setHasError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleDownload(id: number) {
    window.location.href = skillService.downloadUrl(id);
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-[64px] lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_112px] lg:items-start">
        <div>
          <p className="text-[13px] font-semibold font-ui uppercase tracking-[0.12em] text-[#baac90]">
            My Favorites
          </p>
          <h1 className="mt-3 text-[36px] leading-[1.25] font-medium font-display text-text-primary sm:text-[44px]">
            我的收藏
          </h1>
          <p className="mt-4 text-[17px] leading-[1.8] font-ui text-text-secondary">
            收藏你想稍后查看、下载或继续研究的优质 AI 助手资源。
          </p>
        </div>

        <div className="justify-self-start rounded-[22px] border border-border bg-white px-5 py-5 shadow-[0_4px_16px_rgba(77,69,54,0.03)] lg:justify-self-end">
          <p className="text-[12px] font-semibold font-ui text-[#baac90]">当前收藏</p>
          <p className="mt-1 text-[20px] font-semibold font-ui text-text-primary">
            {loading ? '--' : `${skills.length} 项`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {hasError ? (
          <div className="rounded-[24px] border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            收藏列表加载失败，请稍后重试。
          </div>
        ) : loading ? (
          <div className="rounded-[24px] border border-border bg-white px-6 py-10 text-[16px] font-ui text-text-secondary">
            正在加载收藏资源...
          </div>
        ) : skills.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill, index) => (
                <article
                  key={skill.id}
                  className="rounded-[24px] border border-border bg-white p-4 shadow-[0_4px_14px_rgba(77,69,54,0.03)]"
                >
                  <div className={`h-[148px] rounded-[18px] bg-gradient-to-br ${HERO_GRADIENTS[index % HERO_GRADIENTS.length]}`} />
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-[12px] font-semibold font-ui text-[#c08a3f]">
                      <span>{skill.category === 'coding' ? 'MCP' : 'Skill'}</span>
                      <span className="text-text-secondary">•</span>
                      <span>{skill.category === 'productivity' ? '工作流' : skill.category === 'other' ? 'Prompt' : '效率'}</span>
                    </div>
                    <Link
                      to={`/skills/${skill.id}`}
                      className="mt-3 block text-[18px] leading-[1.4] font-semibold font-ui text-text-primary hover:text-primary"
                    >
                      {skill.title}
                    </Link>
                    <p className="mt-3 line-clamp-2 text-[15px] leading-[1.8] font-ui text-text-secondary">
                      {skill.description || '收藏后可随时查看与下载，便于你继续研究和复用。'}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-[14px] font-ui text-text-secondary">
                      <span>by {skill.author_username}</span>
                      <button
                        type="button"
                        onClick={() => handleDownload(skill.id)}
                        className="font-semibold text-text-primary hover:text-primary"
                      >
                        {cardMeta(skill)}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-[28px] border border-[#f0dfc8] bg-[#fff7eb] px-6 py-5 shadow-[0_4px_14px_rgba(77,69,54,0.03)]">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="h-[88px] w-[88px] rounded-[22px] bg-gradient-to-br from-[#edf7f4] via-[#f9f0d9] to-[#f2ead6]" />
                <div className="flex-1">
                  <h2 className="text-[22px] leading-[1.35] font-medium font-display text-text-primary">
                    还没有新的收藏？
                  </h2>
                  <p className="mt-2 text-[15px] leading-[1.8] font-ui text-text-secondary">
                    去浏览资源库，把感兴趣的 MCP、Skills 和模板先收藏起来。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/skills')}
                  className="inline-flex h-[46px] items-center justify-center rounded-btn bg-[#171d2d] px-7 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
                >
                  去浏览资源
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-[28px] border border-[#f0dfc8] bg-[#fff7eb] px-6 py-6 shadow-[0_4px_14px_rgba(77,69,54,0.03)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="h-[88px] w-[88px] rounded-[22px] bg-gradient-to-br from-[#edf7f4] via-[#f9f0d9] to-[#f2ead6]" />
              <div className="flex-1">
                <h2 className="text-[24px] leading-[1.35] font-medium font-display text-text-primary">
                  还没有新的收藏？
                </h2>
                <p className="mt-2 text-[15px] leading-[1.8] font-ui text-text-secondary">
                  去浏览资源库，把感兴趣的 MCP、Skills 和模板先收藏起来。
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/skills')}
                className="inline-flex h-[46px] items-center justify-center rounded-btn bg-[#171d2d] px-7 text-[15px] font-medium font-ui text-white transition-opacity hover:opacity-90"
              >
                去浏览资源
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
