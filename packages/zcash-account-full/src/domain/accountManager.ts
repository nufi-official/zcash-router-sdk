import type {ZCashShieldedAddress, ZCashTransparentAddress} from './address'
import type {ZcashCryptoProvider} from './cryptoProvider'
import type {ZcashSeedFingerprintHex, ZcashUnifiedFullViewingKey} from './key'
import type {Zatoshis, ZcashProvedPcztHex, ZcashTxPlan} from './transaction'
import type {WebWalletManager} from './webWalletManager'

export type ZcashAccountStoredData = {
  accountIndex: number
  cryptoProviderType: ZcashCryptoProvider['type']
  unifiedFullViewingKey: ZcashUnifiedFullViewingKey
  seedFingerprintHex: ZcashSeedFingerprintHex
}

export type ZcashAccountOfflineInfo = {
  // TODO: accountOfflineInfoBase
  shieldedAddress: ZCashShieldedAddress
  transparentAddress: ZCashTransparentAddress
}

export type ZcashAccountNetworkInfo = {
  shieldedBalance: Zatoshis
  unshieldedBalance: Zatoshis
}

export type ZcashAccountInfo = ZcashAccountStoredData &
  ZcashAccountNetworkInfo &
  ZcashAccountOfflineInfo

export const ZCashAccountManager = (
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>,
  webWalletManager: WebWalletManager,
) => {
  const getAccountOfflineInfo = async (
    account: ZcashAccountStoredData,
  ): Promise<ZcashAccountOfflineInfo> => {
    return {
      shieldedAddress: await webWalletManager.getCurrentAddress(account),
      transparentAddress:
        await webWalletManager.getCurrentTransparentAddress(account),
    }
  }

  const getAccountNetworkInfo = async (
    account: ZcashAccountStoredData,
  ): Promise<ZcashAccountNetworkInfo> => {
    return await webWalletManager.getAccountBalances(account)
  }

  const getAccountInfo = async (
    account: ZcashAccountStoredData,
  ): Promise<ZcashAccountInfo> => {
    const networkInfo = await getAccountNetworkInfo(account)
    const offlineInfo = await getAccountOfflineInfo(account)
    return {...account, ...networkInfo, ...offlineInfo}
  }

  const signPczt = async (
    account: ZcashAccountStoredData,
    txPlan: ZcashTxPlan,
  ): Promise<ZcashProvedPcztHex> => {
    const pcztHex = await webWalletManager.createPczt(
      account,
      txPlan.toAddress,
      txPlan.amount,
    )

    const signedPcztHex = await cryptoProviders[
      account.cryptoProviderType
    ].signPczt(pcztHex, account.accountIndex)

    return await webWalletManager.provePczt(signedPcztHex)
  }

  return {
    signPczt,
    getAccountOfflineInfo,
    getAccountNetworkInfo,
    getAccountInfo,
  }
}
