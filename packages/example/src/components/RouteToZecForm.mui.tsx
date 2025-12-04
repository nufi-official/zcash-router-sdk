import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { SwapTimeline } from './RouteToZecForm/SwapTimeline';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useSolBalance } from './RouteToZecForm/useSolBalance';
import { getZcashAccount } from './RouteToZecForm/zcashAccountManager';
import {
  CARVED_BOX_STYLES,
  SLIDE_DOWN_ANIMATION,
} from './RouteToZecForm/constants';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

interface RouteToZecFormProps {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
  onConnectClick?: () => void;
}

export function RouteToZecForm({ addressType, mnemonic, onConnectClick }: RouteToZecFormProps) {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');
  const [swapStatus, setSwapStatus] = useState<
    'idle' | 'monitoring' | 'success' | 'error'
  >('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [swapError, setSwapError] = useState<string>();

  const { price, loading: priceLoading } = useTokenPrice(asset);
  const { balance: solBalance, loading: balanceLoading } =
    useSolBalance(mnemonic);

  // Max balance is the SOL balance (only shown for SOL asset)
  const maxBalance = useMemo(() => {
    if (asset !== 'SOL' || balanceLoading) return '0';
    return solBalance;
  }, [asset, solBalance, balanceLoading]);

  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || price <= 0) {
      return '$0';
    }
    const value = numAmount * price;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amount, price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!price || price <= 0) {
      alert('Waiting for price data...');
      return;
    }

    try {
      // Set status to monitoring to show processing UI
      setSwapStatus('monitoring');
      setSwapError(undefined);
      setCurrentState(undefined);

      // Validate mnemonic
      if (!mnemonic || !mnemonic.trim()) {
        alert('Please enter a mnemonic');
        setSwapStatus('idle');
        return;
      }

      // Get lightwalletd URL from environment variable
      const lightwalletdUrl =
        import.meta.env.VITE_LIGHTWALLETD_URL ||
        'https://zcash-mainnet.chainsafe.dev';

      // Get Zcash account
      let zcashAccount;

      try {
        zcashAccount = await getZcashAccount({
          addressType,
          mnemonic,
          lightwalletdUrl,
        });
      } catch (zcashErr) {
        console.error(
          '[RouteToZecForm] Failed to create Zcash account:',
          zcashErr
        );
        setSwapStatus('idle');
        const errorMsg =
          zcashErr instanceof Error ? zcashErr.message : 'Unknown error';
        if (
          addressType === 'shielded' &&
          errorMsg.includes('UnifiedSpendingKey')
        ) {
          alert(
            `Failed to create Zcash shielded account. This may require additional WASM initialization. Try using "Transparent" address type instead.`
          );
        } else {
          alert(`Failed to create Zcash ${addressType} account: ${errorMsg}`);
        }
        return;
      }

      // Get Solana account (full account with balance and send capabilities)
      const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL;
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

      console.log('[RouteToZecForm] Starting swap with routeToZcash:', {
        amount: numAmount,
        asset,
        addressType,
      });

      // Execute the swap using routeToZcash
      const { routeToZcash } = await import('@asset-route-sdk/core');

      await routeToZcash({
        sourceAccount: solanaAccount,
        zcashAccount: zcashAccount,
        amount: numAmount.toString(),
        onSwapStatusChange: (event) => {
          // eslint-disable-next-line no-console
          console.log('[RouteToZecForm] Swap status:', event);
          setCurrentState(event);

          if (event.status === 'DEPOSIT_SENT') {
            // Deposit sent, continue monitoring
            setSwapStatus('monitoring');
          } else if (event.status === 'SUCCESS') {
            setSwapStatus('success');
          } else if (event.status === 'FAILED' || event.status === 'REFUNDED') {
            setSwapStatus('error');
            setSwapError(`Swap ${event.status.toLowerCase()}`);
          }
        },
      });
    } catch (err) {
      console.error('[RouteToZecForm] Failed to execute swap:', err);
      setSwapStatus('error');
      setSwapError(err instanceof Error ? err.message : 'Unknown error');
      alert(
        `Failed to execute swap: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Amount and Asset Selector */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
        >
          → Zcash
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AmountInput value={amount} onChange={setAmount} />
          <AssetSelect value={asset} onChange={setAsset} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {priceLoading ? 'Loading price...' : usdValue}
          </Typography>
          <Typography
            onClick={() => !balanceLoading && setAmount(maxBalance)}
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'white',
              cursor: balanceLoading ? 'default' : 'pointer',
              opacity: balanceLoading ? 0.6 : 1,
              '&:hover': {
                textDecoration: balanceLoading ? 'none' : 'underline',
              },
            }}
          >
            {balanceLoading
              ? 'Loading balance...'
              : `MAX: ${maxBalance} ${asset}`}
          </Typography>
        </Box>
      </Box>

      {/* Submit Button */}
      <SwapButton
        isProcessing={swapStatus === 'monitoring'}
        text="Swap"
        isLoggedIn={!!mnemonic && !!mnemonic.trim()}
        onConnectClick={onConnectClick}
      />

      {/* Timeline - Show during swap execution */}
      {(swapStatus === 'monitoring' || swapStatus === 'success') && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapTimeline
            currentState={currentState}
            isFetchingQuote={false}
            hasQuote={true}
          />
        </Box>
      )}

      {/* Error Display - Show only on error */}
      {swapStatus === 'error' && swapError && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Box sx={{ ...CARVED_BOX_STYLES, p: 3 }}>
            <Typography color="error" variant="body2">
              Error: {swapError}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
