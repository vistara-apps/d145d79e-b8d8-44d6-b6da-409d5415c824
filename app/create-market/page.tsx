'use client';

import { useState } from 'react';
import { FrameContainer } from '@/components/ui/frame-container';
import { MarketInput } from '@/components/ui/market-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useMarketStore } from '@/lib/stores/market-store';
import { useWalletStore } from '@/lib/stores/wallet-store';
import { PredictionMarket } from '@/lib/types';
import { PredictionMarketModel } from '@/lib/models/prediction-market';
import { Plus, X } from 'lucide-react';

interface PredictionOption {
  id: string;
  label: string;
}

export default function CreateMarketPage() {
  const { addMarket } = useMarketStore();
  const { isConnected, connect } = useWalletStore();

  const [outcomeDescription, setOutcomeDescription] = useState('');
  const [predictionOptions, setPredictionOptions] = useState<PredictionOption[]>([
    { id: '1', label: '' },
    { id: '2', label: '' },
  ]);
  const [duration, setDuration] = useState('24'); // hours
  const [isCreating, setIsCreating] = useState(false);

  const handleAddOption = () => {
    const newId = (predictionOptions.length + 1).toString();
    setPredictionOptions([...predictionOptions, { id: newId, label: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (predictionOptions.length > 2) {
      setPredictionOptions(predictionOptions.filter(opt => opt.id !== id));
    }
  };

  const handleOptionChange = (id: string, label: string) => {
    setPredictionOptions(predictionOptions.map(opt =>
      opt.id === id ? { ...opt, label } : opt
    ));
  };

  const handleCreateMarket = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!outcomeDescription.trim()) {
      alert('Please enter an outcome description');
      return;
    }

    const validOptions = predictionOptions.filter(opt => opt.label.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 prediction options');
      return;
    }

    setIsCreating(true);

    try {
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + parseInt(duration));

      const marketData = {
        creatorId: 'creator_1', // Would come from auth/wallet
        outcomeDescription: outcomeDescription.trim(),
        predictionOptions: validOptions.map((opt, index) => ({
          id: opt.id,
          label: opt.label.trim(),
          odds: 1,
          totalBets: '0',
          probability: Math.floor(100 / validOptions.length),
        })),
        startDate: new Date(),
        endDate,
        creatorFee: 5,
        resolutionMethod: 'creator' as const,
      };

      const market = PredictionMarketModel.create(marketData);
      addMarket(market);

      // Reset form
      setOutcomeDescription('');
      setPredictionOptions([
        { id: '1', label: '' },
        { id: '2', label: '' },
      ]);
      setDuration('24');

      alert('Prediction market created successfully!');
    } catch (error) {
      console.error('Failed to create market:', error);
      alert('Failed to create market. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <FrameContainer
        title="Create Prediction Market"
        showBackButton
        onBack={() => window.history.back()}
      >
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-text-secondary mb-6">
            You need to connect your wallet to create prediction markets.
          </p>
          <PrimaryButton onClick={connect}>
            Connect Wallet
          </PrimaryButton>
        </div>
      </FrameContainer>
    );
  }

  return (
    <FrameContainer
      title="Create Prediction Market"
      showBackButton
      onBack={() => window.history.back()}
    >
      <div className="space-y-6">
        {/* Outcome Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Prediction Outcome
          </label>
          <textarea
            value={outcomeDescription}
            onChange={(e) => setOutcomeDescription(e.target.value)}
            placeholder="e.g., Will the next video reach 100K views?"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCreating}
          />
        </div>

        {/* Prediction Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Prediction Options
            </label>
            <button
              onClick={handleAddOption}
              disabled={isCreating}
              className="p-2 rounded-md hover:bg-surface transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {predictionOptions.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="text"
                value={option.label}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`Option ${index + 1} (e.g., Yes)`}
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCreating}
              />
              {predictionOptions.length > 2 && (
                <button
                  onClick={() => handleRemoveOption(option.id)}
                  disabled={isCreating}
                  className="p-2 rounded-md hover:bg-surface transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Market Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isCreating}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72">72 hours</option>
          </select>
        </div>

        {/* Market Preview */}
        {outcomeDescription && predictionOptions.some(opt => opt.label.trim()) && (
          <div className="bg-surface rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Market Preview
            </h3>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-text-secondary">Question:</div>
                <div className="text-sm text-foreground">{outcomeDescription}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Options:</div>
                <div className="text-sm text-foreground">
                  {predictionOptions
                    .filter(opt => opt.label.trim())
                    .map(opt => opt.label)
                    .join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Duration:</div>
                <div className="text-sm text-foreground">{duration} hours</div>
              </div>
            </div>
          </div>
        )}

        <PrimaryButton
          onClick={handleCreateMarket}
          disabled={!outcomeDescription.trim() || isCreating}
          loading={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Market...' : 'Create Prediction Market'}
        </PrimaryButton>
      </div>
    </FrameContainer>
  );
}

