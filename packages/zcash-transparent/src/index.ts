import type { AccountFull, RouteAsset } from '@asset-route-sdk/core';
import type {
  Zatoshis,
  ZcashAccountStoredData,
  ZCashAddress,
  ZcashWallet,
  ZcashNetwork,
} from '@asset-route-sdk/zcash-core';
import type { WebWalletManager } from '@asset-route-sdk/zcash-core';
import type { ZcashCryptoProvider } from '@asset-route-sdk/zcash-core';
import {
  ZCashAccountManager,
  zecToZatoshis,
  ZcashWallet as ZcashWalletClass,
  MnemonicCryptoProvider,
  WebWalletManagerImpl,
} from '@asset-route-sdk/zcash-core';

export interface CreateZcashTransparentAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
}

const ZCASH_ASSET: RouteAsset = {
  blockchain: 'zcash',
  tokenId: undefined,
};

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

/**
 * Factory function to create a Zcash transparent account with simplified parameters
 */
export async function createZcashTransparentAccount(
  params: CreateZcashTransparentAccountParams
): Promise<AccountFull> {
  const { mnemonic, accountIndex, network, lightwalletdUrl, minConfirmations } =
    params;

  // Initialize crypto provider
  const mnemonicProvider = new MnemonicCryptoProvider(mnemonic);

  // Initialize web wallet manager
  const webWalletManager = new WebWalletManagerImpl({
    network,
    lightwalletdUrl,
    minConfirmations,
  });

  // Create wallet
  const wallet = new ZcashWalletClass({
    cryptoProviders: { mnemonic: mnemonicProvider },
    webWalletManager,
  });

  // Create account
  const account = await wallet.createAccount({
    accountIndex,
    cryptoProviderType: 'mnemonic',
  });

  // Return the transparent account
  return new ZcashTransparentAccount({
    wallet,
    account,
    cryptoProviders: { mnemonic: mnemonicProvider },
    webWalletManager,
    asset: ZCASH_ASSET,
  });
}
