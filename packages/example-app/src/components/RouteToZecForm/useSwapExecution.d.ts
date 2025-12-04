import type { SwapStateChangeEvent } from '@zcash-router-sdk/core';
interface StartSwapParams {
    depositAddress: string;
    onStatusChange: (event: SwapStateChangeEvent) => void;
}
export declare function useSwapExecution(): {
    isPolling: boolean;
    error: string | null;
    startSwapExecution: (params: StartSwapParams) => Promise<import("@defuse-protocol/one-click-sdk-typescript").GetExecutionStatusResponse | null>;
};
export {};
//# sourceMappingURL=useSwapExecution.d.ts.map