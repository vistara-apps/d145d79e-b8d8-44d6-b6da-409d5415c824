import { Prediction, PredictionStatus } from '@/lib/types';
import { generatePredictionId } from '@/lib/utils';

export class PredictionModel {
  static create(data: Omit<Prediction, 'predictionId' | 'status' | 'placedAt' | 'updatedAt'>): Prediction {
    const predictionId = generatePredictionId();

    return {
      ...data,
      predictionId,
      status: 'pending',
      placedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static update(prediction: Prediction, updates: Partial<Omit<Prediction, 'placedAt' | 'updatedAt'>>): Prediction {
    return {
      ...prediction,
      ...updates,
      updatedAt: new Date(),
    };
  }

  static validate(prediction: Partial<Prediction>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!prediction.marketId) {
      errors.push('Market ID is required');
    }

    if (!prediction.userId) {
      errors.push('User ID is required');
    }

    if (!prediction.selectedOutcome) {
      errors.push('Selected outcome is required');
    }

    if (!prediction.betAmount || parseFloat(prediction.betAmount) <= 0) {
      errors.push('Bet amount must be greater than 0');
    }

    if (prediction.odds && prediction.odds <= 0) {
      errors.push('Odds must be greater than 0');
    }

    if (prediction.potentialReward && parseFloat(prediction.potentialReward) < 0) {
      errors.push('Potential reward cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static resolve(prediction: Prediction, marketOutcome: string): Prediction {
    const isCorrect = prediction.selectedOutcome === marketOutcome;
    const newStatus: PredictionStatus = isCorrect ? 'won' : 'lost';

    return this.update(prediction, {
      status: newStatus,
      resolvedAt: new Date(),
    });
  }

  static cancel(prediction: Prediction): Prediction {
    return this.update(prediction, {
      status: 'cancelled',
      resolvedAt: new Date(),
    });
  }

  static claimReward(prediction: Prediction): Prediction {
    if (prediction.status !== 'won') {
      throw new Error('Only won predictions can claim rewards');
    }

    if (prediction.rewardClaimed) {
      throw new Error('Reward already claimed');
    }

    return this.update(prediction, {
      rewardClaimed: true,
      claimedAt: new Date(),
    });
  }

  static calculatePotentialReward(betAmount: string, odds: number): string {
    const amount = parseFloat(betAmount);
    const reward = amount * odds;
    return reward.toFixed(6);
  }

  static getProfit(prediction: Prediction): number {
    if (prediction.status !== 'won' || !prediction.rewardClaimed) {
      return 0;
    }

    const betAmount = parseFloat(prediction.betAmount);
    const reward = parseFloat(prediction.potentialReward);
    return reward - betAmount;
  }

  static isResolved(prediction: Prediction): boolean {
    return ['won', 'lost', 'cancelled'].includes(prediction.status);
  }

  static canClaimReward(prediction: Prediction): boolean {
    return prediction.status === 'won' && !prediction.rewardClaimed;
  }

  static getStatusColor(status: PredictionStatus): string {
    switch (status) {
      case 'won':
        return 'text-green-500';
      case 'lost':
        return 'text-red-500';
      case 'cancelled':
        return 'text-gray-500';
      case 'pending':
      default:
        return 'text-yellow-500';
    }
  }

  static getStatusText(status: PredictionStatus): string {
    switch (status) {
      case 'won':
        return 'Won';
      case 'lost':
        return 'Lost';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
      default:
        return 'Pending';
    }
  }

  static formatBetAmount(amount: string): string {
    return `${parseFloat(amount).toFixed(4)} ETH`;
  }

  static formatPotentialReward(amount: string): string {
    return `${parseFloat(amount).toFixed(4)} ETH`;
  }
}

