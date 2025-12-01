import type { SwapStateChangeEvent } from '@asset-route-sdk/core';

export const createMockSwapStates = (): SwapStateChangeEvent[] => [
  { status: 'DEPOSIT_SENT', txHash: '0x123...abc' },
  {
    status: 'KNOWN_DEPOSIT_TX',
    statusResponse: { depositTxHash: '0x123...abc' } as any
  },
  {
    status: 'PENDING_DEPOSIT',
    statusResponse: { depositTxHash: '0x123...abc' } as any
  },
  {
    status: 'PROCESSING',
    statusResponse: {} as any
  },
  {
    status: 'SUCCESS',
    statusResponse: { zcashTxHash: '0xabc...123' } as any
  },
];
