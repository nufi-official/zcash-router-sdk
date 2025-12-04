import { useState, useEffect, useCallback } from 'react';
import { useAccounts } from '../../contexts/AccountContext';

export function useSolBalance(mnemonic: string) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { solanaAccount, isLoading: accountsLoading } = useAccounts();

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchBalance = async () => {
      // If no mnemonic, don't fetch
      if (!mnemonic || !mnemonic.trim()) {
        setBalance('0');
        setLoading(false);
        return;
      }

      // Wait for account to be available
      if (accountsLoading || !solanaAccount) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        setError(undefined);

        // Get balance in base units (lamports)
        const balanceInLamports = await solanaAccount.getBalance();

        if (!mounted) return;

        // Convert from lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

        console.log('[useSolBalance] Solana Balance:', {
          balanceInLamports: balanceInLamports.toString(),
          balanceInSol,
          address: await solanaAccount.getAddress(),
        });

        setBalance(balanceInSol.toString());
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : 'Failed to fetch balance'
        );
        setBalance('0');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchBalance();

    return () => {
      mounted = false;
    };
  }, [mnemonic, refreshTrigger, accountsLoading, solanaAccount]);

  return { balance, loading, error, refresh };
}
