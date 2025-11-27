// Domain exports
export { ZcashWallet } from './domain/zcashWallet';
export type { ZcashWalletParams } from './domain/zcashWallet';

export { ZCashAccountManager } from './domain/accountManager';
export type {
  ZcashAccountStoredData,
  ZcashAccountOfflineInfo,
  ZcashAccountNetworkInfo,
  ZcashAccountInfo,
} from './domain/accountManager';

export type {
  ZcashCryptoProvider,
  ZcashCryptoProviderType,
} from './domain/cryptoProvider';

export type {
  ZcashSeedFingerprintHex,
  ZcashUnifiedFullViewingKey,
} from './domain/key';

export type { ZcashNetwork } from './domain/network';

export type {
  Zatoshis,
  ZcashPcztHex,
  ZcashSignedPcztHex,
  ZcashProvedPcztHex,
  ZcashTxPlan,
} from './domain/transaction';

export type {
  ZCashShieldedAddress,
  ZCashTransparentAddress,
} from './domain/address';

export type {
  WebWalletConfig,
  WebWalletManager,
  WebWalletSummary,
} from './domain/webWalletManager';

// Infrastructure exports
export { MnemonicCryptoProvider } from './infrastructure/mnemonicCryptoProvider';
export { WebWalletManagerImpl } from './infrastructure/webWalletManager';

export {
  loadAndInitWebZjs,
  webzJsKeys,
  webzJsWallet,
} from './infrastructure/chainsafe-webzjs-wrapper';
export type { WebZjsKeys, WebZjsWallet } from './infrastructure/chainsafe-webzjs-wrapper';
