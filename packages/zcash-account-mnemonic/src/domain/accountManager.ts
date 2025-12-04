import type { ZCashShieldedAddress, ZCashTransparentAddress } from './address';
import type { ZcashCryptoProvider } from './cryptoProvider';
import type {
  ZcashSeedFingerprintHex,
  ZcashUnifiedFullViewingKey,
} from './key';
import type { Zatoshis, ZcashProvedPcztHex, ZcashTxPlan } from './transaction';
import type { WebWalletManager } from './webWalletManager';

export type ZcashAccountStoredData = {
  accountIndex: number;
  cryptoProviderType: ZcashCryptoProvider['type'];
  unifiedFullViewingKey: ZcashUnifiedFullViewingKey;
  seedFingerprintHex: ZcashSeedFingerprintHex;
};

export type ZcashAccountOfflineInfo = {
  // TODO: accountOfflineInfoBase
  shieldedAddress: ZCashShieldedAddress;
  transparentAddress: ZCashTransparentAddress;
};

export type ZcashAccountNetworkInfo = {
  shieldedBalance: Zatoshis;
  unshieldedBalance: Zatoshis;
};

export type ZcashAccountInfo = ZcashAccountStoredData &
  ZcashAccountNetworkInfo &
  ZcashAccountOfflineInfo;

export const ZCashAccountManager = (
  cryptoProviders: Record<ZcashCryptoProvider['type'], ZcashCryptoProvider>,
  webWalletManager: WebWalletManager
) => {
  const getAccountOfflineInfo = async (
    account: ZcashAccountStoredData
  ): Promise<ZcashAccountOfflineInfo> => {
    return {
      shieldedAddress: await webWalletManager.getCurrentAddress(account),
      transparentAddress:
        await webWalletManager.getCurrentTransparentAddress(account),
    };
  };

  const getAccountNetworkInfo = async (
    account: ZcashAccountStoredData
  ): Promise<ZcashAccountNetworkInfo> => {
    return await webWalletManager.getAccountBalances(account);
  };

  const getAccountInfo = async (
    account: ZcashAccountStoredData
  ): Promise<ZcashAccountInfo> => {
    const networkInfo = await getAccountNetworkInfo(account);
    const offlineInfo = await getAccountOfflineInfo(account);
    return { ...account, ...networkInfo, ...offlineInfo };
  };

  const signPczt = async (
    account: ZcashAccountStoredData,
    txPlan: ZcashTxPlan
  ): Promise<ZcashProvedPcztHex> => {
    const pcztHex = await webWalletManager.createPczt(
      account,
      txPlan.toAddress,
      txPlan.amount
    );

    const signedPcztHex = await cryptoProviders[
      account.cryptoProviderType
    ].signPczt(pcztHex, account.accountIndex);

    return await webWalletManager.provePczt(signedPcztHex);
  };

  const shieldTransparentFunds = async (
    account: ZcashAccountStoredData
  ): Promise<void> => {
    // Create a PCZT to shield all transparent funds
    const shieldPcztHex = await webWalletManager.createShieldPczt(account);

    // Sign the shield PCZT
    const signedShieldPcztHex = await cryptoProviders[
      account.cryptoProviderType
    ].signPczt(shieldPcztHex, account.accountIndex);

    // Prove the shield PCZT (shielding transactions need proofs)
    const provedShieldPcztHex =
      await webWalletManager.provePczt(signedShieldPcztHex);

    // Submit the shield transaction
    await webWalletManager.submitTransaction(provedShieldPcztHex);

    // Wait for the transaction to be confirmed
    // TODO: Poll for confirmation instead of fixed delay
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    // Sync to see the newly shielded funds
    await webWalletManager.sync();
  };

  return {
    signPczt,
    getAccountOfflineInfo,
    getAccountNetworkInfo,
    getAccountInfo,
    shieldTransparentFunds,
  };
};
