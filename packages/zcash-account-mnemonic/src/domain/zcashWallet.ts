import type {ZcashAccountStoredData} from './accountManager'
import type {ZcashCryptoProvider} from './cryptoProvider'
import type {WebWalletManager} from './webWalletManager'

export interface ZcashWalletParams {
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>
  webWalletManager: WebWalletManager
}

export class ZcashWallet {
  private cryptoProviders: ZcashWalletParams['cryptoProviders']
  private webWalletManager: WebWalletManager

  constructor(params: ZcashWalletParams) {
    this.cryptoProviders = params.cryptoProviders
    this.webWalletManager = params.webWalletManager
  }

  async createAccount({
    accountIndex,
    cryptoProviderType,
  }: {
    accountIndex: number
    cryptoProviderType: ZcashCryptoProvider['type']
  }): Promise<ZcashAccountStoredData> {
    const cryptoProvider = this.cryptoProviders[cryptoProviderType]
    const unifiedFullViewingKey =
      await cryptoProvider.getUnifiedFullViewingKey(accountIndex)
    const seedFingerprintHex = await cryptoProvider.getSeedFingerprint()

    return {
      accountIndex,
      cryptoProviderType,
      unifiedFullViewingKey,
      seedFingerprintHex,
    }
  }

  async submitTransaction(signedPcztHex: string): Promise<string> {
    return await this.webWalletManager.submitTransaction(signedPcztHex)
  }
}
