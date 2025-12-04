import { useState, useEffect } from 'react';

export function useZcashAddress(
  mnemonic: string,
  addressType: 'transparent' | 'shielded'
) {
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
        const lightwalletdUrl =
          import.meta.env.VITE_LIGHTWALLETD_URL ||
          'https://zcash-mainnet.chainsafe.dev';

        const { getZcashAccount } = await import('./zcashAccountManager');
        const zcashAccount = await getZcashAccount({
          addressType,
          mnemonic: mnemonic.trim(),
          lightwalletdUrl,
        });

        const addr = await zcashAccount.getAddress();
        if (!mounted) return;

        setAddress(addr);
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to get Zcash address:', err);
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
  }, [mnemonic, addressType]);

  return { address, loading };
}
