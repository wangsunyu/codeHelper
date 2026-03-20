import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-primary font-ui">{label}</label>}
      <input
        ref={ref}
        className={`h-11 px-4 rounded-[12px] border border-border bg-white text-text-primary text-sm font-ui
          placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors
          ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-ui">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';
