import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-primary font-ui">{label}</label>}
      <select
        ref={ref}
        className={`h-11 px-4 rounded-[12px] border border-border bg-white text-text-primary text-sm font-ui
          focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer
          ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 font-ui">{error}</span>}
    </div>
  )
);
Select.displayName = 'Select';
