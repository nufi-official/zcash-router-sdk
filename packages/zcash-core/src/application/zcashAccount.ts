import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';

import type { ZcashAccountStoredData } from '../domain/accountManager';
import { ZCashAccountManager } from '../domain/accountManager';
import type { ZCashAddress } from '../domain/address';
import type { ZcashCryptoProvider } from '../domain/cryptoProvider';
import type { WebWalletManager } from '../domain/webWalletManager';
import type { ZcashWallet } from '../domain/zcashWallet';
import { zecToZatoshis } from '../domain/parseUtils';
import type { Zatoshis } from '../domain/transaction';
import { ZEC_FEE_ZATOSHIS } from '../domain';

export const ZCASH_ASSET: RouteAsset = {
  blockchain: 'zec',
  tokenId: undefined,
};

export type ZcashAddressType = 'transparent' | 'shielded';

export interface ZcashAccountParams {
  wallet: ZcashWallet;
  account: ZcashAccountStoredData;
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>;
  webWalletManager: WebWalletManager;
  addressType: ZcashAddressType;
}

/**
 * Base Zcash account implementation that supports both transparent and shielded addresses
 */
export class ZcashAccount implements AccountFull {
  readonly type = 'full' as const;
  readonly asset: RouteAsset = ZCASH_ASSET;

  private wallet: ZcashWallet;
  private account: ZcashAccountStoredData;
  private accountManager: ReturnType<typeof ZCashAccountManager>;
  private addressType: ZcashAddressType;

  constructor(params: ZcashAccountParams) {
    this.wallet = params.wallet;
    this.account = params.account;
    this.addressType = params.addressType;
    this.accountManager = ZCashAccountManager(
      params.cryptoProviders,
      params.webWalletManager
    );
  }

  async getAddress(): Promise<string> {
    const offlineInfo = await this.accountManager.getAccountOfflineInfo(
      this.account
    );
    return this.addressType === 'transparent'
      ? offlineInfo.transparentAddress
      : offlineInfo.shieldedAddress;
  }

  async getBalance(): Promise<bigint> {
    const networkInfo = await this.accountManager.getAccountNetworkInfo(
      this.account
    );
    return this.addressType === 'transparent'
      ? networkInfo.unshieldedBalance
      : ((networkInfo.shieldedBalance - ZEC_FEE_ZATOSHIS) as Zatoshis);
  }

  assetToBaseUnits(amount: string): bigint {
    return zecToZatoshis(amount);
  }

  async sendDeposit({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }): Promise<string> {
    // Amount is expected to be in zatoshis (base units) as a string
    const amountZatoshis = BigInt(amount) as Zatoshis;

    // Create transaction plan
    const txPlan = {
      toAddress: address as ZCashAddress,
      amount: amountZatoshis,
    };

    // Sign and prove the transaction
    const provedPcztHex = await this.accountManager.signPczt(
      this.account,
      txPlan
    );

    // Submit the transaction and return the transaction hash
    return await this.wallet.submitTransaction(provedPcztHex);
  }
}
