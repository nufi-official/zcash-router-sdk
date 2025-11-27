import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';
import type {
  ZcashAccountStoredData,
  ZcashWallet,
} from '@asset-route-sdk/zcash-core';
import type { WebWalletManager } from '@asset-route-sdk/zcash-core';
import type { ZcashCryptoProvider } from '@asset-route-sdk/zcash-core';
import { ZCashAccountManager, zecToZatoshis } from '@asset-route-sdk/zcash-core';

export interface ZcashShieldedAccountParams {
  wallet: ZcashWallet;
  account: ZcashAccountStoredData;
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>;
  webWalletManager: WebWalletManager;
  asset: RouteAsset;
}

export class ZcashShieldedAccount implements AccountFull {
  readonly type = 'full' as const;
  readonly asset: RouteAsset;

  private wallet: ZcashWallet;
  private account: ZcashAccountStoredData;
  private accountManager: ReturnType<typeof ZCashAccountManager>;

  constructor(params: ZcashShieldedAccountParams) {
    this.wallet = params.wallet;
    this.account = params.account;
    this.asset = params.asset;
    this.accountManager = ZCashAccountManager(
      params.cryptoProviders,
      params.webWalletManager
    );
  }

  async getAddress(): Promise<string> {
    const offlineInfo = await this.accountManager.getAccountOfflineInfo(
      this.account
    );
    return offlineInfo.shieldedAddress;
  }

  async getBalance(): Promise<bigint> {
    const networkInfo = await this.accountManager.getAccountNetworkInfo(
      this.account
    );
    return networkInfo.shieldedBalance;
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
      toAddress: address as any, // Type cast to ZCashAddress
      amount: amountZatoshis as any, // Type cast to Zatoshis
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
