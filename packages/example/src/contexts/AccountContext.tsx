import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { AccountFull } from '@asset-route-sdk/core';
import { loadAndInitWebZjs } from '@asset-route-sdk/zcash-core';
import { createZcashShieldedAccount } from '@asset-route-sdk/zcash-core';
import { createSolanaAccountFull } from '@asset-route-sdk/solana-hot-address-only';

interface AccountContextType {
  solanaAccount: AccountFull | null;
  zcashTransparentAccount: AccountFull | null;
  zcashShieldedAccount: AccountFull | null;
  isLoading: boolean;
  error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
  mnemonic: string;
}

export function AccountProvider({ children, mnemonic }: AccountProviderProps) {
  const [solanaAccount, setSolanaAccount] = useState<AccountFull | null>(null);
  const [zcashTransparentAccount, setZcashTransparentAccount] =
    useState<AccountFull | null>(null);
  const [zcashShieldedAccount, setZcashShieldedAccount] =
    useState<AccountFull | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mnemonic || !mnemonic.trim()) {
      // Clear accounts if no mnemonic
      setSolanaAccount(null);
      setZcashTransparentAccount(null);
      setZcashShieldedAccount(null);
      return;
    }

    const createAccounts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize WASM
        await loadAndInitWebZjs();

        const lightwalletdUrl =
          import.meta.env.VITE_LIGHTWALLETD_URL ||
          'https://zcash-mainnet.chainsafe.dev';
        const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;

        // Create all accounts in parallel
        const [solAccount, zecShielded] = await Promise.all([
          // Solana account
          createSolanaAccountFull({
            mnemonic: mnemonic.trim(),
            accountIndex: 0,
            network: 'mainnet',
            tokenId: undefined,
            rpcUrl,
          }),
          // Zcash transparent account
          // createZcashTransparentAccount({
          //   mnemonic: mnemonic.trim(),
          //   accountIndex: 0,
          //   network: 'main',
          //   lightwalletdUrl,
          //   minConfirmations: 1,
          // }),
          // Zcash shielded account
          createZcashShieldedAccount({
            mnemonic: mnemonic.trim(),
            accountIndex: 0,
            network: 'main',
            lightwalletdUrl,
            minConfirmations: 1,
          }),
        ]);

        setSolanaAccount(solAccount);
        // setZcashTransparentAccount(zecTransparent);
        setZcashShieldedAccount(zecShielded);
      } catch (err) {
        console.error('[AccountProvider] Failed to create accounts:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to create accounts'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void createAccounts();
  }, [mnemonic]);

  return (
    <AccountContext.Provider
      value={{
        solanaAccount,
        zcashTransparentAccount,
        zcashShieldedAccount,
        isLoading,
        error,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
}
