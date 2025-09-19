'use client';

import { cn } from '@/lib/utils';
import { MiniAppHeaderProps } from '@/lib/types';

export function MiniAppHeader({
  title,
  subtitle,
  avatarUrl,
  className,
}: MiniAppHeaderProps) {
  return (
    <div className={cn(
      'flex items-center gap-4 p-4 bg-surface rounded-lg',
      className
    )}>
      {avatarUrl && (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-accent flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-primary rounded-full" />
          )}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

