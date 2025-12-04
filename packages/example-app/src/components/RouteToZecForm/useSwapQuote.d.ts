import { type SwapApiAsset } from '@zcash-router-sdk/core';
import type { SwapQuoteResponse } from '@zcash-router-sdk/core';
interface GetQuoteParams {
    amount: string;
    sourceAsset: SwapApiAsset;
    destinationAsset: SwapApiAsset;
    senderAddress: string;
    recipientAddress: string;
}
export declare function useSwapQuote(): {
    quote: SwapQuoteResponse | null;
    loading: boolean;
    error: string | null;
    fetchQuote: (params: GetQuoteParams) => Promise<SwapQuoteResponse>;
    clearQuote: () => void;
};
export {};
//# sourceMappingURL=useSwapQuote.d.ts.map