import {describe, it, expect, beforeAll} from 'vitest'

import {TEST_SEED} from '../../__tests__/common'
import {loadAndInitWebZjs} from '../../infrastructure/chainsafe-webzjs-wrapper'
import {MnemonicCryptoProvider} from '../../infrastructure/mnemonicCryptoProvider'
import {WebWalletManagerImpl} from '../../infrastructure/webWalletManager'
import {ZcashWallet} from '../zcashWallet'

describe('ZcashWallet', () => {
  beforeAll(async () => {
    await loadAndInitWebZjs()
  })

  const mnemonicProvider = new MnemonicCryptoProvider(TEST_SEED)

  const wallet = new ZcashWallet({
    cryptoProviders: {
      mnemonic: mnemonicProvider,
    },
    webWalletManager: new WebWalletManagerImpl({
      network: 'main',
      lightwalletdUrl: 'https://zcash-mainnet.chainsafe.dev',
      minConfirmations: 10,
    }),
  })

  describe('constructor', () => {
    it('should create a wallet with crypto providers', () => {
      expect(wallet).toBeTruthy()
      expect(wallet).toBeInstanceOf(ZcashWallet)
    })
  })

  describe('createAccount', () => {
    it('should create an account with viewing key and seed fingerprint', async () => {
      const account = await wallet.createAccount({
        accountIndex: 0,
        cryptoProviderType: 'mnemonic',
      })

      expect(account).toEqual({
        accountIndex: 0,
        cryptoProviderType: 'mnemonic',
        unifiedFullViewingKey:
          'uview1qggz6nejagvka9wtm9r7xf84kkwy4cc0cgchptr98w0cyz33cj4958q5ulkd32nz2u3s0sp9yhcw7tu2n3nlw9x6ulghyd2zgc857tnzme2zpr3vn24zhtm2rjduv9a5zxlmzz404n7l0k69gmu4tfn2g3vpcn03rhz63e3l92fn8gra37tyly7utvgveswl20vz23pu84rc2nyqess38wvlgr2xzyhgj232ne5qutpe6ql6ghzetdy7pfzcmdzd5gd5dnwk25fwv7nnzmnty7u5ax3nzzgr6pdc905ckpd0s9v2cvn7e03qm7r46e5ngax536ywz7zxjptymm90px0rhvmqtwvttuy6d7degly023lqvskclk6mezyt69dwu6c4tfzrjgq4uuh5xa9m5dclgatykgtrrw268qe5pldfkx73f2kd5yyy2tjpjql92pa6tsk2nh2h88q23nee9z379het4akl6haqmuwf9d0nl0susg4tnxyk',
        seedFingerprintHex:
          '21ed3d7882c7e37fe012b54a6408048048cb09782d4b2938617da793ccd27815',
      })
    })
  })
})
