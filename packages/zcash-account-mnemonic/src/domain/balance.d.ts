import type { ZcashAccountInfo } from './accountManager';
import type { Zatoshis } from './transaction';
export declare const ZEC_FEE_ZATOSHIS: Zatoshis;
export declare const getMaxSendableAmount: (accountInfo: ZcashAccountInfo) => {
    shielded: Zatoshis;
    transparent: Zatoshis;
};
//# sourceMappingURL=balance.d.ts.map