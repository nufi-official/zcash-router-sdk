import {describe, it, expect, beforeAll, afterEach} from 'vitest'

import {TEST_SEED} from '../../__tests__/common'
import {loadAndInitWebZjs} from '../../infrastructure/chainsafe-webzjs-wrapper'
import {MnemonicCryptoProvider} from '../../infrastructure/mnemonicCryptoProvider'
import {WebWalletManagerImpl} from '../../infrastructure/webWalletManager'
import {ZCashAccountManager} from '../accountManager'
import type {ZcashAccountStoredData} from '../accountManager'

const WEB_WALLET_CONFIG = {
  network: 'main' as const,
  lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
  minConfirmations: 10,
}

describe('ZCashAccountManager', () => {
  beforeAll(async () => {
    await loadAndInitWebZjs()
  })

  afterEach(() => {
    if (webWalletManager) {
      webWalletManager.destroy()
    }
  })

  const createTestAccount = async (): Promise<ZcashAccountStoredData> => {
    const cryptoProvider = new MnemonicCryptoProvider(TEST_SEED)

    const ufvk = await cryptoProvider.getUnifiedFullViewingKey(0)
    const seedFingerprintHex = await cryptoProvider.getSeedFingerprint()

    return {
      accountIndex: 0,
      cryptoProviderType: 'mnemonic',
      unifiedFullViewingKey: ufvk,
      seedFingerprintHex,
    }
  }

  const mnemonicProvider = new MnemonicCryptoProvider(TEST_SEED)

  const webWalletManager = new WebWalletManagerImpl(WEB_WALLET_CONFIG)

  const accountManager = ZCashAccountManager(
    {mnemonic: mnemonicProvider},
    webWalletManager,
  )

  describe('getAccountOfflineInfo', () => {
    it('should get shielded and transparent addresses for account', async () => {
      const account = await createTestAccount()
      const offlineInfo = await accountManager.getAccountOfflineInfo(account)

      expect(offlineInfo.shieldedAddress).toEqual(
        'u1vu0zkreyef83369fn3dr94zkg2djqlcgtghxf2jmdcdmxp2z4l70dlh6yfdf5v33cteezva2c528syqtmu7uxgzss6fumh3tzjumnqh45z3yewkqplrfdz4f68aahg8x35yknyf7vjh4wy5sn4cc8edkxlef2p4q8ez6e0xuzrmr4rzff54m5t5whyzdgfg2cujtjdjlx2zqu46h7ty',
      )
      expect(offlineInfo.transparentAddress).toEqual(
        't1XVXWCvpMgBvUaed4XDqWtgQgJSu1Ghz7F',
      )
    }, 30000)
  })
})
