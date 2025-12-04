import type { GetExecutionStatusResponse } from '@defuse-protocol/one-click-sdk-typescript';
import type { SwapStateChangeEvent } from './swap';
export type TokensResponse = Record<string, string>;
export type SwapQuote = {
    amountInFormatted: string;
    amountOutFormatted: string;
    depositAddress: string;
    estimatedFees?: {
        network?: string;
        protocol?: string;
    };
};
export type SwapQuoteResponse = {
    timestamp: string;
    signature: string;
    quote: {
        depositAddress?: string;
    };
};
export type SubmitTxHashParams = {
    transactionHash: string;
    depositAddress: string;
};
export type GetQuoteParams = {
    dry: boolean;
    senderAddress: string;
    recipientAddress: string;
    originAsset: string;
    destinationAsset: string;
    amount: string;
    slippageTolerance: number;
    deadline?: string;
    referral?: string;
};
export type CheckStatusParams = {
    depositAddress: string;
    maxAttempts: number;
    pollingInterval: number;
    initialDelay: number;
    onStatusChange?: (event: SwapStateChangeEvent) => void;
};
export declare const checkStatusResponse: readonly ["KNOWN_DEPOSIT_TX", "PENDING_DEPOSIT", "INCOMPLETE_DEPOSIT", "PROCESSING", "SUCCESS", "REFUNDED", "FAILED"];
export type CheckStatusResponse = (typeof checkStatusResponse)[number];
export declare const SWAP_HAPPY_PATH_TIMELINE: readonly CheckStatusResponse[];
export declare const SWAP_END_STATES: Set<"KNOWN_DEPOSIT_TX" | "PENDING_DEPOSIT" | "INCOMPLETE_DEPOSIT" | "PROCESSING" | "SUCCESS" | "REFUNDED" | "FAILED">;
export type SwapApi = {
    getTokens: () => Promise<SwapApiAsset[]>;
    getQuote: (params: GetQuoteParams) => Promise<SwapQuoteResponse>;
    submitTxHash: (params: SubmitTxHashParams) => Promise<void>;
    pollStatus: (params: CheckStatusParams) => Promise<GetExecutionStatusResponse | null>;
};
export type SendDepositFn = ({ address, amount, }: {
    address: string;
    amount: string;
}) => Promise<string>;
export type SwapApiAsset = {
    assetId: string;
    priceUpdatedAt: string;
    price: number;
    decimals: number;
    symbol: string;
    blockchain: string;
    contractAddress?: string | undefined;
};
//# sourceMappingURL=swapApi.d.ts.map