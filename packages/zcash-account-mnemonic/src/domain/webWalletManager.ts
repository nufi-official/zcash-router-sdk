import type {ZcashAccountStoredData} from './accountManager'
import type {ZCashShieldedAddress, ZCashTransparentAddress} from './address'
import type {ZcashNetwork} from './network'
import type {
  Zatoshis,
  ZcashPcztHex,
  ZcashProvedPcztHex,
  ZcashSignedPcztHex,
} from './transaction'

/**
 * Configuration for WebWallet manager
 */
export type WebWalletConfig = {
  network: ZcashNetwork
  lightwalletdUrl: string
  minConfirmations: number
}

export type WebWalletSummary = {
  accountBalances: {
    accountId: number
    saplingBalance: bigint
    orchardBalance: bigint
    unshieldedBalance: bigint
  }[]
}

export type WebWalletManager = {
  getCurrentAddress(
    account: ZcashAccountStoredData,
  ): Promise<ZCashShieldedAddress>

  getCurrentTransparentAddress(
    account: ZcashAccountStoredData,
  ): Promise<ZCashTransparentAddress>

  createPczt(
    account: ZcashAccountStoredData,
    toAddress: string,
    amount: Zatoshis,
  ): Promise<ZcashPcztHex>

  createShieldPczt(
    account: ZcashAccountStoredData,
  ): Promise<ZcashPcztHex>

  provePczt(signedPcztHex: ZcashSignedPcztHex): Promise<ZcashProvedPcztHex>

  submitTransaction(provedPcztHex: string): Promise<string>

  getAccountBalances(account: ZcashAccountStoredData): Promise<{
    shieldedBalance: Zatoshis
    unshieldedBalance: Zatoshis
  }>

  sync(): Promise<void>

  destroy(): void
}
