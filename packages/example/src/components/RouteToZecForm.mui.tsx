import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { SwapStatus } from './SwapStatus.mui';
import { AmountInput } from './RouteToZecForm/AmountInput';
import { AssetSelect } from './RouteToZecForm/AssetSelect';
import { SwapButton } from './RouteToZecForm/SwapButton';
import { QuoteDisplay } from './RouteToZecForm/QuoteDisplay';
import { useSwapState } from './RouteToZecForm/useSwapState';
import { useTokenPrice } from './RouteToZecForm/useTokenPrice';
import { useSwapQuote } from './RouteToZecForm/useSwapQuote';
import { CARVED_BOX_STYLES, SLIDE_DOWN_ANIMATION } from './RouteToZecForm/constants';

// Temporary placeholder addresses - replace with real wallet integration
const PLACEHOLDER_SOL_ADDRESS = 'So11111111111111111111111111111111111111112';
// Valid Zcash transparent address format (t-address)
const PLACEHOLDER_ZEC_ADDRESS = 't1gQn3cVQDM5Cnez96dAAZfKZydJDKq73cX';

export function RouteToZecForm() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');

  const { swapStatus, currentState, txHash, error } = useSwapState();
  const { price, loading: priceLoading } = useTokenPrice(asset);
  const { quote, loading: quoteLoading, error: quoteError, fetchQuote } = useSwapQuote();

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
      // For now, we need to get the assets to get their assetIds
      // In a real app, you'd cache this or get it from the token price hook
      const { getSwapApiAssets } = await import('@asset-route-sdk/core');
      const assets = await getSwapApiAssets();

      const sourceAsset = assets.find(a => a.symbol === asset);
      const destinationAsset = assets.find(a => a.symbol === 'ZEC');

      if (!sourceAsset || !destinationAsset) {
        alert('Asset not found');
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

      // Uncomment to test mock progress
      // startMockProgress();
    } catch (err) {
      console.error('[RouteToZecForm] Failed to get quote:', err);
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
        isProcessing={quoteLoading || swapStatus === 'processing'}
        text={quote ? 'Get New Quote' : 'Get Quote'}
      />

      {/* Quote Display */}
      {quote && !quoteError && (
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

      {/* Status Display */}
      {swapStatus !== 'idle' && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapStatus
            status={swapStatus}
            currentState={currentState}
            txHash={txHash}
            error={error}
          />
        </Box>
      )}
    </Box>
  );
}
