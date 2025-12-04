import type { AccountFull } from '@zcash-router-sdk/core';

import type { ZcashNetwork } from '../domain/network';
import { MnemonicCryptoProvider } from '../infrastructure/mnemonicCryptoProvider';
import { getWebWalletManager } from '../infrastructure/webWalletManagerSingleton';
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

export interface CreateZcashShieldedAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
}

export interface CreateZcashTransparentAccountParams {
  mnemonic: string;
  accountIndex: number;
  network: ZcashNetwork;
  lightwalletdUrl: string;
  minConfirmations: number;
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

  // Get singleton web wallet manager instance
  // This ensures all accounts share the same wallet
  const webWalletManager = getWebWalletManager(
    network,
    lightwalletdUrl,
    minConfirmations
  );

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

/**
 * Factory function to create a Zcash shielded account
 */
export async function createZcashShieldedAccount(
  params: CreateZcashShieldedAccountParams
): Promise<AccountFull> {
  return createZcashAccount({
    ...params,
    addressType: 'shielded',
  });
}

/**
 * Factory function to create a Zcash transparent account
 */
export async function createZcashTransparentAccount(
  params: CreateZcashTransparentAccountParams
): Promise<AccountFull> {
  return createZcashAccount({
    ...params,
    addressType: 'transparent',
  });
}
