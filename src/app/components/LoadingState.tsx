import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  message = 'Cargando...',
  size = 'md',
}: LoadingStateProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
      <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
}
