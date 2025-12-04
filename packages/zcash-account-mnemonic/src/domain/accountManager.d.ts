import type { ZCashShieldedAddress, ZCashTransparentAddress } from './address';
import type { ZcashCryptoProvider } from './cryptoProvider';
import type { ZcashSeedFingerprintHex, ZcashUnifiedFullViewingKey } from './key';
import type { Zatoshis, ZcashProvedPcztHex, ZcashTxPlan } from './transaction';
import type { WebWalletManager } from './webWalletManager';
export type ZcashAccountStoredData = {
    accountIndex: number;
    cryptoProviderType: ZcashCryptoProvider['type'];
    unifiedFullViewingKey: ZcashUnifiedFullViewingKey;
    seedFingerprintHex: ZcashSeedFingerprintHex;
};
export type ZcashAccountOfflineInfo = {
    shieldedAddress: ZCashShieldedAddress;
    transparentAddress: ZCashTransparentAddress;
};
export type ZcashAccountNetworkInfo = {
    shieldedBalance: Zatoshis;
    unshieldedBalance: Zatoshis;
};
export type ZcashAccountInfo = ZcashAccountStoredData & ZcashAccountNetworkInfo & ZcashAccountOfflineInfo;
export declare const ZCashAccountManager: (cryptoProviders: Record<ZcashCryptoProvider["type"], ZcashCryptoProvider>, webWalletManager: WebWalletManager) => {
    signPczt: (account: ZcashAccountStoredData, txPlan: ZcashTxPlan) => Promise<ZcashProvedPcztHex>;
    getAccountOfflineInfo: (account: ZcashAccountStoredData) => Promise<ZcashAccountOfflineInfo>;
    getAccountNetworkInfo: (account: ZcashAccountStoredData) => Promise<ZcashAccountNetworkInfo>;
    getAccountInfo: (account: ZcashAccountStoredData) => Promise<ZcashAccountInfo>;
    shieldTransparentFunds: (account: ZcashAccountStoredData) => Promise<void>;
};
//# sourceMappingURL=accountManager.d.ts.map