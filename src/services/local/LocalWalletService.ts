import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AddTransactionParams,
  IWalletService,
  WalletSummary,
  WalletTransaction,
} from "@/services/interfaces/IWalletService";
import { localWallet } from "./data/wallet";

const WALLET_KEY = "local_wallet";

function formatWalletDate(date: Date): { formattedDate: string; formattedDateTime: string } {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return {
    formattedDate: `${month} ${day}`,
    formattedDateTime: `${month} ${day}, ${hour12}:${minuteStr} ${ampm}`,
  };
}

export class LocalWalletService implements IWalletService {
  private async readWallet(): Promise<WalletSummary> {
    try {
      const raw = await AsyncStorage.getItem(WALLET_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return localWallet;
  }

  private async writeWallet(wallet: WalletSummary): Promise<void> {
    await AsyncStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  }

  async getWallet(page = 1, limit = 10): Promise<WalletSummary> {
    const wallet = await this.readWallet();
    const start = (page - 1) * limit;
    const paged = wallet.transactions.slice(start, start + limit);
    return {
      ...wallet,
      transactions: paged,
      pagination: {
        page,
        limit,
        total: wallet.transactions.length,
        totalPages: Math.ceil(wallet.transactions.length / limit) || 1,
      },
    };
  }

  async addTransaction(params: AddTransactionParams): Promise<void> {
    const wallet = await this.readWallet();
    const now = new Date();
    const { formattedDate, formattedDateTime } = formatWalletDate(now);

    const txn: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: params.type,
      amount: params.amount,
      note: params.note,
      date: now.toISOString(),
      formattedDate,
      formattedDateTime,
      course: params.course ?? null,
    };

    const allTransactions = [txn, ...wallet.transactions];
    const newBalance =
      params.type === "EARNED"
        ? wallet.balance + params.amount
        : Math.max(0, wallet.balance - params.amount);

    await this.writeWallet({
      balance: newBalance,
      totalEarned:
        params.type === "EARNED"
          ? wallet.totalEarned + params.amount
          : wallet.totalEarned,
      totalRedeemed:
        params.type === "REDEEMED"
          ? wallet.totalRedeemed + params.amount
          : wallet.totalRedeemed,
      transactions: allTransactions,
      pagination: {
        page: 1,
        limit: 10,
        total: allTransactions.length,
        totalPages: Math.ceil(allTransactions.length / 10),
      },
    });
  }
}
