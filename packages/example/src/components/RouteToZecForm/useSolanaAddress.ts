import { useState, useEffect } from 'react';
import { useAccounts } from '../../contexts/AccountContext';

export function useSolanaAddress(mnemonic: string) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { solanaAccount, isLoading: accountsLoading } = useAccounts();

  useEffect(() => {
    let mounted = true;

    const fetchAddress = async () => {
      if (!mnemonic || !mnemonic.trim()) {
        setAddress('');
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
  }, [mnemonic, accountsLoading, solanaAccount]);

  return { address, loading };
}
