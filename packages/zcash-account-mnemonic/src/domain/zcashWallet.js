export class ZcashWallet {
    constructor(params) {
        this.cryptoProviders = params.cryptoProviders;
        this.webWalletManager = params.webWalletManager;
    }
    async createAccount({ accountIndex, cryptoProviderType, }) {
        const cryptoProvider = this.cryptoProviders[cryptoProviderType];
        const unifiedFullViewingKey = await cryptoProvider.getUnifiedFullViewingKey(accountIndex);
        const seedFingerprintHex = await cryptoProvider.getSeedFingerprint();
        return {
            accountIndex,
            cryptoProviderType,
            unifiedFullViewingKey,
            seedFingerprintHex,
        };
    }
    async submitTransaction(signedPcztHex) {
        return await this.webWalletManager.submitTransaction(signedPcztHex);
    }
}
//# sourceMappingURL=zcashWallet.js.map