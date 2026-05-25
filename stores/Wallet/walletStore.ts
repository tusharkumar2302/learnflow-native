import { create } from "zustand";
import { walletService } from "@/lib/services";
import { WalletSummary } from "@/services/interfaces/IWalletService";

interface WalletStore {
  walletData: WalletSummary | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMoreTransactions: boolean;
  fetchWalletData: () => Promise<void>;
  fetchMoreTransactions: () => Promise<void>;
  resetTransactions: () => void;
  reset: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  walletData: null,
  loading: false,
  loadingMore: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMoreTransactions: false,

  fetchWalletData: async () => {
    try {
      set({ loading: true, error: null, currentPage: 1 });
      const data = await walletService.getWallet(1, 10);
      const pagination = data.pagination;
      set({
        walletData: data,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        hasMoreTransactions: pagination.page < pagination.totalPages,
      });
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMoreTransactions: async () => {
    const { currentPage, totalPages, loadingMore, walletData } = get();
    if (loadingMore || currentPage >= totalPages) return;

    try {
      set({ loadingMore: true });
      const nextPage = currentPage + 1;
      const data = await walletService.getWallet(nextPage, 10);
      const pagination = data.pagination;
      const newTransactions = data.transactions || [];

      set({
        walletData: walletData
          ? {
              ...walletData,
              transactions: [...walletData.transactions, ...newTransactions],
              pagination: data.pagination,
            }
          : data,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        hasMoreTransactions: pagination.page < pagination.totalPages,
      });
    } catch {
      // silent — pagination failure should not surface
    } finally {
      set({ loadingMore: false });
    }
  },

  resetTransactions: () => {
    set({ currentPage: 1, totalPages: 1, hasMoreTransactions: false });
  },

  reset: () => {
    set({
      walletData: null,
      loading: false,
      loadingMore: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMoreTransactions: false,
    });
  },
}));
