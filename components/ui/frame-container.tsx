'use client';

import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FrameContainerProps } from '@/lib/types';

export function FrameContainer({
  title,
  showBackButton = false,
  onBack,
  className,
  children,
}: FrameContainerProps) {
  return (
    <div className={cn(
      'min-h-screen bg-background',
      'px-6 py-8',
      'max-w-md mx-auto',
      className
    )}>
      {/* Header */}
      {(title || showBackButton) && (
        <div className="flex items-center gap-4 mb-6">
          {showBackButton && (
            <button
              onClick={onBack}
              className="p-2 rounded-md hover:bg-surface transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-2xl font-semibold text-foreground">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

