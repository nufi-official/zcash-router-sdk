import type { AccountFull, RouteAsset } from '@zcash-router-sdk/core';
import type { ZcashAccountStoredData } from '../domain/accountManager';
import type { ZcashCryptoProvider } from '../domain/cryptoProvider';
import type { WebWalletManager } from '../domain/webWalletManager';
import type { ZcashWallet } from '../domain/zcashWallet';
export declare const ZCASH_ASSET: RouteAsset;
export type ZcashAddressType = 'transparent' | 'shielded';
export interface ZcashAccountParams {
    wallet: ZcashWallet;
    account: ZcashAccountStoredData;
    cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>;
    webWalletManager: WebWalletManager;
    addressType: ZcashAddressType;
}
export declare class ZcashAccount implements AccountFull {
    readonly type: "full";
    readonly asset: RouteAsset;
    private wallet;
    private account;
    private accountManager;
    private addressType;
    constructor(params: ZcashAccountParams);
    getAddress(): Promise<string>;
    getBalance(): Promise<bigint>;
    assetToBaseUnits(amount: string): bigint;
    sendDeposit({ address, amount, }: {
        address: string;
        amount: string;
    }): Promise<string>;
}
//# sourceMappingURL=zcashAccount.d.ts.map