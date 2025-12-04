import { AccountFull } from './types';
import { SwapStateChangeEvent } from './swapApi';
export declare function routeToZcash(params: {
    sourceAccount: AccountFull;
    zcashAccount: AccountFull;
    amount: string;
    onSwapStatusChange: (event: SwapStateChangeEvent) => void;
}): Promise<void>;
//# sourceMappingURL=toZcash.d.ts.map