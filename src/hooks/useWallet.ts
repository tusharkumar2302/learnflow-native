import { useCallback, useEffect, useState } from "react";
import { walletService } from "@/services";
import { WalletSummary } from "@/services/interfaces/IWalletService";

export function useWallet(page = 1) {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await walletService.getWallet(page);
      setWallet(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load wallet");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { wallet, isLoading, error, refetch: fetchWallet };
}
