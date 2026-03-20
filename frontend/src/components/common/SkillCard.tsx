import { Link } from 'react-router-dom';
import type { ISkill } from '../../types';
import { formatFileSize, formatNumber, CATEGORY_LABELS } from '../../utils/format';

interface SkillCardProps {
  skill: ISkill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link
      to={`/skills/${skill.id}`}
      className="block bg-white rounded-card border border-border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-icon bg-bg-surface flex items-center justify-center text-lg flex-shrink-0">
          📦
        </div>
        <span className="text-[11px] font-medium font-ui px-3 py-1 rounded-badge bg-primary-tint text-primary">
          {CATEGORY_LABELS[skill.category] || skill.category}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-text-primary font-ui mb-2 line-clamp-2 leading-snug">
        {skill.title}
      </h3>
      {skill.description && (
        <p className="text-sm text-text-secondary font-ui mb-4 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-subtle">
        <span className="text-xs text-text-muted font-ui">{skill.author_username}</span>
        <div className="flex items-center gap-3 text-xs text-text-secondary font-ui">
          <span>↓ {formatNumber(skill.download_count)}</span>
          <span>♥ {formatNumber(skill.favorite_count)}</span>
          <span>{formatFileSize(skill.file_size)}</span>
        </div>
      </div>
    </Link>
  );
}
