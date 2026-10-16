import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'p-10 rounded-2xl bg-aurum-surface/40 border border-aurum-border/60 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-aurum-gold/10 border border-aurum-gold/20 flex items-center justify-center text-aurum-gold">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-aurum-text">{title}</h4>
        <p className="text-xs text-aurum-text-muted leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Failed to Load Financial Data',
  message = 'We encountered an issue synchronizing with the secure vault ledger. Please retry.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex items-center space-x-3 text-left">
        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-aurum-text">{title}</h4>
          <p className="text-xs text-aurum-text-muted mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="whitespace-nowrap"
        >
          Retry Sync
        </Button>
      )}
    </div>
  );
}
