import { useState, useEffect } from 'react';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-hot-shielded-full';
import { createZcashTransparentAccount } from '@asset-route-sdk/zcash-hot-transparent-full';

export function useZecBalance(
  addressType: 'transparent' | 'shielded',
  mnemonic: string
) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

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

        // Create the appropriate Zcash account based on address type
        const account =
          addressType === 'shielded'
            ? await createZcashShieldedAccount({
                mnemonic: mnemonic.trim(),
                accountIndex: 0,
                network: 'main',
                lightwalletdUrl,
                minConfirmations: 1,
              })
            : await createZcashTransparentAccount({
                mnemonic: mnemonic.trim(),
                accountIndex: 0,
                network: 'main',
                lightwalletdUrl,
                minConfirmations: 1,
              });

        // Get balance in base units (zatoshis)
        const balanceInZatoshis = await account.getBalance();

        if (!mounted) return;

        // Convert from zatoshis to ZEC (1 ZEC = 100,000,000 zatoshis)
        const balanceInZec = Number(balanceInZatoshis) / 100_000_000;
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
  }, [addressType, mnemonic]);

  return { balance, loading, error };
}
