'use client';

import { cn } from '@/lib/utils';
import { MarketInputProps } from '@/lib/types';

export function MarketInput({
  type,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className,
}: MarketInputProps) {
  if (type === 'outcomeSelection') {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="text-sm font-medium text-foreground">
          Select Outcome
        </label>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChange?.(option)}
              disabled={disabled}
              className={cn(
                'p-3 text-left rounded-md border transition-colors',
                'hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent',
                value === option
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background text-foreground border-border',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-foreground">
        Bet Amount (ETH)
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || '0.0'}
          disabled={disabled}
          step="0.001"
          min="0.001"
          max="10"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">
          ETH
        </div>
      </div>
      <div className="text-xs text-text-secondary">
        Min: 0.001 ETH • Max: 10 ETH
      </div>
    </div>
  );
}

