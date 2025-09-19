import { PredictionMarket, PredictionOption, MarketStatus, ResolutionMethod } from '@/lib/types';
import { generateMarketId, isMarketActive } from '@/lib/utils';
import { MARKET_CONFIG } from '@/lib/constants';

export class PredictionMarketModel {
  static create(data: Omit<PredictionMarket, 'marketId' | 'status' | 'totalPool' | 'createdAt' | 'updatedAt'>): PredictionMarket {
    const marketId = generateMarketId();

    return {
      ...data,
      marketId,
      status: 'pending',
      totalPool: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static update(market: PredictionMarket, updates: Partial<Omit<PredictionMarket, 'createdAt' | 'updatedAt'>>): PredictionMarket {
    return {
      ...market,
      ...updates,
      updatedAt: new Date(),
    };
  }

  static validate(market: Partial<PredictionMarket>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!market.creatorId) {
      errors.push('Creator ID is required');
    }

    if (!market.outcomeDescription || market.outcomeDescription.trim().length === 0) {
      errors.push('Outcome description is required');
    }

    if (!market.predictionOptions || market.predictionOptions.length < 2) {
      errors.push('At least 2 prediction options are required');
    }

    if (market.startDate && market.endDate && market.startDate >= market.endDate) {
      errors.push('End date must be after start date');
    }

    if (market.creatorFee && (market.creatorFee < 0 || market.creatorFee > 100)) {
      errors.push('Creator fee must be between 0 and 100');
    }

    if (market.predictionOptions) {
      market.predictionOptions.forEach((option, index) => {
        if (!option.label || option.label.trim().length === 0) {
          errors.push(`Option ${index + 1} label is required`);
        }
        if (option.odds <= 0) {
          errors.push(`Option ${index + 1} odds must be greater than 0`);
        }
        if (option.probability < 0 || option.probability > 100) {
          errors.push(`Option ${index + 1} probability must be between 0 and 100`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static activateMarket(market: PredictionMarket): PredictionMarket {
    if (market.status !== 'pending') {
      throw new Error('Only pending markets can be activated');
    }

    return this.update(market, { status: 'active' });
  }

  static resolveMarket(market: PredictionMarket, resolvedOutcome: string): PredictionMarket {
    if (market.status !== 'active') {
      throw new Error('Only active markets can be resolved');
    }

    return this.update(market, {
      status: 'resolved',
      resolvedOutcome,
      resolvedAt: new Date(),
    });
  }

  static cancelMarket(market: PredictionMarket): PredictionMarket {
    if (market.status === 'resolved') {
      throw new Error('Resolved markets cannot be cancelled');
    }

    return this.update(market, { status: 'cancelled' });
  }

  static expireMarket(market: PredictionMarket): PredictionMarket {
    if (market.status !== 'active') {
      return market;
    }

    return this.update(market, { status: 'expired' });
  }

  static addPrediction(market: PredictionMarket, betAmount: string, selectedOutcome: string): PredictionMarket {
    const updatedOptions = market.predictionOptions.map(option => {
      if (option.id === selectedOutcome) {
        return {
          ...option,
          totalBets: (parseInt(option.totalBets) + 1).toString(),
        };
      }
      return option;
    });

    const newTotalPool = (parseFloat(market.totalPool) + parseFloat(betAmount)).toFixed(6);

    return this.update(market, {
      predictionOptions: updatedOptions,
      totalPool: newTotalPool,
    });
  }

  static calculateOdds(market: PredictionMarket): PredictionMarket {
    const totalPool = parseFloat(market.totalPool);
    if (totalPool === 0) return market;

    const updatedOptions = market.predictionOptions.map(option => {
      const optionPool = parseFloat(option.totalBets);
      const odds = optionPool > 0 ? totalPool / optionPool : 1;
      const probability = optionPool > 0 ? (optionPool / totalPool) * 100 : 0;

      return {
        ...option,
        odds: Math.max(odds, 1.01), // Minimum odds of 1.01
        probability,
      };
    });

    return this.update(market, { predictionOptions: updatedOptions });
  }

  static getStatus(market: PredictionMarket): MarketStatus {
    const now = new Date();

    if (market.status === 'resolved' || market.status === 'cancelled') {
      return market.status;
    }

    if (now < market.startDate) {
      return 'pending';
    }

    if (now > market.endDate) {
      return 'expired';
    }

    return 'active';
  }

  static isActive(market: PredictionMarket): boolean {
    return isMarketActive(market.startDate, market.endDate) && market.status === 'active';
  }

  static getTimeRemaining(market: PredictionMarket): number {
    const now = new Date();
    const endTime = market.endDate.getTime();
    const remaining = endTime - now.getTime();
    return Math.max(remaining, 0);
  }

  static formatDuration(startDate: Date, endDate: Date): string {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }
}

