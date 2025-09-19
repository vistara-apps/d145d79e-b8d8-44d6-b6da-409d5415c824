import { create } from 'zustand';
import { WalletState, TransactionState } from '@/lib/types';
import { WalletService } from '@/lib/wallet';

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setTransactionState: (state: Partial<TransactionState>) => void;
  transactionState: TransactionState;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  isConnected: false,
  address: undefined,
  chainId: undefined,
  balance: undefined,
  transactionState: {
    status: 'idle',
  },

  connect: async () => {
    try {
      set({ transactionState: { status: 'pending' } });

      const result = await WalletService.connectWallet();
      if (result) {
        const balance = await WalletService.getBalance(result.address);
        set({
          isConnected: true,
          address: result.address,
          chainId: result.chainId,
          balance,
          transactionState: { status: 'idle' },
        });
      } else {
        set({
          transactionState: {
            status: 'error',
            error: 'Failed to connect wallet',
          },
        });
      }
    } catch (error) {
      set({
        transactionState: {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  },

  disconnect: async () => {
    try {
      await WalletService.disconnectWallet();
      set({
        isConnected: false,
        address: undefined,
        chainId: undefined,
        balance: undefined,
        transactionState: { status: 'idle' },
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  },

  refreshBalance: async () => {
    const { address } = get();
    if (!address) return;

    try {
      const balance = await WalletService.getBalance(address);
      set({ balance });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  },

  setTransactionState: (state) => {
    set((prev) => ({
      transactionState: { ...prev.transactionState, ...state },
    }));
  },
}));

