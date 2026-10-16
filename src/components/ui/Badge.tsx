import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'gold'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'sapphire'
  | 'slate'
  | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export function Badge({
  variant = 'gold',
  pulse = false,
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    gold: 'bg-aurum-gold/15 text-aurum-gold border-aurum-gold/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    sapphire: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    slate: 'bg-aurum-surface text-aurum-text-muted border-aurum-border',
    outline: 'bg-transparent text-aurum-text-muted border-aurum-border',
  };

  const pulseColors: Record<BadgeVariant, string> = {
    gold: 'bg-aurum-gold',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    sapphire: 'bg-blue-400',
    slate: 'bg-aurum-text-muted',
    outline: 'bg-aurum-text-muted',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center space-x-1.5 font-medium rounded-full border tracking-wide uppercase font-mono',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              pulseColors[variant]
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              pulseColors[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
