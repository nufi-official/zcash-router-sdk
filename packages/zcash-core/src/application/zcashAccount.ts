import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';

import type { ZcashAccountStoredData } from '../domain/accountManager';
import { ZCashAccountManager } from '../domain/accountManager';
import type { ZCashAddress } from '../domain/address';
import type { ZcashCryptoProvider } from '../domain/cryptoProvider';
import type { Zatoshis } from '../domain/transaction';
import type { WebWalletManager } from '../domain/webWalletManager';
import type { ZcashWallet } from '../domain/zcashWallet';
import { zecToZatoshis } from '../domain/parseUtils';

export const ZCASH_ASSET: RouteAsset = {
  blockchain: 'zcash',
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
      : networkInfo.shieldedBalance;
  }

  async sendDeposit({
    address,
    amount,
  }: {
    address: string;
    amount: string;
  }): Promise<string> {
    const amountZatoshis = this.assetToBaseUnits(amount);

    // Create transaction plan
    const txPlan = {
      toAddress: address as ZCashAddress,
      amount: amountZatoshis as Zatoshis,
    };

    // Sign and prove the transaction
    const provedPcztHex = await this.accountManager.signPczt(
      this.account,
      txPlan
    );

    // Submit the transaction and return the transaction hash
    return await this.wallet.submitTransaction(provedPcztHex);
  }

  assetToBaseUnits(amount: string): bigint {
    return zecToZatoshis(amount);
  }
}
