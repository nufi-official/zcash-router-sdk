import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';
import type {
  ZcashAccountStoredData,
  ZcashWallet,
} from '@asset-route-sdk/zcash-account-full';
import type { WebWalletManager } from '@asset-route-sdk/zcash-account-full';
import type { ZcashCryptoProvider } from '@asset-route-sdk/zcash-account-full';
import { ZCashAccountManager } from '@asset-route-sdk/zcash-account-full';

const ZCASH_DECIMALS = 8;
const ZATOSHIS_PER_ZEC = BigInt(10 ** ZCASH_DECIMALS);

export interface ZcashTransparentAccountParams {
  wallet: ZcashWallet;
  account: ZcashAccountStoredData;
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>;
  webWalletManager: WebWalletManager;
  asset: RouteAsset;
}

export class ZcashTransparentAccount implements AccountFull {
  readonly type = 'full' as const;
  readonly asset: RouteAsset;

  private wallet: ZcashWallet;
  private account: ZcashAccountStoredData;
  private accountManager: ReturnType<typeof ZCashAccountManager>;

  constructor(params: ZcashTransparentAccountParams) {
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
    return offlineInfo.transparentAddress;
  }

  async getBalance(): Promise<bigint> {
    const networkInfo = await this.accountManager.getAccountNetworkInfo(
      this.account
    );
    return networkInfo.unshieldedBalance;
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
    // Convert ZEC amount string to zatoshis (1 ZEC = 100,000,000 zatoshis)
    const [whole = '0', fraction = ''] = amount.split('.');
    const paddedFraction = fraction.padEnd(ZCASH_DECIMALS, '0').slice(0, ZCASH_DECIMALS);
    const zatoshis = BigInt(whole) * ZATOSHIS_PER_ZEC + BigInt(paddedFraction);
    return zatoshis;
  }
}
