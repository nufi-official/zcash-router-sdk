import type { ZcashCryptoProvider, ZcashCryptoProviderType } from '../domain/cryptoProvider';
import type { ZcashSeedFingerprintHex, ZcashUnifiedFullViewingKey } from '../domain/key';
import type { ZcashPcztHex, ZcashSignedPcztHex } from '../domain/transaction';
export declare class MnemonicCryptoProvider implements ZcashCryptoProvider {
    private mnemonic;
    readonly type: ZcashCryptoProviderType;
    private readonly network;
    constructor(mnemonic: string);
    private getUnifiedSpendingKey;
    getUnifiedFullViewingKey(accountIndex: number): Promise<ZcashUnifiedFullViewingKey>;
    getSeedFingerprint(): Promise<ZcashSeedFingerprintHex>;
    signPczt(pcztHex: ZcashPcztHex, accountIndex: number): Promise<ZcashSignedPcztHex>;
}
//# sourceMappingURL=mnemonicCryptoProvider.d.ts.map