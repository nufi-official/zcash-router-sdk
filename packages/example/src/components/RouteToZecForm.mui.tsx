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
import { getZcashAccount } from './RouteToZecForm/zcashAccountManager';
import { CARVED_BOX_STYLES, SLIDE_DOWN_ANIMATION } from './RouteToZecForm/constants';
import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

interface RouteToZecFormProps {
  addressType: 'transparent' | 'shielded';
  mnemonic: string;
}

export function RouteToZecForm({ addressType, mnemonic }: RouteToZecFormProps) {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('SOL');
  const [swapStatus, setSwapStatus] = useState<'idle' | 'fetching-quote' | 'monitoring' | 'success' | 'error'>('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [swapError, setSwapError] = useState<string>();
  const [solanaAddress, setSolanaAddress] = useState<string>('');
  const [zcashAddress, setZcashAddress] = useState<string>('');
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

  // Derive addresses when mnemonic or address type changes
  useEffect(() => {
    const deriveAddresses = async () => {
      if (!mnemonic || !mnemonic.trim()) {
        setSolanaAddress('');
        setZcashAddress('');
        return;
      }

      try {
        // Clean up mnemonic: trim and normalize whitespace
        const cleanedMnemonic = mnemonic.trim().replace(/\s+/g, ' ');
        console.log('[RouteToZecForm] Original mnemonic length:', mnemonic.length);
        console.log('[RouteToZecForm] Cleaned mnemonic:', cleanedMnemonic);
        console.log('[RouteToZecForm] Word count:', cleanedMnemonic.split(' ').length);

        // Derive Solana address
        const { createSolanaAccount } = await import('@asset-route-sdk/solana-hot-address-only');
        const solanaAccount = await createSolanaAccount({
          mnemonic: cleanedMnemonic,
          accountIndex: 0,
          network: 'mainnet',
          tokenId: 'native',
        });
        const solAddr = await solanaAccount.getAddress();
        console.log('[RouteToZecForm] Derived Solana address:', solAddr);
        setSolanaAddress(solAddr);

        // Derive Zcash address
        const lightwalletdUrl =
          import.meta.env.VITE_LIGHTWALLETD_URL ||
          'https://zcash-mainnet.chainsafe.dev';
        const zcashAccount = await getZcashAccount({
          addressType,
          mnemonic: cleanedMnemonic,
          lightwalletdUrl,
        });
        const zecAddr = await zcashAccount.getAddress();
        console.log('[RouteToZecForm] Derived Zcash address:', zecAddr, 'Type:', addressType);
        setZcashAddress(zecAddr);
      } catch (err) {
        console.error('[RouteToZecForm] Failed to derive addresses:', err);
        // Clear addresses on error
        setSolanaAddress('');
        setZcashAddress('');
      }
    };

    void deriveAddresses();
  }, [mnemonic, addressType]);

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

      // Get Zcash account and address
      let zcashAccount;
      let recipientAddress;

      try {
        zcashAccount = await getZcashAccount({
          addressType,
          mnemonic,
          lightwalletdUrl,
        });

        recipientAddress = await zcashAccount.getAddress();
      } catch (zcashErr) {
        console.error('[RouteToZecForm] Failed to create Zcash account:', zcashErr);
        setSwapStatus('idle');
        const errorMsg = zcashErr instanceof Error ? zcashErr.message : 'Unknown error';
        if (addressType === 'shielded' && errorMsg.includes('UnifiedSpendingKey')) {
          alert(`Failed to create Zcash shielded account. This may require additional WASM initialization. Try using "Transparent" address type instead.`);
        } else {
          alert(`Failed to create Zcash ${addressType} account: ${errorMsg}`);
        }
        return;
      }

      // Get Solana account and address
      const { createSolanaAccount } = await import('@asset-route-sdk/solana-hot-address-only');
      const solanaAccount = await createSolanaAccount({
        mnemonic: mnemonic.trim(),
        accountIndex: 0,
        network: 'mainnet',
        tokenId: 'native',
      });

      const senderAddress = await solanaAccount.getAddress();

      console.log('[RouteToZecForm] Using addresses:', {
        addressType,
        senderAddress,
        recipientAddress,
      });

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
        senderAddress,
        recipientAddress,
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
      {/* Addresses Display */}
      {(solanaAddress || zcashAddress) && (
        <Box sx={{ ...CARVED_BOX_STYLES, p: 2, mb: 3 }}>
          {solanaAddress && (
            <Box sx={{ mb: zcashAddress ? 1.5 : 0 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Solana Address (Sender)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: 'primary.main',
                  wordBreak: 'break-all',
                }}
              >
                {solanaAddress}
              </Typography>
            </Box>
          )}
          {zcashAddress && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Zcash Address (Recipient - {addressType})
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: 'secondary.main',
                  wordBreak: 'break-all',
                }}
              >
                {zcashAddress}
              </Typography>
            </Box>
          )}
        </Box>
      )}

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

      {/* Timeline - Show immediately after submit */}
      {(swapStatus === 'fetching-quote' || swapStatus === 'monitoring' || swapStatus === 'success') && (
        <Box sx={{ ...SLIDE_DOWN_ANIMATION, mt: 3 }}>
          <SwapTimeline
            currentState={currentState}
            isFetchingQuote={swapStatus === 'fetching-quote' && !quote}
            hasQuote={!!quote}
          />
        </Box>
      )}

      {/* Quote Display - Show once we have the quote (after Getting Quote step is complete) */}
      {quote && !quoteError && swapStatus !== 'idle' && (
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
