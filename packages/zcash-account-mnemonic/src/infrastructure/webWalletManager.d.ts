import type { ZcashAccountStoredData } from '../domain/accountManager';
import type { ZCashShieldedAddress, ZCashTransparentAddress } from '../domain/address';
import type { Zatoshis, ZcashPcztHex, ZcashProvedPcztHex, ZcashSignedPcztHex } from '../domain/transaction';
import type { WebWalletConfig, WebWalletManager } from '../domain/webWalletManager';
export declare class WebWalletManagerImpl implements WebWalletManager {
    private wallet;
    private readonly config;
    private accountIdCache;
    private pendingSync;
    private pendingImports;
    constructor(config: WebWalletConfig);
    private getOrCreateWallet;
    private getCurrentBlockHeight;
    private importOrGetAccount;
    sync(): Promise<void>;
    getCurrentAddress(account: ZcashAccountStoredData): Promise<ZCashShieldedAddress>;
    getCurrentTransparentAddress(account: ZcashAccountStoredData): Promise<ZCashTransparentAddress>;
    createPczt(account: ZcashAccountStoredData, toAddress: string, amount: Zatoshis): Promise<ZcashPcztHex>;
    createShieldPczt(account: ZcashAccountStoredData): Promise<ZcashPcztHex>;
    provePczt(signedPcztHex: ZcashSignedPcztHex): Promise<ZcashProvedPcztHex>;
    submitTransaction(provedPcztHex: string): Promise<string>;
    getAccountBalances(account: ZcashAccountStoredData): Promise<{
        shieldedBalance: Zatoshis;
        unshieldedBalance: Zatoshis;
    }>;
    destroy(): void;
}
//# sourceMappingURL=webWalletManager.d.ts.map