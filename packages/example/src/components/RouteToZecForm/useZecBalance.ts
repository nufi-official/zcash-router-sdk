import { useState, useEffect, useCallback } from 'react';
import { getZcashAccount } from './zcashAccountManager';

export function useZecBalance(
  addressType: 'transparent' | 'shielded',
  mnemonic: string
) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

      try {
        setLoading(true);
        setError(undefined);

        // Get lightwalletd URL from environment variable
        const lightwalletdUrl =
          import.meta.env.VITE_LIGHTWALLETD_URL ||
          'https://zcash-mainnet.chainsafe.dev';

        // Get or create the Zcash account (singleton)
        const account = await getZcashAccount({
          addressType,
          mnemonic,
          lightwalletdUrl,
        });

        // Get balance in base units (zatoshis)
        const balanceInZatoshis = await account.getBalance();

        if (!mounted) return;

        // Convert from zatoshis to ZEC (1 ZEC = 100,000,000 zatoshis)
        const balanceInZec = Number(balanceInZatoshis) / 100_000_000;

        console.log('[useZecBalance] Zcash Balance:', {
          addressType,
          balanceInZatoshis: balanceInZatoshis.toString(),
          balanceInZec,
          address: await account.getAddress(),
        });

        setBalance(balanceInZec.toString());
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
  }, [addressType, mnemonic, refreshTrigger]);

  return { balance, loading, error, refresh };
}
