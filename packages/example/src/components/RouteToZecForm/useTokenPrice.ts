import { useState, useEffect } from 'react';
import { getSwapApiAssets } from '@asset-route-sdk/core';
import type { SwapApiAsset } from '@asset-route-sdk/core';

export function useTokenPrice(assetSymbol: string) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[useTokenPrice] Fetching assets...');
        const assets = await getSwapApiAssets();
        console.log('[useTokenPrice] Received', assets.length, 'assets');

        if (!mounted) return;

        const asset = assets.find(
          (a: SwapApiAsset) => a.symbol.toLowerCase() === assetSymbol.toLowerCase()
        );

        if (asset) {
          console.log('[useTokenPrice] Found asset:', assetSymbol, 'price:', asset.price);
          setPrice(asset.price);
        } else {
          console.error('[useTokenPrice] Asset not found:', assetSymbol);
          setError(`Asset ${assetSymbol} not found`);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
        console.error('[useTokenPrice] Failed to fetch token price:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [assetSymbol]);

  return { price, loading, error };
}
