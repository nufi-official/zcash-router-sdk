import type {
  ZcashCryptoProvider,
  ZcashCryptoProviderType,
} from '../domain/cryptoProvider';
import type {
  ZcashSeedFingerprintHex,
  ZcashUnifiedFullViewingKey,
} from '../domain/key';
import type { ZcashNetwork } from '../domain/network';
import type { ZcashPcztHex, ZcashSignedPcztHex } from '../domain/transaction';
import { mnemonicToSeed } from 'bip39';

import type { WebZjsKeys } from './chainsafe-webzjs-wrapper';
import { webzJsKeys, webzJsWallet } from './chainsafe-webzjs-wrapper';

export class MnemonicCryptoProvider implements ZcashCryptoProvider {
  readonly type: ZcashCryptoProviderType = 'mnemonic';
  private readonly network: ZcashNetwork = 'main';

  constructor(private mnemonic: string) {}

  private async getUnifiedSpendingKey(
    accountIndex: number
  ): Promise<WebZjsKeys.UnifiedSpendingKey> {
    const seed = await mnemonicToSeed(this.mnemonic);

    return new webzJsWallet.UnifiedSpendingKey(
      this.network,
      new Uint8Array(seed),
      accountIndex
    );
  }

  async getUnifiedFullViewingKey(
    accountIndex: number
  ): Promise<ZcashUnifiedFullViewingKey> {
    const unifiedSpendingKey = await this.getUnifiedSpendingKey(accountIndex);
    return unifiedSpendingKey
      .to_unified_full_viewing_key()
      .encode(this.network) as ZcashUnifiedFullViewingKey;
  }

  async getSeedFingerprint(): Promise<ZcashSeedFingerprintHex> {
    const seed = await mnemonicToSeed(this.mnemonic);

    const seedFingerprint = new webzJsKeys.SeedFingerprint(
      new Uint8Array(seed)
    );

    return Buffer.from(seedFingerprint.to_bytes()).toString(
      'hex'
    ) as ZcashSeedFingerprintHex;
  }

  async signPczt(
    pcztHex: ZcashPcztHex,
    accountIndex: number
  ): Promise<ZcashSignedPcztHex> {
    const unifiedSpendingKey = await this.getUnifiedSpendingKey(accountIndex);
    const seedFingerprint = await this.getSeedFingerprint();

    const pcztBytes = new Uint8Array(Buffer.from(pcztHex, 'hex'));
    const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);

    const signedPczt = await webzJsWallet.pczt_sign(
      this.network,
      pczt,
      unifiedSpendingKey,
      webzJsWallet.SeedFingerprint.from_bytes(
        new Uint8Array(Buffer.from(seedFingerprint, 'hex'))
      )
    );
    console.log('Signed PCZT:', signedPczt);
    return Buffer.from(signedPczt.serialize()).toString(
      'hex'
    ) as ZcashSignedPcztHex;
  }
}
