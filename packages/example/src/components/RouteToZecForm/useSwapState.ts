import { useState, useCallback } from 'react';
import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';
import { createMockSwapStates } from './mockSwapStates';

export function useSwapState() {
  const [swapStatus, setSwapStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [currentState, setCurrentState] = useState<SwapStateChangeEvent>();
  const [txHash] = useState<string>();
  const [error] = useState<string>();

  const startMockProgress = useCallback(() => {
    const mockStates = createMockSwapStates();
    let currentIndex = 0;
    setSwapStatus('processing');
    setCurrentState(mockStates[0]);

    setInterval(() => {
      currentIndex++;
      if (currentIndex < mockStates.length) {
        setCurrentState(mockStates[currentIndex]);
        if (mockStates[currentIndex]?.status === 'SUCCESS') {
          setSwapStatus('success');
        }
      }
    }, 3000);
  }, []);

  return {
    swapStatus,
    currentState,
    txHash,
    error,
    startMockProgress,
  };
}
