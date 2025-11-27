import type {
  ZcashSeedFingerprintHex,
  ZcashUnifiedFullViewingKey,
} from './key';
import type { ZcashPcztHex, ZcashSignedPcztHex } from './transaction';

export const zcashCryptoProviders = ['mnemonic'] as const;

export type ZcashCryptoProviderType = (typeof zcashCryptoProviders)[number];

export interface ZcashCryptoProvider {
  readonly type: ZcashCryptoProviderType;

  getUnifiedFullViewingKey(
    accountIndex: number
  ): Promise<ZcashUnifiedFullViewingKey>;
  getSeedFingerprint(): Promise<ZcashSeedFingerprintHex>;
  signPczt(
    pcztHex: ZcashPcztHex,
    accountIndex: number
  ): Promise<ZcashSignedPcztHex>;
}
