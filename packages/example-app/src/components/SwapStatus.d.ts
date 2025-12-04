import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';
interface SwapStatusProps {
    status: 'idle' | 'processing' | 'success' | 'error';
    currentState?: SwapStateChangeEvent;
    txHash?: string;
    error?: string;
}
export declare function SwapStatus({ status, currentState, txHash, error }: SwapStatusProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=SwapStatus.d.ts.map