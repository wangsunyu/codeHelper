interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 justify-center font-ui">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="h-9 px-4 rounded-btn text-sm border border-border bg-white text-text-secondary
          hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        上一页
      </button>
      <span className="text-sm text-text-secondary px-2">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="h-9 px-4 rounded-btn text-sm border border-border bg-white text-text-secondary
          hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        下一页
      </button>
    </div>
  );
}
