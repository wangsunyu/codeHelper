import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'lg' | 'md';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-ui font-medium tracking-[-0.01em] transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    lg: 'h-[52px] px-7 text-[15px] rounded-btn',
    md: 'h-10 px-5 text-[14px] rounded-btn',
  };
  const variants = {
    primary: 'bg-primary text-white shadow-[0_6px_14px_rgba(142,160,143,0.18)] hover:opacity-90',
    secondary: 'bg-bg-surface text-text-primary border border-border hover:bg-bg-muted',
    danger: 'bg-[#d86b6b] text-white hover:opacity-90',
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" /> : null}
      {children}
    </button>
  );
}
