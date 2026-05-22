import { IWalletService, WalletSummary } from "@/services/interfaces/IWalletService";
import { mockWallet } from "./data/wallet";

function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total: items.length,
    totalPages: Math.ceil(items.length / limit),
  };
}

export class MockWalletService implements IWalletService {
  async getWallet(page = 1, limit = 10): Promise<WalletSummary> {
    const paged = paginate(mockWallet.transactions, page, limit);
    return {
      balance: mockWallet.balance,
      totalEarned: mockWallet.totalEarned,
      totalRedeemed: mockWallet.totalRedeemed,
      transactions: paged.items,
      pagination: {
        page,
        limit,
        total: paged.total,
        totalPages: paged.totalPages,
      },
    };
  }
}
