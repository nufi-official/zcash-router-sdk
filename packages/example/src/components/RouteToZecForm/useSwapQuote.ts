import { useState, useCallback } from 'react';
import { getSwapQuote, type SwapApiAsset } from '@asset-route-sdk/core';
import type { SwapQuoteResponse } from '@asset-route-sdk/core';

interface GetQuoteParams {
  amount: string;
  sourceAsset: SwapApiAsset;
  destinationAsset: SwapApiAsset;
  senderAddress: string;
  recipientAddress: string;
}

export function useSwapQuote() {
  const [quote, setQuote] = useState<SwapQuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async (params: GetQuoteParams) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[useSwapQuote] Fetching quote with params:', {
        amount: params.amount,
        sourceAsset: params.sourceAsset.symbol,
        destinationAsset: params.destinationAsset.symbol,
        senderAddress: params.senderAddress,
        recipientAddress: params.recipientAddress,
      });

      const quoteResponse = await getSwapQuote({
        dry: false, // Set to true for dry run (no actual quote generation)
        senderAddress: params.senderAddress,
        recipientAddress: params.recipientAddress,
        originAsset: params.sourceAsset.assetId,
        destinationAsset: params.destinationAsset.assetId,
        amount: params.amount,
        slippageTolerance: 1, // 1% slippage tolerance
      });

      console.log('[useSwapQuote] Quote received:', quoteResponse);
      setQuote(quoteResponse);
      return quoteResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(errorMessage);
      console.error('[useSwapQuote] Failed to fetch quote:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearQuote = useCallback(() => {
    setQuote(null);
    setError(null);
  }, []);

  return {
    quote,
    loading,
    error,
    fetchQuote,
    clearQuote,
  };
}
