import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type SubscriptionTier = "FREE" | "ZUPER_CENT" | "ZUPER_PRO" | "ZUPER_VINTAGE";

interface ConversionRate {
  coinsPerDollar: number;
  dollarsPerCoin: number;
  effectiveFrom: string;
}

interface RedeemRequest {
  id: string;
  coinsRequested: number;
  zuperiorAccountNumber: string;
  subscriptionTier: SubscriptionTier;
  status: "PENDING" | "APPROVED" | "REJECTED";
  amountInDollars?: number;
  rejectionReason?: string;
  conversionRate: ConversionRate | null;
  createdAt: string;
  processedAt?: string;
}

interface ConversionCalculation {
  coins: number;
  subscriptionTier: SubscriptionTier;
  amountInDollars: number;
  conversionRate: ConversionRate;
}

interface CreateRedeemResult {
  requestId: string;
  coinsRequested: number;
  subscriptionTier: SubscriptionTier;
  status: string;
  estimatedAmount: number;
  conversionRate: ConversionRate;
  createdAt: string;
}

interface RedeemState {
  conversionRate: (ConversionRate & { subscriptionTier: SubscriptionTier }) | null;
  redeemRequests: RedeemRequest[];
  isLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMoreRequests: boolean;

  fetchConversionRate: () => Promise<void>;
  calculateConversion: (coins: number) => Promise<ConversionCalculation>;
  createRedeemRequest: (coinsRequested: number, zuperiorAccountNumber: string) => Promise<CreateRedeemResult>;
  fetchRedeemRequests: (page?: number) => Promise<void>;
  fetchMoreRedeemRequests: () => Promise<void>;
  fetchRedeemRequestDetails: (requestId: string) => Promise<RedeemRequest>;
  clearError: () => void;
  reset: () => void;
}

const LOCAL_RATE: ConversionRate = {
  coinsPerDollar: 100,
  dollarsPerCoin: 0.01,
  effectiveFrom: "2026-01-01T00:00:00Z",
};

const REDEEM_REQUESTS_KEY = "local_redeem_requests";

async function readRequests(): Promise<RedeemRequest[]> {
  try {
    const raw = await AsyncStorage.getItem(REDEEM_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeRequests(requests: RedeemRequest[]): Promise<void> {
  await AsyncStorage.setItem(REDEEM_REQUESTS_KEY, JSON.stringify(requests));
}

export const useRedeemStore = create<RedeemState>((set, get) => ({
  conversionRate: null,
  redeemRequests: [],
  isLoading: false,
  loadingMore: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMoreRequests: false,

  fetchConversionRate: async () => {
    set({ isLoading: true, error: null });
    set({
      conversionRate: { ...LOCAL_RATE, subscriptionTier: "ZUPER_PRO" },
      isLoading: false,
    });
  },

  calculateConversion: async (coins: number) => {
    set({ isLoading: true, error: null });
    const result: ConversionCalculation = {
      coins,
      subscriptionTier: "ZUPER_PRO",
      amountInDollars: parseFloat((coins * LOCAL_RATE.dollarsPerCoin).toFixed(2)),
      conversionRate: LOCAL_RATE,
    };
    set({ isLoading: false });
    return result;
  },

  createRedeemRequest: async (coinsRequested: number, zuperiorAccountNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      const existing = await readRequests();
      const now = new Date().toISOString();
      const newRequest: RedeemRequest = {
        id: `redeem-${Date.now()}`,
        coinsRequested,
        zuperiorAccountNumber,
        subscriptionTier: "ZUPER_PRO",
        status: "PENDING",
        amountInDollars: parseFloat((coinsRequested * LOCAL_RATE.dollarsPerCoin).toFixed(2)),
        conversionRate: LOCAL_RATE,
        createdAt: now,
      };
      await writeRequests([newRequest, ...existing]);
      await get().fetchRedeemRequests();
      set({ isLoading: false });
      return {
        requestId: newRequest.id,
        coinsRequested,
        subscriptionTier: "ZUPER_PRO",
        status: "PENDING",
        estimatedAmount: newRequest.amountInDollars!,
        conversionRate: LOCAL_RATE,
        createdAt: now,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to create redeem request";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  fetchRedeemRequests: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const all = await readRequests();
      const limit = 10;
      const start = (page - 1) * limit;
      const paged = all.slice(start, start + limit);
      const totalPages = Math.ceil(all.length / limit) || 1;
      set({
        redeemRequests: paged,
        currentPage: page,
        totalPages,
        hasMoreRequests: page < totalPages,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch redeem requests",
        isLoading: false,
      });
    }
  },

  fetchMoreRedeemRequests: async () => {
    const { currentPage, totalPages, loadingMore, redeemRequests } = get();
    if (loadingMore || currentPage >= totalPages) return;
    set({ loadingMore: true });
    try {
      const nextPage = currentPage + 1;
      const all = await readRequests();
      const limit = 10;
      const start = (nextPage - 1) * limit;
      const paged = all.slice(start, start + limit);
      const newTotalPages = Math.ceil(all.length / limit) || 1;
      set({
        redeemRequests: [...redeemRequests, ...paged],
        currentPage: nextPage,
        totalPages: newTotalPages,
        hasMoreRequests: nextPage < newTotalPages,
        loadingMore: false,
      });
    } catch {
      set({ loadingMore: false });
    }
  },

  fetchRedeemRequestDetails: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      const all = await readRequests();
      const found = all.find((r) => r.id === requestId);
      set({ isLoading: false });
      if (!found) throw new Error("Request not found");
      return found;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to fetch request details";
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      conversionRate: null,
      redeemRequests: [],
      isLoading: false,
      loadingMore: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMoreRequests: false,
    }),
}));
