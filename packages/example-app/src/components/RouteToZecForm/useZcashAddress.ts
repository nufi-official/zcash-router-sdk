import { useState, useEffect } from 'react';
import { useAccounts } from '../../contexts/AccountContext';

export function useZcashAddress(
  mnemonic: string,
  addressType: 'transparent' | 'shielded'
) {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { zcashTransparentAccount, zcashShieldedAccount, isLoading: accountsLoading } = useAccounts();

  useEffect(() => {
    let mounted = true;

    const fetchAddress = async () => {
      if (!mnemonic || !mnemonic.trim()) {
        setAddress('');
        setLoading(false);
        return;
      }

      // Wait for account to be available
      const zcashAccount = addressType === 'shielded' ? zcashShieldedAccount : zcashTransparentAccount;
      if (accountsLoading || !zcashAccount) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
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
  }, [mnemonic, addressType, accountsLoading, zcashTransparentAccount, zcashShieldedAccount]);

  return { address, loading };
}
