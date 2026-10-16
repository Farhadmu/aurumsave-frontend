import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurum-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-aurum-gold via-aurum-gold-light to-aurum-gold text-aurum-midnight hover:brightness-110 active:scale-[0.98] shadow-gold-glow font-bold border border-aurum-gold/40',
      secondary:
        'bg-aurum-surface text-aurum-text border border-aurum-border hover:border-aurum-gold/50 hover:bg-aurum-card active:scale-[0.98]',
      outline:
        'bg-transparent text-aurum-gold border border-aurum-gold/40 hover:bg-aurum-gold/10 active:scale-[0.98]',
      ghost:
        'bg-transparent text-aurum-text-muted hover:text-aurum-gold hover:bg-aurum-surface/50',
      danger:
        'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 space-x-1.5',
      md: 'text-sm px-4 py-2.5 space-x-2',
      lg: 'text-base px-6 py-3.5 space-x-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
