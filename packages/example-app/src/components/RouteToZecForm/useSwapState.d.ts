import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';
export declare function useSwapState(): {
    swapStatus: "error" | "success" | "idle" | "processing";
    currentState: SwapStateChangeEvent | undefined;
    txHash: string | undefined;
    error: string | undefined;
    startMockProgress: () => void;
};
//# sourceMappingURL=useSwapState.d.ts.map