import { Creator } from '@/lib/types';

export class CreatorModel {
  static create(data: Omit<Creator, 'createdAt' | 'updatedAt'>): Creator {
    return {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static update(creator: Creator, updates: Partial<Omit<Creator, 'createdAt' | 'updatedAt'>>): Creator {
    return {
      ...creator,
      ...updates,
      updatedAt: new Date(),
    };
  }

  static validate(creator: Partial<Creator>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!creator.creatorId) {
      errors.push('Creator ID is required');
    }

    if (!creator.nativeTokenAddress) {
      errors.push('Native token address is required');
    }

    if (!creator.socialHandle) {
      errors.push('Social handle is required');
    }

    if (creator.totalMarketsCreated && creator.totalMarketsCreated < 0) {
      errors.push('Total markets created cannot be negative');
    }

    if (creator.totalVolume && parseFloat(creator.totalVolume) < 0) {
      errors.push('Total volume cannot be negative');
    }

    if (creator.reputationScore && (creator.reputationScore < 0 || creator.reputationScore > 100)) {
      errors.push('Reputation score must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static formatDisplayName(creator: Creator): string {
    return creator.displayName || creator.socialHandle || `Creator ${creator.creatorId.slice(-4)}`;
  }

  static getStats(creator: Creator) {
    return {
      marketsCreated: creator.totalMarketsCreated,
      totalVolume: parseFloat(creator.totalVolume || '0'),
      reputationScore: creator.reputationScore,
      averageVolumePerMarket: creator.totalMarketsCreated > 0
        ? parseFloat(creator.totalVolume || '0') / creator.totalMarketsCreated
        : 0,
    };
  }

  static calculateReputationScore(creator: Creator): number {
    // Simple reputation calculation based on activity
    const baseScore = 50;
    const marketBonus = Math.min(creator.totalMarketsCreated * 2, 20);
    const volumeBonus = Math.min(parseFloat(creator.totalVolume || '0') * 0.1, 30);

    return Math.min(baseScore + marketBonus + volumeBonus, 100);
  }
}

