'use client';

import { useEffect } from 'react';
import { FrameContainer } from '@/components/ui/frame-container';
import { PredictionCard } from '@/components/ui/prediction-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MiniAppHeader } from '@/components/ui/mini-app-header';
import { Navigation } from '@/components/navigation';
import { useMarketStore } from '@/lib/stores/market-store';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { PredictionMarket } from '@/lib/types';
import { TrendingUp, Users, Zap } from 'lucide-react';

// Mock data for demonstration
const mockMarkets: PredictionMarket[] = [
  {
    marketId: 'market_1',
    creatorId: 'creator_1',
    outcomeDescription: 'Will the next video reach 100K views?',
    predictionOptions: [
      {
        id: 'yes',
        label: 'Yes',
        odds: 2.5,
        totalBets: '15',
        probability: 40,
      },
      {
        id: 'no',
        label: 'No',
        odds: 1.8,
        totalBets: '22',
        probability: 60,
      },
    ],
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    totalPool: '2.5',
    creatorFee: 5,
    resolutionMethod: 'creator',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    marketId: 'market_2',
    creatorId: 'creator_2',
    outcomeDescription: 'Will the live stream go over 500 concurrent viewers?',
    predictionOptions: [
      {
        id: 'yes',
        label: 'Yes',
        odds: 3.2,
        totalBets: '8',
        probability: 30,
      },
      {
        id: 'no',
        label: 'No',
        odds: 1.4,
        totalBets: '18',
        probability: 70,
      },
    ],
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    totalPool: '1.8',
    creatorFee: 5,
    resolutionMethod: 'creator',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HomePage() {
  const { markets, setMarkets, getActiveMarkets } = useMarketStore();
  const { isConnected, address, connect } = useWalletStore();

  useEffect(() => {
    // Load mock data
    setMarkets(mockMarkets);
  }, [setMarkets]);

  const activeMarkets = getActiveMarkets();

  const handleBetClick = (marketId: string) => {
    if (!isConnected) {
      connect();
      return;
    }
    // Navigate to market detail page
    window.location.href = `/market/${marketId}`;
  };

  return (
    <div className="pb-20"> {/* Add padding for navigation */}
      <FrameContainer>
        <MiniAppHeader
          title="CreatorBets"
          subtitle="Predict creator outcomes, earn crypto rewards"
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-surface rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-lg font-semibold text-foreground">
              {activeMarkets.length}
            </div>
            <div className="text-xs text-text-secondary">Active Markets</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-lg font-semibold text-foreground">
              {activeMarkets.reduce((sum, market) =>
                sum + market.predictionOptions.reduce((optionSum, option) =>
                  optionSum + parseInt(option.totalBets), 0
                ), 0
              )}
            </div>
            <div className="text-xs text-text-secondary">Total Bets</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-lg font-semibold text-foreground">
              {activeMarkets.reduce((sum, market) =>
                sum + parseFloat(market.totalPool), 0
              ).toFixed(1)}
            </div>
            <div className="text-xs text-text-secondary">ETH Volume</div>
          </div>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="bg-surface rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Connect your Base wallet to start placing bets and earning rewards.
            </p>
            <PrimaryButton onClick={connect} className="w-full">
              Connect Wallet
            </PrimaryButton>
          </div>
        )}

        {isConnected && address && (
          <div className="bg-surface rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">Connected Wallet</div>
                <div className="text-sm font-mono text-foreground">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-text-secondary">Balance</div>
                <div className="text-sm font-semibold text-accent">1.234 ETH</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Markets */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Active Prediction Markets
          </h2>

          {activeMarkets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-text-secondary mb-4">
                No active markets at the moment
              </div>
              <PrimaryButton
                variant="secondary"
                onClick={() => window.location.href = '/create-market'}
              >
                Create Market
              </PrimaryButton>
            </div>
          ) : (
            <div className="space-y-4">
              {activeMarkets.map((market) => (
                <PredictionCard
                  key={market.marketId}
                  market={market}
                  onBetClick={handleBetClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <PrimaryButton
            variant="secondary"
            className="w-full"
            onClick={() => window.location.href = '/markets'}
          >
            View All Markets
          </PrimaryButton>
          <PrimaryButton
            variant="secondary"
            className="w-full"
            onClick={() => window.location.href = '/profile'}
          >
            My Predictions
          </PrimaryButton>
        </div>
      </FrameContainer>

      {/* Navigation */}
      <Navigation activeTab="home" />
    </div>
  );
}
