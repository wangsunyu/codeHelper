import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-primary font-ui">{label}</label>}
      <textarea
        ref={ref}
        className={`px-4 py-3 rounded-[12px] border border-border bg-white text-text-primary text-sm font-ui
          placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none
          ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-ui">{error}</span>}
    </div>
  )
);
Textarea.displayName = 'Textarea';
