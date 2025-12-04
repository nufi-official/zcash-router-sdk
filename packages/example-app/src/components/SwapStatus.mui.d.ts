import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';
interface SwapStatusProps {
    status: 'idle' | 'fetching-quote' | 'monitoring' | 'success' | 'error';
    currentState?: SwapStateChangeEvent;
    txHash?: string;
    error?: string;
    swapExplorerUrl?: string;
}
export declare function SwapStatus({ status, currentState, txHash, error, swapExplorerUrl, }: SwapStatusProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=SwapStatus.mui.d.ts.map