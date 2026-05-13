import { ReactNode } from 'react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: string; // emoji
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center gap-4 ${className}`}
    >
      <div className="text-5xl">{icon}</div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} variant="outline" className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
