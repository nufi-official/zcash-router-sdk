import type { GetExecutionStatusResponse } from '@defuse-protocol/one-click-sdk-typescript';
import type { GetQuoteParams, SendDepositFn, SwapApi, CheckStatusResponse, SwapQuoteResponse } from './swapApi.ts';
export type SwapStateChangeEvent = {
    status: 'QUOTE_RECEIVED';
    depositAddress: string;
} | {
    status: 'DEPOSIT_SENT';
    txHash: string;
} | {
    status: CheckStatusResponse;
    statusResponse: GetExecutionStatusResponse;
};
export type SwapParams = {
    swapApi: SwapApi;
    quote: GetQuoteParams;
    sendDeposit?: SendDepositFn;
    onStatusChange?: (event: SwapStateChangeEvent) => void;
};
export declare const swap: (params: SwapParams) => Promise<SwapQuoteResponse>;
//# sourceMappingURL=swap.d.ts.map