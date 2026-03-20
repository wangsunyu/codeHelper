interface CategoryTabsProps {
  categories: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`h-9 px-4 rounded-btn text-sm font-ui font-medium transition-colors
            ${active === cat.value
              ? 'bg-[#2D2D2D] text-white'
              : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-muted'
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
