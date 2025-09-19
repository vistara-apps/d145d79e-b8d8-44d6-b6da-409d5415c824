'use client';

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { cn, getMarketStatusColor, getPredictionStatusColor } from '@/lib/utils';
import { StatusIndicatorProps } from '@/lib/types';

export function StatusIndicator({
  status,
  label,
  className,
}: StatusIndicatorProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: AlertCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
        };
      case 'resolved':
        return {
          icon: CheckCircle,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        };
      case 'correct':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
        };
      case 'incorrect':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium',
      config.bgColor,
      className
    )}>
      <Icon className={cn('w-3 h-3', config.color)} />
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}

