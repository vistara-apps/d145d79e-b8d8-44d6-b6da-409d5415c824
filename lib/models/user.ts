import { User } from '@/lib/types';

export class UserModel {
  static create(data: Omit<User, 'createdAt' | 'updatedAt'>): User {
    return {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static update(user: User, updates: Partial<Omit<User, 'createdAt' | 'updatedAt'>>): User {
    return {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
  }

  static validate(user: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!user.farcasterId) {
      errors.push('Farcaster ID is required');
    }

    if (!user.baseWalletAddress) {
      errors.push('Base wallet address is required');
    }

    if (user.nativeTokenBalance && parseFloat(user.nativeTokenBalance) < 0) {
      errors.push('Native token balance cannot be negative');
    }

    if (user.totalBetsPlaced && user.totalBetsPlaced < 0) {
      errors.push('Total bets placed cannot be negative');
    }

    if (user.totalRewardsEarned && parseFloat(user.totalRewardsEarned) < 0) {
      errors.push('Total rewards earned cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static formatDisplayName(user: User): string {
    return user.farcasterId || `User ${user.baseWalletAddress.slice(-4)}`;
  }

  static getStats(user: User) {
    return {
      totalBets: user.totalBetsPlaced,
      totalRewards: parseFloat(user.totalRewardsEarned || '0'),
      winRate: user.totalBetsPlaced > 0
        ? (user.totalRewardsEarned ? parseFloat(user.totalRewardsEarned) / user.totalBetsPlaced : 0)
        : 0,
    };
  }
}

