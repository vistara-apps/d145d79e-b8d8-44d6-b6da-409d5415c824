'use client';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            CreatorBets
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Predict creator outcomes, earn crypto rewards
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-200">
              Welcome to CreatorBets! Make predictions on creator activities and earn rewards.
              Connect your wallet to start predicting and earning crypto rewards!
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Native Token Prediction Markets
            </h3>
            <p className="text-gray-300">
              Create and join prediction markets for specific creator outcomes using native tokens.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Automated Reward System
            </h3>
            <p className="text-gray-300">
              Smart contracts automatically distribute rewards to accurate predictions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              Audience Confidence Gauge
            </h3>
            <p className="text-gray-300">
              Real-time sentiment analysis from active prediction markets.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Predicting?
            </h2>
            <p className="text-purple-100 mb-6">
              Connect your wallet and join the prediction revolution!
            </p>
            <Button variant="secondary" size="lg">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
