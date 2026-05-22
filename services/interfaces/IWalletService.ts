export interface WalletTransaction {
  id: string;
  type: "EARNED" | "REDEEMED";
  amount: number;
  note: string;
  date: string;
  formattedDate: string;
  course?: string | null;
}

export interface WalletSummary {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactions: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IWalletService {
  getWallet(page?: number, limit?: number): Promise<WalletSummary>;
}
