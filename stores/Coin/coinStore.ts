import { apiClient } from "@/lib/api-client";
import { create } from "zustand";

// Types
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

interface RedeemStatistics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalCoinsRedeemed: number;
  totalAmountPaid: number;
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
  // State
  conversionRate:
    | (ConversionRate & { subscriptionTier: SubscriptionTier })
    | null;
  redeemRequests: RedeemRequest[];
  statistics: RedeemStatistics | null;
  isLoading: boolean;
  loadingMore: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMoreRequests: boolean;

  // Actions
  fetchConversionRate: () => Promise<void>;
  calculateConversion: (coins: number) => Promise<ConversionCalculation>;
  createRedeemRequest: (
    coinsRequested: number,
    zuperiorAccountNumber: string
  ) => Promise<CreateRedeemResult>;
  fetchRedeemRequests: (page?: number) => Promise<void>;
  fetchMoreRedeemRequests: () => Promise<void>;
  fetchRedeemRequestDetails: (requestId: string) => Promise<RedeemRequest>;
  fetchStatistics: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useRedeemStore = create<RedeemState>((set, get) => ({
  // Initial state
  conversionRate: null,
  redeemRequests: [],
  statistics: null,
  isLoading: false,
  loadingMore: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMoreRequests: false,

  // Fetch conversion rate for current user's subscription
  fetchConversionRate: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ConversionRate & { subscriptionTier: SubscriptionTier };
      }>("/api/user/redeem/conversion-rate");

      set({
        conversionRate: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversion rate",
        isLoading: false,
      });
    }
  },

  // Calculate conversion for current user's subscription
  calculateConversion: async (coins: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ConversionCalculation;
      }>(`/api/user/redeem/calculate?coins=${coins}`);

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to calculate conversion";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Create redeem request
  createRedeemRequest: async (
    coinsRequested: number,
    zuperiorAccountNumber: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: CreateRedeemResult;
      }>("/api/user/redeem/requests", {
        coinsRequested,
        zuperiorAccountNumber,
      });

      // Refresh requests list after creation
      await get().fetchRedeemRequests();

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create redeem request";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch redeem requests
  fetchRedeemRequests: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          requests: RedeemRequest[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>(`/api/user/redeem/requests?page=${page}&limit=10`);

      set({
        redeemRequests: response.data.requests,
        currentPage: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        hasMoreRequests:
          response.data.pagination.page < response.data.pagination.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch redeem requests",
        isLoading: false,
      });
    }
  },

  // Fetch more redeem requests (pagination)
  fetchMoreRedeemRequests: async () => {
    const { currentPage, totalPages, loadingMore, redeemRequests } = get();

    if (loadingMore || currentPage >= totalPages) return;

    set({ loadingMore: true });
    try {
      const nextPage = currentPage + 1;
      const response = await apiClient.get<{
        success: boolean;
        data: {
          requests: RedeemRequest[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      }>(`/api/user/redeem/requests?page=${nextPage}&limit=10`);

      set({
        redeemRequests: [...redeemRequests, ...response.data.requests],
        currentPage: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        hasMoreRequests:
          response.data.pagination.page < response.data.pagination.totalPages,
        loadingMore: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch more redeem requests",
        loadingMore: false,
      });
    }
  },

  // Fetch single request details
  fetchRedeemRequestDetails: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: RedeemRequest;
      }>(`/api/user/redeem/requests/${requestId}`);

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch request details";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch statistics
  fetchStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: RedeemStatistics;
      }>("/api/user/redeem/statistics");

      set({
        statistics: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch statistics",
        isLoading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      conversionRate: null,
      redeemRequests: [],
      statistics: null,
      isLoading: false,
      loadingMore: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      hasMoreRequests: false,
    }),
}));
