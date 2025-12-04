import { useState, useEffect } from 'react';

export function useSolBalance(mnemonic: string) {
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

        // Get Solana RPC URL from environment or use default
        const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;

        // Create Solana account
        const { createSolanaAccountFull } = await import(
          '@asset-route-sdk/solana-hot-address-only'
        );
        const solanaAccount = await createSolanaAccountFull({
          mnemonic: mnemonic.trim(),
          accountIndex: 0,
          network: 'mainnet',
          tokenId: undefined,
          rpcUrl, // Will use Ankr if not specified
        });

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
  }, [mnemonic]);

  return { balance, loading, error };
}
