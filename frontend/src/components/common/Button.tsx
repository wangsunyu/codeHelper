import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'lg' | 'md';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-ui font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    lg: 'h-12 px-7 text-[15px] rounded-btn',
    md: 'h-10 px-5 text-sm rounded-btn',
  };
  const variants = {
    primary: 'bg-[#2D2D2D] text-white hover:opacity-80',
    secondary: 'bg-bg-surface text-text-primary border border-border hover:bg-bg-muted',
    danger: 'bg-red-500 text-white hover:opacity-80',
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
