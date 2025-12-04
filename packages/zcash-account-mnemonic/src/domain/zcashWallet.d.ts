import type { ZcashAccountStoredData } from './accountManager';
import type { ZcashCryptoProvider } from './cryptoProvider';
import type { WebWalletManager } from './webWalletManager';
export interface ZcashWalletParams {
    cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>;
    webWalletManager: WebWalletManager;
}
export declare class ZcashWallet {
    private cryptoProviders;
    private webWalletManager;
    constructor(params: ZcashWalletParams);
    createAccount({ accountIndex, cryptoProviderType, }: {
        accountIndex: number;
        cryptoProviderType: ZcashCryptoProvider['type'];
    }): Promise<ZcashAccountStoredData>;
    submitTransaction(signedPcztHex: string): Promise<string>;
}
//# sourceMappingURL=zcashWallet.d.ts.map