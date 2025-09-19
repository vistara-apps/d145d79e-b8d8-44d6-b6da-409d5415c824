'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FrameContainer } from '@/components/ui/frame-container';
import { PredictionCard } from '@/components/ui/prediction-card';
import { MarketInput } from '@/components/ui/market-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useMarketStore } from '@/lib/stores/market-store';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { PredictionMarket, Prediction } from '@/lib/types';
import { formatCurrency, calculatePotentialReward, validateBetAmount } from '@/lib/utils';
import { ArrowLeft, Clock, TrendingUp, Users } from 'lucide-react';

// Mock market data - in real app this would come from API
const mockMarket: PredictionMarket = {
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
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  totalPool: '2.5',
  creatorFee: 5,
  resolutionMethod: 'creator',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = params.id as string;

  const { getMarketById, getUserPredictionForMarket, setUserPrediction } = useMarketStore();
  const { isConnected, connect, setTransactionState, transactionState } = useWalletStore();

  const [market, setMarket] = useState<PredictionMarket | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  useEffect(() => {
    // In real app, fetch market data from API
    if (marketId === 'market_1') {
      setMarket(mockMarket);
    }
  }, [marketId]);

  const userPrediction = market ? getUserPredictionForMarket(market.marketId) : null;

  const handlePlaceBet = async () => {
    if (!market || !isConnected) return;

    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (!selectedOutcome) {
      alert('Please select an outcome');
      return;
    }

    setIsPlacingBet(true);
    setTransactionState({ status: 'pending' });

    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedOption = market.predictionOptions.find(opt => opt.id === selectedOutcome);
      if (!selectedOption) return;

      const potentialReward = calculatePotentialReward(betAmount, selectedOption.odds);

      const prediction: Prediction = {
        predictionId: `pred_${Date.now()}`,
        marketId: market.marketId,
        userId: 'user_1', // Would come from wallet/auth
        selectedOutcome,
        betAmount,
        odds: selectedOption.odds,
        potentialReward,
        status: 'pending',
        placedAt: new Date(),
      };

      setUserPrediction(market.marketId, prediction);
      setTransactionState({ status: 'success' });

      // Reset form
      setBetAmount('');
      setSelectedOutcome('');

      alert('Bet placed successfully!');
    } catch (error) {
      setTransactionState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Transaction failed',
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleConnectWallet = () => {
    connect();
  };

  if (!market) {
    return (
      <FrameContainer>
        <div className="text-center py-8">
          <div className="text-text-secondary">Loading market...</div>
        </div>
      </FrameContainer>
    );
  }

  const selectedOption = market.predictionOptions.find(opt => opt.id === selectedOutcome);
  const potentialReward = selectedOption && betAmount
    ? calculatePotentialReward(betAmount, selectedOption.odds)
    : '0';

  return (
    <FrameContainer
      title="Place Your Bet"
      showBackButton
      onBack={() => window.history.back()}
    >
      {/* Market Overview */}
      <div className="mb-6">
        <PredictionCard market={market} />
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary">Time Remaining</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            23h 45m
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary">Total Pool</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {formatCurrency(market.totalPool)} ETH
          </div>
        </div>
      </div>

      {/* Wallet Connection Check */}
      {!isConnected && (
        <div className="bg-surface rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            You need to connect your wallet to place bets.
          </p>
          <PrimaryButton onClick={handleConnectWallet} className="w-full">
            Connect Wallet
          </PrimaryButton>
        </div>
      )}

      {/* Existing Prediction */}
      {userPrediction && (
        <div className="bg-surface rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Your Current Bet
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-text-secondary">
                {userPrediction.selectedOutcome === 'yes' ? 'Yes' : 'No'}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(userPrediction.betAmount)} ETH
              </div>
            </div>
            <StatusIndicator status="pending" label="Pending" />
          </div>
        </div>
      )}

      {/* Bet Placement Form */}
      {isConnected && !userPrediction && (
        <div className="space-y-6">
          <MarketInput
            type="outcomeSelection"
            value={selectedOutcome}
            onChange={setSelectedOutcome}
            options={market.predictionOptions.map(opt => opt.label)}
          />

          <MarketInput
            type="tokenAmount"
            value={betAmount}
            onChange={setBetAmount}
            placeholder="0.1"
          />

          {/* Bet Summary */}
          {selectedOption && betAmount && (
            <div className="bg-surface rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Bet Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Your Bet:</span>
                  <span className="text-foreground">{formatCurrency(betAmount)} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Odds:</span>
                  <span className="text-foreground">{selectedOption.odds}x</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-secondary">Potential Reward:</span>
                  <span className="text-accent">{formatCurrency(potentialReward)} ETH</span>
                </div>
              </div>
            </div>
          )}

          <PrimaryButton
            onClick={handlePlaceBet}
            disabled={!selectedOutcome || !betAmount || isPlacingBet}
            loading={isPlacingBet}
            className="w-full"
          >
            {isPlacingBet ? 'Placing Bet...' : 'Place Bet'}
          </PrimaryButton>
        </div>
      )}

      {/* Transaction Status */}
      {transactionState.status !== 'idle' && (
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2">
            <StatusIndicator
              status={transactionState.status === 'pending' ? 'pending' :
                     transactionState.status === 'success' ? 'correct' : 'incorrect'}
            />
            <span className="text-sm text-foreground">
              {transactionState.status === 'pending' && 'Processing transaction...'}
              {transactionState.status === 'success' && 'Transaction successful!'}
              {transactionState.status === 'error' && `Transaction failed: ${transactionState.error}`}
            </span>
          </div>
        </div>
      )}
    </FrameContainer>
  );
}

