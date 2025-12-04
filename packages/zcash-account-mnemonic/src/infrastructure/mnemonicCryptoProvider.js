import { mnemonicToSeed } from 'bip39';
import { webzJsKeys, webzJsWallet } from './chainsafe-webzjs-wrapper';
export class MnemonicCryptoProvider {
    constructor(mnemonic) {
        this.mnemonic = mnemonic;
        this.type = 'mnemonic';
        this.network = 'main';
    }
    async getUnifiedSpendingKey(accountIndex) {
        const seed = await mnemonicToSeed(this.mnemonic);
        return new webzJsWallet.UnifiedSpendingKey(this.network, new Uint8Array(seed), accountIndex);
    }
    async getUnifiedFullViewingKey(accountIndex) {
        const unifiedSpendingKey = await this.getUnifiedSpendingKey(accountIndex);
        return unifiedSpendingKey
            .to_unified_full_viewing_key()
            .encode(this.network);
    }
    async getSeedFingerprint() {
        const seed = await mnemonicToSeed(this.mnemonic);
        const seedFingerprint = new webzJsKeys.SeedFingerprint(new Uint8Array(seed));
        return Buffer.from(seedFingerprint.to_bytes()).toString('hex');
    }
    async signPczt(pcztHex, accountIndex) {
        const unifiedSpendingKey = await this.getUnifiedSpendingKey(accountIndex);
        const seedFingerprint = await this.getSeedFingerprint();
        const pcztBytes = new Uint8Array(Buffer.from(pcztHex, 'hex'));
        const pczt = webzJsWallet.Pczt.from_bytes(pcztBytes);
        const signedPczt = await webzJsWallet.pczt_sign(this.network, pczt, unifiedSpendingKey, webzJsWallet.SeedFingerprint.from_bytes(new Uint8Array(Buffer.from(seedFingerprint, 'hex'))));
        return Buffer.from(signedPczt.serialize()).toString('hex');
    }
}
//# sourceMappingURL=mnemonicCryptoProvider.js.map