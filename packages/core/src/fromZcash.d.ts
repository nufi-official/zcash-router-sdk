import { AccountAddressOnly, AccountFull } from './types';
import { SwapStateChangeEvent } from './swapApi';
export declare function routeFromZcash(params: {
    zcashAccount: AccountFull;
    destinationAccount: AccountAddressOnly;
    amount: string;
    onSwapStatusChange: (event: SwapStateChangeEvent) => void;
}): Promise<void>;
//# sourceMappingURL=fromZcash.d.ts.map