import { create } from 'zustand';
import { PredictionMarket, Prediction } from '@/lib/types';

interface MarketStore {
  markets: PredictionMarket[];
  userPredictions: Record<string, Prediction>; // marketId -> prediction
  isLoading: boolean;
  error: string | null;

  // Actions
  setMarkets: (markets: PredictionMarket[]) => void;
  addMarket: (market: PredictionMarket) => void;
  updateMarket: (marketId: string, updates: Partial<PredictionMarket>) => void;
  setUserPrediction: (marketId: string, prediction: Prediction) => void;
  removeUserPrediction: (marketId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getActiveMarkets: () => PredictionMarket[];
  getMarketById: (marketId: string) => PredictionMarket | undefined;
  getUserPredictionForMarket: (marketId: string) => Prediction | undefined;
  getMarketsWithUserPredictions: () => PredictionMarket[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: [],
  userPredictions: {},
  isLoading: false,
  error: null,

  setMarkets: (markets) => set({ markets }),

  addMarket: (market) => set((state) => ({
    markets: [...state.markets, market],
  })),

  updateMarket: (marketId, updates) => set((state) => ({
    markets: state.markets.map(market =>
      market.marketId === marketId ? { ...market, ...updates } : market
    ),
  })),

  setUserPrediction: (marketId, prediction) => set((state) => ({
    userPredictions: {
      ...state.userPredictions,
      [marketId]: prediction,
    },
  })),

  removeUserPrediction: (marketId) => set((state) => {
    const newPredictions = { ...state.userPredictions };
    delete newPredictions[marketId];
    return { userPredictions: newPredictions };
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getActiveMarkets: () => {
    const { markets } = get();
    const now = new Date();
    return markets.filter(market =>
      market.status === 'active' &&
      now >= market.startDate &&
      now <= market.endDate
    );
  },

  getMarketById: (marketId) => {
    const { markets } = get();
    return markets.find(market => market.marketId === marketId);
  },

  getUserPredictionForMarket: (marketId) => {
    const { userPredictions } = get();
    return userPredictions[marketId];
  },

  getMarketsWithUserPredictions: () => {
    const { markets, userPredictions } = get();
    return markets.filter(market => userPredictions[market.marketId]);
  },
}));

