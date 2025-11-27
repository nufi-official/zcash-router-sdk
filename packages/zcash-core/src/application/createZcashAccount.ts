import type { AccountFull } from '@asset-route-sdk/core';

import type { ZcashNetwork } from '../domain/network';
import { MnemonicCryptoProvider } from '../infrastructure/mnemonicCryptoProvider';
import { WebWalletManagerImpl } from '../infrastructure/webWalletManager';
import { ZcashWallet } from '../domain/zcashWallet';

import { ZcashAccount, type ZcashAddressType } from './zcashAccount';

export interface CreateZcashAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
  addressType: ZcashAddressType;
}

/**
 * Factory function to create a Zcash account with simplified parameters
 * Supports both transparent and shielded address types
 */
export async function createZcashAccount(
  params: CreateZcashAccountParams
): Promise<AccountFull> {
  const {
    mnemonic,
    accountIndex,
    network,
    lightwalletdUrl,
    minConfirmations,
    addressType,
  } = params;

  // Initialize crypto provider
  const mnemonicProvider = new MnemonicCryptoProvider(mnemonic);

  // Initialize web wallet manager
  const webWalletManager = new WebWalletManagerImpl({
    network,
    lightwalletdUrl,
    minConfirmations,
  });

  // Create wallet
  const wallet = new ZcashWallet({
    cryptoProviders: { mnemonic: mnemonicProvider },
    webWalletManager,
  });

  // Create account
  const account = await wallet.createAccount({
    accountIndex,
    cryptoProviderType: 'mnemonic',
  });

  // Return the account
  return new ZcashAccount({
    wallet,
    account,
    cryptoProviders: { mnemonic: mnemonicProvider },
    webWalletManager,
    addressType,
  });
}
