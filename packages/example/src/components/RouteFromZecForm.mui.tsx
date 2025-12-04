import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { SwapTimeline } from './RouteToZecForm/SwapTimeline';
import { AddressDisplay } from './RouteToZecForm/AddressDisplay';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useZecBalance } from './RouteToZecForm/useZecBalance';
import { useZcashAddress } from './RouteToZecForm/useZcashAddress';
import {
  CARVED_BOX_STYLES,
  SLIDE_DOWN_ANIMATION,
} from './RouteToZecForm/constants';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

interface RouteFromZecFormProps {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
  onConnectClick?: () => void;
  onRefreshBalance?: (refresh: () => void) => void;
}

export function RouteFromZecForm({
  addressType,
  mnemonic,
  onConnectClick,
  onRefreshBalance,
}: RouteFromZecFormProps) {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [swapStatus, setSwapStatus] = useState<
    'idle' | 'initiating' | 'monitoring' | 'success' | 'error'
  >('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [swapError, setSwapError] = useState<string>();

  const { price: assetPrice, loading: priceLoading } = useTokenPrice(asset);
  const { price: zecPrice, loading: zecPriceLoading } = useTokenPrice('ZEC');
  const { balance: zecBalance, loading: balanceLoading, refresh: refreshZecBalance } = useZecBalance(
    addressType,
    mnemonic
  );
  const { address: zcashAddress, loading: addressLoading } = useZcashAddress(
    mnemonic,
    addressType
  );

  // Pass refresh function to parent
  useEffect(() => {
    if (onRefreshBalance) {
      onRefreshBalance(refreshZecBalance);
    }
  }, [onRefreshBalance, refreshZecBalance]);

  // Calculate max SOL amount based on ZEC balance
  const maxBalance = useMemo(() => {
    if (balanceLoading || zecPriceLoading || priceLoading) return '0';

    const zecBalanceNum = parseFloat(zecBalance);
    const zecPriceNum = zecPrice;
    const assetPriceNum = assetPrice;

    if (
      isNaN(zecBalanceNum) ||
      zecBalanceNum <= 0 ||
      zecPriceNum <= 0 ||
      assetPriceNum <= 0
    ) {
      return '0';
    }

    // Convert ZEC balance to USD, then to SOL
    const zecValueInUsd = zecBalanceNum * zecPriceNum;
    const maxAssetAmount = zecValueInUsd / assetPriceNum;

    return maxAssetAmount.toFixed(6);
  }, [
    zecBalance,
    zecPrice,
    assetPrice,
    balanceLoading,
    zecPriceLoading,
    priceLoading,
  ]);

  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || assetPrice <= 0) {
      return '$0';
    }
    const value = numAmount * assetPrice;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amount, assetPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!destinationAddress || !destinationAddress.trim()) {
      alert('Please enter a destination Solana address');
      return;
    }

    if (!mnemonic || !mnemonic.trim()) {
      alert('Please enter a mnemonic');
      return;
    }

    try {
      setSwapStatus('initiating');
      setSwapError(undefined);

      // Get lightwalletd URL from environment variable
      const lightwalletdUrl =
        import.meta.env.VITE_LIGHTWALLETD_URL ||
        'https://zcash-mainnet.chainsafe.dev';

      // Import required functions
      const { routeFromZcash } = await import('@asset-route-sdk/core');
      const { getZcashAccount } = await import(
        './RouteToZecForm/zcashAccountManager'
      );

      // Get Zcash account (source)
      console.log('[RouteFromZecForm] Creating Zcash account...');
      const zcashAccount = await getZcashAccount({
        addressType,
        mnemonic,
        lightwalletdUrl,
      });

      if (!zcashAccount) {
        throw new Error(
          'Failed to create Zcash account - account is undefined'
        );
      }

      console.log('[RouteFromZecForm] Zcash account created:', {
        hasAccount: !!zcashAccount,
        type: zcashAccount.type,
        hasAssetToBaseUnits:
          typeof zcashAccount.assetToBaseUnits === 'function',
        hasGetAddress: typeof zcashAccount.getAddress === 'function',
        hasSendDeposit: typeof zcashAccount.sendDeposit === 'function',
      });

      const address = await zcashAccount.getAddress();
      console.log('[RouteFromZecForm] Zcash address:', address);

      // Create destination AddressOnlyAccount for Solana
      const destinationAccount = {
        type: 'addressOnly' as const,
        asset: {
          blockchain: 'sol' as const,
          tokenId: undefined,
        },
        getAddress: async () => destinationAddress.trim(),
        assetToBaseUnits: (amount: string) => {
          // SOL has 9 decimals
          return BigInt(Math.floor(parseFloat(amount) * 1_000_000_000));
        },
      };

      // Convert SOL amount (what user wants to receive) to ZEC amount (what needs to be sent)
      // User entered SOL amount, we need to calculate equivalent ZEC amount
      const solAmountInUsd = numAmount * assetPrice;
      const zecAmountNeeded = solAmountInUsd / zecPrice;

      console.log('[RouteFromZecForm] Starting swap:', {
        solAmountRequested: numAmount,
        solPriceUsd: assetPrice,
        zecPriceUsd: zecPrice,
        solAmountInUsd,
        zecAmountNeeded,
        from: 'ZEC',
        to: asset,
        sourceAddress: await zcashAccount.getAddress(),
        destinationAddress,
      });

      // Start monitoring
      setSwapStatus('monitoring');

      // Execute the swap - pass ZEC amount (source asset amount)
      await routeFromZcash({
        zcashAccount,
        destinationAccount,
        amount: zecAmountNeeded.toString(),
        onSwapStatusChange: (event) => {
          console.log('[RouteFromZecForm] Swap status:', event);
          setCurrentState(event);

          // Update swap status based on event
          if (event.status === 'SUCCESS') {
            setSwapStatus('success');
          } else if (event.status === 'FAILED' || event.status === 'REFUNDED') {
            setSwapStatus('error');
            setSwapError(`Swap ${event.status.toLowerCase()}`);
          }
        },
      });
    } catch (err) {
      console.error('[RouteFromZecForm] Swap failed:', err);
      setSwapStatus('error');
      setSwapError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {/* Amount and Asset Selector */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary' }}
          >
            Zcash →
          </Typography>
          <AddressDisplay
            address={zcashAddress}
            loading={addressLoading}
          />
        </Box>
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

      {/* Destination Address Input */}
      <Box sx={{ ...CARVED_BOX_STYLES, p: 3, mb: 3 }}>
        <TextField
          fullWidth
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          placeholder="Destination address"
          variant="standard"
          sx={{
            '& .MuiInput-root': {
              color: 'white',
              fontSize: '1rem',
              '&:before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: 'none',
              },
              '&:after': {
                borderBottom: 'none',
              },
            },
            '& .MuiInput-input': {
              padding: '8px 0',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Submit Button */}
      <SwapButton
        isProcessing={
          swapStatus === 'initiating' || swapStatus === 'monitoring'
        }
        text="Swap"
        isLoggedIn={!!mnemonic && !!mnemonic.trim()}
        onConnectClick={onConnectClick}
      />

      {/* Timeline - Show when swap is in progress */}
      {(swapStatus === 'initiating' ||
        swapStatus === 'monitoring' ||
        swapStatus === 'success') && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapTimeline
            currentState={currentState}
            isFetchingQuote={swapStatus === 'initiating'}
            hasQuote={swapStatus !== 'initiating'}
          />
        </Box>
      )}

      {/* Error Display */}
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
