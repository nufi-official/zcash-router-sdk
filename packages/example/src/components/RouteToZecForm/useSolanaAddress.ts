import { useState, useEffect } from 'react';

export function useSolanaAddress(mnemonic: string) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchAddress = async () => {
      if (!mnemonic || !mnemonic.trim()) {
        setAddress('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;
        const { createSolanaAccountFull } = await import(
          '@asset-route-sdk/solana-hot-address-only'
        );
        const solanaAccount = await createSolanaAccountFull({
          mnemonic: mnemonic.trim(),
          accountIndex: 0,
          network: 'mainnet',
          tokenId: undefined,
          rpcUrl,
        });

        const addr = await solanaAccount.getAddress();
        if (!mounted) return;

        setAddress(addr);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to get Solana address:', err);
        setAddress('');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchAddress();

    return () => {
      mounted = false;
    };
  }, [mnemonic]);

  return { address, loading };
}
