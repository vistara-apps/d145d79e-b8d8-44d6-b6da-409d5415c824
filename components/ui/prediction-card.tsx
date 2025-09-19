'use client';

import { Clock, TrendingUp, Users } from 'lucide-react';
import { cn, formatCurrency, formatTimeRemaining, getMarketStatusColor } from '@/lib/utils';
import { PredictionCardProps } from '@/lib/types';
import { StatusIndicator } from './status-indicator';

export function PredictionCard({
  market,
  userPrediction,
  onBetClick,
  className,
}: PredictionCardProps) {
  const isActive = market.status === 'active';
  const hasUserPrediction = !!userPrediction;

  return (
    <div className={cn(
      'bg-surface rounded-lg border shadow-sm p-6',
      'hover:shadow-md transition-shadow cursor-pointer',
      className
    )} onClick={() => onBetClick?.(market.marketId)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {market.outcomeDescription}
          </h3>
          <div className="flex items-center gap-2">
            <StatusIndicator status={market.status as any} />
            <span className={cn('text-sm', getMarketStatusColor(market.status))}>
              {market.status.charAt(0).toUpperCase() + market.status.slice(1)}
            </span>
          </div>
        </div>
        {hasUserPrediction && (
          <div className="text-right">
            <div className="text-sm text-text-secondary">Your Bet</div>
            <div className="text-lg font-semibold text-accent">
              {formatCurrency(userPrediction.betAmount)} ETH
            </div>
          </div>
        )}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <div>
            <div className="text-sm text-text-secondary">Total Pool</div>
            <div className="text-lg font-semibold text-foreground">
              {formatCurrency(market.totalPool)} ETH
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <div>
            <div className="text-sm text-text-secondary">Participants</div>
            <div className="text-lg font-semibold text-foreground">
              {market.predictionOptions.reduce((sum, option) =>
                sum + parseInt(option.totalBets), 0
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Time Remaining */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-text-secondary" />
        <span className="text-sm text-text-secondary">
          {formatTimeRemaining(market.endDate)}
        </span>
      </div>

      {/* Prediction Options */}
      <div className="space-y-2">
        {market.predictionOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between p-3 bg-background rounded-md"
          >
            <span className="text-sm font-medium text-foreground">
              {option.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">
                {option.odds.toFixed(2)}x
              </span>
              <span className="text-sm text-accent">
                {option.probability.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      {isActive && (
        <button
          className="w-full mt-4 bg-accent hover:bg-accent/90 text-white py-3 px-4 rounded-md font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onBetClick?.(market.marketId);
          }}
        >
          {hasUserPrediction ? 'Update Bet' : 'Place Bet'}
        </button>
      )}
    </div>
  );
}

