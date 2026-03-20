import type { IRankingItem } from '../../types';
import { formatNumber, CATEGORY_LABELS } from '../../utils/format';
import { Link } from 'react-router-dom';
import { skillService } from '../../services/skill';

interface RankingRowProps {
  item: IRankingItem;
}

const RANK_COLORS: Record<number, string> = {
  1: 'text-yellow-500 border-yellow-300 bg-yellow-50',
  2: 'text-gray-400 border-gray-300 bg-gray-50',
  3: 'text-amber-600 border-amber-300 bg-amber-50',
};

export function RankingRow({ item }: RankingRowProps) {
  const rankStyle = RANK_COLORS[item.rank] || 'text-text-muted border-border bg-bg-surface';

  function handleDownload(e: React.MouseEvent) {
    e.preventDefault();
    window.location.href = skillService.downloadUrl(item.id);
  }

  return (
    <Link
      to={`/skills/${item.id}`}
      className={`flex items-center gap-4 p-4 rounded-rank border transition-shadow hover:shadow-sm
        ${item.rank <= 3 ? rankStyle : 'border-border bg-white'}`}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold font-mono flex-shrink-0
        ${item.rank <= 3 ? rankStyle : 'text-text-muted bg-bg-surface'}`}>
        {item.rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary font-ui truncate">{item.title}</p>
        <p className="text-xs text-text-secondary font-ui mt-0.5">
          {CATEGORY_LABELS[item.category]} · {item.author_username}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-semibold font-mono text-text-primary">
          ↓ {formatNumber(item.download_count)}
        </span>
        <button
          onClick={handleDownload}
          className="h-8 px-3 rounded-btn text-xs font-medium font-ui bg-[#2D2D2D] text-white hover:opacity-80 transition-opacity"
        >
          下载
        </button>
      </div>
    </Link>
  );
}
