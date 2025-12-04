import { useState, useCallback } from 'react';
import { swapApi } from '@zcash-router-sdk/core';
import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';

interface StartSwapParams {
  depositAddress: string;
  onStatusChange: (event: SwapStateChangeEvent) => void;
}

export function useSwapExecution() {
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSwapExecution = useCallback(async (params: StartSwapParams) => {
    try {
      setIsPolling(true);
      setError(null);

      console.log('[useSwapExecution] Starting swap execution polling for deposit address:', params.depositAddress);

      // Start polling for status updates
      const statusResponse = await swapApi.pollStatus({
        depositAddress: params.depositAddress,
        maxAttempts: 100, // Poll up to 100 times
        pollingInterval: 3000, // Poll every 3 seconds
        initialDelay: 2000, // Wait 2 seconds before first poll
        onStatusChange: (event: SwapStateChangeEvent) => {
          console.log('[useSwapExecution] Status change:', event);
          params.onStatusChange(event);
        },
      });

      console.log('[useSwapExecution] Polling completed:', statusResponse);
      return statusResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap';
      setError(errorMessage);
      console.error('[useSwapExecution] Failed to execute swap:', err);
      throw err;
    } finally {
      setIsPolling(false);
    }
  }, []);

  return {
    isPolling,
    error,
    startSwapExecution,
  };
}
