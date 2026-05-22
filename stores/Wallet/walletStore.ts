// stores/walletStore.ts
import axios from "axios";
import { create } from "zustand";
import { authStore } from ".././authStore";

interface Transaction {
  id: string;
  type: "EARNED" | "REDEEMED";
  amount: number;
  note: string;
  date: string;
  formattedDate: string;
  formattedDateTime: string;
  course?: string | null;
}

interface WalletData {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface WalletStore {
  walletData: WalletData | null;
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
    const { token } = authStore.getState();

    // Guard: Don't fetch if no token (user logged out)
    if (!token) {
      console.log("⚠️ No token available, skipping wallet fetch");
      return;
    }

    try {
      set({ loading: true, error: null, currentPage: 1 });

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/wallet?page=1&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        const pagination = data.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        };
        set({
          walletData: data,
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          hasMoreTransactions: pagination.page < pagination.totalPages,
        });
      } else {
        set({ error: "Failed to fetch wallet data" });
      }
    } catch (error: any) {
      console.error("Error fetching wallet data:", error);
      set({ error: error.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMoreTransactions: async () => {
    const { token } = authStore.getState();
    const { currentPage, totalPages, loadingMore, walletData } = get();

    // Guard: Don't fetch if no token (user logged out)
    if (!token) {
      console.log("⚠️ No token available, skipping more transactions fetch");
      return;
    }

    if (loadingMore || currentPage >= totalPages) return;

    try {
      set({ loadingMore: true });

      const nextPage = currentPage + 1;
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/wallet?page=${nextPage}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        const pagination = data.pagination || { page: nextPage, totalPages: 1 };
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
      }
    } catch (error: any) {
      console.error("Error fetching more transactions:", error);
    } finally {
      set({ loadingMore: false });
    }
  },

  resetTransactions: () => {
    set({
      currentPage: 1,
      totalPages: 1,
      hasMoreTransactions: false,
    });
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
