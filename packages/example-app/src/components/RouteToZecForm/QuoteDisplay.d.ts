import type { SwapQuoteResponse } from '@zcash-router-sdk/core';
interface QuoteDisplayProps {
    quote: SwapQuoteResponse | null;
    sourceSymbol: string;
    destinationSymbol: string;
}
export declare function QuoteDisplay({ quote, sourceSymbol, destinationSymbol }: QuoteDisplayProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=QuoteDisplay.d.ts.map