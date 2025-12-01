import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { QuoteDisplay } from './RouteToZecForm/QuoteDisplay';
import { SwapTimeline } from './RouteToZecForm/SwapTimeline';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useSwapQuote } from './RouteToZecForm/useSwapQuote';
import { useSwapExecution } from './RouteToZecForm/useSwapExecution';
import { CARVED_BOX_STYLES, SLIDE_DOWN_ANIMATION } from './RouteToZecForm/constants';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

// Temporary placeholder addresses - replace with real wallet integration
const PLACEHOLDER_SOL_ADDRESS = 'So11111111111111111111111111111111111111112';
// Valid Zcash transparent address format (t-address)
const PLACEHOLDER_ZEC_ADDRESS = 't1gQn3cVQDM5Cnez96dAAZfKZydJDKq73cX';

export function RouteToZecForm() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');
  const [swapStatus, setSwapStatus] = useState<'idle' | 'fetching-quote' | 'monitoring' | 'success' | 'error'>('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [swapError, setSwapError] = useState<string>();
  const shouldAutoStartRef = useRef(false);

  const { price, loading: priceLoading } = useTokenPrice(asset);
  const { quote, loading: quoteLoading, error: quoteError, fetchQuote } = useSwapQuote();
  const { startSwapExecution } = useSwapExecution();

  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || price <= 0) {
      return '$0';
    }
    const value = numAmount * price;
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [amount, price]);

  // Auto-start monitoring when quote is received
  useEffect(() => {
    if (quote && shouldAutoStartRef.current && swapStatus === 'fetching-quote') {
      console.log('[RouteToZecForm] Quote received, auto-starting monitoring...');
      shouldAutoStartRef.current = false; // Reset flag

      // Start monitoring immediately after quote
      handleStartMonitoring();
    }
  }, [quote, swapStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartMonitoring = useCallback(async () => {
    if (!quote?.quote.depositAddress) {
      alert('No deposit address available');
      return;
    }

    try {
      console.log('[RouteToZecForm] Starting swap monitoring...');
      setSwapStatus('monitoring');
      setSwapError(undefined);

      await startSwapExecution({
        depositAddress: quote.quote.depositAddress,
        onStatusChange: (event) => {
          console.log('[RouteToZecForm] Status update:', event);
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
      console.error('[RouteToZecForm] Swap monitoring failed:', err);
      setSwapStatus('error');
      setSwapError(err instanceof Error ? err.message : 'Swap monitoring failed');
    }
  }, [quote, startSwapExecution]);

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
      // Set status to fetching-quote to show processing UI
      setSwapStatus('fetching-quote');
      setSwapError(undefined);

      // For now, we need to get the assets to get their assetIds
      // In a real app, you'd cache this or get it from the token price hook
      const { getSwapApiAssets } = await import('@asset-route-sdk/core');
      const assets = await getSwapApiAssets();

      const sourceAsset = assets.find(a => a.symbol === asset);
      const destinationAsset = assets.find(a => a.symbol === 'ZEC');

      if (!sourceAsset || !destinationAsset) {
        alert('Asset not found');
        setSwapStatus('idle');
        return;
      }

      // Convert amount to base units (considering decimals)
      const amountInBaseUnits = (numAmount * Math.pow(10, sourceAsset.decimals)).toString();

      console.log('[RouteToZecForm] Fetching quote for swap:', {
        amount: numAmount,
        amountInBaseUnits,
        from: sourceAsset.symbol,
        to: destinationAsset.symbol,
      });

      await fetchQuote({
        amount: amountInBaseUnits,
        sourceAsset,
        destinationAsset,
        senderAddress: PLACEHOLDER_SOL_ADDRESS,
        recipientAddress: PLACEHOLDER_ZEC_ADDRESS,
      });

      // Set flag to auto-start monitoring when quote is received
      shouldAutoStartRef.current = true;
    } catch (err) {
      console.error('[RouteToZecForm] Failed to get quote:', err);
      setSwapStatus('idle');
      alert(`Failed to get quote: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
          Sell
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AmountInput value={amount} onChange={setAmount} />
          <AssetSelect value={asset} onChange={setAsset} />
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {priceLoading ? 'Loading price...' : usdValue}
        </Typography>
      </Box>

      {/* Submit Button */}
      <SwapButton
        isProcessing={quoteLoading || swapStatus === 'fetching-quote'}
        text={quote && swapStatus === 'idle' ? 'Get New Quote' : 'Get Quote'}
      />

      {/* Show processing state while fetching quote */}
      {swapStatus === 'fetching-quote' && !quote && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Fetching quote...
          </Typography>
        </Box>
      )}

      {/* Timeline - Show as separate bubble above deposit address */}
      {currentState && (
        currentState.status === 'PENDING_DEPOSIT' ||
        currentState.status === 'PROCESSING' ||
        currentState.status === 'KNOWN_DEPOSIT_TX'
      ) && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapTimeline currentState={currentState} />
        </Box>
      )}

      {/* Quote Display - Show during PENDING_DEPOSIT or PROCESSING */}
      {quote && !quoteError && (
        currentState?.status === 'PENDING_DEPOSIT' ||
        currentState?.status === 'PROCESSING' ||
        currentState?.status === 'KNOWN_DEPOSIT_TX'
      ) && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <QuoteDisplay
            quote={quote}
            sourceSymbol={asset}
            destinationSymbol="ZEC"
          />
        </Box>
      )}

      {/* Error Display */}
      {quoteError && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <Typography color="error" variant="body2">
            {quoteError}
          </Typography>
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
